#!/usr/bin/env python3
"""
descarga.py — Descarga JSON de una API y guarda una copia en data/crudos/.

Si no hay internet (o se corre con --offline), usa la copia guardada. Así los datos reales
descargados una vez no se pierden cuando otra persona vuelve a correr generar_parcelas.py.
También permite descargar las URL desde el navegador y copiar los archivos a data/crudos/.
"""
import json
import os
import urllib.request


def obtener_json(url, cache_path=None, online=True, timeout=60):
    if online:
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "NASA-SpaceApps-FieldShift/1.0"})
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                data = json.loads(resp.read().decode("utf-8"))
            if cache_path:
                os.makedirs(os.path.dirname(cache_path), exist_ok=True)
                with open(cache_path, "w", encoding="utf-8") as f:
                    json.dump(data, f, separators=(",", ":"))
            return data
        except Exception:
            pass
    if cache_path and os.path.exists(cache_path):
        with open(cache_path, encoding="utf-8") as f:
            return json.load(f)
    return None
