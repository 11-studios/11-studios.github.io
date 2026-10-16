(()=>{
  const KEY='11_editor_state_cache_v2';
  const ENDPOINT='https://mzrnuiunfxaendnrigzk.supabase.co/functions/v1/editor-api';
  let cached=null;
  try{
    const raw=localStorage.getItem(KEY);
    const parsed=raw?JSON.parse(raw):null;
    if(parsed&&Array.isArray(parsed.elements))cached=parsed;
  }catch{}
  window.__11EditorCachedState=cached;
  window.__11EditorStatePromise=fetch(ENDPOINT,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({action:'get'}),
    cache:'no-store',
    credentials:'omit'
  }).then(r=>{if(!r.ok)throw new Error(`editor-state:${r.status}`);return r.json();}).then(data=>{
    const state=data?.data&&Array.isArray(data.data.elements)?data.data:{elements:[]};
    try{localStorage.setItem(KEY,JSON.stringify(state));}catch{}
    window.__11EditorCachedState=state;
    return state;
  }).catch(()=>cached||null);
})();