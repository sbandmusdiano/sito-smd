/* ===== DATI: qui si aggiornano anni e uscite =====
   Per aggiungere le foto di un anno: mettere i file originali in foto/<anno>/
   e le versioni compresse (stessa larghezza max ~900px) in foto/web/<anno>/,
   poi elencare i nomi file qui sotto in PHOTOS[<anno>], nell'ordine in cui
   devono comparire. Un anno senza voce in PHOTOS mostra ancora i riquadri
   segnaposto "foto".
   Per le foto di un'uscita: mettere i file originali in foto/trasferte/
   e le versioni compresse in foto/web/trasferte/ (stesso nome file), poi
   aggiungere photos:["nomefile1.jpg","nomefile2.jpg"] (fino a 2) alla voce
   dell'uscita in EVENTS qui sotto. Un'uscita senza "photos" mostra ancora
   i riquadri segnaposto "foto". */
var FIRST = 2014, LAST = 2026;
var SKIP_YEARS = {2020:1, 2021:1}; /* gruppo fermo per il covid (2020 anche senza foto) */
var PHOTOS = {
  2014: ["10462522_930644246950500_4884746311994228946_n.jpg","10485333_929996087015316_92046561094872916_n.jpg","10505040_932887743392817_8150159280794700903_o.jpg","10665075_761795800554706_7449826152497795826_n.jpg","1959405_10204852312133482_7204492610093172358_n.jpg","DSC_2396.jpg"],
  2015: ["10710464_1155902461091343_8376766114535467922_o.jpg","11863374_10204359659540819_826362227226594539_n.jpg","11888629_1068986343111828_5319668564204765126_o.jpg","125.JPG","alla tavola della principessa costanza festa medioevale 2015 408.JPG","DSC_4786.jpg"],
  2016: ["13908898_1337457389598054_3315066254007881094_o.jpg","13909282_10206361394782949_3382068927048868037_o.jpg","13925790_10206361459224560_7472574325333055807_o.jpg","13987644_10206361488785299_5785940466612430141_o.jpg","DSC_0666 copia_00001.jpg","DSC_6747-3.JPG"],
  2017: ["20818971_1834856946524760_1239952153583677089_o.jpg","20861561_10213369390780068_5046530200654406461_o.jpg","20900684_512301375775761_7959869114882791114_o.jpg","20900866_10209145866312997_8887821437553266338_o.jpg","20934046_10209145756950263_7531391168080208890_o.jpg","principessa costanza 2017 1010.JPG"],
  2018: ["BSUT8550.JPG","IMG_2024.JPG","IMG_8382.JPG","IMG_9771.JPG","QWSU7428.JPG"],
  2019: ["IMG-20190814-WA0020.jpg","IMG-20190814-WA0022.jpg","IMG_2024.JPG","IMG_8382.JPG","MGWA4191.JPG"],
  2022: ["473518656_1150936633699902_4820667600101948447_n.jpg","474033469_1152621610198071_1643138677884754089_n.jpg","480161945_1172244641569101_8056584839419522418_n.jpg","482246581_3905581256376981_2978739932177796676_n.jpg","483626114_3905804346354672_4947814203864788974_n.jpg"],
  2023: ["486391793_1204914774968754_4187120556714253903_n.jpg","486486773_1205190671607831_1410169000253721011_n.jpg","486521815_1205418928251672_2358366011998475862_n.jpg","487199945_1211099784350253_4575188005132137877_n.jpg","487467112_1207622901364608_6865352587337052808_n.jpg"],
  2024: ["463371772_18355918606140568_4744695927013833805_n.jpg","463804825_18356360029140568_7654846183045292654_n.jpg","472478977_18367230865140568_1914633049692257545_n.jpg","474606365_18369008932140568_134816758567389471_n.jpg","475446368_18369734380140568_5589640984996088199_n.jpg"],
  2025: ["532349583_18394639477140568_5214864160826197594_n.jpg","532477527_18394639489140568_1103862618535903581_n.jpg","532571220_18394639552140568_7512622559856946120_n.jpg","542745726_18397693789140568_3019106228429192123_n.jpg","605846663_18413913451140568_7167808554338203322_n.jpg"],
  2026: ["20260.png","20261.jpg","20262.jpg","20263.png","20264.png"]
};
var EVENTS = [
  {y:"2015", name:"Giochi di Carnasciale", place:"Firenze", photos:["carnasciale1.jpg","carnasciale2.jpg"]},
  {y:"2016", name:"Parata Storica", place:"Città della Pieve (PG)", photos:["pieve1.jpg","pieve2.jpg"]},
  {y:"2025", name:"Corteo Storico", place:"Avigliano (PZ)", photos:["avigliano1.png", "avigliano2.png"]},
  {y:"2025", name:"Vivi il Medioevo", place:"Brienza (PZ)", photos:["brienza1.JPG", "brienza2.png"]},
  {y:"2025", name:"La Notte dei Tamburi", place:"Antrodoco (RT)", photos:["antrodoco1.png", "antrodoco2.png"]},
  {y:"2026", name:"Harmonica", place:"Nepi (VT)", photos:["nepi1.jpg","nepi2.jpg"]},
];
var groups = {};   /* gruppo -> elenco tessere, per il lightbox */

function tile(cls, group, label, photo){
  var b = document.createElement('button');
  b.type = 'button'; b.className = 'tile ' + cls;
  b.setAttribute('aria-label', 'Ingrandisci foto: ' + label);
  b.dataset.label = label; b.dataset.group = group;
  if (photo){
    b.dataset.full = photo.full;
    var img = document.createElement('img'); img.src = photo.thumb; img.alt = label; img.loading = 'lazy';
    b.appendChild(img);
  } else {
    var s = document.createElement('span'); s.textContent = 'foto'; b.appendChild(s);
  }
  (groups[group] = groups[group] || []).push(b);
  return b;
}

var mosaicPattern = ['big','','','wide','wide',''];
var yearsEl = document.getElementById('years'), shown = 0;
for (var y = FIRST; y <= LAST; y++){
  if (SKIP_YEARS[y]) continue;
  var d = document.createElement('div');
  d.className = 'year' + (shown % 2 ? ' flip' : ''); shown++;
  d.innerHTML = '<h3>' + y + '</h3>';
  var m = document.createElement('div'); m.className = 'mosaic';
  var photos = PHOTOS[y];
  var count = photos ? photos.length : mosaicPattern.length;
  for (var i = 0; i < count; i++){
    var cls = mosaicPattern[i % mosaicPattern.length];
    var photo = photos ? {thumb:'foto/web/' + y + '/' + photos[i], full:'foto/' + y + '/' + photos[i]} : null;
    m.appendChild(tile(cls, 'y' + y, y + ' · foto ' + (i + 1), photo));
  }
  d.appendChild(m); yearsEl.appendChild(d);
}

var evEl = document.getElementById('events');
EVENTS.forEach(function(e, k){
  var a = document.createElement('article'); a.className = 'event';
  var p = document.createElement('div'); p.className = 'pics';
  for (var i = 0; i < 2; i++){
    var file = e.photos && e.photos[i];
    var photo = file ? {thumb:'foto/web/trasferte/' + file, full:'foto/trasferte/' + file} : null;
    p.appendChild(tile('', 'e' + k, e.name + ' · foto ' + (i + 1), photo));
  }
  a.appendChild(p);
  var b = document.createElement('div'); b.className = 'body';
  b.innerHTML = '<time>' + e.y + '</time><h3>' + e.name + '</h3><p>' + e.place + '</p>';
  a.appendChild(b); evEl.appendChild(a);
});

/* bandiera che ondeggia, col drappo vero (immagini/web/bandiera.png). amp = ampiezza dell'onda; pole = mostra l'asta. */
var still = window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches;
function wavePath(a){
  var t = 12, b = 192;
  return 'M0,'+t+' C40,'+(t-a)+' 80,'+(t+a)+' 120,'+t+' S180,'+(t-1.6*a)+' 200,'+(t+a)+
    ' L200,'+(b+a)+' C180,'+(b-1.6*a)+' 160,'+(b-a)+' 120,'+b+' C80,'+(b+a)+' 40,'+(b-a)+' 0,'+b+' Z';
}
/* il drappo e' tagliato in tante strisce verticali; ognuna ondeggia in verticale
   con un ritardo diverso dalle vicine, cosi' l'immagine si deforma davvero
   invece di restare piatta dentro un bordo che ondeggia */
function clothStrips(id, a, dur){
  if (still) return '<image href="immagini/web/bandiera.png" x="0" y="-10" width="200" height="220" preserveAspectRatio="xMidYMid slice"/>';
  var N = 12, w = 200, h = 220, sw = w / N, ia = a * .6, margin = Math.ceil(ia) + 4;
  var iy = -10 - margin, ih = h + margin * 2, out = '';
  for (var i = 0; i < N; i++){
    var x = i * sw, cw = sw + 1, cid = 'cs' + id + i, begin = (dur * i / N).toFixed(3);
    var av = '<animateTransform attributeName="transform" type="translate" dur="'+dur+'s" begin="'+begin+'s" repeatCount="indefinite" values="0,'+(-ia)+';0,'+ia+';0,'+(-ia)+'" keyTimes="0;.5;1" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1"/>';
    out += '<clipPath id="'+cid+'"><rect x="'+x+'" y="-10" width="'+cw+'" height="'+h+'"/></clipPath>'+
      '<g clip-path="url(#'+cid+')"><image href="immagini/web/bandiera.png" x="0" y="'+iy+'" width="'+w+'" height="'+ih+'" preserveAspectRatio="xMidYMid slice">'+av+'</image></g>';
  }
  return out;
}
function flagSVG(id, amp, pole, dur){
  var a = amp, vals = wavePath(a)+';'+wavePath(-a)+';'+wavePath(a);
  var anim = still ? '' : '<animate attributeName="d" dur="'+dur+'s" repeatCount="indefinite" values="'+vals+'" keyTimes="0;.5;1" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1"/>';
  var shade = still ? '' : '<animateTransform attributeName="gradientTransform" type="translate" dur="'+dur+'s" repeatCount="indefinite" values="-.25 0;.25 0;-.25 0"/>';
  var vb = pole ? '-14 -4 230 300' : '0 -30 200 260';
  return '<svg viewBox="'+vb+'" aria-hidden="true">'+
    '<defs><clipPath id="c'+id+'"><path d="'+wavePath(a)+'">'+anim+'</path></clipPath>'+
    '<linearGradient id="g'+id+'" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".22"/><stop offset=".3" stop-color="#fff" stop-opacity=".18"/><stop offset=".6" stop-color="#000" stop-opacity=".2"/><stop offset="1" stop-color="#fff" stop-opacity=".12"/>'+shade+'</linearGradient></defs>'+
    (pole ? '<rect x="-6" y="-4" width="8" height="300" rx="3" fill="#fefefe"/><circle cx="-2" cy="-6" r="7" fill="#fefefe"/>' : '')+
    '<g clip-path="url(#c'+id+')">'+clothStrips(id, a, dur)+'<rect width="200" height="220" y="-10" fill="url(#g'+id+')"/></g></svg>';
}
var cart = document.getElementById('cart');
cart.innerHTML = flagSVG('m', 14, true, 1.8);

/* la bandiera-guida scorre lungo la linea del tempo */
var tl = document.getElementById('timeline'), t = null;
function moveCart(){
  var r = tl.getBoundingClientRect(), h = tl.offsetHeight, vh = window.innerHeight;
  var p = (vh * .45 - r.top) / h; p = Math.max(0, Math.min(1, p));
  cart.style.transform = 'translateY(' + (p * (h - cart.offsetHeight)) + 'px)';
  cart.classList.add('moving'); clearTimeout(t);
  t = setTimeout(function(){ cart.classList.remove('moving'); }, 160);
}
window.addEventListener('scroll', moveCart, {passive:true});
window.addEventListener('resize', moveCart);
moveCart();

/* lightbox */
var dlg = document.getElementById('lb'), stage = document.getElementById('lbStage'), cap = document.getElementById('lbCap');
var cur = [], idx = 0;
function show(){
  var b = cur[idx]; stage.innerHTML = '';
  stage.classList.toggle('has-img', !!b.dataset.full);
  if (b.dataset.full){ var im = new Image(); im.src = b.dataset.full; im.alt = b.dataset.label; stage.appendChild(im); }
  else { var s = document.createElement('b'); s.textContent = b.dataset.label; stage.appendChild(s); }
  cap.textContent = (idx + 1) + ' / ' + cur.length;
}
document.addEventListener('click', function(e){
  var b = e.target.closest('.tile'); if (!b) return;
  cur = groups[b.dataset.group]; idx = cur.indexOf(b); show();
  if (dlg.showModal) dlg.showModal();
});
document.getElementById('prev').onclick = function(){ idx = (idx + cur.length - 1) % cur.length; show(); };
document.getElementById('next').onclick = function(){ idx = (idx + 1) % cur.length; show(); };
document.getElementById('close').onclick = function(){ dlg.close(); };
dlg.addEventListener('click', function(e){ if (e.target === dlg) dlg.close(); });
dlg.addEventListener('keydown', function(e){
  if (e.key === 'ArrowLeft') document.getElementById('prev').click();
  if (e.key === 'ArrowRight') document.getElementById('next').click();
});

/* carica lo script di embed di Instagram solo quando la sezione si avvicina alla vista,
   cosi' il tracking di Meta non parte ad ogni caricamento della pagina */
var igSection = document.getElementById('instagram');
if (igSection && 'IntersectionObserver' in window){
  var igObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if (!entry.isIntersecting) return;
      igObserver.disconnect();
      var s = document.createElement('script');
      s.async = true; s.src = 'https://www.instagram.com/embed.js';
      document.body.appendChild(s);
    });
  }, {rootMargin: '200px'});
  igObserver.observe(igSection);
}
