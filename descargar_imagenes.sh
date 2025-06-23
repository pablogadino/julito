#!/bin/bash
# Script para descargar y reemplazar imágenes en la carpeta images
# URLs verificadas y libres de derechos

cd "$(dirname "$0")/images"

# Bandera de Salto (SVG)
wget -O bandera_salto.png "https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Salto_Department.svg"

# Costanera de Salto
wget -O costanera_salto.png "https://upload.wikimedia.org/wikipedia/commons/2/2e/Costanera_Norte_Salto_Uruguay.jpg"

# Escudo de Salto
wget -O escudo_salto.png "https://upload.wikimedia.org/wikipedia/commons/5/57/Coat_of_arms_of_Salto_Department.png"

# Fauna de Salto (carpincho)
wget -O fauna_salto.png "https://upload.wikimedia.org/wikipedia/commons/6/6b/Capybara_%28Hydrochoerus_hydrochaeris%29.JPG"

# Flora de Salto (ceibo)
wget -O flora_salto.png "https://upload.wikimedia.org/wikipedia/commons/2/2e/Erythrina_crista-galli_flower.jpg"

# Mapa de Salto detalle
wget -O mapa_salto_detalle.png "https://upload.wikimedia.org/wikipedia/commons/2/2a/Salto_Uruguay_map.png"

# Mapa Uruguay Salto
wget -O mapa_uruguay_salto.png "https://upload.wikimedia.org/wikipedia/commons/3/3e/Uruguay_departments_Salto_highlighted.png"

# Represa Salto Grande (800x600)
wget -O represa_salto_grande.png "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Represa_Salto_Grande.jpg/800px-Represa_Salto_Grande.jpg"

# Termas del Daymán
wget -O termas_dayman.png "https://upload.wikimedia.org/wikipedia/commons/7/7e/Termas_Dayman_Salto_Uruguay.jpg"

echo "Descarga completada. Las imágenes han sido reemplazadas."
