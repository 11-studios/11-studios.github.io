
const ICONS=[{"name":"general_icon_11","src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAcElEQVR4XmNgGHDgHxb6nxIMNuDo5ev/3/z/RxIG6YEbgC5JLKa+ATB/kcJnMLO3g4cBiA3CMAX4+PAwQDaAFAzSA9JLHQMWb94BFkA3CCaGDYP0wA1Axug2EMIoqRJmANx5pAKQJrI1gwBWZ9EaAAC+qAZYCwzmfgAAAABJRU5ErkJggg=="},{"name":"general_icon_17","src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAjUlEQVR4XmNgGAVg0Gxv8J8cjGLAn1tHScIoBqSbaIIFQBLv9i/Ei2GaQXpQDABJro7Tw2sISA6kBsTGMACmEaTg9qwiDM0gMZhmkFqsBoAUXexJAisE0SA+NjGsBiDbAtOAjGFiMNdhNQAUODBbcWGQGgwDXOTFwQLIgYUNw+RBakF6UAwgB8MNGFAAAAxacSS51UBSAAAAAElFTkSuQmCC"},{"name":"general_icon_20","src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAArUlEQVR4XmNgoBUwt7L9j4zR5fECkAZldV24JhCbKEPQbcWF0fWBAUhi+/7jYDx/6VqsGCaP1RCQMyPSav53TpiBF4PUIHsPxQCYX/FhmDp0/WCgpWf03y0wCW4LiEZmg+RAatD1wQFIEuRXkFPxsdH1wYG5rQs4kEAK8bHR9cEBukJcbHR9cAByHi5NMDZeLyD7FaQJGxuvAeJSMgRjAaQGXR8cgCSJwej6KAIABHcZ3m+I1uoAAAAASUVORK5CYII="},{"name":"general_icon_23","src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAm0lEQVR4XrWQMQqAMBAEfYmthQ+wtxGsbWws7Xyfj7D1A3aCj4hs4CTZOxJEXNgim72Bu6L4Q2VVO8vce8RFmMX/EZAH+G1lScBxXqZDKQCX4abtvDmHswAMyq4WRAH6cXLDvLh1273DY8GSo4OuAnAxhFiZAryVAvCOOScB2JMHOFMAHEYOyUAZkAMmjyhGOTT/RwAWF7MDX3QDSj7jzHCZUGMAAAAASUVORK5CYII="},{"name":"general_icon_24","src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAo0lEQVR4XmNgoBRoB0/9j4zR5QkCkCbrxG3/bef9J88AcRXv/yAMAuiuIQaDDVFWVv5/58MPsCvg+DwWDJXzKLoIxiCL4QaA8OxVG4imYS6HewUkceDcTbACYmm4ZpgBIG+QQmMYADMZBPDROF0A8htIEh8AycPCAsMAYjBMM1YDCLkAp+0wA2CGINuCSxxdPxiAJEAhjB7KuMQxALqthMSpAgCqunhBYxfkDwAAAABJRU5ErkJggg=="},{"name":"general_icon_34","src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAmUlEQVR4XmNgGJRATk7+PzaMrg4rgCkOCQmBY5IMASmysLD439bW9n/Dhg1gjG4Quh4UAFMEMgSENTU1/9+7dw/MJtkQEA4zlIYbQrIBIM2pDlr/3VQFwYbAvIPXAGyaYV4iaACy5jI/M7hmmAGggMVpAD7NyIbA2Dg1IzsbWSGyQch64ZL4NBMEIMUgjWRpBgFk55GsmVIAAAu3r988k3a2AAAAAElFTkSuQmCC"},{"name":"general_icon_41","src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAoUlEQVR4XsWRQQrDIBBFcxLPIEK78wTTjTv3XXtKr1ViGeEb86tNAoUOPBjI/Bcdl+UXZa0tI3huWjqcc66U9VVh2YypQO63yvMhH+BbExhjCsN/mtFO4L1vpJRKCGFIjLGIyBb+JtBhBDXU94cCHYJAewjQnxJwCL2KdwJeoOKcq6JezDNNwJJRmCW7MAS8RBwbu8ALXBL09z8UXIHz/6s3vEMtuo2xQ2AAAAAASUVORK5CYII="},{"name":"general_icon_43","src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA1klEQVR4XmNgoCawUJX+j4zR5QkCkCYYIMkgZMVf710AGzDDWur/DE+p/1tCpAgboiElDNYE0gwzYLODxP8tEUpgAzo8lPAbAjMAGYAMOlNs+/92gxfYkGQjMcKGgJwNshnmCpABr2fGgA1odpEnwgCQn4HOBmmEYWQD8LoCZABIIQiDnA3CryciNBM0AARAhoACDGYQsmaiDAABkCEghcga0Q0AqUHXhwJACmAGIWN/VV7CUYoMYAbBMNh786eCY4mgK9ABzOmwxEa0K9ABzCCSXYALAACEEvaa0Gx58AAAAABJRU5ErkJggg=="},{"name":"general_icon_5","src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAqElEQVR4XpWTsQ2AIBBFibWdlYWthQtYuoI7uIKuYKNbuIBruAvOgDmST44TFIrfcP89LiQosy6KsleFyQk4Bx9dba5xSAp1IcmGpcQK+EBrbSOB0PmngJdDZ1HB2bcewEOzX0FMIuFPgYRD60cF8la5zUswlSoo4CtzCe8SawX3PHmDlBDjBFvTZEmoS4wngCQl6L8EeLS/eAL6EJDIYiyA3W+EJCfgHm4hUR9H96HXAAAAAElFTkSuQmCC"}];
const ADMIN_USER='sems11_';
const ADMIN_PASS_HASH='disabled-cloud-only';
const iconByName=name=>ICONS.find(x=>x.name===name)?.src || 'assets/logo-v7.png';
let currentLang=(localStorage.getItem('11_lang')==='en')?'en':'tr';
const I18N={
 tr:{
  navPlugins:'Pluginler',navAbout:'Hakkında',login:'Giriş',register:'Kayıt Ol',logout:'Çıkış',
  heroEyebrow:'Minecraft geliştiricileri için',heroTitle:'Bi kaç plugin var istersen kullan.',heroDesc:'Kendi sunucularımız için yaptığımız pluginleri burada topluyoruz. İşine yararsa al kullan.',heroBrowse:'Pluginlere bak',heroLogin:'Hesabına gir',
  storeKicker:'Mağaza',storeTitle:'Son pluginler',storeDesc:'Yaptığımız Minecraft pluginleri. Ücretsiz olanları indir, premium olanlara göz at.',all:'Tümü',free:'Ücretsiz',paid:'Premium',utility:'Araçlar',security:'Güvenlik',visual:'Görsel',other:'Diğer',
  aboutTitle:'11_ Studios',aboutDesc:'Sunucuda işimize yarayan şeyleri yapıp burada paylaşıyoruz.',
  feature1Title:'Sunucuda kullandıklarımız',feature1Desc:'Pluginleri önce kendi sunucularımızda deniyoruz.',feature2Title:'Gereksiz şey yok',feature2Desc:'İşi neyse onu yapıyor. Ayarları mümkün olduğunca sade tutuyoruz.',feature3Title:'Güncellemeler',feature3Desc:'Kullandığımız sürümlerde sorun çıktıkça düzeltip güncelliyoruz.',
  footerDisclaimer:'Minecraft ile bağlantılı resmi bir Mojang/Microsoft sitesi değildir.',footerCopyright:'© 2026 11_ Studios • Minecraft Plugin Platformu',
  loginTitle:'Giriş yap',username:'Kullanıcı adı',password:'Şifre',registerTitle:'Kayıt ol',passwordAgain:'Şifre tekrar',createAccount:'Hesap oluştur',
  adminNotice:'Yönetim verileri bu tarayıcıda saklanır. GitHub Pages sunucu tarafı veritabanı sağlamadığından, ortak ve kalıcı yönetim için backend entegrasyonu gerekir.',newPlugin:'Yeni plugin ekle',editPlugin:'Plugin düzenle',pluginName:'Plugin adı',version:'Sürüm',category:'Kategori',price:'Fiyat (₺)',description:'Açıklama',downloadSaleLink:'İndirme / satış linki',pluginIcon:'Plugin ikonu',cancel:'Vazgeç',save:'Kaydet',publishedPlugins:'Yayındaki pluginler',edit:'Düzenle',delete:'Sil',download:'İndir',buy:'Satın al',emptyFilter:'Bu filtrede plugin yok.',noDescription:'Açıklama eklenmemiş.',pluginCount:'plugin',
  invalidUrl:'Geçersiz bağlantı. Yalnızca http/https bağlantıları açılır.',saleMissing:'Satış linki henüz eklenmedi.',downloadMissing:'İndirme linki henüz eklenmedi.',alreadyLogged:'Zaten {user} olarak giriş yaptın.',loggedOut:'Çıkış yapıldı.',adminLogged:'Admin hesabıyla giriş yapıldı.',badLogin:'Kullanıcı adı veya şifre hatalı.',loggedIn:'Giriş yapıldı.',badUsername:'Kullanıcı adı 3-24 karakter ve sadece harf, sayı, _ olmalı.',passwordMismatch:'Şifreler aynı değil.',usernameUsed:'Bu kullanıcı adı zaten kullanılıyor.',accountCreated:'Hesap oluşturuldu.',deleteConfirm:'Bu plugini silmek istiyor musun?',pluginDeleted:'Plugin silindi.',urlProtocol:'Bağlantı http:// veya https:// ile başlamalı.',pluginUpdated:'Plugin güncellendi.',pluginAdded:'Plugin eklendi.',detailBack:'Pluginlere dön',detailAbout:'Plugin hakkında',detailInfo:'Plugin bilgileri',detailDeveloper:'Geliştirici',detailPrice:'Fiyat',detailReadyFree:'İndirmeye hazır',detailReadyPaid:'Satın almaya hazır',detailActionFree:'Aşağıdaki butondan plugin indirme bağlantısına gidebilirsin.',detailActionPaid:'Aşağıdaki butondan plugin satın alma bağlantısına gidebilirsin.'
 },
 en:{
  navPlugins:'Plugins',navAbout:'About',login:'Log in',register:'Sign up',logout:'Log out',
  heroEyebrow:'For Minecraft developers',heroTitle:'Share your <span class="accent">plugins.</span><br>Grow your server.',heroDesc:'Plugins we build for our own servers, collected in one place. Use whatever helps.',heroBrowse:'Browse plugins',heroLogin:'Log in',
  storeKicker:'Store',storeTitle:'Latest plugins',storeDesc:'Minecraft plugins we made. Download the free ones or check the premium ones.',all:'All',free:'Free',paid:'Premium',utility:'Tools',security:'Security',visual:'Visual',other:'Other',
  aboutTitle:'11_ Studios',aboutDesc:'We make things we actually need on our servers and share them here.',
  feature1Title:'Used on our servers',feature1Desc:'We test plugins on our own servers first.',feature2Title:'No extra clutter',feature2Desc:'Each plugin does its job without unnecessary extras.',feature3Title:'Updates',feature3Desc:'When something breaks on the versions we use, we fix and update it.',
  footerDisclaimer:'Not an official Mojang/Microsoft website or affiliated with Minecraft.',footerCopyright:'© 2026 11_ Studios • Minecraft Plugin Platform',
  loginTitle:'Log in',username:'Username',password:'Password',registerTitle:'Sign up',passwordAgain:'Repeat password',createAccount:'Create account',
  adminNotice:'Management data is stored in this browser. GitHub Pages does not provide a server-side database, so a backend integration is required for shared and persistent management.',newPlugin:'Add new plugin',editPlugin:'Edit plugin',pluginName:'Plugin name',version:'Version',category:'Category',price:'Price (₺)',description:'Description',downloadSaleLink:'Download / purchase link',pluginIcon:'Plugin icon',cancel:'Cancel',save:'Save',publishedPlugins:'Published plugins',edit:'Edit',delete:'Delete',download:'Download',buy:'Buy',emptyFilter:'No plugins match this filter.',noDescription:'No description added.',pluginCount:'plugins',
  invalidUrl:'Invalid link. Only http/https links can be opened.',saleMissing:'Purchase link has not been added yet.',downloadMissing:'Download link has not been added yet.',alreadyLogged:'You are already logged in as {user}.',loggedOut:'Logged out.',adminLogged:'Logged in as admin.',badLogin:'Incorrect username or password.',loggedIn:'Logged in.',badUsername:'Username must be 3–24 characters and contain only letters, numbers, and _.',passwordMismatch:'Passwords do not match.',usernameUsed:'This username is already in use.',accountCreated:'Account created.',deleteConfirm:'Do you want to delete this plugin?',pluginDeleted:'Plugin deleted.',urlProtocol:'The link must start with http:// or https://.',pluginUpdated:'Plugin updated.',pluginAdded:'Plugin added.',detailBack:'Back to plugins',detailAbout:'About this plugin',detailInfo:'Plugin information',detailDeveloper:'Developer',detailPrice:'Price',detailReadyFree:'Ready to download',detailReadyPaid:'Ready to purchase',detailActionFree:'Use the button below to open the plugin download link.',detailActionPaid:'Use the button below to open the plugin purchase link.'
 }
};
const DEFAULT_DESC_EN={
 '11_ChatHeads':'A lightweight visual plugin that displays player heads in chat with a clean, modern presentation.',
 '11_AntiDupe':'A server utility designed to limit common duplication exploits and unnecessary repeating redstone systems.',
 '11_Join':'Sends players to a configured location on join and runs configured startup actions.',
 '11_DeathMessages':'A simple, customizable system for styling death messages to match your server.',
 '11_RenderOptimizer':'A performance tool that combines client visibility ideas with server-side optimization features.',
 '11_AntiPopup':'Controls unwanted interface and popup behavior during player join in a simple way.',
 '11_AntiCheat':'A monitoring system that supports server security by detecting suspicious movement and common cheating behavior.',
 '11_LoginScreen':'A branded login interface with custom visuals and title sequences for player joins.',
 '11_WorldGuard':'A security plugin for managing per-world block breaking and placement rules with simple configuration.'
};
function t(key){return I18N[currentLang][key]??I18N.tr[key]??key;}
function setText(id,key){const el=document.getElementById(id);if(el)el.textContent=t(key);}
function applyLanguage(lang){
 currentLang=lang==='en'?'en':'tr';localStorage.setItem('11_lang',currentLang);document.documentElement.lang=currentLang;
 const s=document.getElementById('languageSelect');if(s)s.value=currentLang;
 setText('navPlugins','navPlugins');setText('navAbout','navAbout');setText('loginBtn','login');setText('registerBtn','register');setText('logoutBtn','logout');
 const he=document.getElementById('heroEyebrow');if(he){const img=he.querySelector('img');he.childNodes[he.childNodes.length-1].textContent=' '+t('heroEyebrow');}
 const ht=document.getElementById('heroTitle');if(ht)ht.innerHTML=t('heroTitle');setText('heroDesc','heroDesc');setText('heroBrowseText','heroBrowse');setText('heroLoginText','heroLogin');
 setText('storeKicker','storeKicker');setText('storeTitle','storeTitle');setText('storeDesc','storeDesc');setText('filterAll','all');setText('filterFree','free');setText('filterPaid','paid');setText('filterUtility','utility');setText('filterSecurity','security');
 setText('aboutTitle','aboutTitle');setText('aboutDesc','aboutDesc');setText('feature1Title','feature1Title');setText('feature1Desc','feature1Desc');setText('feature2Title','feature2Title');setText('feature2Desc','feature2Desc');setText('feature3Title','feature3Title');setText('feature3Desc','feature3Desc');setText('footerDisclaimer','footerDisclaimer');setText('footerCopyright','footerCopyright');
 setText('loginTitle','loginTitle');setText('loginUserLabel','username');setText('loginPassLabel','password');setText('loginToRegister','registerTitle');setText('loginSubmit','login');setText('registerTitle','registerTitle');setText('regUserLabel','username');setText('regPassLabel','password');setText('regPass2Label','passwordAgain');setText('registerToLogin','loginTitle');setText('registerSubmit','createAccount');
 setText('adminNotice','adminNotice');setText('statFreeLabel','free');setText('statPaidLabel','paid');setText('pNameLabel','pluginName');setText('pVersionLabel','version');setText('pCategoryLabel','category');setText('pPriceLabel','price');setText('pDescLabel','description');setText('pUrlLabel','downloadSaleLink');setText('pIconLabel','pluginIcon');setText('cancelEdit','cancel');setText('savePluginBtn','save');setText('publishedPluginsTitle','publishedPlugins');
 const formTitle=document.getElementById('formTitle');if(formTitle)formTitle.textContent=document.getElementById('editId')?.value?t('editPlugin'):t('newPlugin');
 const cat=document.getElementById('pCategory');if(cat){[...cat.options].forEach(o=>o.textContent=t(o.value));}
 const desc=document.getElementById('pDesc');if(desc)desc.placeholder=currentLang==='en'?'What does the plugin do?':'Plugin ne yapıyor?';
 setText('detailBackText','detailBack');setText('detailAboutTitle','detailAbout');setText('detailInfoTitle','detailInfo');setText('detailVersionLabel','version');setText('detailCategoryLabel','category');setText('detailPriceLabel','detailPrice');setText('detailDeveloperLabel','detailDeveloper');
 renderPlugins();if(activeDetailId)renderPluginDetail(activeDetailId);
}
const DEFAULT_PLUGINS=[
 {id:'p1',name:'11_ChatHeads',version:'1.4.5',category:'visual',price:0,desc:'Sohbette oyuncu kafalarını modern ve temiz şekilde gösteren hafif bir görsel eklenti.',url:'',icon:'general_icon_11'},
 {id:'p2',name:'11_AntiDupe',version:'1.0.0',category:'security',price:79,desc:'Yaygın dupe açıklarını ve gereksiz tekrar eden redstone sistemlerini sınırlamaya yönelik sunucu aracı.',url:'',icon:'general_icon_23'},
 {id:'p3',name:'11_Join',version:'1.0.0',category:'utility',price:0,desc:'Oyuncuyu girişte belirlenen noktaya gönderir ve yapılandırılmış başlangıç aksiyonlarını çalıştırır.',url:'',icon:'general_icon_43'},
 {id:'p4',name:'11_DeathMessages',version:'1.0.2',category:'utility',price:39,desc:'Ölüm mesajlarını sunucunun stiline göre düzenlemek için sade ve özelleştirilebilir sistem.',url:'',icon:'general_icon_17'},
 {id:'p5',name:'11_RenderOptimizer',version:'0.9.0',category:'utility',price:99,desc:'İstemci görünürlüğü ve sunucu tarafı optimizasyonlarını tek yapıda birleştiren performans aracı.',url:'',icon:'general_icon_34'},
 {id:'p6',name:'11_AntiPopup',version:'1.0.0',category:'visual',price:0,desc:'Katılım sırasında istenmeyen arayüz ve popup davranışlarını sade biçimde kontrol etmeye yarar.',url:'',icon:'general_icon_5'},
 {id:'p7',name:'11_AntiCheat',version:'1.0.0',category:'security',price:0,desc:'Şüpheli hareketleri ve yaygın hile davranışlarını izleyerek sunucu güvenliğini destekleyen denetim sistemi.',url:'',icon:'general_icon_20'},
 {id:'p8',name:'11_LoginScreen',version:'1.8.4',category:'visual',price:0,desc:'Oyuncu girişlerinde özel görsel ve başlık akışlarıyla markalı açılış deneyimi sunan arayüz sistemi.',url:'',icon:'general_icon_41'},
 {id:'p9',name:'11_WorldGuard',version:'1.0.0',category:'security',price:0,desc:'Dünya bazlı blok kırma ve yerleştirme kurallarını sade yapılandırmayla yöneten güvenlik eklentisi.',url:'',icon:'general_icon_24'}
];
let currentFilter='all';
function readStoredJson(key,fallback){try{const raw=localStorage.getItem(key);return raw===null?fallback:JSON.parse(raw);}catch{return fallback;}}
let session=readStoredJson('11_session',null);
const storedPlugins=readStoredJson('11_plugins',null);
let plugins=Array.isArray(storedPlugins)?storedPlugins:DEFAULT_PLUGINS.map(p=>({...p}));
if(!Array.isArray(storedPlugins)){savePlugins();localStorage.setItem('11_catalog_v2','1');}
else if(localStorage.getItem('11_catalog_v2')!=='1'){
 const additions=DEFAULT_PLUGINS.filter(p=>['p7','p8','p9'].includes(p.id)&&!plugins.some(x=>x&&x.name===p.name));
 if(additions.length){plugins.push(...additions.map(p=>({...p})));savePlugins();}
 localStorage.setItem('11_catalog_v2','1');
}
plugins=plugins.filter(p=>p&&typeof p==='object').map((p,i)=>({
 ...p,
 id:(String(p.id||('plugin_'+i)).replace(/[^a-zA-Z0-9_-]/g,'').slice(0,64)||('plugin_'+i)),
 name:String(p.name||'Plugin').slice(0,60),
 version:String(p.version||'1.0.0').slice(0,24),
 desc:String(p.desc||'').slice(0,500),
 category:['utility','security','visual','other'].includes(p.category)?p.category:'other',
 price:Number.isFinite(Number(p.price))&&Number(p.price)>=0?Number(p.price):0,
 icon:ICONS.some(x=>x.name===p.icon)?p.icon:(ICONS[0]?.name||''),
 url:typeof p.url==='string'?p.url.trim().slice(0,500):''
}));

function sha256(ascii){function rightRotate(value,amount){return(value>>>amount)|(value<<(32-amount));}let mathPow=Math.pow,maxWord=mathPow(2,32),lengthProperty='length',i,j,result='',words=[],asciiBitLength=ascii[lengthProperty]*8;let hash=sha256.h=sha256.h||[],k=sha256.k=sha256.k||[],primeCounter=k[lengthProperty],isComposite={};for(let candidate=2;primeCounter<64;candidate++){if(!isComposite[candidate]){for(i=0;i<313;i+=candidate)isComposite[i]=candidate;hash[primeCounter]=(mathPow(candidate,.5)*maxWord)|0;k[primeCounter++]=(mathPow(candidate,1/3)*maxWord)|0;}}ascii+='\x80';while(ascii[lengthProperty]%64-56)ascii+='\x00';for(i=0;i<ascii[lengthProperty];i++){j=ascii.charCodeAt(i);if(j>>8)return;words[i>>2]|=j<<((3-i)%4)*8;}words[words[lengthProperty]]=((asciiBitLength/maxWord)|0);words[words[lengthProperty]]=asciiBitLength;for(j=0;j<words[lengthProperty];){let w=words.slice(j,j+=16),oldHash=hash;hash=hash.slice(0,8);for(i=0;i<64;i++){let i2=i+j,w15=w[i-15],w2=w[i-2],a=hash[0],e=hash[4];let temp1=hash[7]+(rightRotate(e,6)^rightRotate(e,11)^rightRotate(e,25))+((e&hash[5])^((~e)&hash[6]))+k[i]+(w[i]=(i<16)?w[i]:(w[i-16]+(rightRotate(w15,7)^rightRotate(w15,18)^(w15>>>3))+w[i-7]+(rightRotate(w2,17)^rightRotate(w2,19)^(w2>>>10)))|0);let temp2=(rightRotate(a,2)^rightRotate(a,13)^rightRotate(a,22))+((a&hash[1])^(a&hash[2])^(hash[1]&hash[2]));hash=[(temp1+temp2)|0].concat(hash);hash[4]=(hash[4]+temp1)|0;}for(i=0;i<8;i++)hash[i]=(hash[i]+oldHash[i])|0;}for(i=0;i<8;i++)for(j=3;j+1;j--){let b=(hash[i]>>(j*8))&255;result+=(b<16?0:'')+b.toString(16);}return result;}
function savePlugins(){localStorage.setItem('11_plugins',JSON.stringify(plugins));}
function escapeHtml(s=''){return s.replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c]));}
function categoryLabel(c){return t(c);}
function money(v){return Number(v)>0?Number(v).toLocaleString(currentLang==='en'?'en-US':'tr-TR')+' ₺':t('free');}
function pluginDescription(p){return currentLang==='en'&&DEFAULT_DESC_EN[p.name]?DEFAULT_DESC_EN[p.name]:(p.desc||t('noDescription'));}
function renderPlugins(){
 const grid=document.getElementById('pluginGrid');
 const shown=plugins.filter(p=>currentFilter==='all'||(currentFilter==='free'&&Number(p.price)===0)||(currentFilter==='paid'&&Number(p.price)>0)||p.category===currentFilter);
 grid.innerHTML=shown.length?shown.map(p=>`<article class="plugin-card"><div class="plugin-top"><div class="plugin-icon"><img src="${iconByName(p.icon)}" alt=""></div><div><div class="plugin-name">${escapeHtml(p.name)}</div><div class="plugin-meta">v${escapeHtml(p.version)} • ${categoryLabel(p.category)}</div></div></div><div class="plugin-desc">${escapeHtml(pluginDescription(p))}</div><div class="plugin-bottom"><div class="price ${Number(p.price)===0?'free':''}">${money(p.price)}</div><div class="card-actions"><button class="btn small" onclick="openPlugin('${p.id}')">${Number(p.price)>0?t('buy'):t('download')}</button></div></div><div class="admin-actions"><button class="btn small ghost" onclick="editPlugin('${p.id}')">${t('edit')}</button><button class="btn small danger" onclick="deletePlugin('${p.id}')">${t('delete')}</button></div></article>`).join(''):`<div style="color:#afa4bb;padding:28px">${t('emptyFilter')}</div>`;
 document.getElementById('pluginCountBadge').textContent=`${plugins.length} ${t('pluginCount')}`;
 document.body.classList.toggle('admin-mode',session?.admin===true);
 renderAdminList(); updateStats();
}
function safeExternalUrl(value){try{const u=new URL(value,location.href);return (u.protocol==='https:'||u.protocol==='http:')?u.href:null;}catch{return null;}}
let activeDetailId=null;
function renderPluginDetail(id){const p=plugins.find(x=>x.id===id);if(!p)return;activeDetailId=id;document.getElementById('detailIcon').src=iconByName(p.icon);document.getElementById('detailName').textContent=p.name;document.getElementById('detailSub').textContent=`v${p.version} • ${categoryLabel(p.category)}`;document.getElementById('detailDescription').textContent=pluginDescription(p);document.getElementById('detailVersion').textContent='v'+p.version;document.getElementById('detailCategory').textContent=categoryLabel(p.category);document.getElementById('detailPrice').textContent=money(p.price);document.getElementById('detailActionTitle').textContent=Number(p.price)>0?t('detailReadyPaid'):t('detailReadyFree');document.getElementById('detailActionText').textContent=Number(p.price)>0?t('detailActionPaid'):t('detailActionFree');document.getElementById('detailActionBtn').textContent=Number(p.price)>0?t('buy'):t('download');}
function openPlugin(id){const p=plugins.find(x=>x.id===id);if(!p)return;renderPluginDetail(id);const page=document.getElementById('pluginDetailPage');page.classList.add('open');page.setAttribute('aria-hidden','false');page.scrollTop=0;document.body.style.overflow='hidden';}
function closePluginDetail(){const page=document.getElementById('pluginDetailPage');page.classList.remove('open');page.setAttribute('aria-hidden','true');activeDetailId=null;document.body.style.overflow='';}
function runPluginAction(){const p=plugins.find(x=>x.id===activeDetailId);if(!p)return;const url=safeExternalUrl(p.url);if(url){window.open(url,'_blank','noopener,noreferrer');}else toast(p.url?t('invalidUrl'):(Number(p.price)>0?t('saleMissing'):t('downloadMissing')));}
function toast(t){const e=document.getElementById('toast');e.textContent=t;e.classList.add('show');clearTimeout(window.__tt);window.__tt=setTimeout(()=>e.classList.remove('show'),2300);}
function openModal(id){document.querySelectorAll('.modal').forEach(m=>m.classList.remove('open'));document.getElementById(id).classList.add('open');}
function closeModal(id){document.getElementById(id)?.classList.remove('open');}
function updateSessionUI(){const logged=!!session;document.getElementById('loginBtn').style.display=logged?'none':'';document.getElementById('registerBtn').style.display=logged?'none':'';document.getElementById('logoutBtn').style.display=logged?'':'none';document.getElementById('userChip').classList.toggle('show',logged);document.getElementById('userNameText').textContent=logged?session.username:'';document.getElementById('adminBtn').style.display=session?.admin?'':'none';document.body.classList.toggle('admin-mode',session?.admin===true);renderPlugins();}
function getUsers(){return JSON.parse(localStorage.getItem('11_users')||'[]');}function setUsers(v){localStorage.setItem('11_users',JSON.stringify(v));}

document.getElementById('loginBtn').onclick=()=>openModal('loginModal');document.getElementById('heroLogin').onclick=()=>session?toast(t('alreadyLogged').replace('{user}',session.username)):openModal('loginModal');document.getElementById('registerBtn').onclick=()=>openModal('registerModal');document.getElementById('adminBtn').onclick=()=>openModal('adminModal');document.getElementById('logoutBtn').onclick=()=>{session=null;localStorage.removeItem('11_session');updateSessionUI();toast(t('loggedOut'));};
document.getElementById('detailBackBtn').onclick=closePluginDetail;document.getElementById('detailActionBtn').onclick=runPluginAction;document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.getElementById('pluginDetailPage').classList.contains('open'))closePluginDetail();});
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>closeModal(b.dataset.close));document.querySelectorAll('[data-switch]').forEach(b=>b.onclick=()=>openModal(b.dataset.switch));document.querySelectorAll('.modal').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('open')}));

document.getElementById('loginForm').addEventListener('submit',e=>{e.preventDefault();const u=document.getElementById('loginUser').value.trim(),p=document.getElementById('loginPass').value;const msg=document.getElementById('loginMsg');const h=sha256(p);if(u===ADMIN_USER&&h===ADMIN_PASS_HASH){session={username:u,admin:true};localStorage.setItem('11_session',JSON.stringify(session));msg.textContent='';closeModal('loginModal');updateSessionUI();toast(t('adminLogged'));return;}const user=getUsers().find(x=>x.username.toLowerCase()===u.toLowerCase()&&x.pass===h);if(!user){msg.textContent=t('badLogin');return;}session={username:user.username,admin:false};localStorage.setItem('11_session',JSON.stringify(session));msg.textContent='';closeModal('loginModal');updateSessionUI();toast(t('loggedIn'));});

document.getElementById('registerForm').addEventListener('submit',e=>{e.preventDefault();const u=document.getElementById('regUser').value.trim(),p=document.getElementById('regPass').value,p2=document.getElementById('regPass2').value,msg=document.getElementById('registerMsg');if(!/^[a-zA-Z0-9_]{3,24}$/.test(u)){msg.textContent=t('badUsername');return;}if(p!==p2){msg.textContent=t('passwordMismatch');return;}if(u.toLowerCase()===ADMIN_USER.toLowerCase()||getUsers().some(x=>x.username.toLowerCase()===u.toLowerCase())){msg.textContent=t('usernameUsed');return;}let users=getUsers();users.push({username:u,pass:sha256(p)});setUsers(users);session={username:u,admin:false};localStorage.setItem('11_session',JSON.stringify(session));msg.textContent='';closeModal('registerModal');updateSessionUI();toast(t('accountCreated'));});

document.querySelectorAll('.filter').forEach(b=>b.onclick=()=>{document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');currentFilter=b.dataset.filter;renderPlugins();});

const picker=document.getElementById('iconPicker');picker.innerHTML=ICONS.map((i,n)=>`<button type="button" class="icon-choice ${n===0?'selected':''}" title="${i.name}" data-icon="${i.name}"><img src="${i.src}" alt=""></button>`).join('');document.getElementById('pIcon').value=ICONS[0]?.name||'';picker.addEventListener('click',e=>{const b=e.target.closest('.icon-choice');if(!b)return;picker.querySelectorAll('.icon-choice').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');document.getElementById('pIcon').value=b.dataset.icon;});
function renderAdminList(){const el=document.getElementById('adminList');if(!el)return;el.innerHTML=plugins.map(p=>`<div class="admin-item"><img src="${iconByName(p.icon)}" alt=""><div class="admin-item-main"><div class="admin-item-name">${escapeHtml(p.name)}</div><div class="admin-item-meta">v${escapeHtml(p.version)} • ${money(p.price)}</div></div><div class="admin-item-actions"><button class="btn small ghost" onclick="editPlugin('${p.id}')">${t('edit')}</button><button class="btn small danger" onclick="deletePlugin('${p.id}')">${t('delete')}</button></div></div>`).join('');}
function updateStats(){document.getElementById('statPlugins').textContent=plugins.length;document.getElementById('statFree').textContent=plugins.filter(p=>Number(p.price)===0).length;document.getElementById('statPaid').textContent=plugins.filter(p=>Number(p.price)>0).length;}
function clearPluginForm(){document.getElementById('pluginForm').reset();document.getElementById('editId').value='';document.getElementById('pPrice').value='0';document.getElementById('formTitle').textContent=t('newPlugin');document.getElementById('cancelEdit').style.display='none';const first=ICONS[0]?.name||'';document.getElementById('pIcon').value=first;picker.querySelectorAll('.icon-choice').forEach((x,i)=>x.classList.toggle('selected',i===0));}
function editPlugin(id){if(!session?.admin)return;const p=plugins.find(x=>x.id===id);if(!p)return;openModal('adminModal');document.getElementById('formTitle').textContent=t('editPlugin');document.getElementById('editId').value=p.id;document.getElementById('pName').value=p.name;document.getElementById('pVersion').value=p.version;document.getElementById('pCategory').value=p.category;document.getElementById('pPrice').value=p.price;document.getElementById('pDesc').value=p.desc;document.getElementById('pUrl').value=p.url||'';document.getElementById('pIcon').value=p.icon;document.getElementById('cancelEdit').style.display='';picker.querySelectorAll('.icon-choice').forEach(x=>x.classList.toggle('selected',x.dataset.icon===p.icon));}
function deletePlugin(id){if(!session?.admin)return;if(!confirm(t('deleteConfirm')))return;plugins=plugins.filter(x=>x.id!==id);savePlugins();renderPlugins();toast(t('pluginDeleted'));}
document.getElementById('cancelEdit').onclick=clearPluginForm;
document.getElementById('pluginForm').addEventListener('submit',e=>{e.preventDefault();if(!session?.admin)return;const id=(document.getElementById('editId').value||'p'+Date.now()).replace(/[^a-zA-Z0-9_-]/g,'');const rawUrl=document.getElementById('pUrl').value.trim();if(rawUrl&&!safeExternalUrl(rawUrl)){toast(t('urlProtocol'));return;}const rawPrice=Number(document.getElementById('pPrice').value||0);const obj={id,name:document.getElementById('pName').value.trim().slice(0,60),version:document.getElementById('pVersion').value.trim().slice(0,24),category:document.getElementById('pCategory').value,price:Number.isFinite(rawPrice)&&rawPrice>=0?rawPrice:0,desc:document.getElementById('pDesc').value.trim().slice(0,500),url:rawUrl,icon:document.getElementById('pIcon').value};const idx=plugins.findIndex(x=>x.id===id);if(idx>=0)plugins[idx]=obj;else plugins.unshift(obj);savePlugins();renderPlugins();clearPluginForm();toast(idx>=0?t('pluginUpdated'):t('pluginAdded'));});
window.editPlugin=editPlugin;window.deletePlugin=deletePlugin;window.openPlugin=openPlugin;window.closePluginDetail=closePluginDetail;
document.getElementById('languageSelect').addEventListener('change',e=>applyLanguage(e.target.value));
updateSessionUI();applyLanguage(currentLang);

;
(()=>{
  const SUPABASE_URL='https://mzrnuiunfxaendnrigzk.supabase.co';
  const PUBLISHABLE='sb_publishable_ZF1vdtlp5gpOGwljI1vRmw_FaLRRFOb';
  const API_URL=`${SUPABASE_URL}/functions/v1/site-api`;
  const ADMIN_USER='sems11_';
  const TOKEN_KEY='11_cloud_admin_token';
  let adminToken=sessionStorage.getItem(TOKEN_KEY)||'';
  let remoteInitiallyEmpty=false;
  let ready=false;
  let pushing=false;

  const publicHeaders=()=>({apikey:PUBLISHABLE,'Content-Type':'application/json'});

  async function api(action,payload){
    const r=await fetch(API_URL,{
      method:'POST',headers:publicHeaders(),body:JSON.stringify({action,...(payload||{})}),cache:'no-store',credentials:'omit'
    });
    const text=await r.text();
    let data=null;try{data=text?JSON.parse(text):null;}catch{data=text;}
    if(!r.ok){
      const err=new Error(`${action}:${r.status}`);err.status=r.status;err.payload=data;err.raw=text;throw err;
    }
    return data;
  }
  const rpc=api;

  function safeImage(value){
    const s=String(value||'');
    return /^data:image\/(?:png|jpe?g|webp|gif);base64,/i.test(s)?s:'';
  }
  function mapRemote(row){
    return {
      id:String(row.id||'').replace(/[^A-Za-z0-9_-]/g,'').slice(0,64),
      name:String(row.name||'Plugin').slice(0,80),
      version:String(row.version||'1.0.0').slice(0,40),
      category:['utility','security','visual','other'].includes(String(row.category||''))?String(row.category):'other',
      price:Math.max(0,Number(row.price)||0),
      desc:String(row.description||'').slice(0,12000),
      url:/^https?:\/\//i.test(String(row.url||''))?String(row.url).slice(0,1200):'',
      icon:String(row.icon||'').replace(/[^A-Za-z0-9_-]/g,'').slice(0,120),
      image:safeImage(row.image),
      video:/^https?:\/\//i.test(String(row.video||''))?String(row.video).slice(0,1200):'',
      downloadFileName:String(row.download_file_name||'').slice(0,180),
      downloadFileSize:Math.max(0,Number(row.download_file_size)||0),
      hasDownloadFile:!!row.has_download_file,
      filePath:/^[A-Za-z0-9_-]+\/[A-Za-z0-9._-]+$/.test(String(row.file_path||''))?String(row.file_path):''
    };
  }

  async function fetchRemote(){
    const r=await fetch(`${SUPABASE_URL}/rest/v1/plugins?select=*&order=sort_order.asc,name.asc`,{
      headers:{apikey:PUBLISHABLE,Accept:'application/json'},cache:'no-store',credentials:'omit'
    });
    if(!r.ok)throw new Error(`plugins:${r.status}`);
    const data=await r.json();
    return Array.isArray(data)?data.map(mapRemote):[];
  }

  function localPlugins(){try{return typeof plugins!=='undefined'&&Array.isArray(plugins)?plugins:[];}catch{return[];}}
  function setPlugins(list){
    try{
      plugins=list.map(x=>({...x}));
      localStorage.setItem('11_plugins',JSON.stringify(plugins));
      if(typeof renderPlugins==='function')renderPlugins();
      if(typeof renderAdminList==='function')renderAdminList();
      if(typeof updateSessionUI==='function')updateSessionUI();
    }catch(err){console.error('[11_ Studios] cloud catalog apply failed',err);}
  }

  async function loadRemote(){
    try{
      const remote=await fetchRemote();
      remoteInitiallyEmpty=remote.length===0;
      if(remote.length){setPlugins(remote);return true;}
      return false;
    }catch(err){console.error('[11_ Studios] cloud catalog load failed',err);return false;}
  }

  async function tokenValid(){
    if(!adminToken)return false;
    try{return !!(await rpc('admin_session_valid',{p_token:adminToken}));}catch{return false;}
  }

  async function pushAll(showToast=false){
    if(!adminToken||pushing)return false;
    const list=localPlugins();if(!Array.isArray(list))return false;
    pushing=true;
    try{
      await rpc('replace_plugins',{p_token:adminToken,p_plugins:list});
      remoteInitiallyEmpty=false;
      if(showToast&&typeof toast==='function')toast(document.getElementById('languageSelect')?.value==='en'?'Saved for all devices.':'Tüm cihazlara kaydedildi.');
      document.dispatchEvent(new CustomEvent('11:cloud-synced'));
      return true;
    }catch(err){
      console.error('[11_ Studios] cloud catalog save failed',err);
      if(showToast&&typeof toast==='function')toast(err?.status===429?(document.getElementById('languageSelect')?.value==='en'?'Too many requests. Try again shortly.':'Çok fazla işlem yapıldı. Biraz sonra tekrar dene.'):(document.getElementById('languageSelect')?.value==='en'?'Cloud save failed.':'Buluta kaydetme başarısız.'));
      return false;
    }finally{pushing=false;}
  }

  async function cloudLogin(username,password){
    const token=await rpc('admin_login',{p_username:username,p_password:password});
    if(!token)return '';
    adminToken=String(token);sessionStorage.setItem(TOKEN_KEY,adminToken);return adminToken;
  }

  window.__11Cloud={
    url:SUPABASE_URL,
    anon:PUBLISHABLE,
    publishable:PUBLISHABLE,
    api,
    getToken:()=>adminToken,
    pushAll,
    loadRemote,
    publicFileUrl:path=>`${SUPABASE_URL}/storage/v1/object/public/plugin-files/${String(path||'').split('/').map(encodeURIComponent).join('/')}`
  };

  document.addEventListener('submit',async e=>{
    const form=e.target;
    if(!(form instanceof HTMLFormElement)||form.id!=='loginForm')return;
    const u=document.getElementById('loginUser')?.value.trim()||'';
    if(u.toLowerCase()!==ADMIN_USER.toLowerCase())return;
    e.preventDefault();e.stopImmediatePropagation();
    const p=document.getElementById('loginPass')?.value||'';
    const msg=document.getElementById('loginMsg');const submit=form.querySelector('button[type="submit"]');
    if(submit)submit.disabled=true;
    try{
      const token=await cloudLogin(ADMIN_USER,p);
      if(!token){if(msg)msg.textContent=document.getElementById('languageSelect')?.value==='en'?'Incorrect username or password.':'Kullanıcı adı veya şifre hatalı.';return;}
      try{session={username:ADMIN_USER,admin:true};localStorage.setItem('11_session',JSON.stringify(session));}catch{}
      if(msg)msg.textContent='';if(typeof closeModal==='function')closeModal('loginModal');if(typeof updateSessionUI==='function')updateSessionUI();
      if(typeof toast==='function')toast(document.getElementById('languageSelect')?.value==='en'?'Admin login successful.':'Admin hesabıyla giriş yapıldı.');
      if(remoteInitiallyEmpty)await pushAll(true);else await loadRemote();
      document.dispatchEvent(new CustomEvent('11:cloud-admin-ready'));
    }catch(err){
      console.error('[11_ Studios] cloud admin login failed',err);
      if(msg)msg.textContent=err?.status===429?(document.getElementById('languageSelect')?.value==='en'?'Too many attempts. Try again later.':'Çok fazla deneme yapıldı. Biraz sonra tekrar dene.'):(document.getElementById('languageSelect')?.value==='en'?'Login service unavailable.':'Giriş servisine ulaşılamadı.');
    }finally{if(submit)submit.disabled=false;}
  },true);

  function patchAfterAppReady(){
    if(ready)return;
    try{if(typeof plugins==='undefined'||typeof renderPlugins!=='function'||typeof updateSessionUI!=='function')return;ready=true;
      const logout=document.getElementById('logoutBtn');
      if(logout)logout.addEventListener('click',()=>{const old=adminToken;adminToken='';sessionStorage.removeItem(TOKEN_KEY);if(old)rpc('admin_logout',{p_token:old}).catch(()=>{});},true);
      const form=document.getElementById('pluginForm');if(form)form.addEventListener('submit',()=>{if(adminToken)setTimeout(()=>pushAll(true),900);});
      try{if(typeof deletePlugin==='function'){const baseDelete=deletePlugin;deletePlugin=function(id){const r=baseDelete(id);if(adminToken)setTimeout(()=>pushAll(true),250);return r;};window.deletePlugin=deletePlugin;}}catch{}
      document.addEventListener('11:catalog-changed',()=>{if(adminToken)setTimeout(()=>pushAll(true),120);});
      (async()=>{
        const valid=await tokenValid();if(!valid){adminToken='';sessionStorage.removeItem(TOKEN_KEY);}
        try{if(session?.admin&&!adminToken){session=null;localStorage.removeItem('11_session');updateSessionUI();if(typeof toast==='function')toast(document.getElementById('languageSelect')?.value==='en'?'Please log in as admin again.':'Admin hesabına tekrar giriş yap.');}}catch{}
        const hadRemote=await loadRemote();if(!hadRemote&&adminToken)await pushAll(false);
      })();
    }catch(err){console.error('[11_ Studios] cloud init failed',err);}
  }

  let tries=0;const timer=setInterval(()=>{tries++;patchAfterAppReady();if(ready||tries>200)clearInterval(timer);},100);
})();
;
(()=>{
  const ADMIN_USER='sems11_';
  const USER_TOKEN_KEY='11_cloud_user_token';
  const VISITOR_KEY='11_visitor_id';
  const VISIT_SESSION_KEY='11_visit_recorded';
  let userToken=localStorage.getItem(USER_TOKEN_KEY)||'';
  let appReady=false;
  let dashboardBusy=false;

  const en=()=>document.getElementById('languageSelect')?.value==='en';
  const tr=(trText,enText)=>en()?enText:trText;
  const cloud=()=>window.__11Cloud||null;
  const cfg=()=>{
    const c=cloud();
    if(!c?.url||!c?.anon)throw new Error('cloud-not-ready');
    return c;
  };
  const headers=()=>{const c=cfg();return {apikey:c.anon,Authorization:`Bearer ${c.anon}`,'Content-Type':'application/json'};};

  async function rpc(name,payload){
    const c=cfg();
    if(typeof c.api!=='function')throw new Error('cloud-api-not-ready');
    return c.api(name,payload||{});
  }

  const safeUsers=()=>{try{const x=JSON.parse(localStorage.getItem('11_users')||'[]');return Array.isArray(x)?x:[];}catch{return[];}};
  const legacyMatch=(username,password)=>{
    try{
      if(typeof sha256!=='function')return false;
      const h=sha256(password);
      return safeUsers().some(x=>String(x?.username||'').toLowerCase()===username.toLowerCase()&&x?.pass===h);
    }catch{return false;}
  };
  const removeLegacy=username=>{
    try{localStorage.setItem('11_users',JSON.stringify(safeUsers().filter(x=>String(x?.username||'').toLowerCase()!==username.toLowerCase())));}catch{}
  };

  function saveUserSession(username,token){
    userToken=String(token||'');
    if(userToken)localStorage.setItem(USER_TOKEN_KEY,userToken);else localStorage.removeItem(USER_TOKEN_KEY);
    try{
      session={username:String(username||''),admin:false,cloud:true};
      localStorage.setItem('11_session',JSON.stringify(session));
      if(typeof updateSessionUI==='function')updateSessionUI();
    }catch{}
  }
  function clearUserSession(){
    const old=userToken;
    userToken='';
    localStorage.removeItem(USER_TOKEN_KEY);
    return old;
  }

  async function cloudUserLogin(username,password){return await rpc('user_login',{p_username:username,p_password:password});}
  async function cloudUserRegister(username,password){return await rpc('user_register',{p_username:username,p_password:password});}

  document.addEventListener('submit',async e=>{
    const form=e.target;
    if(!(form instanceof HTMLFormElement))return;
    if(form.id==='loginForm'){
      const username=document.getElementById('loginUser')?.value.trim()||'';
      if(username.toLowerCase()===ADMIN_USER.toLowerCase())return;
      e.preventDefault();e.stopImmediatePropagation();
      const password=document.getElementById('loginPass')?.value||'';
      const msg=document.getElementById('loginMsg');
      const submit=form.querySelector('button[type="submit"]');
      if(submit)submit.disabled=true;
      try{
        let data=await cloudUserLogin(username,password);
        if(!data && legacyMatch(username,password)){
          try{data=await cloudUserRegister(username,password);removeLegacy(username);}catch{}
        }
        if(!data?.token){if(msg)msg.textContent=tr('Kullanıcı adı veya şifre hatalı.','Incorrect username or password.');return;}
        saveUserSession(data.username||username,data.token);
        if(msg)msg.textContent='';
        if(typeof closeModal==='function')closeModal('loginModal');
        if(typeof toast==='function')toast(tr('Giriş yapıldı.','Logged in.'));
      }catch(err){
        console.error('[11_ Studios] cloud user login failed',err);
        if(msg)msg.textContent=tr('Giriş servisine ulaşılamadı.','Login service unavailable.');
      }finally{if(submit)submit.disabled=false;}
      return;
    }

    if(form.id==='registerForm'){
      e.preventDefault();e.stopImmediatePropagation();
      const username=document.getElementById('regUser')?.value.trim()||'';
      const password=document.getElementById('regPass')?.value||'';
      const password2=document.getElementById('regPass2')?.value||'';
      const msg=document.getElementById('registerMsg');
      const submit=form.querySelector('button[type="submit"]');
      if(!/^[A-Za-z0-9_]{3,24}$/.test(username)){if(msg)msg.textContent=tr('Kullanıcı adı 3-24 karakter ve sadece harf, sayı, _ olmalı.','Username must be 3-24 characters and contain only letters, numbers, and _.');return;}
      if(username.toLowerCase()===ADMIN_USER.toLowerCase()){if(msg)msg.textContent=tr('Bu kullanıcı adı kullanılamaz.','This username cannot be used.');return;}
      if(password!==password2){if(msg)msg.textContent=tr('Şifreler aynı değil.','Passwords do not match.');return;}
      if(password.length<6){if(msg)msg.textContent=tr('Şifre en az 6 karakter olmalı.','Password must be at least 6 characters.');return;}
      if(submit)submit.disabled=true;
      try{
        const data=await cloudUserRegister(username,password);
        if(!data?.token)throw new Error('register-no-token');
        saveUserSession(data.username||username,data.token);
        if(msg)msg.textContent='';
        if(typeof closeModal==='function')closeModal('registerModal');
        if(typeof toast==='function')toast(tr('Hesap oluşturuldu.','Account created.'));
      }catch(err){
        const raw=String(err?.raw||'');
        if(msg)msg.textContent=/username_used|23505/i.test(raw)?tr('Bu kullanıcı adı zaten kullanılıyor.','This username is already in use.'):tr('Hesap oluşturulamadı.','Account could not be created.');
      }finally{if(submit)submit.disabled=false;}
    }
  },true);

  document.addEventListener('click',e=>{
    if(e.target?.closest?.('#logoutBtn')){
      const old=clearUserSession();
      if(old)rpc('user_logout',{p_token:old}).catch(()=>{});
    }
  },true);

  function visitorId(){
    let id='';try{id=localStorage.getItem(VISITOR_KEY)||'';}catch{}
    if(!id){
      try{id=crypto.randomUUID();}catch{id=`v_${Date.now()}_${Math.random().toString(36).slice(2)}_${Math.random().toString(36).slice(2)}`;}
      try{localStorage.setItem(VISITOR_KEY,id);}catch{}
    }
    return id;
  }
  async function recordVisit(){
    try{if(sessionStorage.getItem(VISIT_SESSION_KEY)==='1')return;sessionStorage.setItem(VISIT_SESSION_KEY,'1');}catch{}
    try{await rpc('record_visit',{p_visitor_id:visitorId()});}catch(err){console.warn('[11_ Studios] visit analytics unavailable',err);}
  }

  function installAdminUi(){
    const body=document.querySelector('#adminModal .dialog-body');
    if(!body||document.getElementById('cloudAdminPanel'))return;
    const notice=document.getElementById('adminNotice');
    if(notice)notice.textContent=tr('Yönetim verileri Supabase bulut veritabanında saklanır ve tüm cihazlarda ortaktır.','Management data is stored in the Supabase cloud database and shared across all devices.');

    const section=document.createElement('section');
    section.id='cloudAdminPanel';
    section.className='cloud-admin-panel';
    section.innerHTML=`
      <div class="cloud-admin-head"><h4>${tr('Site istatistikleri','Site analytics')}</h4><button type="button" class="btn small ghost" id="cloudStatsRefresh">${tr('Yenile','Refresh')}</button></div>
      <div class="cloud-stat-grid">
        <div class="cloud-stat"><b id="cloudUniqueVisitors">—</b><span>${tr('Toplam ziyaretçi','Unique visitors')}</span></div>
        <div class="cloud-stat"><b id="cloudTotalVisits">—</b><span>${tr('Toplam ziyaret','Total visits')}</span></div>
        <div class="cloud-stat"><b id="cloudVisitors24">—</b><span>${tr('Son 24 saat','Last 24 hours')}</span></div>
        <div class="cloud-stat"><b id="cloudAccountsTotal">—</b><span>${tr('Hesaplar','Accounts')}</span></div>
      </div>
      <div class="cloud-accounts-head"><h4>${tr('Hesaplar','Accounts')}</h4><span id="cloudAccountsState"></span></div>
      <div class="cloud-account-list" id="cloudAccountList"><div class="cloud-empty">${tr('Admin girişi yapınca hesaplar burada görünecek.','Accounts will appear here after admin login.')}</div></div>`;
    body.appendChild(section);

    if(!document.getElementById('cloudAdminStyle')){
      const style=document.createElement('style');style.id='cloudAdminStyle';style.textContent=`
      .cloud-admin-panel{margin-top:22px;padding-top:20px;border-top:1px solid rgba(203,167,255,.14)}
      .cloud-admin-head,.cloud-accounts-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px}.cloud-admin-head h4,.cloud-accounts-head h4{margin:0}
      .cloud-stat-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-bottom:20px}.cloud-stat{padding:14px;border:1px solid rgba(203,167,255,.14);border-radius:14px;background:rgba(10,7,15,.6)}.cloud-stat b{display:block;font-size:24px;line-height:1.1;margin-bottom:5px}.cloud-stat span{font-size:12px;color:#9f94aa}
      .cloud-account-list{display:flex;flex-direction:column;gap:8px;max-height:320px;overflow:auto;padding-right:2px}.cloud-account-row{display:grid;grid-template-columns:minmax(140px,1.2fr) minmax(130px,1fr) minmax(130px,1fr);gap:10px;align-items:center;padding:11px 12px;border:1px solid rgba(203,167,255,.12);border-radius:12px;background:rgba(8,6,12,.55)}.cloud-account-name{font-weight:700}.cloud-account-meta{font-size:12px;color:#9f94aa}.cloud-account-admin{color:#cba7ff}.cloud-empty{padding:14px;color:#9f94aa;border:1px dashed rgba(203,167,255,.16);border-radius:12px}.cloud-accounts-head span{font-size:12px;color:#9f94aa}
      @media(max-width:760px){.cloud-stat-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.cloud-account-row{grid-template-columns:1fr}.cloud-account-meta{font-size:11px}}
      `;document.head.appendChild(style);
    }

    document.getElementById('cloudStatsRefresh')?.addEventListener('click',refreshAdminDashboard);
    document.getElementById('adminBtn')?.addEventListener('click',()=>setTimeout(refreshAdminDashboard,80));
    document.addEventListener('11:cloud-admin-ready',()=>setTimeout(refreshAdminDashboard,80));
    document.getElementById('languageSelect')?.addEventListener('change',()=>setTimeout(()=>{document.getElementById('cloudAdminPanel')?.remove();installAdminUi();refreshAdminDashboard();},20));
  }

  const fmtDate=value=>{
    if(!value)return tr('Henüz yok','Not yet');
    try{return new Intl.DateTimeFormat(en()?'en-GB':'tr-TR',{dateStyle:'medium',timeStyle:'short'}).format(new Date(value));}catch{return String(value);}
  };

  function renderAccounts(data){
    const list=document.getElementById('cloudAccountList');
    if(!list)return;
    const rows=Array.isArray(data?.accounts)?data.accounts:[];
    const adminRow=`<div class="cloud-account-row"><div><div class="cloud-account-name cloud-account-admin">${ADMIN_USER}</div><div class="cloud-account-meta">Admin</div></div><div class="cloud-account-meta">${tr('Sistem yöneticisi','System administrator')}</div><div class="cloud-account-meta">—</div></div>`;
    const userRows=rows.map(u=>`<div class="cloud-account-row"><div><div class="cloud-account-name">${escapeHtmlSafe(u.username)}</div><div class="cloud-account-meta">${u.disabled?tr('Devre dışı','Disabled'):tr('Kullanıcı','User')}</div></div><div class="cloud-account-meta">${tr('Kayıt','Registered')}: ${fmtDate(u.created_at)}</div><div class="cloud-account-meta">${tr('Son giriş','Last login')}: ${fmtDate(u.last_login_at)}</div></div>`).join('');
    list.innerHTML=adminRow+(userRows||`<div class="cloud-empty">${tr('Henüz kayıtlı kullanıcı yok.','No registered users yet.')}</div>`);
  }
  const escapeHtmlSafe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));

  async function refreshAdminDashboard(){
    if(dashboardBusy)return;
    installAdminUi();
    const token=cloud()?.getToken?.()||'';
    const state=document.getElementById('cloudAccountsState');
    if(!token){if(state)state.textContent=tr('Admin girişi gerekli','Admin login required');return;}
    dashboardBusy=true;if(state)state.textContent=tr('Yükleniyor...','Loading...');
    try{
      const data=await rpc('admin_dashboard',{p_token:token});
      document.getElementById('cloudUniqueVisitors').textContent=Number(data?.unique_visitors||0).toLocaleString();
      document.getElementById('cloudTotalVisits').textContent=Number(data?.total_visits||0).toLocaleString();
      document.getElementById('cloudVisitors24').textContent=Number(data?.visitors_24h||0).toLocaleString();
      document.getElementById('cloudAccountsTotal').textContent=(Number(data?.accounts_total||0)+1).toLocaleString();
      renderAccounts(data);
      if(state)state.textContent=tr(`${Number(data?.accounts_total||0)+1} hesap`,`${Number(data?.accounts_total||0)+1} accounts`);
    }catch(err){
      console.error('[11_ Studios] admin dashboard failed',err);
      if(state)state.textContent=tr('Veriler alınamadı','Could not load data');
    }finally{dashboardBusy=false;}
  }

  async function validateExistingUser(){
    if(!userToken)return;
    try{
      const data=await rpc('user_session_get',{p_token:userToken});
      if(!data?.username)throw new Error('invalid-session');
      saveUserSession(data.username,userToken);
    }catch{
      clearUserSession();
      try{if(session&&!session.admin){session=null;localStorage.removeItem('11_session');if(typeof updateSessionUI==='function')updateSessionUI();}}catch{}
    }
  }

  function afterAppReady(){
    if(appReady)return;
    try{if(typeof updateSessionUI!=='function')return;}catch{return;}
    appReady=true;
    installAdminUi();
    validateExistingUser();
    recordVisit();
  }

  let tries=0;const timer=setInterval(()=>{tries++;afterAppReady();if(appReady||tries>200)clearInterval(timer);},100);
})();
;
(()=>{
  const loadParts=(base,count)=>Promise.all(
    Array.from({length:count},(_,i)=>
      fetch(`${base}/part${i+1}.txt?v=20261015-8`,{cache:'force-cache'})
        .then(r=>{if(!r.ok) throw new Error(`${base} part ${i+1}: ${r.status}`); return r.text();})
    )
  ).then(parts=>parts.join('').replace(/\s+/g,''));

  const heroPromise=Promise.resolve('static');
  const faviconPromise=Promise.resolve('static');

  let heroData='';
  let pendingImageData='';
  let pendingImagePromise=Promise.resolve('');

  const installHero=()=>{
    if(!heroData) return;
    const eyebrow=document.querySelector('.eyebrow');
    if(!eyebrow) return;
    const existing=eyebrow.querySelector('.hero-wordmark-img');
    if(existing && existing.dataset.ready==='1') return;
    const img=document.createElement('img');
    img.className='hero-wordmark-img';
    img.alt='11_ Studios';
    img.dataset.ready='1';
    img.decoding='async';
    img.src='assets/hero-wordmark.png?v=20261016-32';img.decoding='async';
    eyebrow.style.removeProperty('background-image');
    eyebrow.setAttribute('aria-label','11_ Studios');
    eyebrow.replaceChildren(img);
  };

  const installFooterCredit=()=>{
    const footer=document.querySelector('.footer');
    if(!footer || footer.querySelector('.made-by-sems')) return;
    const credit=document.createElement('div');
    credit.className='made-by-sems';
    credit.textContent='made by sems11_';
    footer.appendChild(credit);
  };

  const installMediaUI=()=>{
    const pUrl=document.getElementById('pUrl');
    if(pUrl && !document.getElementById('pImage')){
      const imageField=document.createElement('div');
      imageField.className='field plugin-image-field';
      imageField.innerHTML=`
        <label id="pImageLabel" for="pImage">Ürün fotoğrafı</label>
        <input id="pImage" type="file" accept="image/png,image/jpeg,image/webp,image/gif">
        <div id="pImagePreviewWrap" class="plugin-image-preview-wrap" hidden>
          <img id="pImagePreview" class="plugin-image-preview" alt="Ürün fotoğrafı önizleme">
          <button id="pImageRemove" class="btn small ghost" type="button">Fotoğrafı kaldır</button>
        </div>`;
      pUrl.closest('.field')?.insertAdjacentElement('afterend',imageField);
    }

    if(pUrl && !document.getElementById('pVideo')){
      const field=document.createElement('div');
      field.className='field';
      field.innerHTML='<label id="pVideoLabel" for="pVideo">Tanıtım videosu</label><input id="pVideo" type="url" maxlength="700" inputmode="url" placeholder="YouTube, Vimeo veya direkt video linki">';
      const imageField=document.querySelector('.plugin-image-field');
      (imageField||pUrl.closest('.field'))?.insertAdjacentElement('afterend',field);
    }

    const detailGrid=document.querySelector('.plugin-detail-content .detail-grid');
    if(detailGrid && !document.getElementById('detailImagePanel')){
      const panel=document.createElement('section');
      panel.className='detail-panel detail-image-panel';
      panel.id='detailImagePanel';
      panel.hidden=true;
      panel.innerHTML='<img id="detailProductImage" class="detail-product-image" alt="Plugin görseli">';
      detailGrid.insertAdjacentElement('beforebegin',panel);
    }

    if(detailGrid && !document.getElementById('detailVideoPanel')){
      const panel=document.createElement('section');
      panel.className='detail-panel detail-video-panel';
      panel.id='detailVideoPanel';
      panel.hidden=true;
      panel.innerHTML=`
        <h3 id="detailVideoTitle">Tanıtım videosu</h3>
        <div class="plugin-video-shell">
          <iframe id="detailVideoFrame" class="plugin-video-frame" title="Plugin videosu" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen hidden></iframe>
          <video id="detailVideoFile" class="plugin-video-file" controls playsinline preload="metadata" hidden></video>
          <a id="detailVideoLink" class="btn purple plugin-video-link" target="_blank" rel="noopener noreferrer" hidden>Videoyu aç</a>
        </div>`;
      detailGrid.insertAdjacentElement('afterend',panel);
    }
  };

  const setMediaLabels=()=>{
    const en=document.getElementById('languageSelect')?.value==='en';
    const imageLabel=document.getElementById('pImageLabel');
    const imageRemove=document.getElementById('pImageRemove');
    const videoLabel=document.getElementById('pVideoLabel');
    const videoInput=document.getElementById('pVideo');
    const videoTitle=document.getElementById('detailVideoTitle');
    const videoLink=document.getElementById('detailVideoLink');
    if(imageLabel) imageLabel.textContent=en?'Product image':'Ürün fotoğrafı';
    if(imageRemove) imageRemove.textContent=en?'Remove image':'Fotoğrafı kaldır';
    if(videoLabel) videoLabel.textContent=en?'Promo video':'Tanıtım videosu';
    if(videoInput) videoInput.placeholder=en?'YouTube, Vimeo or direct video URL':'YouTube, Vimeo veya direkt video linki';
    if(videoTitle) videoTitle.textContent=en?'Promo video':'Tanıtım videosu';
    if(videoLink) videoLink.textContent=en?'Open video':'Videoyu aç';
  };

  const setImagePreview=data=>{
    const wrap=document.getElementById('pImagePreviewWrap');
    const img=document.getElementById('pImagePreview');
    if(!wrap||!img) return;
    if(data){img.src=data;wrap.hidden=false;}
    else{img.removeAttribute('src');wrap.hidden=true;}
  };

  const compressImage=file=>new Promise((resolve,reject)=>{
    if(!file || !file.type.startsWith('image/')) return reject(new Error('invalid-image'));
    if(file.size>12*1024*1024) return reject(new Error('too-large'));
    const reader=new FileReader();
    reader.onerror=()=>reject(new Error('read-failed'));
    reader.onload=()=>{
      const img=new Image();
      img.onerror=()=>reject(new Error('decode-failed'));
      img.onload=()=>{
        const maxW=1400,maxH=900;
        const scale=Math.min(1,maxW/img.naturalWidth,maxH/img.naturalHeight);
        const w=Math.max(1,Math.round(img.naturalWidth*scale));
        const h=Math.max(1,Math.round(img.naturalHeight*scale));
        const canvas=document.createElement('canvas');
        canvas.width=w;canvas.height=h;
        const ctx=canvas.getContext('2d',{alpha:true});
        ctx.imageSmoothingEnabled=true;
        ctx.imageSmoothingQuality='high';
        ctx.drawImage(img,0,0,w,h);
        let data=canvas.toDataURL('image/webp',.84);
        if(!data.startsWith('data:image/webp')) data=canvas.toDataURL('image/jpeg',.84);
        resolve(data);
      };
      img.src=String(reader.result||'');
    };
    reader.readAsDataURL(file);
  });

  const bindImageInput=()=>{
    const input=document.getElementById('pImage');
    if(!input || input.dataset.bound==='1') return;
    input.dataset.bound='1';
    input.addEventListener('change',()=>{
      const file=input.files?.[0];
      if(!file) return;
      const save=document.getElementById('savePluginBtn');
      if(save) save.disabled=true;
      pendingImagePromise=compressImage(file).then(data=>{
        pendingImageData=data;
        setImagePreview(data);
        return data;
      }).catch(err=>{
        input.value='';
        const en=document.getElementById('languageSelect')?.value==='en';
        if(typeof toast==='function') toast(err.message==='too-large'?(en?'Image must be smaller than 12 MB.':'Fotoğraf 12 MB’dan küçük olmalı.'):(en?'Image could not be processed.':'Fotoğraf işlenemedi.'));
        return pendingImageData;
      }).finally(()=>{if(save) save.disabled=false;});
    });
    document.getElementById('pImageRemove')?.addEventListener('click',()=>{
      pendingImageData='';
      pendingImagePromise=Promise.resolve('');
      input.value='';
      setImagePreview('');
    });
  };

  const parseVideoUrl=value=>{
    const raw=String(value||'').trim();
    if(!raw) return null;
    let u;try{u=new URL(raw,location.href);}catch{return null;}
    if(u.protocol!=='https:'&&u.protocol!=='http:') return null;
    const host=u.hostname.toLowerCase().replace(/^www\./,'');
    let id='';
    if(host==='youtu.be') id=u.pathname.split('/').filter(Boolean)[0]||'';
    if(host==='youtube.com'||host.endsWith('.youtube.com')){
      if(u.pathname==='/watch') id=u.searchParams.get('v')||'';
      else{const m=u.pathname.match(/^\/(?:shorts|embed|live)\/([^/?#]+)/);if(m) id=m[1];}
    }
    if(id && /^[A-Za-z0-9_-]{6,}$/.test(id)) return {type:'iframe',src:`https://www.youtube-nocookie.com/embed/${id}`};
    if(host==='vimeo.com'||host.endsWith('.vimeo.com')){const m=u.pathname.match(/\/(\d{5,})/);if(m) return {type:'iframe',src:`https://player.vimeo.com/video/${m[1]}`};}
    if(/\.(mp4|webm|ogg)$/i.test(u.pathname)) return {type:'video',src:u.href};
    return {type:'link',src:u.href};
  };

  const renderVideoForPlugin=p=>{
    const panel=document.getElementById('detailVideoPanel');
    const frame=document.getElementById('detailVideoFrame');
    const video=document.getElementById('detailVideoFile');
    const link=document.getElementById('detailVideoLink');
    if(!panel||!frame||!video||!link) return;
    frame.hidden=true;frame.removeAttribute('src');
    video.hidden=true;video.pause();video.removeAttribute('src');video.load();
    link.hidden=true;link.removeAttribute('href');
    const info=parseVideoUrl(p?.video);panel.hidden=!info;if(!info)return;
    if(info.type==='iframe'){frame.src=info.src;frame.hidden=false;}
    else if(info.type==='video'){video.src=info.src;video.hidden=false;}
    else{link.href=info.src;link.hidden=false;}
  };

  const renderImageForPlugin=p=>{
    const panel=document.getElementById('detailImagePanel');
    const img=document.getElementById('detailProductImage');
    if(!panel||!img) return;
    const data=typeof p?.image==='string'&&p.image.startsWith('data:image/')?p.image:'';
    panel.hidden=!data;
    if(data) img.src=data; else img.removeAttribute('src');
  };

  const decoratePluginCards=()=>{
    document.querySelectorAll('.plugin-card').forEach(card=>{
      card.querySelector('.plugin-cover')?.remove();
      const button=[...card.querySelectorAll('[onclick]')].find(el=>String(el.getAttribute('onclick')||'').includes('openPlugin('));
      const m=String(button?.getAttribute('onclick')||'').match(/openPlugin\(['\"]([^'\"]+)['\"]\)/);
      if(!m) return;
      const p=plugins.find(x=>x.id===m[1]);
      if(!p?.image || !String(p.image).startsWith('data:image/')) return;
      const cover=document.createElement('div');
      cover.className='plugin-cover';
      const img=document.createElement('img');
      img.src=p.image;img.alt=`${p.name} görseli`;img.loading='lazy';
      cover.appendChild(img);
      card.prepend(cover);
    });
  };

  installFooterCredit();installMediaUI();setMediaLabels();bindImageInput();
  document.getElementById('languageSelect')?.addEventListener('change',()=>setTimeout(setMediaLabels,0));

  faviconPromise.then(data=>{
    let favicon=document.querySelector('link[rel~="icon"]');
    if(!favicon){favicon=document.createElement('link');favicon.rel='icon';document.head.appendChild(favicon);}
    favicon.type='image/png';favicon.href='assets/site-icon.png?v=20261016-32';
  }).catch(err=>console.error('[11_ Studios] favicon load failed',err));

  heroPromise.then(data=>{
    heroData=data;installHero();
    const eyebrow=document.querySelector('.eyebrow');
    if(eyebrow){const observer=new MutationObserver(()=>{if(!eyebrow.querySelector('.hero-wordmark-img'))queueMicrotask(installHero);});observer.observe(eyebrow,{childList:true,subtree:true,characterData:true});}
  }).catch(err=>console.error('[11_ Studios] hero wordmark load failed',err));

    installHero();installFooterCredit();installMediaUI();setMediaLabels();bindImageInput();
    try{
      const baseRenderPlugins=renderPlugins;
      renderPlugins=function(){baseRenderPlugins();decoratePluginCards();};
      window.renderPlugins=renderPlugins;

      const baseRenderPluginDetail=renderPluginDetail;
      renderPluginDetail=function(id){
        baseRenderPluginDetail(id);
        const p=plugins.find(x=>x.id===id);
        renderImageForPlugin(p);
        renderVideoForPlugin(p);
      };
      window.renderPluginDetail=renderPluginDetail;

      const baseEditPlugin=editPlugin;
      editPlugin=function(id){
        baseEditPlugin(id);
        const p=plugins.find(x=>x.id===id);
        const video=document.getElementById('pVideo');if(video)video.value=p?.video||'';
        pendingImageData=(typeof p?.image==='string'&&p.image.startsWith('data:image/'))?p.image:'';
        pendingImagePromise=Promise.resolve(pendingImageData);
        const file=document.getElementById('pImage');if(file)file.value='';
        setImagePreview(pendingImageData);
      };
      window.editPlugin=editPlugin;

      const baseClearPluginForm=clearPluginForm;
      clearPluginForm=function(){
        baseClearPluginForm();
        pendingImageData='';pendingImagePromise=Promise.resolve('');
        const file=document.getElementById('pImage');if(file)file.value='';
        const video=document.getElementById('pVideo');if(video)video.value='';
        setImagePreview('');
      };
      window.clearPluginForm=clearPluginForm;

      const form=document.getElementById('pluginForm');
      form?.addEventListener('submit',async e=>{
        if(!session?.admin)return;
        e.preventDefault();e.stopImmediatePropagation();
        await pendingImagePromise;
        const id=(document.getElementById('editId').value||'p'+Date.now()).replace(/[^a-zA-Z0-9_-]/g,'');
        const rawUrl=document.getElementById('pUrl').value.trim();
        const rawVideo=document.getElementById('pVideo')?.value.trim()||'';
        if(rawUrl&&!safeExternalUrl(rawUrl)){toast(t('urlProtocol'));return;}
        if(rawVideo&&!safeExternalUrl(rawVideo)){toast(document.getElementById('languageSelect')?.value==='en'?'Video URL must start with http:// or https://.':'Video linki http:// veya https:// ile başlamalı.');return;}
        const rawPrice=Number(document.getElementById('pPrice').value||0);
        const obj={id,name:document.getElementById('pName').value.trim().slice(0,60),version:document.getElementById('pVersion').value.trim().slice(0,24),category:document.getElementById('pCategory').value,price:Number.isFinite(rawPrice)&&rawPrice>=0?rawPrice:0,desc:document.getElementById('pDesc').value.trim().slice(0,500),url:rawUrl,video:rawVideo.slice(0,700),image:pendingImageData,icon:document.getElementById('pIcon').value};
        const idx=plugins.findIndex(x=>x.id===id);
        const old=idx>=0?plugins[idx]:null;
        if(idx>=0)plugins[idx]=obj;else plugins.unshift(obj);
        try{savePlugins();}
        catch(err){if(idx>=0)plugins[idx]=old;else plugins=plugins.filter(x=>x.id!==id);toast(document.getElementById('languageSelect')?.value==='en'?'Image is too large for browser storage.':'Fotoğraf tarayıcı depolaması için fazla büyük.');return;}
        renderPlugins();clearPluginForm();toast(idx>=0?t('pluginUpdated'):t('pluginAdded'));
      },true);

      document.getElementById('cancelEdit')?.addEventListener('click',()=>setTimeout(clearPluginForm,0));
      renderPlugins();
    }catch(err){console.error('[11_ Studios] media integration failed',err);}
})();

;
(()=>{
  const STATS_KEY='11_plugin_stats_v1';
  let installed=false;
  function isEnglish(){return document.getElementById('languageSelect')?.value==='en';}
  function fixHeroTitle(){const title=document.getElementById('heroTitle');if(title&&isEnglish())title.textContent='A few plugins here, use them if you want.';}
  function readStats(){try{const value=JSON.parse(localStorage.getItem(STATS_KEY)||'{}');return value&&typeof value==='object'?value:{}}catch{return {}}}
  function writeStats(value){try{localStorage.setItem(STATS_KEY,JSON.stringify(value))}catch{}}
  function bumpStat(id,key){if(!id)return;const all=readStats();const row=all[id]&&typeof all[id]==='object'?all[id]:{};row.views=Number(row.views)||0;row.downloads=Number(row.downloads)||0;row.purchases=Number(row.purchases)||0;row[key]=(Number(row[key])||0)+1;all[id]=row;writeStats(all);renderAnalytics();}
  function topPlugin(key){let list=[];try{const all=readStats();list=(typeof plugins!=='undefined'?plugins:[]).map(p=>({p,count:Number(all[p.id]?.[key])||0})).sort((a,b)=>b.count-a.count||String(a.p.name).localeCompare(String(b.p.name)))}catch{}return list[0]||null;}
  function installAnalyticsPanel(){const stats=document.querySelector('#adminModal .stats');if(!stats||document.getElementById('adminAnalytics'))return;const panel=document.createElement('section');panel.id='adminAnalytics';panel.className='admin-analytics';panel.innerHTML=`<div class="admin-analytics-head"><div><div class="analytics-kicker" id="analyticsKicker">İstatistikler</div><h4 id="analyticsTitle">Plugin performansı</h4></div><span class="analytics-note" id="analyticsNote">Bu tarayıcıdaki veriler</span></div><div class="admin-analytics-grid"><div class="analytics-card"><span class="analytics-icon">◉</span><div><small id="topViewedLabel">En çok göz atılan</small><b id="topViewedName">Henüz veri yok</b><em id="topViewedCount">0 görüntülenme</em></div></div><div class="analytics-card"><span class="analytics-icon">⇩</span><div><small id="topDownloadedLabel">En çok indirilen</small><b id="topDownloadedName">Henüz veri yok</b><em id="topDownloadedCount">0 indirme</em></div></div><div class="analytics-card"><span class="analytics-icon">₺</span><div><small id="topPurchasedLabel">En çok satın alınan</small><b id="topPurchasedName">Henüz veri yok</b><em id="topPurchasedCount">0 satın alma</em></div></div></div>`;stats.insertAdjacentElement('afterend',panel);renderAnalytics();}
  function renderAnalytics(){const panel=document.getElementById('adminAnalytics');if(!panel)return;const en=isEnglish(),viewed=topPlugin('views'),downloaded=topPlugin('downloads'),purchased=topPlugin('purchases');const set=(id,text)=>{const el=document.getElementById(id);if(el)el.textContent=text};set('analyticsKicker',en?'Analytics':'İstatistikler');set('analyticsTitle',en?'Plugin performance':'Plugin performansı');set('analyticsNote',en?'Data from this browser':'Bu tarayıcıdaki veriler');set('topViewedLabel',en?'Most viewed':'En çok göz atılan');set('topDownloadedLabel',en?'Most downloaded':'En çok indirilen');set('topPurchasedLabel',en?'Most purchased':'En çok satın alınan');const none=en?'No data yet':'Henüz veri yok';set('topViewedName',viewed&&viewed.count?viewed.p.name:none);set('topViewedCount',`${viewed?.count||0} ${en?'views':'görüntülenme'}`);set('topDownloadedName',downloaded&&downloaded.count?downloaded.p.name:none);set('topDownloadedCount',`${downloaded?.count||0} ${en?'downloads':'indirme'}`);set('topPurchasedName',purchased&&purchased.count?purchased.p.name:none);set('topPurchasedCount',`${purchased?.count||0} ${en?'purchases':'satın alma'}`);}
  function installStoreLabel(){const title=document.querySelector('.market-title h3');if(title)title.textContent='11_ Market';}
  function patchBase(){if(installed)return true;try{if(typeof openPlugin!=='function'||typeof runPluginAction!=='function'||typeof plugins==='undefined')return false;const baseOpenPlugin=openPlugin;openPlugin=function(id){bumpStat(id,'views');return baseOpenPlugin(id)};window.openPlugin=openPlugin;const baseRunPluginAction=runPluginAction;runPluginAction=function(){try{const p=plugins.find(x=>x.id===activeDetailId);if(p&&p.url&&typeof safeExternalUrl==='function'&&safeExternalUrl(p.url))bumpStat(p.id,Number(p.price)>0?'purchases':'downloads')}catch{}return baseRunPluginAction()};window.runPluginAction=runPluginAction;const actionBtn=document.getElementById('detailActionBtn');if(actionBtn)actionBtn.onclick=runPluginAction;const baseRenderPlugins=renderPlugins;renderPlugins=function(){const result=baseRenderPlugins();installStoreLabel();renderAnalytics();return result};window.renderPlugins=renderPlugins;installed=true;return true}catch(err){console.error('[11_ Studios] enhancement patch failed',err);return false}}
  function init(){document.querySelector('.ataturk-quote')?.remove();installAnalyticsPanel();installStoreLabel();fixHeroTitle();document.getElementById('languageSelect')?.addEventListener('change',()=>setTimeout(()=>{fixHeroTitle();renderAnalytics()},20));document.getElementById('adminBtn')?.addEventListener('click',()=>setTimeout(renderAnalytics,30));let tries=0;const timer=setInterval(()=>{tries++;document.querySelector('.ataturk-quote')?.remove();installAnalyticsPanel();fixHeroTitle();if(patchBase()||tries>120){clearInterval(timer);renderAnalytics()}},100)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

;
(()=>{
  const DB_NAME='11_studios_plugin_files';
  const STORE='files';
  const MAX_FILE=150*1024*1024;
  let pendingRemove=false;
  let installed=false;

  const en=()=>document.getElementById('languageSelect')?.value==='en';
  const msg=(tr,enText)=>en()?enText:tr;

  const openDb=()=>new Promise((resolve,reject)=>{
    if(!('indexedDB' in window)) return reject(new Error('indexeddb-unavailable'));
    const req=indexedDB.open(DB_NAME,1);
    req.onupgradeneeded=()=>{
      const db=req.result;
      if(!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE,{keyPath:'id'});
    };
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>reject(req.error||new Error('db-open-failed'));
  });

  const dbGet=async id=>{
    const db=await openDb();
    return new Promise((resolve,reject)=>{
      const tx=db.transaction(STORE,'readonly');
      const req=tx.objectStore(STORE).get(id);
      req.onsuccess=()=>resolve(req.result||null);
      req.onerror=()=>reject(req.error);
      tx.oncomplete=()=>db.close();
    });
  };

  const dbPut=async(id,file)=>{
    const db=await openDb();
    return new Promise((resolve,reject)=>{
      const tx=db.transaction(STORE,'readwrite');
      tx.objectStore(STORE).put({id,blob:file,name:file.name,type:file.type||'application/octet-stream',size:file.size,lastModified:file.lastModified||Date.now()});
      tx.oncomplete=()=>{db.close();resolve();};
      tx.onerror=()=>{db.close();reject(tx.error);};
      tx.onabort=()=>{db.close();reject(tx.error||new Error('db-write-failed'));};
    });
  };

  const dbDelete=async id=>{
    const db=await openDb();
    return new Promise((resolve,reject)=>{
      const tx=db.transaction(STORE,'readwrite');
      tx.objectStore(STORE).delete(id);
      tx.oncomplete=()=>{db.close();resolve();};
      tx.onerror=()=>{db.close();reject(tx.error);};
    });
  };

  const bytes=n=>{
    n=Number(n)||0;
    if(n<1024)return `${n} B`;
    if(n<1024*1024)return `${(n/1024).toFixed(1)} KB`;
    return `${(n/1024/1024).toFixed(1)} MB`;
  };

  function ensureUi(){
    const pUrl=document.getElementById('pUrl');
    if(!pUrl)return false;
    const urlField=pUrl.closest('.field');
    if(urlField)urlField.id='pPurchaseUrlField';

    if(!document.getElementById('pDownloadFileField')){
      const field=document.createElement('div');
      field.className='field plugin-file-field';
      field.id='pDownloadFileField';
      field.innerHTML=`
        <label id="pDownloadFileLabel" for="pDownloadFile">Plugin dosyası</label>
        <input id="pDownloadFile" type="file" accept=".jar,.zip,.rar,.7z,.tar,.gz,.yml,.yaml,.json,.txt,application/java-archive,application/zip">
        <div class="plugin-file-state">
          <span id="pDownloadFileStatus">Dosya seçilmedi</span>
          <button type="button" class="btn small ghost" id="pDownloadFileRemove">Dosyayı kaldır</button>
        </div>
        <small id="pDownloadFileHelp" class="plugin-file-help">Ücretsiz pluginlerde İndir butonu bu dosyayı doğrudan indirir.</small>`;
      urlField?.insertAdjacentElement('beforebegin',field);
    }

    bindUi();
    setLabels();
    syncMode();
    return true;
  }

  function setLabels(){
    const paid=Number(document.getElementById('pPrice')?.value||0)>0;
    const fileLabel=document.getElementById('pDownloadFileLabel');
    const fileHelp=document.getElementById('pDownloadFileHelp');
    const remove=document.getElementById('pDownloadFileRemove');
    const pUrl=document.getElementById('pUrl');
    const urlLabel=pUrl?.closest('.field')?.querySelector('label');
    if(fileLabel)fileLabel.textContent=msg('Plugin dosyası','Plugin file');
    if(fileHelp)fileHelp.textContent=msg('Ücretsiz pluginlerde İndir butonu bu dosyayı doğrudan indirir.','For free plugins, the Download button downloads this file directly.');
    if(remove)remove.textContent=msg('Dosyayı kaldır','Remove file');
    if(urlLabel)urlLabel.textContent=msg('Satın alma linki','Purchase link');
    if(pUrl)pUrl.placeholder=msg('https://satinalma-siten.com/...','https://your-store.com/...');
    const status=document.getElementById('pDownloadFileStatus');
    if(status && !status.dataset.custom) status.textContent=msg('Dosya seçilmedi','No file selected');
  }

  function syncMode(){
    const paid=Number(document.getElementById('pPrice')?.value||0)>0;
    const fileField=document.getElementById('pDownloadFileField');
    const urlField=document.getElementById('pPurchaseUrlField');
    if(fileField)fileField.hidden=paid;
    if(urlField)urlField.hidden=!paid;
    setLabels();
  }

  function setStatus(text,custom=true){
    const el=document.getElementById('pDownloadFileStatus');
    if(!el)return;
    el.textContent=text;
    if(custom)el.dataset.custom='1'; else delete el.dataset.custom;
  }

  async function showStoredFile(id){
    const input=document.getElementById('pDownloadFile');
    if(input)input.value='';
    pendingRemove=false;
    if(!id){setStatus(msg('Dosya seçilmedi','No file selected'),false);return;}
    try{
      const rec=await dbGet(id);
      if(rec)setStatus(`${rec.name} • ${bytes(rec.size)}`);
      else setStatus(msg('Dosya eklenmemiş','No file uploaded'));
    }catch{setStatus(msg('Dosya bilgisi okunamadı','Could not read file info'));}
  }

  function bindUi(){
    const input=document.getElementById('pDownloadFile');
    if(input && input.dataset.bound!=='1'){
      input.dataset.bound='1';
      input.addEventListener('change',()=>{
        const file=input.files?.[0];
        if(!file){setStatus(msg('Dosya seçilmedi','No file selected'),false);return;}
        if(file.size>MAX_FILE){
          input.value='';
          setStatus(msg('Dosya 150 MB’dan küçük olmalı.','File must be smaller than 150 MB.'));
          if(typeof toast==='function')toast(msg('Dosya 150 MB’dan küçük olmalı.','File must be smaller than 150 MB.'));
          return;
        }
        pendingRemove=false;
        setStatus(`${file.name} • ${bytes(file.size)}`);
      });
    }

    const remove=document.getElementById('pDownloadFileRemove');
    if(remove && remove.dataset.bound!=='1'){
      remove.dataset.bound='1';
      remove.addEventListener('click',()=>{
        if(input)input.value='';
        pendingRemove=true;
        setStatus(msg('Kaydedince dosya kaldırılacak','File will be removed when saved'));
      });
    }

    const price=document.getElementById('pPrice');
    if(price && price.dataset.fileModeBound!=='1'){
      price.dataset.fileModeBound='1';
      price.addEventListener('input',syncMode);
      price.addEventListener('change',syncMode);
    }

    const lang=document.getElementById('languageSelect');
    if(lang && lang.dataset.fileModeBound!=='1'){
      lang.dataset.fileModeBound='1';
      lang.addEventListener('change',()=>setTimeout(()=>{setLabels();syncMode();},20));
    }
  }

  function bumpDownload(id){
    try{
      const key='11_plugin_stats_v1';
      const all=JSON.parse(localStorage.getItem(key)||'{}')||{};
      const row=all[id]&&typeof all[id]==='object'?all[id]:{};
      row.views=Number(row.views)||0;
      row.downloads=(Number(row.downloads)||0)+1;
      row.purchases=Number(row.purchases)||0;
      all[id]=row;
      localStorage.setItem(key,JSON.stringify(all));
    }catch{}
  }

  async function downloadFreePlugin(p){
    let rec=null;
    try{rec=await dbGet(p.id);}catch{}
    if(!rec?.blob){
      if(typeof toast==='function')toast(msg('İndirme dosyası henüz eklenmedi.','Download file has not been added yet.'));
      return;
    }
    const href=URL.createObjectURL(rec.blob);
    const a=document.createElement('a');
    a.href=href;
    a.download=rec.name||p.downloadFileName||`${p.name||'plugin'}.jar`;
    a.style.display='none';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(()=>URL.revokeObjectURL(href),60000);
    bumpDownload(p.id);
  }

  function patchFunctions(){
    if(installed)return true;
    try{
      if(typeof plugins==='undefined'||typeof editPlugin!=='function'||typeof clearPluginForm!=='function'||typeof runPluginAction!=='function')return false;

      const originalEdit=editPlugin;
      editPlugin=function(id){
        const result=originalEdit(id);
        setTimeout(()=>{ensureUi();syncMode();showStoredFile(id);},0);
        return result;
      };
      window.editPlugin=editPlugin;

      const originalClear=clearPluginForm;
      clearPluginForm=function(){
        const result=originalClear();
        pendingRemove=false;
        const input=document.getElementById('pDownloadFile');if(input)input.value='';
        setTimeout(()=>{ensureUi();syncMode();setStatus(msg('Dosya seçilmedi','No file selected'),false);},0);
        return result;
      };
      window.clearPluginForm=clearPluginForm;

      const originalAction=runPluginAction;
      runPluginAction=async function(){
        let p=null;
        try{p=plugins.find(x=>x.id===activeDetailId);}catch{}
        if(!p)return originalAction();
        if(Number(p.price)>0)return originalAction();
        return downloadFreePlugin(p);
      };
      window.runPluginAction=runPluginAction;
      const action=document.getElementById('detailActionBtn');if(action)action.onclick=runPluginAction;

      const form=document.getElementById('pluginForm');
      if(form && form.dataset.fileSubmitBound!=='1'){
        form.dataset.fileSubmitBound='1';
        form.addEventListener('submit',e=>{
          try{
            if(!session?.admin)return;
            ensureUi();
            const idInput=document.getElementById('editId');
            if(idInput && !idInput.value)idInput.value=`p${Date.now()}`;
            const id=(idInput?.value||'').replace(/[^a-zA-Z0-9_-]/g,'');
            const price=Number(document.getElementById('pPrice')?.value||0);
            const pUrl=document.getElementById('pUrl');
            const input=document.getElementById('pDownloadFile');
            const selected=input?.files?.[0]||null;
            const old=plugins.find(x=>x.id===id);
            const oldMeta=old?{downloadFileName:old.downloadFileName||'',downloadFileSize:Number(old.downloadFileSize)||0,hasDownloadFile:!!old.hasDownloadFile}:null;
            if(price<=0 && pUrl)pUrl.value='';

            setTimeout(async()=>{
              const p=plugins.find(x=>x.id===id);
              if(!p)return;
              try{
                if(price>0){
                  await dbDelete(id).catch(()=>{});
                  p.downloadFileName='';p.downloadFileSize=0;p.hasDownloadFile=false;
                }else if(selected){
                  await dbPut(id,selected);
                  p.downloadFileName=selected.name;
                  p.downloadFileSize=selected.size;
                  p.hasDownloadFile=true;
                  p.url='';
                }else if(pendingRemove){
                  await dbDelete(id).catch(()=>{});
                  p.downloadFileName='';p.downloadFileSize=0;p.hasDownloadFile=false;p.url='';
                }else if(oldMeta){
                  p.downloadFileName=oldMeta.downloadFileName;
                  p.downloadFileSize=oldMeta.downloadFileSize;
                  p.hasDownloadFile=oldMeta.hasDownloadFile;
                  p.url='';
                }else{
                  p.downloadFileName='';p.downloadFileSize=0;p.hasDownloadFile=false;p.url='';
                }
                if(typeof savePlugins==='function')savePlugins();
                pendingRemove=false;
              }catch(err){
                console.error('[11_ Studios] plugin file save failed',err);
                if(typeof toast==='function')toast(msg('Plugin dosyası kaydedilemedi. Tarayıcı depolama alanını kontrol et.','Plugin file could not be saved. Check browser storage.'));
              }
            },80);
          }catch(err){console.error('[11_ Studios] file submit hook failed',err);}
        },true);
      }

      installed=true;
      ensureUi();
      syncMode();
      return true;
    }catch(err){console.error('[11_ Studios] plugin file mode failed',err);return false;}
  }

  function init(){
    ensureUi();
    let tries=0;
    const timer=setInterval(()=>{
      tries++;
      ensureUi();
      if(patchFunctions()||tries>160)clearInterval(timer);
    },100);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();

;
(()=>{
  let installed=false;
  let cloudPendingRemove=false;
  const DB_NAME='11_studios_plugin_files',STORE='files';

  const cloud=()=>window.__11Cloud||null;
  const token=()=>cloud()?.getToken?.()||'';
  const en=()=>document.getElementById('languageSelect')?.value==='en';
  const msg=(tr,enText)=>en()?enText:tr;
  const bytes=n=>{n=Number(n)||0;if(n<1024)return `${n} B`;if(n<1024*1024)return `${(n/1024).toFixed(1)} KB`;return `${(n/1024/1024).toFixed(1)} MB`;};

  async function uploadCloud(pluginId,file){
    const c=cloud(),t=token();if(!c?.api||!t||!file)throw new Error('cloud-auth-missing');
    const signed=await c.api('create_upload',{p_token:t,plugin_id:pluginId,file_name:file.name,file_size:file.size});
    if(!signed?.signedUrl||!signed?.path)throw new Error('signed-upload-missing');
    const form=new FormData();
    form.append('cacheControl','3600');
    form.append('',file);
    const r=await fetch(signed.signedUrl,{
      method:'PUT',
      headers:{apikey:c.publishable||c.anon,'x-upsert':'false'},
      body:form,
      credentials:'omit'
    });
    if(!r.ok){let detail='';try{detail=await r.text();}catch{}throw new Error(`upload:${r.status}:${detail.slice(0,180)}`);}
    return signed.path;
  }

  async function deleteCloud(path){
    const c=cloud(),t=token();
    if(!c?.api||!t||!path)return false;
    try{await c.api('delete_upload',{p_token:t,path});return true;}catch(err){console.warn('[11_ Studios] old cloud file cleanup failed',err);return false;}
  }

  function openDb(){return new Promise((resolve,reject)=>{if(!('indexedDB'in window))return reject(new Error('no-indexeddb'));const req=indexedDB.open(DB_NAME,1);req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});}
  async function localRecord(id){try{const db=await openDb();return await new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readonly'),req=tx.objectStore(STORE).get(id);req.onsuccess=()=>resolve(req.result||null);req.onerror=()=>reject(req.error);tx.oncomplete=()=>db.close();});}catch{return null;}}

  function findPlugin(id){try{return plugins.find(x=>x.id===id);}catch{return null;}}
  function setStatusForPlugin(id){const p=findPlugin(id),el=document.getElementById('pDownloadFileStatus');if(!el||!p)return;if(p.filePath){el.textContent=`${p.downloadFileName||'plugin.jar'} • ${bytes(p.downloadFileSize)} • ${msg('bulutta','cloud')}`;el.dataset.custom='1';}}

  async function migrateLocalFiles(){
    if(!token())return;
    let changed=false;let list=[];try{list=plugins.filter(p=>p?.hasDownloadFile&&!p?.filePath);}catch{return;}
    for(const p of list){
      const rec=await localRecord(p.id);if(!rec?.blob)continue;
      try{
        const file=new File([rec.blob],rec.name||p.downloadFileName||`${p.name}.jar`,{type:rec.type||'application/octet-stream',lastModified:rec.lastModified||Date.now()});
        p.filePath=await uploadCloud(p.id,file);p.downloadFileName=file.name;p.downloadFileSize=file.size;p.hasDownloadFile=true;changed=true;
      }catch(err){console.error('[11_ Studios] local file migration failed',p.id,err);}
    }
    if(changed){try{if(typeof savePlugins==='function')savePlugins();}catch{}document.dispatchEvent(new CustomEvent('11:catalog-changed'));if(typeof toast==='function')toast(msg('Yerel plugin dosyaları buluta taşındı.','Local plugin files moved to cloud.'));}
  }

  function patch(){
    if(installed)return true;
    try{
      if(typeof plugins==='undefined'||typeof runPluginAction!=='function')return false;
      installed=true;

      const baseAction=runPluginAction;
      runPluginAction=async function(){
        let p=null;try{p=plugins.find(x=>x.id===activeDetailId);}catch{}
        if(p&&Number(p.price)<=0&&p.filePath){const href=cloud()?.publicFileUrl?.(p.filePath);if(href){window.open(href,'_blank','noopener,noreferrer');return;}}
        return baseAction();
      };
      window.runPluginAction=runPluginAction;
      const action=document.getElementById('detailActionBtn');if(action)action.onclick=runPluginAction;

      const form=document.getElementById('pluginForm');
      if(form)form.addEventListener('submit',()=>{
        if(!token())return;
        const id=document.getElementById('editId')?.value||'';
        const input=document.getElementById('pDownloadFile');
        const selected=input?.files?.[0]||null;
        const price=Number(document.getElementById('pPrice')?.value||0);
        const remove=cloudPendingRemove;cloudPendingRemove=false;
        const before=findPlugin(id);const oldPath=before?.filePath||'';
        setTimeout(async()=>{
          const p=findPlugin(id);if(!p)return;
          try{
            if(price>0){
              if(oldPath)await deleteCloud(oldPath);
              p.filePath='';p.downloadFileName='';p.downloadFileSize=0;p.hasDownloadFile=false;
            }else if(selected){
              const newPath=await uploadCloud(p.id,selected);
              if(oldPath&&oldPath!==newPath)await deleteCloud(oldPath);
              p.filePath=newPath;p.downloadFileName=selected.name;p.downloadFileSize=selected.size;p.hasDownloadFile=true;p.url='';
            }else if(remove){
              if(oldPath)await deleteCloud(oldPath);
              p.filePath='';p.downloadFileName='';p.downloadFileSize=0;p.hasDownloadFile=false;p.url='';
            }else return;
            if(typeof savePlugins==='function')savePlugins();
            document.dispatchEvent(new CustomEvent('11:catalog-changed'));
            if(typeof toast==='function')toast(msg('Plugin dosyası buluta kaydedildi.','Plugin file saved to cloud.'));
          }catch(err){console.error('[11_ Studios] cloud file upload failed',err);if(typeof toast==='function')toast(err?.status===429?msg('Çok fazla yükleme yapıldı. Biraz sonra tekrar dene.','Too many uploads. Try again shortly.'):msg('Plugin dosyası buluta yüklenemedi.','Plugin file cloud upload failed.'));}
        },1050);
      });

      document.getElementById('pDownloadFileRemove')?.addEventListener('click',()=>{cloudPendingRemove=true;});
      try{if(typeof editPlugin==='function'){const baseEdit=editPlugin;editPlugin=function(id){const r=baseEdit(id);setTimeout(()=>setStatusForPlugin(id),140);return r;};window.editPlugin=editPlugin;}}catch{}
      document.addEventListener('11:cloud-admin-ready',()=>setTimeout(migrateLocalFiles,250));
      if(token())setTimeout(migrateLocalFiles,600);
      return true;
    }catch(err){console.error('[11_ Studios] cloud file patch failed',err);return false;}
  }

  let tries=0;const timer=setInterval(()=>{tries++;if(patch()||tries>200)clearInterval(timer);},100);
})();
;
(()=>{let input=null,empty=null;const isEnglish=()=>document.getElementById('languageSelect')?.value==='en';const normalize=v=>String(v||'').toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();const cardName=c=>c.querySelector('.plugin-name,.plugin-top h3,.plugin-top h4,.plugin-top b,h3,h4')?.textContent||c.textContent||'';const apply=()=>{const grid=document.getElementById('pluginGrid');if(!grid||!input)return;const q=normalize(input.value);let visible=0;const cards=[...grid.querySelectorAll('.plugin-card')];cards.forEach(card=>{const match=!q||normalize(cardName(card)).includes(q);card.style.setProperty('display',match?'grid':'none','important');if(match)visible++});if(empty){empty.hidden=visible!==0||cards.length===0;empty.textContent=isEnglish()?'No plugins matched your search.':'Aramana uygun plugin bulunamadı.'}const badge=document.getElementById('pluginCountBadge');if(badge&&q)badge.textContent=`${visible} plugin`};const updateLanguage=()=>{if(!input)return;input.placeholder=isEnglish()?'Search plugins...':'Plugin ara...';apply()};const install=()=>{if(document.getElementById('pluginSearchInput')){input=document.getElementById('pluginSearchInput');empty=document.getElementById('pluginSearchEmpty');apply();return true}const filters=document.getElementById('filters'),market=document.querySelector('#plugins .market-surface');if(!market)return false;const wrap=document.createElement('div');wrap.className='plugin-search-wrap';wrap.innerHTML='<div class="plugin-search-box"><span class="plugin-search-icon">⌕</span><input id="pluginSearchInput" class="plugin-search-input" type="search" autocomplete="off"><button id="pluginSearchClear" class="plugin-search-clear" type="button">×</button></div><div id="pluginSearchEmpty" class="plugin-search-empty" hidden></div>';(filters||market).insertAdjacentElement(filters?'afterend':'beforebegin',wrap);input=wrap.querySelector('#pluginSearchInput');empty=wrap.querySelector('#pluginSearchEmpty');input.addEventListener('input',apply);wrap.querySelector('#pluginSearchClear').addEventListener('click',()=>{input.value='';apply();input.focus()});updateLanguage();const grid=document.getElementById('pluginGrid');if(grid)new MutationObserver(()=>requestAnimationFrame(apply)).observe(grid,{childList:true,subtree:true,characterData:true});return true};document.getElementById('languageSelect')?.addEventListener('change',()=>setTimeout(updateLanguage,30));let tries=0;const timer=setInterval(()=>{tries++;if(install()||tries>100)clearInterval(timer)},100);if(document.readyState!=='loading')install()})();
