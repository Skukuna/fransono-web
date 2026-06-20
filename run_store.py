import http.server
import socket
import sys

PORT = 8000

# Get local IP address to print for user reference
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
try:
    # doesn't even have to be reachable
    s.connect(('8.8.8.8', 1))
    local_ip = s.getsockname()[0]
except Exception:
    local_ip = '127.0.0.1'
finally:
    s.close()

class StorefrontHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Support extensionless routing for static pages /men and /women
        path = self.path.split('?')[0].split('#')[0]
        if path == '/men':
            self.path = '/men.html'
        elif path == '/women':
            self.path = '/women.html'
        return super().do_GET()

print("=" * 60)
print(f" FRANSONO Storefront Server starting on port {PORT}")
print(f" - Local Access:         http://localhost:{PORT}")
print(f" - Mobile/Network Access: http://{local_ip}:{PORT}")
print("=" * 60)
print("Press Ctrl+C to stop the server.\n")

class ThreadingHTTPServer(http.server.ThreadingHTTPServer):
    def server_bind(self):
        self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        super().server_bind()

try:
    server = ThreadingHTTPServer(('0.0.0.0', PORT), StorefrontHandler)
    server.serve_forever()
except KeyboardInterrupt:
    print("\nServer stopped.")
    sys.exit(0)
