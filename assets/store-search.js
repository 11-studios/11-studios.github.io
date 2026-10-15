(()=>{
  let input=null;
  let empty=null;

  const isEnglish=()=>document.getElementById('languageSelect')?.value==='en';
  const normalize=value=>String(value||'').toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();

  const cardName=card=>{
    const preferred=card.querySelector('.plugin-name,.plugin-top h3,.plugin-top h4,.plugin-top b,h3,h4');
    return preferred?.textContent||card.textContent||'';
  };

  const apply=()=>{
    const grid=document.getElementById('pluginGrid');
    if(!grid||!input)return;
    const q=normalize(input.value);
    let visible=0;
    const cards=[...grid.querySelectorAll('.plugin-card')];
    cards.forEach(card=>{
      const haystack=normalize(cardName(card));
      const match=!q||haystack.includes(q);
      card.style.setProperty('display',match?'grid':'none','important');
      card.dataset.searchMatch=match?'1':'0';
      if(match)visible++;
    });
    if(empty){
      empty.hidden=visible!==0||cards.length===0;
      empty.textContent=isEnglish()?'No plugins matched your search.':'Aramana uygun plugin bulunamadı.';
    }
    const badge=document.getElementById('pluginCountBadge');
    if(badge&&q)badge.textContent=`${visible} plugin`;
  };

  const updateLanguage=()=>{
    if(!input)return;
    input.placeholder=isEnglish()?'Search plugins...':'Plugin ara...';
    input.setAttribute('aria-label',isEnglish()?'Search plugins':'Plugin ara');
    apply();
  };

  const install=()=>{
    if(document.getElementById('pluginSearchInput')){
      input=document.getElementById('pluginSearchInput');
      empty=document.getElementById('pluginSearchEmpty');
      apply();return true;
    }
    const filters=document.getElementById('filters');
    const market=document.querySelector('#plugins .market-surface');
    if(!market)return false;

    const wrap=document.createElement('div');
    wrap.className='plugin-search-wrap';
    wrap.innerHTML=`
      <div class="plugin-search-box">
        <span class="plugin-search-icon" aria-hidden="true">⌕</span>
        <input id="pluginSearchInput" class="plugin-search-input" type="search" autocomplete="off" spellcheck="false">
        <button id="pluginSearchClear" class="plugin-search-clear" type="button" aria-label="Temizle">×</button>
      </div>
      <div id="pluginSearchEmpty" class="plugin-search-empty" hidden></div>`;
    (filters||market).insertAdjacentElement(filters?'afterend':'beforebegin',wrap);
    input=wrap.querySelector('#pluginSearchInput');
    empty=wrap.querySelector('#pluginSearchEmpty');
    const clear=wrap.querySelector('#pluginSearchClear');
    input.addEventListener('input',apply);
    input.addEventListener('search',apply);
    clear.addEventListener('click',()=>{input.value='';apply();input.focus();});
    updateLanguage();

    const grid=document.getElementById('pluginGrid');
    if(grid){
      const observer=new MutationObserver(()=>requestAnimationFrame(apply));
      observer.observe(grid,{childList:true,subtree:true,characterData:true});
    }
    return true;
  };

  document.getElementById('languageSelect')?.addEventListener('change',()=>setTimeout(updateLanguage,30));
  let tries=0;
  const timer=setInterval(()=>{tries++;if(install()||tries>100)clearInterval(timer);},100);
  if(document.readyState!=='loading')install();
})();
