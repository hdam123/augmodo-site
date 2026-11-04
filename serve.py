"""Local preview server for the Augmodo prototype.

Same as `python3 -m http.server`, but tells the browser never to cache, so edits
always show up on a normal refresh. Usage: python3 serve.py [port]
"""
import functools
import http.server
import os
import sys


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Expires", "0")
        super().end_headers()


port = int(sys.argv[1]) if len(sys.argv) > 1 else 5173
root = os.path.dirname(os.path.abspath(__file__))
handler = functools.partial(NoCacheHandler, directory=root)
with http.server.ThreadingHTTPServer(("127.0.0.1", port), handler) as httpd:
    print(f"Augmodo prototype: http://localhost:{port}  (Ctrl+C to stop)")
    httpd.serve_forever()
