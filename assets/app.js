(()=>{
  const css=document.createElement('link');
  css.rel='stylesheet';
  css.href='assets/site-enhancements.css?v=20261015-11';
  document.head.appendChild(css);

  const legacy=document.createElement('script');
  legacy.src='assets/app-media.js?v=20261015-11';
  legacy.async=false;
  legacy.addEventListener('load',()=>{
    const extra=document.createElement('script');
    extra.src='assets/site-enhancements.js?v=20261015-11';
    extra.async=false;
    document.head.appendChild(extra);
  });
  document.head.appendChild(legacy);
})();
