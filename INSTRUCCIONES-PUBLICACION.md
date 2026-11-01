# AIProps Solutions Lab — 7 videos integrados

Este paquete debe subirse UNICAMENTE a la rama `aiprops-v2-development`. No cambies `main`, DNS ni dominios.

## Estructura
- `index.html`: página principal con bienvenida y seis videos.
- `soluciones/<sistema>/index.html`: páginas individuales.
- `assets/demos/*.mp4`: siete videos optimizados para web.
- `assets/demos/*-poster.jpg`: miniaturas de reproducción.

## Subida
Los archivos MP4 pueden superar el límite de subida en la interfaz GitHub (25 MB por archivo). La vía recomendable es Git local con GitHub Desktop, o alojar los MP4 en un servicio de video y actualizar las rutas. Los siete MP4 de este paquete están comprimidos para web; verifica tamaño final individual.

1. Haz respaldo de tu rama actual.
2. Abre el proyecto en GitHub Desktop, selecciona `aiprops-v2-development`.
3. Sustituye/agrega los archivos del paquete en la raíz del repositorio, confirma el commit y haz Push.
4. Verifica Vercel Preview (Ready), reproduce los siete videos y revisa la agenda.
5. No hagas merge a `main` hasta validar todo.

Si habías cambiado manualmente el video de QuoteFlow a `assets/quoteflow-comercial.mp4`, la nueva versión de `index.html` usa `assets/demos/quoteflow.mp4` dentro de este mismo paquete.

Los prototipos de software no se publican: solo estos videos. La versión pública no ha sido modificada.
