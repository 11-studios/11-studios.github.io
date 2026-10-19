(()=>{
  'use strict';

  const KNOWN_PLUGIN_NAMES=new Set([
    '11_ChatHeads','11_AntiDupe','11_Join','11_DeathMessages','11_RenderOptimizer',
    '11_AntiPopup','11_AntiCheat','11_LoginScreen','11_WorldGuard'
  ]);

  let fixing=false;
  let pendingType=null;

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

        // These are real Minecraft plugins. Older site versions stored visual plugins
        // with category="visual", which v54 incorrectly interpreted as Launcher.
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

  normalizeLegacyPlugins();
  bindAdminForm();

  document.addEventListener('11:catalog-changed',()=>{
    if(!fixing)setTimeout(applyPendingType,0);
  });
  document.addEventListener('11:cloud-catalog-applied',()=>{
    if(normalizeLegacyPlugins())renderAgain();
  });
  document.addEventListener('11:cloud-synced',()=>{
    if(normalizeLegacyPlugins())renderAgain();
  });
  document.addEventListener('11:cloud-admin-ready',bindAdminForm);
})();
