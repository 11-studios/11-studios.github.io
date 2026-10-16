(()=>{
  const SUPABASE_URL='https://mzrnuiunfxaendnrigzk.supabase.co';
  const PUBLISHABLE='sb_publishable_ZF1vdtlp5gpOGwljI1vRmw_FaLRRFOb';
  const API_URL=`${SUPABASE_URL}/functions/v1/site-api`;
  const ADMIN_USER='sems11_';
  const TOKEN_KEY='11_cloud_admin_token';
  let adminToken=sessionStorage.getItem(TOKEN_KEY)||'';
  let remoteInitiallyEmpty=false;
  let ready=false;
  let pushing=false;

  const publicHeaders=()=>({apikey:PUBLISHABLE,'Content-Type':'application/json'});

  async function api(action,payload){
    const r=await fetch(API_URL,{
      method:'POST',headers:publicHeaders(),body:JSON.stringify({action,...(payload||{})}),cache:'no-store',credentials:'omit'
    });
    const text=await r.text();
    let data=null;try{data=text?JSON.parse(text):null;}catch{data=text;}
    if(!r.ok){
      const err=new Error(`${action}:${r.status}`);err.status=r.status;err.payload=data;err.raw=text;throw err;
    }
    return data;
  }
  const rpc=api;

  function safeImage(value){
    const s=String(value||'');
    return /^data:image\/(?:png|jpe?g|webp|gif);base64,/i.test(s)?s:'';
  }
  function mapRemote(row){
    return {
      id:String(row.id||'').replace(/[^A-Za-z0-9_-]/g,'').slice(0,64),
      name:String(row.name||'Plugin').slice(0,80),
      version:String(row.version||'1.0.0').slice(0,40),
      category:['utility','security','visual','other'].includes(String(row.category||''))?String(row.category):'other',
      price:Math.max(0,Number(row.price)||0),
      desc:String(row.description||'').slice(0,12000),
      url:/^https?:\/\//i.test(String(row.url||''))?String(row.url).slice(0,1200):'',
      icon:String(row.icon||'').replace(/[^A-Za-z0-9_-]/g,'').slice(0,120),
      image:safeImage(row.image),
      video:/^https?:\/\//i.test(String(row.video||''))?String(row.video).slice(0,1200):'',
      downloadFileName:String(row.download_file_name||'').slice(0,180),
      downloadFileSize:Math.max(0,Number(row.download_file_size)||0),
      hasDownloadFile:!!row.has_download_file,
      filePath:/^[A-Za-z0-9_-]+\/[A-Za-z0-9._-]+$/.test(String(row.file_path||''))?String(row.file_path):''
    };
  }

  async function fetchRemote(){
    const r=await fetch(`${SUPABASE_URL}/rest/v1/plugins?select=*&order=sort_order.asc,name.asc`,{
      headers:{apikey:PUBLISHABLE,Accept:'application/json'},cache:'no-store',credentials:'omit'
    });
    if(!r.ok)throw new Error(`plugins:${r.status}`);
    const data=await r.json();
    return Array.isArray(data)?data.map(mapRemote):[];
  }

  function localPlugins(){try{return typeof plugins!=='undefined'&&Array.isArray(plugins)?plugins:[];}catch{return[];}}
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
      if(remote.length){setPlugins(remote);return true;}
      return false;
    }catch(err){console.error('[11_ Studios] cloud catalog load failed',err);return false;}
  }

  async function tokenValid(){
    if(!adminToken)return false;
    try{return !!(await rpc('admin_session_valid',{p_token:adminToken}));}catch{return false;}
  }

  async function pushAll(showToast=false){
    if(!adminToken||pushing)return false;
    const list=localPlugins();if(!Array.isArray(list))return false;
    pushing=true;
    try{
      await rpc('replace_plugins',{p_token:adminToken,p_plugins:list});
      remoteInitiallyEmpty=false;
      if(showToast&&typeof toast==='function')toast(document.getElementById('languageSelect')?.value==='en'?'Saved for all devices.':'Tüm cihazlara kaydedildi.');
      document.dispatchEvent(new CustomEvent('11:cloud-synced'));
      return true;
    }catch(err){
      console.error('[11_ Studios] cloud catalog save failed',err);
      if(showToast&&typeof toast==='function')toast(err?.status===429?(document.getElementById('languageSelect')?.value==='en'?'Too many requests. Try again shortly.':'Çok fazla işlem yapıldı. Biraz sonra tekrar dene.'):(document.getElementById('languageSelect')?.value==='en'?'Cloud save failed.':'Buluta kaydetme başarısız.'));
      return false;
    }finally{pushing=false;}
  }

  async function cloudLogin(username,password){
    const token=await rpc('admin_login',{p_username:username,p_password:password});
    if(!token)return '';
    adminToken=String(token);sessionStorage.setItem(TOKEN_KEY,adminToken);return adminToken;
  }

  window.__11Cloud={
    url:SUPABASE_URL,
    anon:PUBLISHABLE,
    publishable:PUBLISHABLE,
    api,
    getToken:()=>adminToken,
    pushAll,
    loadRemote,
    publicFileUrl:path=>`${SUPABASE_URL}/storage/v1/object/public/plugin-files/${String(path||'').split('/').map(encodeURIComponent).join('/')}`
  };

  document.addEventListener('submit',async e=>{
    const form=e.target;
    if(!(form instanceof HTMLFormElement)||form.id!=='loginForm')return;
    const u=document.getElementById('loginUser')?.value.trim()||'';
    if(u.toLowerCase()!==ADMIN_USER.toLowerCase())return;
    e.preventDefault();e.stopImmediatePropagation();
    const p=document.getElementById('loginPass')?.value||'';
    const msg=document.getElementById('loginMsg');const submit=form.querySelector('button[type="submit"]');
    if(submit)submit.disabled=true;
    try{
      const token=await cloudLogin(ADMIN_USER,p);
      if(!token){if(msg)msg.textContent=document.getElementById('languageSelect')?.value==='en'?'Incorrect username or password.':'Kullanıcı adı veya şifre hatalı.';return;}
      try{session={username:ADMIN_USER,admin:true};localStorage.setItem('11_session',JSON.stringify(session));}catch{}
      if(msg)msg.textContent='';if(typeof closeModal==='function')closeModal('loginModal');if(typeof updateSessionUI==='function')updateSessionUI();
      if(typeof toast==='function')toast(document.getElementById('languageSelect')?.value==='en'?'Admin login successful.':'Admin hesabıyla giriş yapıldı.');
      if(remoteInitiallyEmpty)await pushAll(true);else await loadRemote();
      document.dispatchEvent(new CustomEvent('11:cloud-admin-ready'));
    }catch(err){
      console.error('[11_ Studios] cloud admin login failed',err);
      if(msg)msg.textContent=err?.status===429?(document.getElementById('languageSelect')?.value==='en'?'Too many attempts. Try again later.':'Çok fazla deneme yapıldı. Biraz sonra tekrar dene.'):(document.getElementById('languageSelect')?.value==='en'?'Login service unavailable.':'Giriş servisine ulaşılamadı.');
    }finally{if(submit)submit.disabled=false;}
  },true);

  function patchAfterAppReady(){
    if(ready)return;
    try{if(typeof plugins==='undefined'||typeof renderPlugins!=='function'||typeof updateSessionUI!=='function')return;ready=true;
      const logout=document.getElementById('logoutBtn');
      if(logout)logout.addEventListener('click',()=>{const old=adminToken;adminToken='';sessionStorage.removeItem(TOKEN_KEY);if(old)rpc('admin_logout',{p_token:old}).catch(()=>{});},true);
      const form=document.getElementById('pluginForm');if(form)form.addEventListener('submit',()=>{if(adminToken)setTimeout(()=>pushAll(true),900);});
      try{if(typeof deletePlugin==='function'){const baseDelete=deletePlugin;deletePlugin=function(id){const r=baseDelete(id);if(adminToken)setTimeout(()=>pushAll(true),250);return r;};window.deletePlugin=deletePlugin;}}catch{}
      document.addEventListener('11:catalog-changed',()=>{if(adminToken)setTimeout(()=>pushAll(true),120);});
      (async()=>{
        const valid=await tokenValid();if(!valid){adminToken='';sessionStorage.removeItem(TOKEN_KEY);}
        try{if(session?.admin&&!adminToken){session=null;localStorage.removeItem('11_session');updateSessionUI();if(typeof toast==='function')toast(document.getElementById('languageSelect')?.value==='en'?'Please log in as admin again.':'Admin hesabına tekrar giriş yap.');}}catch{}
        const hadRemote=await loadRemote();if(!hadRemote&&adminToken)await pushAll(false);
      })();
    }catch(err){console.error('[11_ Studios] cloud init failed',err);}
  }

  let tries=0;const timer=setInterval(()=>{tries++;patchAfterAppReady();if(ready||tries>200)clearInterval(timer);},100);
})();