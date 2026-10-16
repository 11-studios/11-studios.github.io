(()=>{
  const SUPABASE_URL='https://mzrnuiunfxaendnrigzk.supabase.co';
  const PUBLISHABLE='sb_publishable_ZF1vdtlp5gpOGwljI1vRmw_FaLRRFOb';
  const API_URL=`${SUPABASE_URL}/functions/v1/site-api`;
  const ADMIN_USER='sems11_';
  const TOKEN_KEY='11_cloud_admin_token';
  const SYNCED_KEY='11_cloud_catalog_synced_v2';
  let adminToken=sessionStorage.getItem(TOKEN_KEY)||'';
  let remoteInitiallyEmpty=false;
  let ready=false;
  let pushing=false;
  let legacyPending=false;
  let pushTimer=0;
  let lastRemoteSignature='';

  const publicHeaders=()=>({apikey:PUBLISHABLE,'Content-Type':'application/json'});
  const isEnglish=()=>document.getElementById('languageSelect')?.value==='en';

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

  function comparablePlugin(p){
    return {
      id:String(p?.id||''),name:String(p?.name||''),version:String(p?.version||''),category:String(p?.category||''),
      price:Number(p?.price)||0,desc:String(p?.desc??p?.description??''),url:String(p?.url||''),icon:String(p?.icon||''),
      image:String(p?.image||''),video:String(p?.video||''),downloadFileName:String(p?.downloadFileName??p?.download_file_name??''),
      downloadFileSize:Number(p?.downloadFileSize??p?.download_file_size??0)||0,hasDownloadFile:!!(p?.hasDownloadFile??p?.has_download_file),
      filePath:String(p?.filePath??p?.file_path??'')
    };
  }
  const catalogSignature=list=>JSON.stringify((Array.isArray(list)?list:[]).map(comparablePlugin));

  function detectLegacyPending(){
    if(localStorage.getItem(SYNCED_KEY)==='1')return false;
    let stored=null;try{stored=JSON.parse(localStorage.getItem('11_plugins')||'null');}catch{}
    if(!Array.isArray(stored)||!stored.length)return false;
    let defaults=[];try{defaults=(typeof DEFAULT_PLUGINS!=='undefined'&&Array.isArray(DEFAULT_PLUGINS))?DEFAULT_PLUGINS:[];}catch{}
    if(!defaults.length)return true;
    return catalogSignature(stored)!==catalogSignature(defaults);
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
  function markSynced(){legacyPending=false;localStorage.setItem(SYNCED_KEY,'1');updateAdminNotice();}
  function markPending(){legacyPending=true;localStorage.removeItem(SYNCED_KEY);updateAdminNotice();}

  function setPlugins(list){
    try{
      plugins=list.map(x=>({...x}));
      localStorage.setItem('11_plugins',JSON.stringify(plugins));
      lastRemoteSignature=catalogSignature(plugins);
      markSynced();
      if(typeof renderPlugins==='function')renderPlugins();
      if(typeof renderAdminList==='function')renderAdminList();
      if(typeof updateSessionUI==='function')updateSessionUI();
    }catch(err){console.error('[11_ Studios] cloud catalog apply failed',err);}
  }

  async function loadRemote(options={}){
    try{
      const remote=await fetchRemote();
      remoteInitiallyEmpty=remote.length===0;
      if(!remote.length)return false;
      lastRemoteSignature=catalogSignature(remote);
      if(options.preserveLegacy!==false&&legacyPending&&!adminToken)return true;
      if(catalogSignature(localPlugins())!==lastRemoteSignature)setPlugins(remote);else markSynced();
      return true;
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
      lastRemoteSignature=catalogSignature(list);
      markSynced();
      if(showToast&&typeof toast==='function')toast(isEnglish()?'Saved for all devices.':'Plugin listesi tüm cihazlara kaydedildi.');
      document.dispatchEvent(new CustomEvent('11:cloud-synced'));
      return true;
    }catch(err){
      console.error('[11_ Studios] cloud catalog save failed',err);
      if(showToast&&typeof toast==='function')toast(err?.status===429?(isEnglish()?'Too many requests. Try again shortly.':'Çok fazla işlem yapıldı. Biraz sonra tekrar dene.'):(isEnglish()?'Cloud save failed.':'Buluta kaydetme başarısız.'));
      return false;
    }finally{pushing=false;}
  }

  function schedulePush(showToast=true,delay=180){
    clearTimeout(pushTimer);
    pushTimer=setTimeout(()=>{if(adminToken)pushAll(showToast);},delay);
  }

  async function cloudLogin(username,password){
    const token=await rpc('admin_login',{p_username:username,p_password:password});
    if(!token)return '';
    adminToken=String(token);sessionStorage.setItem(TOKEN_KEY,adminToken);return adminToken;
  }

  function updateAdminNotice(){
    const el=document.getElementById('adminNotice');if(!el)return;
    if(legacyPending){
      el.textContent=isEnglish()?'This device contains an older local plugin list that has not been uploaded yet. Log in as admin and it will be synced to every device.':'Bu cihazda henüz buluta aktarılmamış eski plugin listen var. Admin hesabına giriş yaptığında liste tüm cihazlara aktarılacak.';
    }else{
      el.textContent=isEnglish()?'Plugin changes are stored in the cloud and synchronized across devices.':'Plugin değişiklikleri bulutta saklanır ve tüm cihazlara senkronize edilir.';
    }
  }

  async function reconcileAfterAdminAuth(showToast=true){
    let remote=[];
    try{remote=await fetchRemote();}catch(err){console.error('[11_ Studios] catalog reconcile failed',err);return false;}
    remoteInitiallyEmpty=remote.length===0;
    if(legacyPending){
      if(!remote.length)return pushAll(showToast);
      const localSig=catalogSignature(localPlugins());
      const remoteSig=catalogSignature(remote);
      if(localSig===remoteSig){markSynced();return true;}
      const useLocal=confirm(isEnglish()?'This device has an older unsynced plugin list. Upload it and replace the cloud list?':'Bu cihazda eski ve henüz senkronize edilmemiş plugin listesi var. Buluttaki liste bununla değiştirilsin mi?');
      if(useLocal)return pushAll(showToast);
      setPlugins(remote);return true;
    }
    if(remote.length){setPlugins(remote);return true;}
    return true;
  }

  async function refreshRemote(){
    if(pushing||legacyPending||adminToken||document.hidden)return;
    try{
      const remote=await fetchRemote();
      if(!remote.length)return;
      const sig=catalogSignature(remote);
      if(sig!==catalogSignature(localPlugins()))setPlugins(remote);
      else{lastRemoteSignature=sig;markSynced();}
    }catch(err){console.debug('[11_ Studios] background catalog refresh skipped',err);}
  }

  window.__11Cloud={
    url:SUPABASE_URL,
    anon:PUBLISHABLE,
    publishable:PUBLISHABLE,
    api,
    getToken:()=>adminToken,
    pushAll,
    loadRemote,
    refreshRemote,
    hasPendingLocalCatalog:()=>legacyPending,
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
      if(!token){if(msg)msg.textContent=isEnglish()?'Incorrect username or password.':'Kullanıcı adı veya şifre hatalı.';return;}
      try{session={username:ADMIN_USER,admin:true};localStorage.setItem('11_session',JSON.stringify(session));}catch{}
      if(msg)msg.textContent='';if(typeof closeModal==='function')closeModal('loginModal');if(typeof updateSessionUI==='function')updateSessionUI();
      if(typeof toast==='function')toast(isEnglish()?'Admin login successful.':'Admin hesabıyla giriş yapıldı.');
      await reconcileAfterAdminAuth(true);
      document.dispatchEvent(new CustomEvent('11:cloud-admin-ready'));
    }catch(err){
      console.error('[11_ Studios] cloud admin login failed',err);
      if(msg)msg.textContent=err?.status===429?(isEnglish()?'Too many attempts. Try again later.':'Çok fazla deneme yapıldı. Biraz sonra tekrar dene.'):(isEnglish()?'Login service unavailable.':'Giriş servisine ulaşılamadı.');
    }finally{if(submit)submit.disabled=false;}
  },true);

  function patchAfterAppReady(){
    if(ready)return;
    try{
      if(typeof plugins==='undefined'||typeof renderPlugins!=='function'||typeof updateSessionUI!=='function')return;
      ready=true;
      legacyPending=detectLegacyPending();
      updateAdminNotice();

      try{
        if(typeof savePlugins==='function'&&!savePlugins.__11CloudWrapped){
          const baseSave=savePlugins;
          const wrapped=function(){const r=baseSave.apply(this,arguments);document.dispatchEvent(new CustomEvent('11:catalog-changed'));return r;};
          wrapped.__11CloudWrapped=true;savePlugins=wrapped;window.savePlugins=wrapped;
        }
      }catch(err){console.error('[11_ Studios] save hook failed',err);}

      const logout=document.getElementById('logoutBtn');
      if(logout)logout.addEventListener('click',()=>{const old=adminToken;adminToken='';sessionStorage.removeItem(TOKEN_KEY);if(old)rpc('admin_logout',{p_token:old}).catch(()=>{});},true);

      document.addEventListener('11:catalog-changed',()=>{markPending();if(adminToken)schedulePush(true,220);});
      document.getElementById('languageSelect')?.addEventListener('change',()=>setTimeout(updateAdminNotice,20));
      window.addEventListener('focus',()=>refreshRemote());
      document.addEventListener('visibilitychange',()=>{if(!document.hidden)refreshRemote();});
      setInterval(refreshRemote,30000);

      (async()=>{
        const hadLegacyAdmin=(()=>{try{return !!session?.admin;}catch{return false;}})();
        const valid=await tokenValid();
        if(!valid){adminToken='';sessionStorage.removeItem(TOKEN_KEY);}
        try{
          if(session?.admin&&!adminToken){session=null;localStorage.removeItem('11_session');updateSessionUI();}
        }catch{}

        if(adminToken){
          await reconcileAfterAdminAuth(false);
          return;
        }

        const hadRemote=await loadRemote({preserveLegacy:true});
        if(!hadRemote&&legacyPending&&hadLegacyAdmin){
          updateAdminNotice();
          if(typeof openModal==='function')setTimeout(()=>openModal('loginModal'),250);
          const msg=document.getElementById('loginMsg');
          if(msg)msg.textContent=isEnglish()?'Log in as admin once to move this device’s old plugin list to the cloud.':'Bu cihazdaki eski plugin listesini buluta aktarmak için admin hesabına bir kez giriş yap.';
        }
      })();
    }catch(err){console.error('[11_ Studios] cloud init failed',err);}
  }

  let tries=0;const timer=setInterval(()=>{tries++;patchAfterAppReady();if(ready||tries>200)clearInterval(timer);},100);
})();