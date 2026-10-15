(()=>{
  const STATS_KEY='11_plugin_stats_v1';
  let installed=false;

  function isEnglish(){return document.getElementById('languageSelect')?.value==='en';}

  function fixHeroTitle(){
    const title=document.getElementById('heroTitle');
    if(!title)return;
    if(isEnglish()) title.textContent='A few plugins here, use them if you want.';
  }

  function installAtaturkQuote(){
    const wrap=document.querySelector('.orbit-wrap');
    if(!wrap||wrap.querySelector('.ataturk-quote'))return;
    const q=document.createElement('div');
    q.className='ataturk-quote';
    q.setAttribute('aria-hidden','true');
    q.innerHTML='<span>Ne Mutlu</span><span>Türküm</span><span>Diyene!</span>';
    wrap.appendChild(q);
  }

  function readStats(){
    try{
      const value=JSON.parse(localStorage.getItem(STATS_KEY)||'{}');
      return value&&typeof value==='object'?value:{};
    }catch{return {};}
  }

  function writeStats(value){
    try{localStorage.setItem(STATS_KEY,JSON.stringify(value));}catch{}
  }

  function bumpStat(id,key){
    if(!id)return;
    const all=readStats();
    const row=all[id]&&typeof all[id]==='object'?all[id]:{};
    row.views=Number(row.views)||0;
    row.downloads=Number(row.downloads)||0;
    row.purchases=Number(row.purchases)||0;
    row[key]=(Number(row[key])||0)+1;
    all[id]=row;
    writeStats(all);
    renderAnalytics();
  }

  function topPlugin(key){
    let list=[];
    try{
      const all=readStats();
      list=(typeof plugins!=='undefined'?plugins:[]).map(p=>({
        p,
        count:Number(all[p.id]?.[key])||0
      })).sort((a,b)=>b.count-a.count||String(a.p.name).localeCompare(String(b.p.name)));
    }catch{}
    return list[0]||null;
  }

  function installAnalyticsPanel(){
    const stats=document.querySelector('#adminModal .stats');
    if(!stats||document.getElementById('adminAnalytics'))return;
    const panel=document.createElement('section');
    panel.id='adminAnalytics';
    panel.className='admin-analytics';
    panel.innerHTML=`
      <div class="admin-analytics-head">
        <div>
          <div class="analytics-kicker" id="analyticsKicker">İstatistikler</div>
          <h4 id="analyticsTitle">Plugin performansı</h4>
        </div>
        <span class="analytics-note" id="analyticsNote">Bu tarayıcıdaki veriler</span>
      </div>
      <div class="admin-analytics-grid">
        <div class="analytics-card">
          <span class="analytics-icon">◉</span>
          <div><small id="topViewedLabel">En çok göz atılan</small><b id="topViewedName">Henüz veri yok</b><em id="topViewedCount">0 görüntülenme</em></div>
        </div>
        <div class="analytics-card">
          <span class="analytics-icon">⇩</span>
          <div><small id="topDownloadedLabel">En çok indirilen</small><b id="topDownloadedName">Henüz veri yok</b><em id="topDownloadedCount">0 indirme</em></div>
        </div>
        <div class="analytics-card">
          <span class="analytics-icon">₺</span>
          <div><small id="topPurchasedLabel">En çok satın alınan</small><b id="topPurchasedName">Henüz veri yok</b><em id="topPurchasedCount">0 satın alma</em></div>
        </div>
      </div>`;
    stats.insertAdjacentElement('afterend',panel);
    renderAnalytics();
  }

  function renderAnalytics(){
    const panel=document.getElementById('adminAnalytics');
    if(!panel)return;
    const en=isEnglish();
    const viewed=topPlugin('views');
    const downloaded=topPlugin('downloads');
    const purchased=topPlugin('purchases');

    const set=(id,text)=>{const el=document.getElementById(id);if(el)el.textContent=text;};
    set('analyticsKicker',en?'Analytics':'İstatistikler');
    set('analyticsTitle',en?'Plugin performance':'Plugin performansı');
    set('analyticsNote',en?'Data from this browser':'Bu tarayıcıdaki veriler');
    set('topViewedLabel',en?'Most viewed':'En çok göz atılan');
    set('topDownloadedLabel',en?'Most downloaded':'En çok indirilen');
    set('topPurchasedLabel',en?'Most purchased':'En çok satın alınan');

    const none=en?'No data yet':'Henüz veri yok';
    set('topViewedName',viewed&&viewed.count?viewed.p.name:none);
    set('topViewedCount',`${viewed?.count||0} ${en?'views':'görüntülenme'}`);
    set('topDownloadedName',downloaded&&downloaded.count?downloaded.p.name:none);
    set('topDownloadedCount',`${downloaded?.count||0} ${en?'downloads':'indirme'}`);
    set('topPurchasedName',purchased&&purchased.count?purchased.p.name:none);
    set('topPurchasedCount',`${purchased?.count||0} ${en?'purchases':'satın alma'}`);
  }

  function installStoreLabel(){
    const title=document.querySelector('.market-title h3');
    if(title) title.textContent='11_ Market';
  }

  function patchBase(){
    if(installed)return true;
    try{
      if(typeof openPlugin!=='function'||typeof runPluginAction!=='function'||typeof plugins==='undefined')return false;

      const baseOpenPlugin=openPlugin;
      openPlugin=function(id){
        bumpStat(id,'views');
        return baseOpenPlugin(id);
      };
      window.openPlugin=openPlugin;

      const baseRunPluginAction=runPluginAction;
      runPluginAction=function(){
        try{
          const p=plugins.find(x=>x.id===activeDetailId);
          if(p&&p.url&&typeof safeExternalUrl==='function'&&safeExternalUrl(p.url)){
            bumpStat(p.id,Number(p.price)>0?'purchases':'downloads');
          }
        }catch{}
        return baseRunPluginAction();
      };
      window.runPluginAction=runPluginAction;
      const actionBtn=document.getElementById('detailActionBtn');
      if(actionBtn) actionBtn.onclick=runPluginAction;

      const baseRenderPlugins=renderPlugins;
      renderPlugins=function(){
        const result=baseRenderPlugins();
        installStoreLabel();
        renderAnalytics();
        return result;
      };
      window.renderPlugins=renderPlugins;

      installed=true;
      return true;
    }catch(err){console.error('[11_ Studios] enhancement patch failed',err);return false;}
  }

  function init(){
    installAtaturkQuote();
    installAnalyticsPanel();
    installStoreLabel();
    fixHeroTitle();

    document.getElementById('languageSelect')?.addEventListener('change',()=>{
      setTimeout(()=>{
        fixHeroTitle();
        renderAnalytics();
      },20);
    });

    document.getElementById('adminBtn')?.addEventListener('click',()=>setTimeout(renderAnalytics,30));

    let tries=0;
    const timer=setInterval(()=>{
      tries++;
      installAtaturkQuote();
      installAnalyticsPanel();
      fixHeroTitle();
      if(patchBase()||tries>120){clearInterval(timer);renderAnalytics();}
    },100);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
