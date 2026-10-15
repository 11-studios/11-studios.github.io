(()=>{
  let favicon=document.querySelector('link[rel~="icon"]');
  if(!favicon){
    favicon=document.createElement('link');
    favicon.rel='icon';
    document.head.appendChild(favicon);
  }
  favicon.type='image/png';
  favicon.href='assets/site-icon.png?v=20261015-1';

  const app=document.createElement('script');
  app.src='assets/app-original.js?v=20261015-1';
  app.async=false;
  document.head.appendChild(app);
})();
