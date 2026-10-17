(()=>{
  const TYPES={
    utility:{tr:'Pluginler',en:'Plugins'},
    visual:{tr:'Launcher',en:'Launcher'},
    other:{tr:'Diğer projeler',en:'Other projects'}
  };
  let activeType='utility';
  let installed=false;

  const isEnglish=()=>document.getElementById('languageSelect')?.value==='en';
  const normalizeType=type=>type==='security'?'utility':(TYPES[type]?type:'other');
  const labelFor=type=>TYPES[normalizeType(type)]?.[isEnglish()?'en':'tr']||(isEnglish()?'Other projects':'Diğer projeler');
  const esc=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch]));
  const money=value=>Number(value)>0?`${Number(value).toLocaleString(isEnglish()?'en-US':'tr-TR')} ₺`:(isEnglish()?'Free':'Ücretsiz');
  const imageFor=p=>{
    const image=String(p?.image||'');
    if(/^data:image\/(?:png|jpe?g|webp|gif);base64,/i.test(image))return image;
    try{return typeof iconByName==='function'?iconByName(p?.icon):'assets/logo-v7.png';}catch{return 'assets/logo-v7.png';}
  };

  function patchTranslations(){
    try{
      I18N.tr.navPlugins='Projelerimiz';
      I18N.tr.heroBrowse='Projelere bak';
      I18N.tr.heroTitle='Bi kaç proje var istersen bak.';
      I18N.tr.heroDesc='Yaptığımız pluginleri, launcher\'ı ve diğer projeleri burada topluyoruz.';
      I18N.tr.storeKicker='11_ Studios';
      I18N.tr.storeTitle='Projelerimiz';
      I18N.tr.storeDesc='';
      I18N.tr.utility='Pluginler';
      I18N.tr.security='Pluginler';
      I18N.tr.visual='Launcher';
      I18N.tr.other='Diğer projeler';
      I18N.tr.newPlugin='Yeni proje ekle';
      I18N.tr.editPlugin='Proje düzenle';
      I18N.tr.pluginName='Proje adı';
      I18N.tr.category='Proje türü';
      I18N.tr.pluginIcon='Proje ikonu';
      I18N.tr.publishedPlugins='Yayındaki projeler';
      I18N.tr.pluginCount='proje';
      I18N.tr.deleteConfirm='Bu projeyi silmek istiyor musun?';
      I18N.tr.pluginDeleted='Proje silindi.';
      I18N.tr.pluginUpdated='Proje güncellendi.';
      I18N.tr.pluginAdded='Proje eklendi.';
      I18N.tr.detailBack='Projelere dön';
      I18N.tr.detailAbout='Proje hakkında';
      I18N.tr.detailInfo='Proje bilgileri';
      I18N.tr.detailActionFree='Aşağıdaki butondan proje dosyasını indirebilirsin.';
      I18N.tr.detailActionPaid='Aşağıdaki butondan projeyi satın alma bağlantısına gidebilirsin.';

      I18N.en.navPlugins='Projects';
      I18N.en.heroBrowse='View projects';
      I18N.en.heroTitle='A few projects here, take a look.';
      I18N.en.heroDesc='Our plugins, launcher and other projects are collected here.';
      I18N.en.storeKicker='11_ Studios';
      I18N.en.storeTitle='Our Projects';
      I18N.en.storeDesc='';
      I18N.en.utility='Plugins';
      I18N.en.security='Plugins';
      I18N.en.visual='Launcher';
      I18N.en.other='Other projects';
      I18N.en.newPlugin='Add new project';
      I18N.en.editPlugin='Edit project';
      I18N.en.pluginName='Project name';
      I18N.en.category='Project type';
      I18N.en.pluginIcon='Project icon';
      I18N.en.publishedPlugins='Published projects';
      I18N.en.pluginCount='projects';
      I18N.en.deleteConfirm='Do you want to delete this project?';
      I18N.en.pluginDeleted='Project deleted.';
      I18N.en.pluginUpdated='Project updated.';
      I18N.en.pluginAdded='Project added.';
      I18N.en.detailBack='Back to projects';
      I18N.en.detailAbout='About this project';
      I18N.en.detailInfo='Project information';
      I18N.en.detailActionFree='Use the button below to download the project file.';
      I18N.en.detailActionPaid='Use the button below to open the purchase link for this project.';
    }catch{}
  }

  function installTabs(){
    const filters=document.getElementById('filters');
    if(!filters)return;
    if(!TYPES[activeType])activeType='utility';
    filters.className='project-tabs';
    filters.innerHTML=Object.keys(TYPES).map(type=>`<button type="button" class="project-tab${type===activeType?' active':''}" data-project-type="${type}">${esc(labelFor(type))}</button>`).join('');
    filters.querySelectorAll('.project-tab').forEach(button=>button.addEventListener('click',()=>{
      activeType=button.dataset.projectType||'utility';
      filters.querySelectorAll('.project-tab').forEach(x=>x.classList.toggle('active',x===button));
      renderProjects();
    }));
  }

  function refreshTabLabels(){
    document.querySelectorAll('.project-tab').forEach(button=>{
      const type=button.dataset.projectType||'other';
      button.textContent=labelFor(type);
      button.classList.toggle('active',type===activeType);
    });
  }

  function projectRows(){
    let list=[];try{list=Array.isArray(plugins)?plugins.filter(p=>normalizeType(p?.category||'utility')===activeType):[];}catch{}
    return list;
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

  function renderAdminProjectList(){
    const el=document.getElementById('adminList');if(!el)return;
    let list=[];try{list=Array.isArray(plugins)?plugins:[];}catch{}
    el.innerHTML=list.map(p=>`<div class="admin-item project-admin-item" data-admin-project="${esc(p.id)}">
      <img src="${esc(imageFor(p))}" alt="">
      <div class="admin-item-main"><div class="admin-item-name">${esc(p.name)}</div><div class="admin-item-meta">${esc(labelFor(p.category))} · v${esc(p.version||'1.0.0')} · ${esc(money(p.price))}</div></div>
      <div class="admin-item-actions"><button class="btn small ghost" type="button" data-project-edit="${esc(p.id)}">${isEnglish()?'Edit':'Düzenle'}</button><button class="btn small danger" type="button" data-project-delete="${esc(p.id)}">${isEnglish()?'Delete':'Sil'}</button></div>
    </div>`).join('');
    el.querySelectorAll('[data-project-edit]').forEach(button=>button.addEventListener('click',()=>{try{editPlugin(button.dataset.projectEdit||'');}catch{}}));
    el.querySelectorAll('[data-project-delete]').forEach(button=>button.addEventListener('click',()=>{try{deletePlugin(button.dataset.projectDelete||'');}catch{}}));
  }

  function renderProjects(){
    const grid=document.getElementById('pluginGrid');if(!grid)return;
    const list=projectRows();
    grid.className='project-list';
    grid.innerHTML=list.length?list.map(rowHtml).join(''):`<div class="project-empty">${isEnglish()?'Nothing has been added here yet.':'Buraya henüz bir proje eklenmemiş.'}</div>`;
    grid.querySelectorAll('.project-row').forEach(row=>row.addEventListener('click',()=>{try{openPlugin(row.dataset.projectId||'');}catch{}}));
    const badge=document.getElementById('pluginCountBadge');if(badge)badge.textContent=`${list.length} ${isEnglish()?'project':'proje'}`;
    const title=document.querySelector('#plugins .market-title h3');if(title)title.textContent=labelFor(activeType);
    try{document.body.classList.toggle('admin-mode',!!session?.admin);}catch{}
    renderAdminProjectList();
    try{if(typeof updateStats==='function')updateStats();}catch{}
    patchStaticLabels();
  }

  function patchStaticLabels(){
    const english=isEnglish();
    const storeTitle=document.getElementById('storeTitle');if(storeTitle)storeTitle.textContent=english?'Our Projects':'Projelerimiz';
    const heroDesc=document.getElementById('heroDesc');if(heroDesc)heroDesc.textContent=english?'Our plugins, launcher and other projects are collected here.':'Yaptığımız pluginleri, launcher\'ı ve diğer projeleri burada topluyoruz.';
    const desc=document.getElementById('storeDesc');if(desc){desc.textContent='';desc.hidden=true;}
    const firstStat=document.querySelector('#adminModal .stats .stat:first-child span');if(firstStat)firstStat.textContent=english?'Projects':'Proje';
    const categoryLabel=document.getElementById('pCategoryLabel');if(categoryLabel)categoryLabel.textContent=english?'Project type':'Proje türü';
    const nameLabel=document.getElementById('pNameLabel');if(nameLabel)nameLabel.textContent=english?'Project name':'Proje adı';
    const iconLabel=document.getElementById('pIconLabel');if(iconLabel)iconLabel.textContent=english?'Project icon':'Proje ikonu';
    const imageLabel=document.getElementById('pImageLabel');if(imageLabel)imageLabel.textContent=english?'Project image':'Proje görseli';
    const fileLabel=document.getElementById('pDownloadFileLabel');if(fileLabel)fileLabel.textContent=english?'Project file':'Proje dosyası';
    const fileHelp=document.getElementById('pDownloadFileHelp');if(fileHelp)fileHelp.textContent=english?'For free projects, Download gets this file directly.':'Ücretsiz projelerde İndir butonu bu dosyayı doğrudan indirir.';
    const fileInput=document.getElementById('pDownloadFile');if(fileInput)fileInput.accept='.jar,.zip,.rar,.7z,.tar,.gz,.yml,.yaml,.json,.txt,.exe,.msi,.dmg,.appimage,.deb,.rpm,.apk,application/java-archive,application/zip,application/octet-stream';
    const published=document.getElementById('publishedPluginsTitle');if(published)published.textContent=english?'Published projects':'Yayındaki projeler';
    const descInput=document.getElementById('pDesc');if(descInput)descInput.placeholder=english?'What does the project do?':'Proje ne yapıyor?';
    const category=document.getElementById('pCategory');
    if(category){
      [...category.options].forEach(option=>{if(option.value==='security')option.remove();});
      [...category.options].forEach(option=>{option.textContent=labelFor(option.value);});
      if(category.value==='security'||!TYPES[category.value])category.value='utility';
    }
    document.querySelectorAll('.project-tab[data-project-type="security"]').forEach(x=>x.remove());
    const back=document.getElementById('detailBackText');if(back)back.textContent=english?'Back to projects':'Projelere dön';
    const about=document.getElementById('detailAboutTitle');if(about)about.textContent=english?'About this project':'Proje hakkında';
    const info=document.getElementById('detailInfoTitle');if(info)info.textContent=english?'Project information':'Proje bilgileri';
    const categoryDetail=document.getElementById('detailCategoryLabel');if(categoryDetail)categoryDetail.textContent=english?'Type':'Tür';
    const analytics=document.getElementById('analyticsTitle');if(analytics)analytics.textContent=english?'Project performance':'Proje performansı';
    const notice=document.getElementById('adminNotice');
    if(notice){
      let text=notice.textContent||'';
      text=text.replace(/Pluginler/g,'Projeler').replace(/Plugin değişiklikleri/g,'Proje değişiklikleri').replace(/plugin listesi/g,'proje listesi').replace(/plugin listesini/g,'proje listesini').replace(/Plugin changes/g,'Project changes').replace(/plugin list/g,'project list').replace(/Plugin list/g,'Project list');
      if(text!==notice.textContent)notice.textContent=text;
    }
    refreshTabLabels();
  }

  function installNoticeObserver(){
    const notice=document.getElementById('adminNotice');if(!notice||notice.dataset.projectObserved==='1')return;
    notice.dataset.projectObserved='1';
    new MutationObserver(()=>queueMicrotask(patchStaticLabels)).observe(notice,{childList:true,characterData:true,subtree:true});
  }

  function migrateRemovedPackCategory(){
    try{
      let changed=false;
      if(Array.isArray(plugins))plugins.forEach(p=>{if(p&&p.category==='security'){p.category='utility';changed=true;}});
      if(changed){
        try{if(typeof savePlugins==='function')savePlugins();else localStorage.setItem('11_plugins',JSON.stringify(plugins));}catch{}
        activeType='utility';
        installTabs();
        renderProjects();
      }
    }catch(err){console.debug('[11_ Studios] removed category migration skipped',err);}
  }

  function install(){
    if(installed)return true;
    try{
      if(typeof plugins==='undefined'||typeof renderPlugins!=='function'||typeof openPlugin!=='function')return false;
      installed=true;
      patchTranslations();
      migrateRemovedPackCategory();
      installTabs();
      installNoticeObserver();

      renderPlugins=renderProjects;window.renderPlugins=renderProjects;
      renderAdminList=renderAdminProjectList;window.renderAdminList=renderAdminProjectList;

      try{
        const baseDetail=renderPluginDetail;
        renderPluginDetail=function(id){
          baseDetail(id);
          let p=null;try{p=plugins.find(x=>x.id===id);}catch{}
          const type=document.getElementById('detailCategory');if(type&&p)type.textContent=labelFor(p.category);
          patchStaticLabels();
        };
        window.renderPluginDetail=renderPluginDetail;
      }catch{}

      try{
        const baseEdit=editPlugin;
        editPlugin=function(id){
          const p=plugins.find(x=>x.id===id);
          if(p?.category==='security')p.category='utility';
          const result=baseEdit(id);
          setTimeout(patchStaticLabels,0);
          return result;
        };
        window.editPlugin=editPlugin;
      }catch{}

      document.getElementById('languageSelect')?.addEventListener('change',()=>setTimeout(()=>{
        patchTranslations();installTabs();renderProjects();patchStaticLabels();
      },0));
      document.addEventListener('11:cloud-synced',()=>setTimeout(()=>{migrateRemovedPackCategory();renderProjects();},0));
      document.addEventListener('11:cloud-admin-ready',()=>setTimeout(patchStaticLabels,0));
      document.addEventListener('11:catalog-changed',()=>setTimeout(renderProjects,0));

      try{applyLanguage(document.getElementById('languageSelect')?.value||'tr');}catch{}
      renderProjects();patchStaticLabels();setTimeout(patchStaticLabels,250);setTimeout(patchStaticLabels,900);
      return true;
    }catch(err){console.error('[11_ Studios] projects catalog failed',err);return false;}
  }

  let tries=0;const timer=setInterval(()=>{tries++;if(install()||tries>160)clearInterval(timer);},50);
})();