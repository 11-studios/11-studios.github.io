(()=>{
  const $=id=>document.getElementById(id);
  let ro=null;
  let childObserver=null;
  let repairTimer=0;

  function fitPreview(){
    const wrap=document.querySelector('.editor-frame-wrap');
    const frame=$('siteFrame');
    if(!wrap||!frame)return;

    const pad=14;
    const availableWidth=Math.max(320,wrap.clientWidth-pad*2);
    const availableHeight=Math.max(260,wrap.clientHeight-pad*2);

    // Editor kenar çubuğu yüzünden önizleme daralıp sitenin yüksekliğini değiştirmesin.
    // Iframe'i, editor kapalıyken sitenin sahip olacağı gerçek pencere boyutunda render edip
    // sadece görsel olarak küçültüyoruz. Böylece X/Y yüzdeleri canlı siteyle aynı yerde kalıyor.
    const logicalWidth=Math.max(900,window.innerWidth);
    const logicalHeight=Math.max(560,window.innerHeight);
    const scale=Math.min(1,availableWidth/logicalWidth,availableHeight/logicalHeight);

    frame.style.position='absolute';
    frame.style.left=`${pad}px`;
    frame.style.top=`${pad}px`;
    frame.style.width=`${Math.round(logicalWidth)}px`;
    frame.style.height=`${Math.round(logicalHeight)}px`;
    frame.style.transformOrigin='0 0';
    frame.style.transform=`scale(${scale})`;

    wrap.style.position='relative';
    wrap.style.overflow='hidden';
  }

  function repairPreviewLayer(){
    const frame=$('siteFrame');
    let doc,win;
    try{doc=frame?.contentDocument;win=frame?.contentWindow;}catch{return;}
    if(!doc||!win)return;

    let style=doc.getElementById('editorPreviewVisibilityV45');
    if(!style){
      style=doc.createElement('style');
      style.id='editorPreviewVisibilityV45';
      style.textContent=`
        html.site-editor-preview-mode .site-editor-global-layer{
          top:0!important;right:0!important;bottom:auto!important;left:0!important;
          width:100%!important;overflow:visible!important;z-index:2147483000!important;
          pointer-events:none!important;
        }
        html.site-editor-preview-mode .site-editor-element{
          display:block!important;visibility:visible!important;pointer-events:auto!important;
        }
        html.site-editor-preview-mode .site-editor-element.is-editor-focused{
          outline:3px solid #cba7ff!important;outline-offset:5px!important;
          filter:drop-shadow(0 0 12px rgba(203,167,255,.9));
        }
      `;
      (doc.head||doc.documentElement).appendChild(style);
    }

    const height=Math.max(
      win.innerHeight||0,
      doc.documentElement?.scrollHeight||0,
      doc.body?.scrollHeight||0,
      1
    );
    doc.querySelectorAll('.site-editor-global-layer').forEach(layer=>{
      layer.style.setProperty('height',`${height}px`,'important');
      layer.style.setProperty('bottom','auto','important');
      layer.style.setProperty('overflow','visible','important');
      layer.style.setProperty('z-index','2147483000','important');
    });
  }

  function watchChild(){
    const frame=$('siteFrame');
    let doc;
    try{doc=frame?.contentDocument;}catch{return;}
    if(!doc)return;

    if(childObserver)childObserver.disconnect();
    childObserver=new MutationObserver(()=>repairPreviewLayer());
    childObserver.observe(doc.documentElement||doc,{childList:true,subtree:true});

    repairPreviewLayer();
    let tries=0;
    clearInterval(repairTimer);
    repairTimer=setInterval(()=>{
      repairPreviewLayer();
      if(++tries>=24)clearInterval(repairTimer);
    },250);
  }

  function init(){
    const wrap=document.querySelector('.editor-frame-wrap');
    const frame=$('siteFrame');
    if(!wrap||!frame)return;

    fitPreview();
    if('ResizeObserver'in window){ro=new ResizeObserver(fitPreview);ro.observe(wrap);}
    window.addEventListener('resize',fitPreview,{passive:true});
    frame.addEventListener('load',()=>{
      fitPreview();
      setTimeout(watchChild,0);
      setTimeout(repairPreviewLayer,150);
      setTimeout(repairPreviewLayer,700);
    });
    if(frame.contentDocument?.readyState==='complete')watchChild();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();