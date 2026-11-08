#!/usr/bin/env python3
"""Aperçu statique local. Aucun accès administrateur n'est créé par ce serveur."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import functools
import sys
ROOT = Path(__file__).resolve().parent
class Handler(SimpleHTTPRequestHandler):
    def list_directory(self, path):
        self.send_error(403, 'Liste du dossier désactivée')
        return None
    def end_headers(self):
        self.send_header('X-Content-Type-Options','nosniff')
        self.send_header('Referrer-Policy','strict-origin-when-cross-origin')
        self.send_header('X-Frame-Options','DENY')
        self.send_header('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' https://rvreusugrtiubqtafgbk.supabase.co; connect-src https://rvreusugrtiubqtafgbk.supabase.co; object-src 'none'; frame-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'")
        self.send_header('Cache-Control','no-store')
        super().end_headers()
if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv)>1 else 8817
    print(f'Vitrine : http://localhost:{port}/\nAdmin : http://localhost:{port}/admin/\nCtrl+C pour fermer.', flush=True)
    try:
        ThreadingHTTPServer(('127.0.0.1',port),functools.partial(Handler,directory=str(ROOT))).serve_forever()
    except KeyboardInterrupt:
        print('\nAperçu fermé.')
