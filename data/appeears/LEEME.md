# CSV de AppEEARS

## Pedido (Point Sample)
- **Coordenadas:** subir `puntos_pedido2.csv` (centro de cada parcela + 4 vecinos a ~55 m para la pendiente).
- **Fechas:** 11-01-2022 a 11-01-2025.
- **Capas:**
  - HLSL30 (Land Surface Reflectance): B04, B05, B06, B07, Fmask
  - HLSS30 (Land Surface Reflectance): B04, B8A, B11, B12, Fmask
  - SPL4SMGP (SMAP): Geophysical_Data_sm_rootzone
  - NASADEM_NC: NASADEM_HGT (elevación)

## Cuando llegue el correo
Copie aquí los archivos `*-results.csv` y corra `python scripts/generar_parcelas.py`.
Cada punto se asigna a la parcela cuyo centroide esté a menos de 1 km.
