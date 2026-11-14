# CSV de AppEEARS

Copie aquí los archivos `*-results.csv` que entrega AppEEARS (pedido *Point Sample* con
HLSL30: B04, B05, B06, B07, Fmask; HLSS30: B04, B8A, B11, B12, Fmask; SPL4SMGP: sm_rootzone).

Luego corra `python scripts/generar_parcelas.py`. Cada punto se asigna a la parcela cuyo
centroide esté a menos de 1 km.
