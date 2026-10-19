(()=>{
  'use strict';

  const KNOWN_PLUGIN_NAMES=new Set([
    '11_ChatHeads','11_AntiDupe','11_Join','11_DeathMessages','11_RenderOptimizer',
    '11_AntiPopup','11_AntiCheat','11_LoginScreen','11_WorldGuard'
  ]);

  let fixing=false;
  let pendingType=null;
  let layoutRaf=0;
  let layoutTimer=0;

  const typeFromCategory=value=>{
    const category=String(value||'').toLowerCase();
    if(category==='visual')return 'launcher';
    if(category==='other')return 'other';
    return 'plugin';
  };

  function normalizeLegacyPlugins(){
    try{
      if(typeof plugins==='undefined'||!Array.isArray(plugins))return false;
      let changed=false;
      plugins=plugins.map(project=>{
        if(!project||typeof project!=='object')return project;
        const name=String(project.name||'');
        const explicit=String(project.projectType||project.project_type||'').toLowerCase();
        if(KNOWN_PLUGIN_NAMES.has(name)){
          if(project.category!=='utility'||explicit!=='plugin')changed=true;
          return {...project,category:'utility',projectType:'plugin',project_type:'plugin'};
        }
        return project;
      });
      if(changed){
        try{localStorage.setItem('11_plugins',JSON.stringify(plugins));}catch{}
      }
      return changed;
    }catch(err){
      console.error('[11_ Studios] project type migration failed',err);
      return false;
    }
  }

  function renderAgain(){
    try{if(typeof renderPlugins==='function')renderPlugins();}catch{}
    try{if(typeof renderAdminList==='function')renderAdminList();}catch{}
    scheduleLayoutSync();
  }

  function applyPendingType(){
    if(fixing||!pendingType)return;
    const pending=pendingType;
    pendingType=null;
    try{
      if(typeof plugins==='undefined'||!Array.isArray(plugins))return;
      let target=null;
      if(pending.editId)target=plugins.find(p=>String(p?.id||'')===pending.editId)||null;
      if(!target)target=plugins.find(p=>!pending.beforeIds.has(String(p?.id||'')))||null;
      if(!target&&pending.name)target=plugins.find(p=>String(p?.name||'')===pending.name)||null;
      if(!target)return;

      target.projectType=pending.type;
      target.project_type=pending.type;
      target.category=pending.type==='launcher'?'visual':pending.type==='other'?'other':'utility';

      fixing=true;
      try{
        if(typeof savePlugins==='function')savePlugins();
        else localStorage.setItem('11_plugins',JSON.stringify(plugins));
      }finally{fixing=false;}
      renderAgain();
    }catch(err){
      console.error('[11_ Studios] project type save failed',err);
      fixing=false;
    }
  }

  function bindAdminForm(){
    const form=document.getElementById('pluginForm');
    if(!form||form.dataset.projectTypeV55==='1')return;
    form.dataset.projectTypeV55='1';
    form.addEventListener('submit',()=>{
      try{
        const category=document.getElementById('pCategory')?.value||'utility';
        pendingType={
          type:typeFromCategory(category),
          editId:String(document.getElementById('editId')?.value||''),
          name:String(document.getElementById('pName')?.value||'').trim(),
          beforeIds:new Set((Array.isArray(plugins)?plugins:[]).map(p=>String(p?.id||'')))
        };
        setTimeout(applyPendingType,80);
      }catch{}
    },true);
  }

  function syncPageHeight(){
    layoutRaf=0;
    const footer=document.querySelector('.footer');
    if(!footer)return;

    const footerBottom=Math.max(0,Math.ceil((window.scrollY||0)+footer.getBoundingClientRect().bottom));
    const desiredHeight=Math.max(window.innerHeight||0,footerBottom);
    const layer=document.querySelector('.site-editor-global-layer');

    if(layer){
      layer.style.setProperty('height',`${desiredHeight}px`,'important');
      layer.style.setProperty('min-height','0','important');
      layer.style.setProperty('max-height','none','important');
    }

    requestAnimationFrame(()=>{
      const doc=document.documentElement;
      const body=document.body;
      const maxScroll=Math.max(0,Math.max(doc?.scrollHeight||0,body?.scrollHeight||0)-Math.max(1,window.innerHeight||1));
      if((window.scrollY||0)>maxScroll+2)window.scrollTo(0,maxScroll);
    });
  }

  function scheduleLayoutSync(){
    if(layoutRaf)cancelAnimationFrame(layoutRaf);
    layoutRaf=requestAnimationFrame(syncPageHeight);
    clearTimeout(layoutTimer);
    layoutTimer=setTimeout(syncPageHeight,90);
  }

  function bindLayoutSync(){
    const grid=document.getElementById('pluginGrid');
    const pluginsSection=document.getElementById('plugins');
    const main=document.querySelector('main#top');
    const footer=document.querySelector('.footer');

    if(grid && !grid.dataset.heightSyncV56){
      grid.dataset.heightSyncV56='1';
      new MutationObserver(scheduleLayoutSync).observe(grid,{childList:true,subtree:true,characterData:true});
    }

    if('ResizeObserver' in window){
      const ro=new ResizeObserver(scheduleLayoutSync);
      if(pluginsSection)ro.observe(pluginsSection);
      if(main)ro.observe(main);
      if(footer)ro.observe(footer);
    }

    document.addEventListener('click',e=>{
      if(e.target.closest('.catalog-page,.project-tab')){
        scheduleLayoutSync();
        setTimeout(syncPageHeight,40);
        setTimeout(syncPageHeight,180);
      }
    },true);

    window.addEventListener('resize',scheduleLayoutSync,{passive:true});
    window.addEventListener('load',scheduleLayoutSync,{once:true});
    scheduleLayoutSync();
  }

  normalizeLegacyPlugins();
  bindAdminForm();

  document.addEventListener('11:catalog-changed',()=>{
    if(!fixing)setTimeout(applyPendingType,0);
    scheduleLayoutSync();
  });
  document.addEventListener('11:cloud-catalog-applied',()=>{
    if(normalizeLegacyPlugins())renderAgain();
    scheduleLayoutSync();
  });
  document.addEventListener('11:cloud-synced',()=>{
    if(normalizeLegacyPlugins())renderAgain();
    scheduleLayoutSync();
  });
  document.addEventListener('11:cloud-admin-ready',bindAdminForm);

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bindLayoutSync,{once:true});
  else bindLayoutSync();
})();
