// Función serverless en Vercel. Variables privadas en Vercel, nunca en HTML.
const esc=(v)=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cut=(v,n=255)=>String(v??'').trim().slice(0,n);
export default async function handler(req,res){
  if(req.method!=='POST')return res.status(405).json({error:'Método no permitido'});
  const type=String(req.headers['content-type']||'');if(!type.includes('application/json'))return res.status(415).json({error:'Formato no permitido'});
  const origin=req.headers.origin;
  if(origin){try{const host=new URL(origin).hostname;const allowed=host==='aiprops.online'||host==='www.aiprops.online'||host.endsWith('.vercel.app')||host==='localhost';if(!allowed)return res.status(403).json({error:'Origen no permitido'})}catch{return res.status(403).json({error:'Origen inválido'})}}
  const body=typeof req.body==='object'&&req.body!==null?req.body:{};
  if(body.website)return res.status(200).json({ok:true,confirmationSent:true});
  const d={name:cut(body.name,120),email:cut(body.email,180).toLowerCase(),phone:cut(body.phone,35),business:cut(body.business,150),industry:cut(body.industry,100),solution:cut(body.solution,120),challenge:cut(body.challenge,2000),tools:cut(body.tools,250),timeline:cut(body.timeline,80),contactPreference:cut(body.contactPreference,80)};
  if(!d.name||!d.business||!d.industry||!d.solution||d.challenge.length<15||!/^\S+@\S+\.\S+$/.test(d.email)||!/^[-+()0-9 .]{7,35}$/.test(d.phone)||body.consent!=='on')return res.status(400).json({error:'Revisa los campos obligatorios del formulario.'});
  const key=process.env.RESEND_API_KEY,from=process.env.EMAIL_FROM,to=process.env.LEADS_TO_EMAIL;
  if(!key||!from||!to){console.error('Faltan variables de correo');return res.status(503).json({error:'El formulario aún no está activado. Contáctanos por correo o WhatsApp.'})}
  const calendar='https://calendly.com/aiprops/30min';
  const fields=[['Nombre',d.name],['Correo',d.email],['Teléfono',d.phone],['Negocio',d.business],['Industria',d.industry],['Solución',d.solution],['Necesidad',d.challenge],['Herramientas actuales',d.tools],['Plazo',d.timeline],['Contacto preferido',d.contactPreference]];
  const listing=fields.map(([k,v])=>'<p><b>'+esc(k)+':</b> '+esc(v)+'</p>').join('');
  const send=async payload=>{const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify(payload)});const data=await r.json().catch(()=>({}));if(!r.ok)throw new Error('Email provider '+r.status+': '+JSON.stringify(data));return data};
  try{await send({from,to:[to],reply_to:d.email,subject:'Nuevo prospecto AIProps · '+d.business,html:'<h2>Nueva solicitud desde aiprops.online</h2>'+listing});}
  catch(err){console.error('Error enviando aviso interno:',err.message);return res.status(502).json({error:'No pudimos confirmar el envío. Escríbenos directamente por correo.'})}
  let confirmationSent=false;
  try{await send({from,to:[d.email],subject:'AIProps recibió tu solicitud · '+d.business,html:'<div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;color:#142838"><h1 style="color:#0e9bb0">¡Gracias por comunicarte con AIProps!</h1><p>Hola, '+esc(d.name)+'.</p><p>Recibimos tu solicitud relacionada con <strong>'+esc(d.solution)+'</strong> para <strong>'+esc(d.business)+'</strong>.</p><p>Revisaremos la información que compartiste para comunicarnos contigo y conversar sobre una solución adaptada a tus procesos.</p><p><strong>¿Deseas adelantar la coordinación?</strong> Puedes seleccionar una fecha disponible aquí:</p><p><a href="'+calendar+'" style="background:#ff6b00;color:#fff;padding:13px 20px;border-radius:8px;text-decoration:none;display:inline-block">Elegir fecha en Calendly →</a></p><p>Si ya seleccionaste una fecha desde la página, no necesitas repetir el proceso.</p><p>AIProps · Tu empresa. Tus procesos. Nuestra tecnología.</p><p><a href="https://aiprops.online">aiprops.online</a> · soluciones@aiprops.online</p></div>'});confirmationSent=true}catch(err){console.error('Aviso recibido, fallo correo cliente:',err.message)}
  return res.status(200).json({ok:true,confirmationSent});
}
