# AIProps 2.0 — primera vista previa

Base: ZIP de GitHub `aiprops/aiprops-landing` commit `4f7ac8a5b167786ec93b8d3a0001855f09ae9a3d`.

## Incluye
- Seccion Demo Lab integrada antes de Proceso; conserva sitio original.
- 6 tarjetas de soluciones y filtros por industria.
- Ventana de video con aviso explicito de que las grabaciones aun no estan publicadas.
- Enlaces a la seccion Calendly existente.
- Soporte basico para reproducir MP4 al asignar ruta a `video` en el objeto `demos` al final de index.html.
- Enlace Demo Lab en navegacion de escritorio y movil.

## Probar localmente
Abre `index.html` en navegador, o inicia servidor local con `python -m http.server 8000` y visita `http://localhost:8000`.

## Publicacion SEGURA
No subir a `main`. Subir solo los archivos de esta carpeta a `aiprops-v2-development` y revisar preview deployment de Vercel antes de considerar cualquier merge. No se ha publicado nada desde esta entrega.

## Limitaciones
Los demos de software y sus videos NO estan desarrollados ni incluidos. Esta entrega es el primer prototipo visual de la biblioteca comercial. Para un flujo completo de leads podemos incorporar luego UTMs, formularios por solucion y CRM.
