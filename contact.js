'use strict';
function openBooking(){const m=document.querySelector('[aria-label="Заявка"]');m.style.display='flex';m.classList.add('active');document.body.style.overflow='hidden';}
function closeBooking(){const m=document.querySelector('[aria-label="Заявка"]');m.style.display='none';m.classList.remove('active');document.body.style.overflow='';}
function openQuiz(){openBooking();}
function closeQuiz(){closeBooking();}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeBooking();});
document.getElementById('contact-form').addEventListener('submit',async e=>{
 e.preventDefault();const form=e.currentTarget;if(!form.reportValidity())return;
 const button=form.querySelector('button[type=submit]'),status=document.getElementById('form-status');
 const values=new FormData(form);const phone=String(values.get('phone')).replace(/[\s()-]/g,'');
 if(!/^\+[1-9]\d{6,14}$/.test(phone)){status.textContent='Укажите телефон с кодом страны, например +34…';return;}
 const payload={schema_version:2,source:form.dataset.source,name:String(values.get('name')).trim(),phone,email:String(values.get('email')).trim(),program:values.get('program'),travel:values.get('travel'),channel:values.get('channel'),consent:true,consent_version:'2026-11-11',page:location.origin+location.pathname};
 button.disabled=true;status.textContent='Отправляем…';
 try{const r=await fetch('https://leads.profblum.org/lead',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});const result=await r.json();if(!r.ok||!result.ok)throw new Error('send');form.reset();form.querySelectorAll('label,button').forEach(el=>el.hidden=true);status.textContent='Спасибо. Заявка получена. Сотрудник клиники свяжется с вами по выбранному каналу.';}
 catch{status.textContent='Не удалось отправить заявку. Попробуйте ещё раз.';button.disabled=false;}
});
