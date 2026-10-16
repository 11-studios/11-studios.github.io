(()=>{
  const PAGE_SIZE=5;
  let page=1;
  let selectedId='';
  let search='';
  let installed=false;

  const en=()=>document.getElementById('languageSelect')?.value==='en';
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const money=v=>Number(v)>0?`${Number(v).toLocaleString(en()?'en-US':'tr-TR')} ₺`:(en()?'Free':'Ücretsiz');
  const category=v=>({utility:en()?'Tools':'Araçlar',security:en()?'Security':'Güvenlik',visual:en()?'Visual':'Görsel',other:en()?'Other':'Diğer'})[v]||(en()?'Other':'Diğer');
  const safeImage=p=>{
    const img=String(p?.image||'');
    if(/^data:image\/(?:png|jpe?g|webp|gif);base64,/i.test(img))return img;
    try{return typeof iconByName==='function'?iconByName(p?.icon):'assets/logo-v7.png';}catch{return 'assets/logo-v7.png';}
  };
  const filtered=()=>{
    let list=[];try{list=Array.isArray(plugins)?plugins.slice():[];}catch{}
    const f=typeof currentFilter==='string'?currentFilter:'all';
    if(f==='free')list=list.filter(p=>Number(p.price)<=0);
    else if(f==='paid')list=list.filter(p=>Number(p.price)>0);
    else if(f!=='all')list=list.filter(p=>p.category===f);
    const q=search.trim().toLocaleLowerCase('tr-TR');
    if(q)list=list.filter(p=>`${p.name||''} ${p.desc||''} ${p.version||''}`.toLocaleLowerCase('tr-TR').includes(q));
    return list;
  };
  function bumpView(id){
    try{
      const key='11_plugin_stats_v1';const all=JSON.parse(localStorage.getItem(key)||'{}')||{};
      const row=all[id]&&typeof all[id]==='object'?all[id]:{};
      row.views=(Number(row.views)||0)+1;row.downloads=Number(row.downloads)||0;row.purchases=Number(row.purchases)||0;
      all[id]=row;localStorage.setItem(key,JSON.stringify(all));
    }catch{}
  }
  function parseVideo(value){
    const raw=String(value||'').trim();if(!raw)return null;
    let u;try{u=new URL(raw,location.href);}catch{return null;}
    if(!/^https?:$/.test(u.protocol))return null;
    const host=u.hostname.toLowerCase().replace(/^www\./,'');let id='';
    if(host==='youtu.be')id=u.pathname.split('/').filter(Boolean)[0]||'';
    if(host==='youtube.com'||host.endsWith('.youtube.com')){
      if(u.pathname==='/watch')id=u.searchParams.get('v')||'';
      else{const m=u.pathname.match(/^\/(?:shorts|embed|live)\/([^/?#]+)/);if(m)id=m[1];}
    }
    if(id&&/^[A-Za-z0-9_-]{6,}$/.test(id))return{type:'iframe',src:`https://www.youtube-nocookie.com/embed/${id}`};
    if(host==='vimeo.com'||host.endsWith('.vimeo.com')){const m=u.pathname.match(/\/(\d{5,})/);if(m)return{type:'iframe',src:`https://player.vimeo.com/video/${m[1]}`};}
    if(/\.(mp4|webm|ogg)$/i.test(u.pathname))return{type:'video',src:u.href};
    return{type:'link',src:u.href};
  }
  function browserShell(){
    const market=document.querySelector('#plugins .market-surface');if(!market)return false;
    market.classList.add('plugin-browser-surface');
    market.innerHTML=`<div class="plugin-browser-layout">
      <section class="plugin-list-panel" aria-label="Pluginler">
        <div class="plugin-panel-title"><h3>${en()?'Plugins':'Pluginler'}</h3><span id="pluginCountBadge">0 plugin</span></div>
        <div class="plugin-grid plugin-list-grid" id="pluginGrid"></div>
        <nav class="plugin-pagination" id="pluginPagination" aria-label="${en()?'Plugin pages':'Plugin sayfaları'}"></nav>
      </section>
      <aside class="plugin-preview-panel" id="pluginPreview" aria-live="polite"></aside>
    </div>`;
    const kicker=document.getElementById('storeKicker');if(kicker)kicker.textContent='11_ Studios';
    const title=document.getElementById('storeTitle');if(title)title.textContent=en()?'Plugins':'Pluginler';
    const desc=document.getElementById('storeDesc');if(desc)desc.textContent=en()?'Plugins we publish for Minecraft servers.':'Minecraft sunucuları için yayınladığımız pluginler.';
    installSearch();
    return true;
  }
  function installSearch(){
    const filters=document.getElementById('filters');if(!filters)return;
    let wrap=document.querySelector('.plugin-search-wrap');
    if(!wrap){
      wrap=document.createElement('div');wrap.className='plugin-search-wrap';
      wrap.innerHTML=`<div class="plugin-search-box"><span class="plugin-search-icon" aria-hidden="true">⌕</span><input id="pluginSearchInput" class="plugin-search-input" type="search" autocomplete="off" spellcheck="false"><button id="pluginSearchClear" class="plugin-search-clear" type="button" aria-label="Temizle">×</button></div><div id="pluginSearchEmpty" class="plugin-search-empty" hidden></div>`;
      filters.insertAdjacentElement('afterend',wrap);
    }
    let input=document.getElementById('pluginSearchInput');if(!input)return;
    if(input.dataset.browserBound!=='1'){
      const clone=input.cloneNode(true);input.replaceWith(clone);input=clone;input.dataset.browserBound='1';
      input.placeholder=en()?'Search plugins...':'Plugin ara...';
      input.addEventListener('input',()=>{search=input.value;page=1;renderBrowser();});
      document.getElementById('pluginSearchClear')?.addEventListener('click',()=>{input.value='';search='';page=1;renderBrowser();input.focus();});
    }
  }
  function rowHtml(p){
    const paid=Number(p.price)>0;const active=p.id===selectedId?' is-active':'';
    const desc=String(p.desc||'').slice(0,180);
    return `<article class="plugin-card plugin-list-row${active}" data-plugin-id="${esc(p.id)}" tabindex="0">
      <div class="plugin-list-image"><img src="${esc(safeImage(p))}" alt="${esc(p.name)}" loading="lazy"></div>
      <div class="plugin-list-copy"><div class="plugin-list-name">${esc(p.name)}</div><div class="plugin-list-meta">v${esc(p.version||'1.0.0')} · ${esc(category(p.category))}</div><p>${esc(desc|| (en()?'No description.':'Açıklama yok.'))}</p></div>
      <div class="plugin-list-action"><strong class="${paid?'is-paid':'is-free'}">${esc(money(p.price))}</strong><button class="btn small ghost plugin-open-btn" type="button" data-plugin-open="${esc(p.id)}">${paid?(en()?'View':'İncele'):(en()?'Download':'İndir')}</button></div>
    </article>`;
  }
  function videoHtml(p){
    const v=parseVideo(p.video);if(!v)return'';
    if(v.type==='iframe')return`<div class="plugin-preview-video"><iframe src="${esc(v.src)}" title="${esc(p.name)} video" loading="lazy" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
    if(v.type==='video')return`<div class="plugin-preview-video"><video src="${esc(v.src)}" controls playsinline preload="metadata"></video></div>`;
    return`<a class="btn ghost plugin-video-button" href="${esc(v.src)}" target="_blank" rel="noopener noreferrer">${en()?'Open video':'Videoyu aç'}</a>`;
  }
  function preview(p){
    const el=document.getElementById('pluginPreview');if(!el)return;
    if(!p){el.innerHTML=`<div class="plugin-preview-empty">${en()?'No plugins found.':'Plugin bulunamadı.'}</div>`;return;}
    const paid=Number(p.price)>0;
    const fileInfo=!paid&&p.downloadFileName?`<span>${esc(p.downloadFileName)}</span>`:'';
    el.innerHTML=`<div class="plugin-preview-media"><img src="${esc(safeImage(p))}" alt="${esc(p.name)}"></div>
      <div class="plugin-preview-head"><div><span class="plugin-preview-kicker">${esc(category(p.category))}</span><h3>${esc(p.name)}</h3><div class="plugin-preview-meta">v${esc(p.version||'1.0.0')} · 11_ Studios</div></div><strong class="plugin-preview-price ${paid?'is-paid':'is-free'}">${esc(money(p.price))}</strong></div>
      <p class="plugin-preview-description">${esc(p.desc|| (en()?'No description added.':'Açıklama eklenmemiş.'))}</p>
      ${videoHtml(p)}
      <div class="plugin-preview-bottom"><div class="plugin-preview-file">${fileInfo}</div><button class="btn purple plugin-preview-action" id="pluginPreviewAction" type="button">${paid?(en()?'Purchase':'Satın al'):(en()?'Download':'İndir')}</button></div>`;
    document.getElementById('pluginPreviewAction')?.addEventListener('click',()=>{
      try{activeDetailId=p.id;}catch{}
      if(typeof runPluginAction==='function')runPluginAction();
    });
  }
  function pagination(totalPages){
    const nav=document.getElementById('pluginPagination');if(!nav)return;
    if(totalPages<=1){nav.innerHTML='';return;}
    const buttons=[];
    buttons.push(`<button type="button" data-page="${Math.max(1,page-1)}" ${page===1?'disabled':''} aria-label="Önceki">‹</button>`);
    for(let i=1;i<=totalPages;i++)buttons.push(`<button type="button" data-page="${i}" class="${i===page?'active':''}">${i}</button>`);
    buttons.push(`<button type="button" data-page="${Math.min(totalPages,page+1)}" ${page===totalPages?'disabled':''} aria-label="Sonraki">›</button>`);
    nav.innerHTML=buttons.join('');
    nav.querySelectorAll('[data-page]').forEach(b=>b.addEventListener('click',()=>{const next=Number(b.dataset.page)||1;if(next===page)return;page=next;selectedId='';renderBrowser();document.getElementById('pluginGrid')?.scrollIntoView({behavior:'smooth',block:'nearest'});}));
  }
  function bindRows(){
    document.querySelectorAll('.plugin-list-row').forEach(row=>{
      const choose=()=>selectPlugin(row.dataset.pluginId||'');
      row.addEventListener('click',e=>{if(e.target.closest('button'))return;choose();});
      row.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose();}});
    });
    document.querySelectorAll('[data-plugin-open]').forEach(b=>b.addEventListener('click',()=>selectPlugin(b.dataset.pluginOpen||'')));
  }
  function selectPlugin(id){
    if(!id)return;selectedId=id;bumpView(id);
    const p=(Array.isArray(plugins)?plugins:[]).find(x=>x.id===id);preview(p);
    document.querySelectorAll('.plugin-list-row').forEach(x=>x.classList.toggle('is-active',x.dataset.pluginId===id));
  }
  function renderBrowser(){
    if(!document.querySelector('.plugin-browser-layout'))browserShell();
    installSearch();
    const list=filtered();const pages=Math.max(1,Math.ceil(list.length/PAGE_SIZE));if(page>pages)page=pages;
    const start=(page-1)*PAGE_SIZE;const slice=list.slice(start,start+PAGE_SIZE);
    if(!selectedId||!slice.some(p=>p.id===selectedId))selectedId=slice[0]?.id||'';
    const grid=document.getElementById('pluginGrid');if(grid)grid.innerHTML=slice.map(rowHtml).join('');
    const badge=document.getElementById('pluginCountBadge');if(badge)badge.textContent=`${list.length} plugin`;
    const empty=document.getElementById('pluginSearchEmpty');if(empty){empty.hidden=list.length!==0;empty.textContent=en()?'No plugins matched your search.':'Aramana uygun plugin bulunamadı.';}
    pagination(pages);bindRows();preview(slice.find(p=>p.id===selectedId)||slice[0]||null);
  }
  function install(){
    if(installed)return true;
    try{if(typeof plugins==='undefined'||typeof renderPlugins!=='function')return false;
      if(!browserShell())return false;
      renderPlugins=renderBrowser;window.renderPlugins=renderBrowser;
      openPlugin=function(id){selectPlugin(id);};window.openPlugin=openPlugin;
      document.getElementById('languageSelect')?.addEventListener('change',()=>setTimeout(()=>{const input=document.getElementById('pluginSearchInput');if(input)input.placeholder=en()?'Search plugins...':'Plugin ara...';renderBrowser();},20));
      document.querySelectorAll('#filters .filter').forEach(btn=>btn.addEventListener('click',()=>{page=1;selectedId='';setTimeout(renderBrowser,0);},true));
      installed=true;renderBrowser();return true;
    }catch(err){console.error('[11_ Studios] plugin browser failed',err);return false;}
  }
  let tries=0;const timer=setInterval(()=>{tries++;if(install()||tries>160)clearInterval(timer);},100);
})();