// Vercel Serverless API. Do not put secret keys in client-side HTML.
const esc = (v) => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cut = (v, n=255) => String(v ?? '').trim().slice(0,n);
const emailOk = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const phoneOk = v => !v || /^[-+()0-9 .]{7,35}$/.test(v);

export default async function handler(req,res){
  if(req.method !== 'POST') return res.status(405).json({error:'Método no permitido'});
  if(!String(req.headers['content-type'] || '').includes('application/json')) return res.status(415).json({error:'Formato no permitido'});
  const origin=req.headers.origin;
  if(origin){
    try{
      const host=new URL(origin).hostname;
      if(!(host==='aiprops.online'||host==='www.aiprops.online'||host.endsWith('.vercel.app')||host==='localhost')) return res.status(403).json({error:'Origen no permitido'});
    }catch{return res.status(403).json({error:'Origen inválido'});}
  }
  const b=typeof req.body==='object'&&req.body!==null?req.body:{};
  // Hidden honeypot: ignore automated submissions without alerting spambots.
  if(b.website) return res.status(200).json({ok:true,confirmationSent:false});
  const d={
    name:cut(b.name,120),email:cut(b.email,180).toLowerCase(),phone:cut(b.phone,35),
    business:cut(b.business,150),industry:cut(b.industry,100),solution:cut(b.solution,120),
    need:cut(b.need,160),challenge:cut(b.challenge,2000),tools:cut(b.tools,250),
    timeline:cut(b.timeline,80),contactPreference:cut(b.contactPreference,80)
  };
  if(!d.name||!emailOk(d.email)||!phoneOk(d.phone)||b.consent!=='on'){
    return res.status(400).json({error:'Revisa el nombre, correo, teléfono opcional y autorización de contacto.'});
  }
  // Conservative abuse controls: reject giant payloads even when individual fields are truncated.
  if(JSON.stringify(b).length>12000) return res.status(413).json({error:'La solicitud es demasiado extensa.'});
  const key=process.env.RESEND_API_KEY,from=process.env.EMAIL_FROM,to=process.env.LEADS_TO_EMAIL;
  if(!key||!from||!to){console.error('Faltan variables de Resend');return res.status(503).json({error:'El formulario no está disponible ahora. Comunícate por correo o WhatsApp.'});}
  const calendar='https://calendly.com/aiprops/30min';
  const fields=[['Nombre',d.name],['Correo',d.email],['Teléfono / WhatsApp',d.phone],['Negocio',d.business],['Necesidad seleccionada',d.need],['Solución de interés',d.solution],['Descripción',d.challenge],['Industria',d.industry],['Herramientas',d.tools],['Plazo',d.timeline],['Contacto preferido',d.contactPreference]];
  const listing=fields.map(([k,v])=>'<p><b>'+esc(k)+':</b> '+esc(v||'No indicado')+'</p>').join('');
  async function send(payload){
    const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify(payload)});
    const data=await r.json().catch(()=>({}));if(!r.ok)throw new Error('Resend '+r.status+': '+JSON.stringify(data));return data;
  }
  try{
    await send({from,to:[to],reply_to:d.email,subject:'Nuevo prospecto AIProps · '+(d.business||d.name),html:'<h2>Nueva solicitud desde aiprops.online</h2>'+listing});
  }catch(err){console.error('Error aviso interno:',err.message);return res.status(502).json({error:'No pudimos enviar tu solicitud. Inténtalo otra vez o escríbenos directamente.'});}
  let confirmationSent=false;
  try{
    const context=esc(d.need||d.solution||'una solución digital');
    await send({from,to:[d.email],subject:'AIProps recibió tu solicitud',html:'<div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;color:#142838"><h1 style="color:#0e9bb0">¡Gracias por comunicarte con AIProps!</h1><p>Hola, '+esc(d.name)+'.</p><p>Recibimos tu solicitud relacionada con <b>'+context+'</b>. Revisaremos la información que compartiste para conversar sobre una solución adaptada a tu negocio.</p><p>Si deseas elegir una fecha disponible, utiliza este enlace:</p><p><a href="'+calendar+'" style="background:#ff6b00;color:white;padding:13px 20px;border-radius:8px;text-decoration:none;display:inline-block">Coordinar reunión →</a></p><p>Enviar el formulario no reserva una reunión automáticamente.</p><p>AIProps · <a href="https://aiprops.online">aiprops.online</a> · soluciones@aiprops.online</p></div>'});
    confirmationSent=true;
  }catch(err){console.error('Aviso interno recibido, fallo confirmación de cliente:',err.message);}
  return res.status(200).json({ok:true,confirmationSent});
}
