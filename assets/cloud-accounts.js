(()=>{
  const ADMIN_USER='sems11_';
  const USER_TOKEN_KEY='11_cloud_user_token';
  const VISITOR_KEY='11_visitor_id';
  const VISIT_SESSION_KEY='11_visit_recorded';
  let userToken=localStorage.getItem(USER_TOKEN_KEY)||'';
  let appReady=false;
  let dashboardBusy=false;

  const en=()=>document.getElementById('languageSelect')?.value==='en';
  const tr=(trText,enText)=>en()?enText:trText;
  const cloud=()=>window.__11Cloud||null;
  const cfg=()=>{
    const c=cloud();
    if(!c?.url||!c?.anon)throw new Error('cloud-not-ready');
    return c;
  };
  const headers=()=>{const c=cfg();return {apikey:c.anon,Authorization:`Bearer ${c.anon}`,'Content-Type':'application/json'};};

  async function rpc(name,payload){
    const c=cfg();
    if(typeof c.api!=='function')throw new Error('cloud-api-not-ready');
    return c.api(name,payload||{});
  }

  const safeUsers=()=>{try{const x=JSON.parse(localStorage.getItem('11_users')||'[]');return Array.isArray(x)?x:[];}catch{return[];}};
  const legacyMatch=(username,password)=>{
    try{
      if(typeof sha256!=='function')return false;
      const h=sha256(password);
      return safeUsers().some(x=>String(x?.username||'').toLowerCase()===username.toLowerCase()&&x?.pass===h);
    }catch{return false;}
  };
  const removeLegacy=username=>{
    try{localStorage.setItem('11_users',JSON.stringify(safeUsers().filter(x=>String(x?.username||'').toLowerCase()!==username.toLowerCase())));}catch{}
  };

  function saveUserSession(username,token){
    userToken=String(token||'');
    if(userToken)localStorage.setItem(USER_TOKEN_KEY,userToken);else localStorage.removeItem(USER_TOKEN_KEY);
    try{
      session={username:String(username||''),admin:false,cloud:true};
      localStorage.setItem('11_session',JSON.stringify(session));
      if(typeof updateSessionUI==='function')updateSessionUI();
    }catch{}
  }
  function clearUserSession(){
    const old=userToken;
    userToken='';
    localStorage.removeItem(USER_TOKEN_KEY);
    return old;
  }

  async function cloudUserLogin(username,password){return await rpc('user_login',{p_username:username,p_password:password});}
  async function cloudUserRegister(username,password){return await rpc('user_register',{p_username:username,p_password:password});}

  document.addEventListener('submit',async e=>{
    const form=e.target;
    if(!(form instanceof HTMLFormElement))return;
    if(form.id==='loginForm'){
      const username=document.getElementById('loginUser')?.value.trim()||'';
      if(username.toLowerCase()===ADMIN_USER.toLowerCase())return;
      e.preventDefault();e.stopImmediatePropagation();
      const password=document.getElementById('loginPass')?.value||'';
      const msg=document.getElementById('loginMsg');
      const submit=form.querySelector('button[type="submit"]');
      if(submit)submit.disabled=true;
      try{
        let data=await cloudUserLogin(username,password);
        if(!data && legacyMatch(username,password)){
          try{data=await cloudUserRegister(username,password);removeLegacy(username);}catch{}
        }
        if(!data?.token){if(msg)msg.textContent=tr('Kullanıcı adı veya şifre hatalı.','Incorrect username or password.');return;}
        saveUserSession(data.username||username,data.token);
        if(msg)msg.textContent='';
        if(typeof closeModal==='function')closeModal('loginModal');
        if(typeof toast==='function')toast(tr('Giriş yapıldı.','Logged in.'));
      }catch(err){
        console.error('[11_ Studios] cloud user login failed',err);
        if(msg)msg.textContent=tr('Giriş servisine ulaşılamadı.','Login service unavailable.');
      }finally{if(submit)submit.disabled=false;}
      return;
    }

    if(form.id==='registerForm'){
      e.preventDefault();e.stopImmediatePropagation();
      const username=document.getElementById('regUser')?.value.trim()||'';
      const password=document.getElementById('regPass')?.value||'';
      const password2=document.getElementById('regPass2')?.value||'';
      const msg=document.getElementById('registerMsg');
      const submit=form.querySelector('button[type="submit"]');
      if(!/^[A-Za-z0-9_]{3,24}$/.test(username)){if(msg)msg.textContent=tr('Kullanıcı adı 3-24 karakter ve sadece harf, sayı, _ olmalı.','Username must be 3-24 characters and contain only letters, numbers, and _.');return;}
      if(username.toLowerCase()===ADMIN_USER.toLowerCase()){if(msg)msg.textContent=tr('Bu kullanıcı adı kullanılamaz.','This username cannot be used.');return;}
      if(password!==password2){if(msg)msg.textContent=tr('Şifreler aynı değil.','Passwords do not match.');return;}
      if(password.length<6){if(msg)msg.textContent=tr('Şifre en az 6 karakter olmalı.','Password must be at least 6 characters.');return;}
      if(submit)submit.disabled=true;
      try{
        const data=await cloudUserRegister(username,password);
        if(!data?.token)throw new Error('register-no-token');
        saveUserSession(data.username||username,data.token);
        if(msg)msg.textContent='';
        if(typeof closeModal==='function')closeModal('registerModal');
        if(typeof toast==='function')toast(tr('Hesap oluşturuldu.','Account created.'));
      }catch(err){
        const raw=String(err?.raw||'');
        if(msg)msg.textContent=/username_used|23505/i.test(raw)?tr('Bu kullanıcı adı zaten kullanılıyor.','This username is already in use.'):tr('Hesap oluşturulamadı.','Account could not be created.');
      }finally{if(submit)submit.disabled=false;}
    }
  },true);

  document.addEventListener('click',e=>{
    if(e.target?.closest?.('#logoutBtn')){
      const old=clearUserSession();
      if(old)rpc('user_logout',{p_token:old}).catch(()=>{});
    }
  },true);

  function visitorId(){
    let id='';try{id=localStorage.getItem(VISITOR_KEY)||'';}catch{}
    if(!id){
      try{id=crypto.randomUUID();}catch{id=`v_${Date.now()}_${Math.random().toString(36).slice(2)}_${Math.random().toString(36).slice(2)}`;}
      try{localStorage.setItem(VISITOR_KEY,id);}catch{}
    }
    return id;
  }
  async function recordVisit(){
    try{if(sessionStorage.getItem(VISIT_SESSION_KEY)==='1')return;sessionStorage.setItem(VISIT_SESSION_KEY,'1');}catch{}
    try{await rpc('record_visit',{p_visitor_id:visitorId()});}catch(err){console.warn('[11_ Studios] visit analytics unavailable',err);}
  }

  function installAdminUi(){
    const body=document.querySelector('#adminModal .dialog-body');
    if(!body||document.getElementById('cloudAdminPanel'))return;
    const notice=document.getElementById('adminNotice');
    if(notice)notice.textContent=tr('Yönetim verileri Supabase bulut veritabanında saklanır ve tüm cihazlarda ortaktır.','Management data is stored in the Supabase cloud database and shared across all devices.');

    const section=document.createElement('section');
    section.id='cloudAdminPanel';
    section.className='cloud-admin-panel';
    section.innerHTML=`
      <div class="cloud-admin-head"><h4>${tr('Site istatistikleri','Site analytics')}</h4><button type="button" class="btn small ghost" id="cloudStatsRefresh">${tr('Yenile','Refresh')}</button></div>
      <div class="cloud-stat-grid">
        <div class="cloud-stat"><b id="cloudUniqueVisitors">—</b><span>${tr('Toplam ziyaretçi','Unique visitors')}</span></div>
        <div class="cloud-stat"><b id="cloudTotalVisits">—</b><span>${tr('Toplam ziyaret','Total visits')}</span></div>
        <div class="cloud-stat"><b id="cloudVisitors24">—</b><span>${tr('Son 24 saat','Last 24 hours')}</span></div>
        <div class="cloud-stat"><b id="cloudAccountsTotal">—</b><span>${tr('Hesaplar','Accounts')}</span></div>
      </div>
      <div class="cloud-accounts-head"><h4>${tr('Hesaplar','Accounts')}</h4><span id="cloudAccountsState"></span></div>
      <div class="cloud-account-list" id="cloudAccountList"><div class="cloud-empty">${tr('Admin girişi yapınca hesaplar burada görünecek.','Accounts will appear here after admin login.')}</div></div>`;
    body.appendChild(section);

    if(!document.getElementById('cloudAdminStyle')){
      const style=document.createElement('style');style.id='cloudAdminStyle';style.textContent=`
      .cloud-admin-panel{margin-top:22px;padding-top:20px;border-top:1px solid rgba(203,167,255,.14)}
      .cloud-admin-head,.cloud-accounts-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px}.cloud-admin-head h4,.cloud-accounts-head h4{margin:0}
      .cloud-stat-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-bottom:20px}.cloud-stat{padding:14px;border:1px solid rgba(203,167,255,.14);border-radius:14px;background:rgba(10,7,15,.6)}.cloud-stat b{display:block;font-size:24px;line-height:1.1;margin-bottom:5px}.cloud-stat span{font-size:12px;color:#9f94aa}
      .cloud-account-list{display:flex;flex-direction:column;gap:8px;max-height:320px;overflow:auto;padding-right:2px}.cloud-account-row{display:grid;grid-template-columns:minmax(140px,1.2fr) minmax(130px,1fr) minmax(130px,1fr);gap:10px;align-items:center;padding:11px 12px;border:1px solid rgba(203,167,255,.12);border-radius:12px;background:rgba(8,6,12,.55)}.cloud-account-name{font-weight:700}.cloud-account-meta{font-size:12px;color:#9f94aa}.cloud-account-admin{color:#cba7ff}.cloud-empty{padding:14px;color:#9f94aa;border:1px dashed rgba(203,167,255,.16);border-radius:12px}.cloud-accounts-head span{font-size:12px;color:#9f94aa}
      @media(max-width:760px){.cloud-stat-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.cloud-account-row{grid-template-columns:1fr}.cloud-account-meta{font-size:11px}}
      `;document.head.appendChild(style);
    }

    document.getElementById('cloudStatsRefresh')?.addEventListener('click',refreshAdminDashboard);
    document.getElementById('adminBtn')?.addEventListener('click',()=>setTimeout(refreshAdminDashboard,80));
    document.addEventListener('11:cloud-admin-ready',()=>setTimeout(refreshAdminDashboard,80));
    document.getElementById('languageSelect')?.addEventListener('change',()=>setTimeout(()=>{document.getElementById('cloudAdminPanel')?.remove();installAdminUi();refreshAdminDashboard();},20));
  }

  const fmtDate=value=>{
    if(!value)return tr('Henüz yok','Not yet');
    try{return new Intl.DateTimeFormat(en()?'en-GB':'tr-TR',{dateStyle:'medium',timeStyle:'short'}).format(new Date(value));}catch{return String(value);}
  };

  function renderAccounts(data){
    const list=document.getElementById('cloudAccountList');
    if(!list)return;
    const rows=Array.isArray(data?.accounts)?data.accounts:[];
    const adminRow=`<div class="cloud-account-row"><div><div class="cloud-account-name cloud-account-admin">${ADMIN_USER}</div><div class="cloud-account-meta">Admin</div></div><div class="cloud-account-meta">${tr('Sistem yöneticisi','System administrator')}</div><div class="cloud-account-meta">—</div></div>`;
    const userRows=rows.map(u=>`<div class="cloud-account-row"><div><div class="cloud-account-name">${escapeHtmlSafe(u.username)}</div><div class="cloud-account-meta">${u.disabled?tr('Devre dışı','Disabled'):tr('Kullanıcı','User')}</div></div><div class="cloud-account-meta">${tr('Kayıt','Registered')}: ${fmtDate(u.created_at)}</div><div class="cloud-account-meta">${tr('Son giriş','Last login')}: ${fmtDate(u.last_login_at)}</div></div>`).join('');
    list.innerHTML=adminRow+(userRows||`<div class="cloud-empty">${tr('Henüz kayıtlı kullanıcı yok.','No registered users yet.')}</div>`);
  }
  const escapeHtmlSafe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));

  async function refreshAdminDashboard(){
    if(dashboardBusy)return;
    installAdminUi();
    const token=cloud()?.getToken?.()||'';
    const state=document.getElementById('cloudAccountsState');
    if(!token){if(state)state.textContent=tr('Admin girişi gerekli','Admin login required');return;}
    dashboardBusy=true;if(state)state.textContent=tr('Yükleniyor...','Loading...');
    try{
      const data=await rpc('admin_dashboard',{p_token:token});
      document.getElementById('cloudUniqueVisitors').textContent=Number(data?.unique_visitors||0).toLocaleString();
      document.getElementById('cloudTotalVisits').textContent=Number(data?.total_visits||0).toLocaleString();
      document.getElementById('cloudVisitors24').textContent=Number(data?.visitors_24h||0).toLocaleString();
      document.getElementById('cloudAccountsTotal').textContent=(Number(data?.accounts_total||0)+1).toLocaleString();
      renderAccounts(data);
      if(state)state.textContent=tr(`${Number(data?.accounts_total||0)+1} hesap`,`${Number(data?.accounts_total||0)+1} accounts`);
    }catch(err){
      console.error('[11_ Studios] admin dashboard failed',err);
      if(state)state.textContent=tr('Veriler alınamadı','Could not load data');
    }finally{dashboardBusy=false;}
  }

  async function validateExistingUser(){
    if(!userToken)return;
    try{
      const data=await rpc('user_session_get',{p_token:userToken});
      if(!data?.username)throw new Error('invalid-session');
      saveUserSession(data.username,userToken);
    }catch{
      clearUserSession();
      try{if(session&&!session.admin){session=null;localStorage.removeItem('11_session');if(typeof updateSessionUI==='function')updateSessionUI();}}catch{}
    }
  }

  function afterAppReady(){
    if(appReady)return;
    try{if(typeof updateSessionUI!=='function')return;}catch{return;}
    appReady=true;
    installAdminUi();
    validateExistingUser();
    recordVisit();
  }

  let tries=0;const timer=setInterval(()=>{tries++;afterAppReady();if(appReady||tries>200)clearInterval(timer);},100);
})();