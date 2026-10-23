(()=>{
  const ensureStyle=()=>{
    if(document.getElementById('footerOwnerCreditStyle'))return;
    const style=document.createElement('style');
    style.id='footerOwnerCreditStyle';
    style.textContent='.footer-owner-line{width:min(1180px,calc(100% - 34px));margin:16px auto 0;padding-top:14px;border-top:1px solid rgba(169,135,255,.10);display:flex;align-items:center;justify-content:center;gap:9px;flex-wrap:wrap;color:#8f849b;font-size:12px;line-height:1.5;text-align:center}.footer-owner-line .made-by-sems{margin:0;color:#b69cff;font-weight:700;white-space:nowrap}.footer-owner-sep{color:#5f536d}.footer-owner-note{color:#81768d}@media(max-width:700px){.footer-owner-line{gap:5px 8px;font-size:11px}.footer-owner-sep{display:none}.footer-owner-note{width:100%}}';
    document.head.appendChild(style);
  };

  const install=()=>{
    ensureStyle();
    const footer=document.querySelector('.footer');
    if(!footer)return false;
    const credit=footer.querySelector('.made-by-sems');
    if(!credit)return false;
    if(footer.querySelector('.footer-owner-note'))return true;

    const line=document.createElement('div');
    line.className='footer-owner-line';
    credit.parentNode.insertBefore(line,credit);
    line.appendChild(credit);

    const sep=document.createElement('span');
    sep.className='footer-owner-sep';
    sep.textContent='•';

    const note=document.createElement('span');
    note.className='footer-owner-note';
    note.textContent='Bu site ve bu sitede paylaşılan tüm projeler sems11_ tarafından yapılmıştır. İletişim - Discord: sems11_';

    line.append(sep,note);
    return true;
  };

  if(!install()){
    let tries=0;
    const timer=setInterval(()=>{
      tries++;
      if(install()||tries>120)clearInterval(timer);
    },100);
  }
})();
