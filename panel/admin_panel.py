from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import base64
import json
import mimetypes
import re
import time
import urllib.parse


ROOT = Path(__file__).resolve().parents[1]
DATA_FILE = ROOT / "data" / "store.json"
IMAGE_DIR = ROOT / "store-images"
HOST = "127.0.0.1"
PORT = 8765


def read_store():
    with DATA_FILE.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def write_store(payload):
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    with DATA_FILE.open("w", encoding="utf-8") as handle:
        json.dump(payload, handle, ensure_ascii=False, indent=2)
        handle.write("\n")


def safe_file_name(name):
    stem = Path(name or f"product-{int(time.time())}").name
    stem = re.sub(r"[^a-zA-Z0-9._-]+", "-", stem).strip("-")
    return stem or f"product-{int(time.time())}.jpg"


def response_json(handler, status, payload):
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json; charset=utf-8")
    handler.send_header("Content-Length", str(len(body)))
    handler.end_headers()
    handler.wfile.write(body)


PANEL_HTML = r"""<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>FRANSONO Data Panel</title>
    <style>
      :root { font-family: Inter, system-ui, sans-serif; color: #151515; background: #f5f5f5; }
      * { box-sizing: border-box; }
      body { margin: 0; }
      header { position: sticky; top: 0; z-index: 2; background: #ffd52d; padding: 18px 24px; border-bottom: 1px solid #d6b300; }
      h1 { margin: 0; font-size: 24px; }
      main { width: min(1280px, calc(100% - 28px)); margin: 22px auto 50px; display: grid; grid-template-columns: 430px 1fr; gap: 18px; }
      section { background: #fff; border: 1px solid #e3e3e3; border-radius: 6px; overflow: hidden; }
      section h2 { margin: 0; padding: 16px 18px; border-bottom: 1px solid #eee; font-size: 18px; }
      form, .panel-body { padding: 18px; display: grid; gap: 12px; }
      label { display: grid; gap: 6px; font-size: 12px; font-weight: 800; color: #333; }
      input, select, textarea { width: 100%; border: 1px solid #d9d9d9; border-radius: 4px; padding: 10px 11px; font: inherit; background: #fff; }
      textarea { min-height: 280px; resize: vertical; font-family: Consolas, monospace; font-size: 13px; }
      .row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
      .actions { display: flex; flex-wrap: wrap; gap: 10px; }
      button { border: 0; border-radius: 4px; padding: 11px 14px; background: #111; color: #fff; font-weight: 900; cursor: pointer; }
      button.secondary { background: #e9e9e9; color: #111; }
      .status { min-height: 22px; color: #0b7f73; font-weight: 800; }
      .hint { color: #6a6a6a; font-size: 13px; line-height: 1.45; }
      .product-list { max-height: 360px; overflow: auto; border: 1px solid #eee; border-radius: 4px; display: grid; }
      .product-card { width: 100%; display: grid; grid-template-columns: 58px 1fr auto; gap: 10px; align-items: center; padding: 10px 12px; border: 0; border-bottom: 1px solid #eee; background: #fff; color: #111; text-align: left; }
      .product-card:hover, .product-card.active { background: #fff8d8; }
      .product-card img { width: 58px; height: 72px; object-fit: cover; border-radius: 4px; background: #eee; }
      .product-meta { display: grid; gap: 3px; font-size: 12px; font-weight: 500; }
      .product-meta b { font-size: 13px; }
      .tag-row { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 5px; }
      .tag-row span { border: 1px solid #ddd; border-radius: 999px; padding: 3px 7px; color: #555; font-size: 11px; }
      .preview-card { display: grid; grid-template-columns: 130px 1fr; gap: 14px; align-items: start; border: 1px solid #eee; border-radius: 6px; padding: 12px; background: #fafafa; }
      .preview-card img { width: 130px; aspect-ratio: 4 / 5; object-fit: cover; border-radius: 5px; background: #e8e8e8; }
      .preview-card h3 { margin: 0 0 6px; }
      .preview-card p { margin: 0 0 6px; color: #666; }
      .filter-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
      .filter-grid textarea { min-height: 105px; }
      .mini-title { margin: 8px 0 0; font-size: 15px; font-weight: 900; }
      @media (max-width: 900px) { main { grid-template-columns: 1fr; } }
    </style>
  </head>
  <body>
    <header>
      <h1>FRANSONO Data Panel</h1>
      <div class="hint">Edits <b>data/store.json</b>. Uploaded files go to <b>store-images/</b>.</div>
    </header>
    <main>
      <section>
        <h2>Add / Edit Product</h2>
        <form id="productForm">
          <div class="row">
            <label>Collection
              <select name="collection">
                <option value="men">men</option>
                <option value="women">women</option>
              </select>
            </label>
            <label>ID <input name="id" placeholder="m7 or w7" required /></label>
          </div>
          <div class="row">
            <label>Gender <input name="gender" placeholder="men / women" required /></label>
            <label>Type <input name="type" placeholder="t-shirt, shirt, dress" required /></label>
          </div>
          <div class="row">
            <label>Category <input name="category" placeholder="t-shirt" required /></label>
            <label>Brand <input name="brand" value="FRANSONO" required /></label>
          </div>
          <label>Product Name <input name="name" placeholder="Product display name" required /></label>
          <div class="row">
            <label>Image Name <input name="imageName" placeholder="men-new-shirt.jpg" required /></label>
            <label>Upload Image <input name="imageFile" type="file" accept="image/*" /></label>
          </div>
          <label>Remote Image URL or Local Path <input name="image" placeholder="store-images/men-new-shirt.jpg" /></label>
          <label>Tags <input name="tags" placeholder="men, t-shirt, black, oversized" /></label>
          <div class="row">
            <label>Fit <input name="fit" placeholder="OVERSIZED FIT" /></label>
            <label>Rating <input name="rating" type="number" step="0.1" value="4.5" /></label>
          </div>
          <div class="row">
            <label>Price <input name="price" type="number" value="499" required /></label>
            <label>MRP <input name="mrp" type="number" value="999" required /></label>
          </div>
          <div class="row">
            <label>Discount <input name="discount" value="50% OFF" /></label>
            <label>Offer <input name="offer" value="Buy 2 for 1199" /></label>
          </div>
          <div class="row">
            <label>New?
              <select name="isNew"><option value="false">false</option><option value="true">true</option></select>
            </label>
            <label>Active?
              <select name="active"><option value="true">true</option><option value="false">false</option></select>
            </label>
          </div>
          <div class="actions">
            <button type="submit">Save Product To JSON</button>
            <button class="secondary" type="button" id="newProduct">New Product</button>
            <button class="secondary" type="button" id="reloadProducts">Reload</button>
          </div>
          <div class="status" id="productStatus"></div>
        </form>
      </section>

      <section>
        <h2>Products, Filters & JSON</h2>
        <div class="panel-body">
          <div id="previewCard" class="preview-card">
            <img alt="Product preview" />
            <div>
              <h3>Select a product</h3>
              <p>Click an item below to edit and preview it.</p>
              <div class="tag-row"></div>
            </div>
          </div>
          <div class="product-list" id="productList"></div>
          <div class="mini-title">Collection Filters</div>
          <div class="hint">One filter option per line. These values drive storefront filter checkboxes.</div>
          <label>Collection
            <select id="filterCollection">
              <option value="men">men</option>
              <option value="women">women</option>
            </select>
          </label>
          <div class="row">
            <label>New Filter Group <input id="newFilterName" placeholder="Material, Pattern, Tags" /></label>
            <label>Options <input id="newFilterValues" placeholder="Cotton, Denim, Black" /></label>
          </div>
          <div class="filter-grid" id="filterEditor"></div>
          <div class="actions">
            <button id="addFilterGroup">Add Filter Group</button>
            <button id="saveFilters">Save Filters</button>
            <button class="secondary" id="syncFilters">Sync From Product Tags</button>
          </div>
          <div class="actions">
            <button id="loadJson">Load JSON</button>
            <button id="saveJson">Save JSON</button>
            <button class="secondary" id="formatJson">Format</button>
          </div>
          <textarea id="jsonEditor" spellcheck="false"></textarea>
          <div class="status" id="jsonStatus"></div>
        </div>
      </section>
    </main>

    <script>
      let store = null;
      let selectedProduct = null;
      const editor = document.querySelector("#jsonEditor");
      const form = document.querySelector("#productForm");
      const productStatus = document.querySelector("#productStatus");
      const jsonStatus = document.querySelector("#jsonStatus");

      async function api(path, options = {}) {
        const response = await fetch(path, options);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Request failed");
        return data;
      }

      function imageUrl(path) {
        if (!path) return "";
        if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("/")) return path;
        return `/${path}`;
      }

      function updateEditorFromStore(message = "") {
        editor.value = JSON.stringify(store, null, 2);
        renderProductList();
        renderFilterEditor();
        if (message) jsonStatus.textContent = message;
      }

      function renderPreview(collection, product) {
        const preview = document.querySelector("#previewCard");
        if (!product) {
          preview.innerHTML = `<img alt="Product preview" /><div><h3>Select a product</h3><p>Click an item below to edit and preview it.</p><div class="tag-row"></div></div>`;
          return;
        }
        preview.innerHTML = `
          <img src="${imageUrl(product.image)}" alt="${product.name}" />
          <div>
            <h3>${product.name}</h3>
            <p><b>${product.brand}</b> / ${collection} / ${product.type || product.category}</p>
            <p>₹${product.price} <span style="color:#777;text-decoration:line-through;">₹${product.mrp}</span> ${product.discount || ""}</p>
            <div class="tag-row">${(product.tags || []).map((tag) => `<span>${tag}</span>`).join("")}</div>
          </div>
        `;
      }

      function fillProductForm(collection, product) {
        selectedProduct = { collection, id: product.id };
        form.collection.value = collection;
        form.id.value = product.id || "";
        form.gender.value = product.gender || collection;
        form.type.value = product.type || "";
        form.category.value = product.category || "";
        form.brand.value = product.brand || "FRANSONO";
        form.name.value = product.name || "";
        form.imageName.value = product.imageName || "";
        form.image.value = product.image || "";
        form.tags.value = (product.tags || []).join(", ");
        form.fit.value = product.fit || "";
        form.rating.value = product.rating || 0;
        form.price.value = product.price || 0;
        form.mrp.value = product.mrp || 0;
        form.discount.value = product.discount || "";
        form.offer.value = product.offer || "";
        form.isNew.value = String(Boolean(product.isNew));
        form.active.value = String(product.active !== false);
        renderPreview(collection, product);
        productStatus.textContent = `Editing ${product.id}`;
      }

      function resetProductForm() {
        selectedProduct = null;
        form.reset();
        form.collection.value = "men";
        form.gender.value = "men";
        form.brand.value = "FRANSONO";
        form.rating.value = "4.5";
        form.price.value = "499";
        form.mrp.value = "999";
        form.discount.value = "50% OFF";
        form.offer.value = "Buy 2 for 1199";
        form.isNew.value = "false";
        form.active.value = "true";
        renderPreview(null, null);
        productStatus.textContent = "Ready for new product.";
      }

      function renderProductList() {
        const list = document.querySelector("#productList");
        if (!store) return;
        const products = Object.entries(store.collections).flatMap(([collection, value]) =>
          value.products.map((product) => ({ collection, product }))
        );
        list.innerHTML = products.map(({ collection, product }) =>
          `<button class="product-card ${selectedProduct && selectedProduct.collection === collection && selectedProduct.id === product.id ? "active" : ""}" data-edit-product="${product.id}" data-edit-collection="${collection}">
            <img src="${imageUrl(product.image)}" alt="${product.name}" />
            <span class="product-meta">
              <b>${product.name}</b>
              <span>${collection} / ${product.id} / ${product.brand}</span>
              <span>${product.type || product.category} / ${product.fit || ""}</span>
              <span class="tag-row">${(product.tags || []).map((tag) => `<span>${tag}</span>`).join("")}</span>
            </span>
            <span>₹${product.price}</span>
          </button>`
        ).join("");
      }

      function renderFilterEditor() {
        if (!store) return;
        const collectionName = document.querySelector("#filterCollection").value;
        const filters = store.collections[collectionName].filters || {};
        document.querySelector("#filterEditor").innerHTML = Object.entries(filters).map(([group, values]) => `
          <label>${group}
            <textarea data-filter-name="${group}">${values.join("\n")}</textarea>
          </label>
        `).join("");
      }

      async function loadStore() {
        store = await api("/api/store");
        updateEditorFromStore("Loaded.");
      }

      async function saveStore() {
        const payload = JSON.parse(editor.value);
        await api("/api/store", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        store = payload;
        updateEditorFromStore("Saved data/store.json.");
      }

      function readFileAsDataUrl(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }

      function addUnique(values, value) {
        const clean = String(value || "").trim();
        if (!clean) return values;
        return values.some((item) => item.toLowerCase() === clean.toLowerCase()) ? values : [...values, clean];
      }

      function titleCase(value) {
        return String(value || "").split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
      }

      function updateFiltersFromProduct(collectionName, product) {
        const filters = store.collections[collectionName].filters;
        filters.Category = addUnique(filters.Category || [], titleCase(product.category));
        filters.Brand = addUnique(filters.Brand || [], product.brand);
        filters.Type = addUnique(filters.Type || [], titleCase(product.type));
        filters.Fit = addUnique(filters.Fit || [], titleCase(product.fit));
        filters.Offers = addUnique(filters.Offers || [], product.offer);
        filters.Tags = product.tags.reduce((values, tag) => addUnique(values, tag), filters.Tags || []);
      }

      function syncFiltersFromProducts(collectionName) {
        const collection = store.collections[collectionName];
        collection.filters.Tags = [];
        collection.products.forEach((product) => updateFiltersFromProduct(collectionName, product));
      }

      document.querySelector("#productForm").addEventListener("submit", async (event) => {
        event.preventDefault();
        if (!store) await loadStore();
        const form = event.currentTarget;
        const data = Object.fromEntries(new FormData(form).entries());
        const file = form.imageFile.files[0];
        let imagePath = data.image || `store-images/${data.imageName}`;

        if (file) {
          const uploaded = await api("/api/image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fileName: data.imageName || file.name, dataUrl: await readFileAsDataUrl(file) })
          });
          imagePath = uploaded.path;
          data.imageName = uploaded.fileName;
        }

        const product = {
          id: data.id.trim(),
          gender: data.gender.trim(),
          type: data.type.trim(),
          category: data.category.trim(),
          brand: data.brand.trim(),
          name: data.name.trim(),
          imageName: data.imageName.trim(),
          image: imagePath,
          tags: data.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
          fit: data.fit.trim(),
          rating: Number(data.rating || 0),
          price: Number(data.price || 0),
          mrp: Number(data.mrp || 0),
          discount: data.discount.trim(),
          offer: data.offer.trim(),
          isNew: data.isNew === "true",
          active: data.active === "true"
        };

        const collection = store.collections[data.collection];
        const index = collection.products.findIndex((item) => item.id === product.id || (selectedProduct && selectedProduct.collection === data.collection && item.id === selectedProduct.id));
        if (index >= 0) collection.products[index] = product;
        else collection.products.push(product);
        updateFiltersFromProduct(data.collection, product);

        updateEditorFromStore();
        await saveStore();
        productStatus.textContent = `${product.name} saved.`;
        fillProductForm(data.collection, product);
      });

      document.querySelector("#loadJson").addEventListener("click", loadStore);
      document.querySelector("#reloadProducts").addEventListener("click", loadStore);
      document.querySelector("#newProduct").addEventListener("click", resetProductForm);
      document.querySelector("#productList").addEventListener("click", (event) => {
        const card = event.target.closest("[data-edit-product]");
        if (!card) return;
        const collection = card.dataset.editCollection;
        const product = store.collections[collection].products.find((item) => item.id === card.dataset.editProduct);
        if (product) {
          fillProductForm(collection, product);
          renderProductList();
        }
      });
      document.querySelector("#filterCollection").addEventListener("change", renderFilterEditor);
      document.querySelector("#addFilterGroup").addEventListener("click", () => {
        const collectionName = document.querySelector("#filterCollection").value;
        const name = document.querySelector("#newFilterName").value.trim();
        const values = document.querySelector("#newFilterValues").value.split(",").map((value) => value.trim()).filter(Boolean);
        if (!name) {
          jsonStatus.textContent = "Enter a filter group name.";
          return;
        }
        store.collections[collectionName].filters[name] = values;
        document.querySelector("#newFilterName").value = "";
        document.querySelector("#newFilterValues").value = "";
        updateEditorFromStore(`${name} filter added to ${collectionName}.`);
      });
      document.querySelector("#saveFilters").addEventListener("click", async () => {
        const collectionName = document.querySelector("#filterCollection").value;
        const filters = {};
        document.querySelectorAll("[data-filter-name]").forEach((textarea) => {
          filters[textarea.dataset.filterName] = textarea.value.split("\n").map((value) => value.trim()).filter(Boolean);
        });
        store.collections[collectionName].filters = filters;
        updateEditorFromStore();
        await saveStore();
        jsonStatus.textContent = `${collectionName} filters saved.`;
      });
      document.querySelector("#syncFilters").addEventListener("click", async () => {
        const collectionName = document.querySelector("#filterCollection").value;
        syncFiltersFromProducts(collectionName);
        updateEditorFromStore(`${collectionName} filters synced from products and tags.`);
        await saveStore();
      });
      document.querySelector("#saveJson").addEventListener("click", async () => {
        try { await saveStore(); } catch (error) { jsonStatus.textContent = error.message; }
      });
      document.querySelector("#formatJson").addEventListener("click", () => {
        editor.value = JSON.stringify(JSON.parse(editor.value), null, 2);
      });

      loadStore().catch((error) => { jsonStatus.textContent = error.message; });
    </script>
  </body>
</html>"""


class PanelHandler(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        print("[%s] %s" % (self.log_date_time_string(), fmt % args))

    def do_GET(self):
        path = urllib.parse.urlparse(self.path).path
        if path == "/":
            body = PANEL_HTML.encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return

        if path == "/api/store":
            response_json(self, 200, read_store())
            return

        if path.startswith("/store-images/"):
            image_name = safe_file_name(path.replace("/store-images/", "", 1))
            target = IMAGE_DIR / image_name
            if target.exists() and target.is_file():
                body = target.read_bytes()
                content_type = mimetypes.guess_type(target.name)[0] or "application/octet-stream"
                self.send_response(200)
                self.send_header("Content-Type", content_type)
                self.send_header("Content-Length", str(len(body)))
                self.end_headers()
                self.wfile.write(body)
                return

        self.send_error(404)

    def do_POST(self):
        path = urllib.parse.urlparse(self.path).path
        length = int(self.headers.get("Content-Length", "0"))
        raw = self.rfile.read(length).decode("utf-8")

        try:
            payload = json.loads(raw or "{}")
            if path == "/api/store":
                if "site" not in payload or "collections" not in payload:
                    raise ValueError("JSON must include site and collections")
                write_store(payload)
                response_json(self, 200, {"ok": True})
                return

            if path == "/api/image":
                IMAGE_DIR.mkdir(parents=True, exist_ok=True)
                file_name = safe_file_name(payload.get("fileName"))
                data_url = payload.get("dataUrl", "")
                if "," not in data_url:
                    raise ValueError("Invalid image data")
                header, encoded = data_url.split(",", 1)
                extension = mimetypes.guess_extension(header.split(";")[0].replace("data:", "")) or Path(file_name).suffix
                if not Path(file_name).suffix and extension:
                    file_name = f"{file_name}{extension}"
                target = IMAGE_DIR / safe_file_name(file_name)
                target.write_bytes(base64.b64decode(encoded))
                response_json(self, 200, {"ok": True, "fileName": target.name, "path": f"store-images/{target.name}"})
                return

            self.send_error(404)
        except Exception as exc:
            response_json(self, 400, {"ok": False, "error": str(exc)})


if __name__ == "__main__":
    print(f"FRANSONO data panel: http://{HOST}:{PORT}")
    print(f"Editing: {DATA_FILE}")
    ThreadingHTTPServer((HOST, PORT), PanelHandler).serve_forever()
