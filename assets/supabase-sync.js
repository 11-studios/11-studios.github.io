(()=>{
  const SUPABASE_URL='https://mzrnuiunfxaendnrigzk.supabase.co';
  const ANON='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16cm51aXVuZnhhZW5kbnJpZ3prIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIxMzk4NTgsImV4cCI6MjEwNzcxNTg1OH0.VexJjdlAgwBj7uHc51O5wx9ZsWv2unoyi1R_XJJ5cYA';
  const ADMIN_USER='sems11_';
  const TOKEN_KEY='11_cloud_admin_token';
  let adminToken=sessionStorage.getItem(TOKEN_KEY)||'';
  let remoteInitiallyEmpty=false;
  let ready=false;
  let pushing=false;

  const headers=()=>({
    apikey:ANON,
    Authorization:`Bearer ${ANON}`,
    'Content-Type':'application/json'
  });

  async function rpc(name,payload){
    const r=await fetch(`${SUPABASE_URL}/rest/v1/rpc/${name}`,{
      method:'POST',headers:headers(),body:JSON.stringify(payload||{}),cache:'no-store'
    });
    if(!r.ok){
      let detail='';try{detail=await r.text();}catch{}
      throw new Error(`${name}:${r.status}:${detail.slice(0,220)}`);
    }
    const text=await r.text();
    if(!text)return null;
    try{return JSON.parse(text);}catch{return text;}
  }

  function mapRemote(row){
    return {
      id:String(row.id||''),
      name:String(row.name||'Plugin'),
      version:String(row.version||'1.0.0'),
      category:String(row.category||'other'),
      price:Number(row.price)||0,
      desc:String(row.description||''),
      url:String(row.url||''),
      icon:String(row.icon||''),
      image:String(row.image||''),
      video:String(row.video||''),
      downloadFileName:String(row.download_file_name||''),
      downloadFileSize:Number(row.download_file_size)||0,
      hasDownloadFile:!!row.has_download_file,
      filePath:String(row.file_path||'')
    };
  }

  async function fetchRemote(){
    const r=await fetch(`${SUPABASE_URL}/rest/v1/plugins?select=*&order=sort_order.asc,name.asc`,{headers:headers(),cache:'no-store'});
    if(!r.ok)throw new Error(`plugins:${r.status}`);
    const data=await r.json();
    return Array.isArray(data)?data.map(mapRemote):[];
  }

  function localPlugins(){
    try{return typeof plugins!=='undefined'&&Array.isArray(plugins)?plugins:[];}catch{return[];}
  }

  function setPlugins(list){
    try{
      plugins=list.map(x=>({...x}));
      localStorage.setItem('11_plugins',JSON.stringify(plugins));
      if(typeof renderPlugins==='function')renderPlugins();
      if(typeof renderAdminList==='function')renderAdminList();
      if(typeof updateSessionUI==='function')updateSessionUI();
    }catch(err){console.error('[11_ Studios] cloud catalog apply failed',err);}
  }

  async function loadRemote(){
    try{
      const remote=await fetchRemote();
      remoteInitiallyEmpty=remote.length===0;
      if(remote.length){
        setPlugins(remote);
        return true;
      }
      return false;
    }catch(err){
      console.error('[11_ Studios] cloud catalog load failed',err);
      return false;
    }
  }

  async function tokenValid(){
    if(!adminToken)return false;
    try{return !!(await rpc('admin_session_valid',{p_token:adminToken}));}
    catch{return false;}
  }

  async function pushAll(showToast=false){
    if(!adminToken||pushing)return false;
    const list=localPlugins();
    if(!Array.isArray(list))return false;
    pushing=true;
    try{
      await rpc('replace_plugins',{p_token:adminToken,p_plugins:list});
      remoteInitiallyEmpty=false;
      if(showToast&&typeof toast==='function')toast(document.getElementById('languageSelect')?.value==='en'?'Saved for all devices.':'Tüm cihazlara kaydedildi.');
      document.dispatchEvent(new CustomEvent('11:cloud-synced'));
      return true;
    }catch(err){
      console.error('[11_ Studios] cloud catalog save failed',err);
      if(showToast&&typeof toast==='function')toast(document.getElementById('languageSelect')?.value==='en'?'Cloud save failed.':'Buluta kaydetme başarısız.');
      return false;
    }finally{pushing=false;}
  }

  async function cloudLogin(username,password){
    const token=await rpc('admin_login',{p_username:username,p_password:password});
    if(!token)return '';
    adminToken=String(token);
    sessionStorage.setItem(TOKEN_KEY,adminToken);
    return adminToken;
  }

  function expose(){
    window.__11Cloud={
      url:SUPABASE_URL,
      anon:ANON,
      getToken:()=>adminToken,
      pushAll,
      loadRemote,
      publicFileUrl:path=>`${SUPABASE_URL}/storage/v1/object/public/plugin-files/${String(path||'').split('/').map(encodeURIComponent).join('/')}`
    };
  }
  expose();

  document.addEventListener('submit',async e=>{
    const form=e.target;
    if(!(form instanceof HTMLFormElement)||form.id!=='loginForm')return;
    const u=document.getElementById('loginUser')?.value.trim()||'';
    if(u.toLowerCase()!==ADMIN_USER.toLowerCase())return;
    e.preventDefault();
    e.stopImmediatePropagation();
    const p=document.getElementById('loginPass')?.value||'';
    const msg=document.getElementById('loginMsg');
    const submit=form.querySelector('button[type="submit"]');
    if(submit)submit.disabled=true;
    try{
      const token=await cloudLogin(ADMIN_USER,p);
      if(!token){if(msg)msg.textContent=document.getElementById('languageSelect')?.value==='en'?'Incorrect username or password.':'Kullanıcı adı veya şifre hatalı.';return;}
      try{
        session={username:ADMIN_USER,admin:true};
        localStorage.setItem('11_session',JSON.stringify(session));
      }catch{}
      if(msg)msg.textContent='';
      if(typeof closeModal==='function')closeModal('loginModal');
      if(typeof updateSessionUI==='function')updateSessionUI();
      if(typeof toast==='function')toast(document.getElementById('languageSelect')?.value==='en'?'Admin login successful.':'Admin hesabıyla giriş yapıldı.');
      if(remoteInitiallyEmpty)await pushAll(true);else await loadRemote();
      document.dispatchEvent(new CustomEvent('11:cloud-admin-ready'));
    }catch(err){
      console.error('[11_ Studios] cloud admin login failed',err);
      if(msg)msg.textContent=document.getElementById('languageSelect')?.value==='en'?'Login service unavailable.':'Giriş servisine ulaşılamadı.';
    }finally{if(submit)submit.disabled=false;}
  },true);

  function patchAfterAppReady(){
    if(ready)return;
    try{
      if(typeof plugins==='undefined'||typeof renderPlugins!=='function'||typeof updateSessionUI!=='function')return;
      ready=true;

      const logout=document.getElementById('logoutBtn');
      if(logout)logout.addEventListener('click',()=>{
        const old=adminToken;
        adminToken='';sessionStorage.removeItem(TOKEN_KEY);
        if(old)rpc('admin_logout',{p_token:old}).catch(()=>{});
      },true);

      const form=document.getElementById('pluginForm');
      if(form)form.addEventListener('submit',()=>{
        if(!adminToken)return;
        setTimeout(()=>pushAll(true),900);
      });

      try{
        if(typeof deletePlugin==='function'){
          const baseDelete=deletePlugin;
          deletePlugin=function(id){const r=baseDelete(id);if(adminToken)setTimeout(()=>pushAll(true),250);return r;};
          window.deletePlugin=deletePlugin;
        }
      }catch{}

      document.addEventListener('11:catalog-changed',()=>{if(adminToken)setTimeout(()=>pushAll(true),120);});

      (async()=>{
        const valid=await tokenValid();
        if(!valid){adminToken='';sessionStorage.removeItem(TOKEN_KEY);}
        try{
          if(session?.admin&&!adminToken){
            session=null;localStorage.removeItem('11_session');updateSessionUI();
            if(typeof toast==='function')toast(document.getElementById('languageSelect')?.value==='en'?'Please log in as admin once for cloud sync.':'Bulut senkronu için admin hesabına bir kez tekrar giriş yap.');
          }
        }catch{}
        const hadRemote=await loadRemote();
        if(!hadRemote&&adminToken)await pushAll(false);
      })();
    }catch(err){console.error('[11_ Studios] cloud init failed',err);}
  }

  let tries=0;
  const timer=setInterval(()=>{
    tries++;
    patchAfterAppReady();
    if(ready||tries>200)clearInterval(timer);
  },100);
})();