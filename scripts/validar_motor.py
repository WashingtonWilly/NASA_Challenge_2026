#!/usr/bin/env python3
"""
validar_motor.py — Ejecuta la suite de validación del motor agronómico en Chrome headless
sin requerir Node.js. Verifica escenarios Sierra/Costa, monotonía hídrica/térmica/pendiente,
helada severa, crédito N Año 3 e incertidumbre Monte Carlo (z=1.65).
"""
import functools
import html
import http.server
import json
import os
import re
import socketserver
import subprocess
import sys
import tempfile
import threading

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHROME_PATHS = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
]


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass


def main():
    chrome = next((p for p in CHROME_PATHS if os.path.exists(p)), None)
    if not chrome:
        print("ERROR: No se encontró Google Chrome para ejecutar validar_motor.html")
        sys.exit(1)

    handler = functools.partial(QuietHandler, directory=BASE_DIR)
    httpd = socketserver.TCPServer(("127.0.0.1", 0), handler)
    port = httpd.server_address[1]
    thread = threading.Thread(target=httpd.serve_forever, daemon=True)
    thread.start()

    try:
        from pathlib import Path
        url = Path(os.path.join(BASE_DIR, "scripts", "validar_motor.html")).as_uri()
        with tempfile.TemporaryDirectory() as tmp_profile:
            proc = subprocess.run(
                [
                    chrome,
                    "--headless=new",
                    "--no-sandbox",
                    "--disable-gpu",
                    "--allow-file-access-from-files",
                    f"--user-data-dir={tmp_profile}",
                    "--virtual-time-budget=2000",
                    "--dump-dom",
                    url,
                ],
                capture_output=True,
                text=True,
                encoding="utf-8",
                timeout=30,
            )
            m = re.search(r'<pre id="resultado-validacion">(.*?)</pre>', proc.stdout, re.DOTALL)
            if not m:
                print("ERROR: No se obtuvo salida JSON de validar_motor.html")
                print("RC:", proc.returncode, "STDOUT_LEN:", len(proc.stdout), "STDERR:", proc.stderr[-500:])
                sys.exit(1)
            data = json.loads(html.unescape(m.group(1)))
            print(f"Validación RotaSat: {data['pasaron']}/{data['total']} pruebas pasaron.")
            for r in data["resultados"]:
                marca = "PASS" if r["ok"] else "FAIL"
                print(f"  [{marca}] {r['nombre']} ({r['detalle']})")
            sys.exit(0 if data["fallaron"] == 0 else 1)
    finally:
        httpd.shutdown()
        httpd.server_close()


if __name__ == "__main__":
    main()
