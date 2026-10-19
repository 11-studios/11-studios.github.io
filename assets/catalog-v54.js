(()=>{
  const PAGE_SIZE=5;
  const TYPES={
    plugin:{tr:'Pluginler',en:'Plugins'},
    launcher:{tr:'Launcher',en:'Launcher'},
    other:{tr:'Diğer projeler',en:'Other projects'}
  };
  let activeType='plugin';
  let installed=false;
  const pages={premium:1,free:1,launcher:1,other:1};

  const isEnglish=()=>document.getElementById('languageSelect')?.value==='en';
  const esc=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch]));
  const money=value=>Number(value)>0?`${Number(value).toLocaleString(isEnglish()?'en-US':'tr-TR')} ₺`:(isEnglish()?'Free':'Ücretsiz');
  const kindOf=p=>{
    const explicit=String(p?.projectType||p?.project_type||'').toLowerCase();
    if(explicit==='launcher')return 'launcher';
    if(explicit==='other')return 'other';
    if(explicit==='plugin')return 'plugin';
    const category=String(p?.category||'utility').toLowerCase();
    if(category==='visual')return 'launcher';
    if(category==='other')return 'other';
    return 'plugin';
  };
  const typeLabel=type=>TYPES[type]?.[isEnglish()?'en':'tr']||(isEnglish()?'Projects':'Projeler');
  const imageFor=p=>{
    const image=String(p?.image||'');
    if(/^data:image\/(?:png|jpe?g|webp|gif);base64,/i.test(image))return image;
    try{return typeof iconByName==='function'?iconByName(p?.icon):'assets/logo-v7.png';}catch{return 'assets/logo-v7.png';}
  };
  const allProjects=()=>{try{return Array.isArray(plugins)?plugins:[];}catch{return[];}};

  function patchTranslations(){
    try{
      I18N.tr.navPlugins='Projelerimiz';
      I18N.tr.heroBrowse='Projelere bak';
      I18N.tr.heroTitle='Bi kaç proje var istersen bak.';
      I18N.tr.heroDesc='Yaptığımız pluginleri, launcher\'ı ve diğer projeleri burada topluyoruz.';
      I18N.tr.storeKicker='11_ Studios';
      I18N.tr.storeTitle='Projelerimiz';
      I18N.tr.storeDesc='';
      I18N.tr.newPlugin='Yeni proje ekle';
      I18N.tr.editPlugin='Proje düzenle';
      I18N.tr.pluginName='Proje adı';
      I18N.tr.category='Proje türü';
      I18N.tr.pluginIcon='Proje ikonu';
      I18N.tr.publishedPlugins='Yayındaki projeler';
      I18N.tr.pluginCount='proje';
      I18N.tr.detailBack='Projelere dön';
      I18N.tr.detailAbout='Proje hakkında';
      I18N.tr.detailInfo='Proje bilgileri';
      I18N.en.navPlugins='Projects';
      I18N.en.heroBrowse='View projects';
      I18N.en.heroTitle='A few projects here, take a look.';
      I18N.en.heroDesc='Our plugins, launcher and other projects are collected here.';
      I18N.en.storeKicker='11_ Studios';
      I18N.en.storeTitle='Our Projects';
      I18N.en.storeDesc='';
      I18N.en.newPlugin='Add new project';
      I18N.en.editPlugin='Edit project';
      I18N.en.pluginName='Project name';
      I18N.en.category='Project type';
      I18N.en.pluginIcon='Project icon';
      I18N.en.publishedPlugins='Published projects';
      I18N.en.pluginCount='projects';
      I18N.en.detailBack='Back to projects';
      I18N.en.detailAbout='About this project';
      I18N.en.detailInfo='Project information';
    }catch{}
  }

  function rowHtml(p){
    const description=String(p?.desc||'').trim()||(isEnglish()?'No description added.':'Açıklama eklenmemiş.');
    return `<button type="button" class="project-row" data-project-id="${esc(p.id)}">
      <span class="project-thumb"><img src="${esc(imageFor(p))}" alt="" loading="lazy"></span>
      <span class="project-copy">
        <span class="project-name">${esc(p.name||'Proje')}</span>
        <span class="project-meta">v${esc(p.version||'1.0.0')} · 11_ Studios</span>
        <span class="project-description">${esc(description)}</span>
      </span>
      <span class="project-side"><strong>${esc(money(p.price))}</strong><span aria-hidden="true">›</span></span>
    </button>`;
  }

  function paginationHtml(key,total){
    const pageCount=Math.max(1,Math.ceil(total/PAGE_SIZE));
    pages[key]=Math.min(Math.max(1,pages[key]||1),pageCount);
    if(pageCount<=1)return '';
    const current=pages[key];
    const nums=[];
    if(pageCount<=7){for(let i=1;i<=pageCount;i++)nums.push(i);}else{
      nums.push(1);
      const start=Math.max(2,current-1),end=Math.min(pageCount-1,current+1);
      if(start>2)nums.push('…');
      for(let i=start;i<=end;i++)nums.push(i);
      if(end<pageCount-1)nums.push('…');
      nums.push(pageCount);
    }
    return `<div class="catalog-pagination" data-page-key="${key}">
      <button type="button" class="catalog-page nav" data-page="${Math.max(1,current-1)}" ${current===1?'disabled':''}>‹</button>
      ${nums.map(n=>n==='…'?'<span class="catalog-page-dots">…</span>':`<button type="button" class="catalog-page${n===current?' active':''}" data-page="${n}">${n}</button>`).join('')}
      <button type="button" class="catalog-page nav" data-page="${Math.min(pageCount,current+1)}" ${current===pageCount?'disabled':''}>›</button>
    </div>`;
  }

  function groupHtml(title,list,key,emptyText,premium=false){
    const pageCount=Math.max(1,Math.ceil(list.length/PAGE_SIZE));
    pages[key]=Math.min(Math.max(1,pages[key]||1),pageCount);
    const start=(pages[key]-1)*PAGE_SIZE;
    const rows=list.slice(start,start+PAGE_SIZE);
    return `<section class="catalog-group${premium?' premium-group':''}">
      <div class="catalog-group-head"><h3>${esc(title)}</h3><span>${list.length} ${isEnglish()?'item':'öğe'}</span></div>
      <div class="project-list">${rows.length?rows.map(rowHtml).join(''):`<div class="project-empty">${esc(emptyText)}</div>`}</div>
      ${paginationHtml(key,list.length)}
    </section>`;
  }

  function installTabs(){
    const filters=document.getElementById('filters');if(!filters)return;
    filters.className='project-tabs';
    filters.innerHTML=Object.keys(TYPES).map(type=>`<button type="button" class="project-tab${type===activeType?' active':''}" data-project-type="${type}">${esc(typeLabel(type))}</button>`).join('');
    filters.querySelectorAll('.project-tab').forEach(button=>button.addEventListener('click',()=>{
      activeType=button.dataset.projectType||'plugin';
      filters.querySelectorAll('.project-tab').forEach(x=>x.classList.toggle('active',x===button));
      renderCatalog();
    }));
  }

  function bindCatalogControls(root){
    root.querySelectorAll('.project-row').forEach(row=>row.addEventListener('click',()=>{try{openPlugin(row.dataset.projectId||'');}catch{}}));
    root.querySelectorAll('.catalog-pagination').forEach(pager=>{
      const key=pager.dataset.pageKey||'';
      pager.querySelectorAll('button[data-page]').forEach(button=>button.addEventListener('click',()=>{
        const page=Math.max(1,Number(button.dataset.page)||1);
        pages[key]=page;
        renderCatalog();
      }));
    });
  }

  function renderAdminProjectList(){
    const el=document.getElementById('adminList');if(!el)return;
    const list=allProjects();
    el.innerHTML=list.map(p=>`<div class="admin-item project-admin-item" data-admin-project="${esc(p.id)}">
      <img src="${esc(imageFor(p))}" alt="">
      <div class="admin-item-main"><div class="admin-item-name">${esc(p.name)}</div><div class="admin-item-meta">${esc(typeLabel(kindOf(p)))} · v${esc(p.version||'1.0.0')} · ${esc(money(p.price))}</div></div>
      <div class="admin-item-actions"><button class="btn small ghost" type="button" data-project-edit="${esc(p.id)}">${isEnglish()?'Edit':'Düzenle'}</button><button class="btn small danger" type="button" data-project-delete="${esc(p.id)}">${isEnglish()?'Delete':'Sil'}</button></div>
    </div>`).join('');
    el.querySelectorAll('[data-project-edit]').forEach(button=>button.addEventListener('click',()=>{try{editPlugin(button.dataset.projectEdit||'');}catch{}}));
    el.querySelectorAll('[data-project-delete]').forEach(button=>button.addEventListener('click',()=>{try{deletePlugin(button.dataset.projectDelete||'');}catch{}}));
  }

  function renderCatalog(){
    const grid=document.getElementById('pluginGrid');if(!grid)return;
    const all=allProjects();
    let html='';
    let visibleCount=0;
    if(activeType==='plugin'){
      const pluginRows=all.filter(p=>kindOf(p)==='plugin');
      const premium=pluginRows.filter(p=>Number(p.price)>0);
      const free=pluginRows.filter(p=>Number(p.price)<=0);
      visibleCount=pluginRows.length;
      html=groupHtml(isEnglish()?'Premium Plugins':'Premium Pluginler',premium,'premium',isEnglish()?'No premium plugins have been added yet.':'Henüz premium plugin eklenmedi.',true)
        +groupHtml(isEnglish()?'Plugins':'Pluginler',free,'free',isEnglish()?'No free plugins have been added yet.':'Henüz ücretsiz plugin eklenmedi.');
    }else if(activeType==='launcher'){
      const launchers=all.filter(p=>kindOf(p)==='launcher');
      visibleCount=launchers.length;
      html=groupHtml('Launcher',launchers,'launcher',isEnglish()?'Nothing has been added to Launcher yet.':'Launcher kısmına henüz bir şey eklenmedi.');
    }else{
      const other=all.filter(p=>kindOf(p)==='other');
      visibleCount=other.length;
      html=groupHtml(isEnglish()?'Other projects':'Diğer projeler',other,'other',isEnglish()?'Nothing has been added here yet.':'Buraya henüz bir proje eklenmedi.');
    }
    grid.className='catalog-v54';
    grid.innerHTML=html;
    bindCatalogControls(grid);
    const badge=document.getElementById('pluginCountBadge');if(badge)badge.textContent=`${visibleCount} ${isEnglish()?'project':'proje'}`;
    const title=document.querySelector('#plugins .market-title h3');if(title)title.textContent=typeLabel(activeType);
    renderAdminProjectList();
    try{if(typeof updateStats==='function')updateStats();}catch{}
    patchStaticLabels();
  }

  function patchStaticLabels(){
    const en=isEnglish();
    const nav=document.getElementById('navPlugins');if(nav)nav.textContent=en?'Projects':'Projelerimiz';
    const browse=document.getElementById('heroBrowseText');if(browse)browse.textContent=en?'View projects':'Projelere bak';
    const heroTitle=document.getElementById('heroTitle');if(heroTitle)heroTitle.textContent=en?'A few projects here, take a look.':'Bi kaç proje var istersen bak.';
    const heroDesc=document.getElementById('heroDesc');if(heroDesc)heroDesc.textContent=en?'Our plugins, launcher and other projects are collected here.':'Yaptığımız pluginleri, launcher\'ı ve diğer projeleri burada topluyoruz.';
    const storeTitle=document.getElementById('storeTitle');if(storeTitle)storeTitle.textContent=en?'Our Projects':'Projelerimiz';
    const desc=document.getElementById('storeDesc');if(desc){desc.textContent='';desc.hidden=true;}
    const firstStat=document.querySelector('#adminModal .stats .stat:first-child span');if(firstStat)firstStat.textContent=en?'Projects':'Proje';
    const category=document.getElementById('pCategory');
    if(category){
      const current=category.value;
      category.innerHTML=`<option value="utility">${en?'Plugins':'Pluginler'}</option><option value="visual">Launcher</option><option value="other">${en?'Other projects':'Diğer projeler'}</option>`;
      category.value=['utility','visual','other'].includes(current)?current:'utility';
    }
    const categoryLabel=document.getElementById('pCategoryLabel');if(categoryLabel)categoryLabel.textContent=en?'Project type':'Proje türü';
    const nameLabel=document.getElementById('pNameLabel');if(nameLabel)nameLabel.textContent=en?'Project name':'Proje adı';
    const published=document.getElementById('publishedPluginsTitle');if(published)published.textContent=en?'Published projects':'Yayındaki projeler';
    const back=document.getElementById('detailBackText');if(back)back.textContent=en?'Back to projects':'Projelere dön';
    const about=document.getElementById('detailAboutTitle');if(about)about.textContent=en?'About this project':'Proje hakkında';
    const info=document.getElementById('detailInfoTitle');if(info)info.textContent=en?'Project information':'Proje bilgileri';
    const categoryDetail=document.getElementById('detailCategoryLabel');if(categoryDetail)categoryDetail.textContent=en?'Type':'Tür';
    document.querySelectorAll('.project-tab').forEach(button=>{const type=button.dataset.projectType||'plugin';button.textContent=typeLabel(type);button.classList.toggle('active',type===activeType);});
  }

  function install(){
    if(installed)return true;
    try{
      if(typeof plugins==='undefined'||typeof renderPlugins!=='function'||typeof openPlugin!=='function')return false;
      installed=true;
      patchTranslations();
      installTabs();
      renderPlugins=renderCatalog;window.renderPlugins=renderCatalog;
      renderAdminList=renderAdminProjectList;window.renderAdminList=renderAdminProjectList;

      try{
        const baseDetail=renderPluginDetail;
        renderPluginDetail=function(id){
          baseDetail(id);
          let p=null;try{p=allProjects().find(x=>x.id===id);}catch{}
          const type=document.getElementById('detailCategory');if(type&&p)type.textContent=typeLabel(kindOf(p));
          patchStaticLabels();
        };
        window.renderPluginDetail=renderPluginDetail;
      }catch{}

      try{
        const baseEdit=editPlugin;
        editPlugin=function(id){
          const result=baseEdit(id);
          setTimeout(()=>{
            const p=allProjects().find(x=>x.id===id);
            const category=document.getElementById('pCategory');
            if(category&&p){const kind=kindOf(p);category.value=kind==='launcher'?'visual':kind==='other'?'other':'utility';}
            patchStaticLabels();
          },0);
          return result;
        };
        window.editPlugin=editPlugin;
      }catch{}

      document.getElementById('languageSelect')?.addEventListener('change',()=>setTimeout(()=>{patchTranslations();installTabs();renderCatalog();},20));
      document.addEventListener('11:cloud-catalog-applied',()=>setTimeout(renderCatalog,20));
      document.addEventListener('11:cloud-synced',()=>setTimeout(renderCatalog,20));
      document.addEventListener('11:catalog-changed',()=>setTimeout(renderCatalog,20));
      window.addEventListener('focus',()=>setTimeout(renderCatalog,40));

      try{applyLanguage(document.getElementById('languageSelect')?.value||'tr');}catch{}
      installTabs();renderCatalog();patchStaticLabels();
      return true;
    }catch(err){console.error('[11_ Studios] catalog v54 failed',err);return false;}
  }

  let tries=0;const timer=setInterval(()=>{tries++;if(install()||tries>200)clearInterval(timer);},50);
})();
