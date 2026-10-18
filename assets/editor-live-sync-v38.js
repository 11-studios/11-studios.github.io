(()=>{
  if(window.__11EditorLiveSync38)return;window.__11EditorLiveSync38=true;
  if(new URLSearchParams(location.search).get('editorPreview')==='1')return;
  const API='https://mzrnuiunfxaendnrigzk.supabase.co/functions/v1/editor-api';
  let revision=null,busy=false;
  async function check(){
    if(busy||document.hidden)return;
    busy=true;
    try{
      const r=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'get'}),cache:'no-store',credentials:'omit'});
      if(!r.ok)return;
      const data=await r.json();const next=Number(data?.revision)||1;
      if(revision===null){revision=next;return;}
      if(next!==revision){revision=next;location.reload();}
    }catch{}finally{busy=false;}
  }
  window.addEventListener('focus',check);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)check();});
  setInterval(check,6000);
  setTimeout(check,1200);
})();
