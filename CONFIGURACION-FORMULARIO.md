# AIProps — Formulario de prospectos y correo automático

## Flujo
1. El visitante completa el formulario y autoriza el contacto.
2. `POST /api/lead` valida los campos y notifica por correo a AIProps.
3. El visitante recibe (si el proveedor admite el envío) un correo de agradecimiento con el enlace a Calendly.
4. La página ofrece abrir Calendly integrado, con nombre y correo precargados.
5. Elegir fecha es OPCIONAL y no ocurre por el solo envío del formulario.

## Activar antes de publicar
La interfaz local permite visualizar el formulario, pero los envíos REQUIEREN desplegar en Vercel y configurar estas variables en **Project Settings → Environment Variables** (Preview para probar; luego Production):

- `RESEND_API_KEY`: clave privada del servicio Resend.
- `EMAIL_FROM`: remitente verificado en Resend, por ejemplo `AIProps <contacto@notificaciones.aiprops.online>` después de verificar ese subdominio.
- `LEADS_TO_EMAIL`: correo interno de recepción; por ejemplo `soluciones@aiprops.online`.

**Importante:** No añadir los valores secretos al repositorio, ni modificar el DNS de correo existente sin comprobar el impacto. Verificar un subdominio de envío dedicado facilita mantener la configuración actual de Microsoft 365/GoDaddy. Crear las entradas DNS indicadas por Resend cuidadosamente.

## Pruebas
- Vercel → Preview más reciente, no abrir desde `file://` para probar envío.
- Con las 3 variables en Preview, enviar un prospecto ficticio desde un correo propio y comprobar aviso al negocio y autorespuesta.
- Verificar recepción, spam y visualización móvil.
- Enviar con un error deliberado para comprobar validaciones.
- Comprobar que el botón abre Calendly y que el visitante puede seleccionar fecha; la reserva es independiente.

## Limitaciones y siguiente etapa
- **Los prospectos se notifican por correo; esta V1 NO guarda una base de datos de leads ni garantiza entrega del correo al inbox.** Recomendado después: registrar simultáneamente en un CRM/SharePoint/DB y activar protección anti-spam/captcha y limitación de solicitudes.
- La privacidad debe revisarse antes de publicar: finalidad, proveedor de correo, conservación, derechos y mecanismos de contacto.
- Un correo de confirmación informa recepción y comparte enlace; no significa que la reunión está reservada.
- El backend debe permanecer en Vercel; los archivos HTML solos no pueden enviar correos seguros desde el navegador.
