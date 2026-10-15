(()=>{
  const css=document.createElement('link');
  css.rel='stylesheet';
  css.href='assets/site-enhancements.css?v=20261015-10';
  document.head.appendChild(css);

  const legacy=document.createElement('script');
  legacy.src='assets/app-media.js?v=20261015-10';
  legacy.async=false;
  legacy.addEventListener('load',()=>{
    const extra=document.createElement('script');
    extra.src='assets/site-enhancements.js?v=20261015-10';
    extra.async=false;
    document.head.appendChild(extra);
  });
  document.head.appendChild(legacy);
})();
