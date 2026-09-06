var state={lang:localStorage.getItem("kvr-lang")||"en",filter:"all",kidTab:"kids",barTab:"timeline",quiz:null,qi:0,score:0,deferred:null};
function T(o){return (o&&o[state.lang])?o[state.lang]:(o?o.en||"":"");}
function $(s,r){return (r||document).querySelector(s);}
function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));}
function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function toast(msg){var t=$("#toast");t.textContent=msg;t.hidden=false;clearTimeout(toast._h);toast._h=setTimeout(function(){t.hidden=true;},2200);}
function speak(text){try{var u=new SpeechSynthesisUtterance(text.replace(/[#*_`]/g,""));u.lang="en";u.rate=0.95;speechSynthesis.cancel();speechSynthesis.speak(u);}catch(e){toast("Audio not available");}}
function waShare(text){var url="https://wa.me/?text="+encodeURIComponent(text);window.open(url,"_blank");}
function nativeShare(text){if(navigator.share){navigator.share({text:text}).catch(function(){});}else{waShare(text);}}
function siteUrl(){return location.href.split("#")[0];}

function applyLabels(){
 $("#navHome").textContent=T(UI.navHome);$("#navRights").textContent=T(UI.navRights);
 $("#navKids").textContent=T(UI.navKids);$("#navBar").textContent=T(UI.navBar);
 $("#homeTitle").textContent=T(UI.homeTitle);$("#homeSub").textContent=T(UI.homeSub);
 $("#homeCta1").textContent=T(UI.homeCta1);$("#homeCta2").textContent=T(UI.homeCta2);
 $("#exploreTitle").textContent=T(UI.exploreTitle);
 $("#askLabel").textContent=T(UI.askLabel);$("#askLabel2").textContent=T(UI.askLabel2);
 $("#askBtn").textContent=T(UI.askBtn);$("#askBtn2").textContent=T(UI.askBtn2);
 $("#askInput").placeholder=T(UI.searchPh);$("#askInput2").placeholder=T(UI.searchPh);$("#searchInput").placeholder=T(UI.searchPh);
 $("#rightsTitle").textContent=T(UI.rightsTitle);$("#rightsSub").textContent=T(UI.rightsSub);
 $("#kidsTitle").textContent=T(UI.kidsTitle);$("#kidsSub").textContent=T(UI.kidsSub);
 $("#enfTitle").textContent=T(UI.enfTitle);$("#enfSub").textContent=T(UI.enfSub);
 $("#courtsTitle").textContent=T(UI.courtsTitle);$("#courtsSub").textContent=T(UI.courtsSub);
 $("#barTitle").textContent=T(UI.barTitle);$("#barSub").textContent=T(UI.barSub);
 $("#quizTitle").textContent=T(UI.quizTitle);$("#quizSub").textContent=T(UI.quizSub);
 $("#sosChildText").textContent=T(UI.sosChild);$("#installText").textContent=T(UI.install);
 $("#langBtn").textContent=state.lang.toUpperCase()+" ▾";
 document.documentElement.lang=state.lang;
}

function card(c,opts){
 opts=opts||{};
 var h='<div class="card" id="card-'+c.id+'"><h3>'+c.emoji+' '+esc(T(c.t))+'<span class="tag">'+esc(c.art||"")+'</span></h3>';
 if(c.st&&T(c.st)){h+='<p class="story">“'+esc(T(c.st))+'”'+(state.lang!=="en"?' <small>'+esc(T(UI.storyNote))+'</small>':'')+'</p>';}
 if(c.b)h+='<p>'+esc(T(c.b))+'</p>';
 if(c.d)h+='<div class="do"><strong>✅ What to do:</strong> '+esc(T(c.d))+'</div>';
 if(c.items){h+='<ul class="hier">'+c.items.map(function(i){return '<li>'+esc(T(i.t))+'<span class="sub">'+esc(T(i.s))+'</span></li>';}).join('')+'</ul>';}
 if(c.steps){h+='<ol class="steps">'+c.steps.map(function(s,i){return '<li><strong>'+esc(s.t)+'</strong><span class="sub">'+esc(s.s)+'</span></li>';}).join('')+'</ol>';}
 if(!opts.minimal){
  h+='<div class="card-actions">'+
  '<button class="icon-btn" data-speak="'+esc(c.id)+'">🔊</button>'+
  '<button class="icon-btn" data-wshare="'+esc(c.id)+'">📲</button>'+
  '<span class="fb">'+esc(T(UI.helpful))+' <button data-fb="up" data-id="'+esc(c.id)+'">👍</button> <button data-fb="down" data-id="'+esc(c.id)+'">👎</button></span></div>';
 }
 return h+'</div>';
}
function cardText(c){return T(c.t)+". "+T(c.b||"")+(c.d?" What to do: "+T(c.d):"")+(c.items?" "+c.items.map(function(i){return T(i.t)+": "+T(i.s);}).join(" "):"")+(c.steps?" "+c.steps.map(function(s){return s.t+". "+s.s;}).join(" "):"");}

function renderRights(){
 var cats=[["all","All ⭐"],["equality","🤝"],["life","🔓"],["work","💼"],["everyone","🌍"]];
 $("#rightsChips").innerHTML=cats.map(function(c){return '<button class="chip'+(state.filter===c[0]?' active':'')+'" data-filter="'+c[0]+'">'+c[1]+' '+(c[0]==="all"?T({en:"All",tw:"Nyinaa",ewe:"Katã",ga:"Bɛ"}):"")+'</button>';}).join('');
 var list=DB.rights.filter(function(r){return state.filter==="all"||r.cat===state.filter;});
 $("#rightsList").innerHTML=list.map(card).join("");
}
function renderEnf(){$("#enfList").innerHTML=DB.enforcement.map(card).join("");}
function renderCourts(){$("#courtsList").innerHTML=LAW.courts.map(function(c,i){var o={id:"ct"+i,emoji:c.emoji,art:c.art,t:c.t,b:c.b,d:c.d};return card(o,{minimal:true});}).join("");}
function renderKids(){
 $$("#kidsTabs .chip").forEach(function(b){b.classList.toggle("active",b.getAttribute("data-kidtab")===state.kidTab);});
 var arr=state.kidTab==="kids"?DB.kids.kids:DB.kids.adults;
 var wrap=$("#kidsContent");
 wrap.className="cards"+(state.kidTab==="kids"?" kid-theme kid-big":"");
 wrap.innerHTML=arr.map(function(c){var o={id:c.id,emoji:c.emoji,art:c.art,t:c.t,b:c.b,d:c.d};return card(o,{minimal:state.kidTab==="kids"});}).join("");
}
function renderBar(){
 $("#barChips").innerHTML=BAR_LABELS.map(function(l,i){
  var ids=["timeline","entry","study","types","courts","after","mindset"];
  var key=ids[i];
  return '<button class="chip'+(state.barTab===key?' active':'')+'" data-bartab="'+key+'">'+T(l)+'</button>';
 }).join("");
 var c;
 if(state.barTab==="courts"){c={id:"courts-ref",emoji:"🏛️",art:"Court explorer",t:{en:"The Court System",tw:"Asɛnnibea",ewe:"ŋkɔwo",ga:"Kwe"},b:{en:"Tap a level to learn. Start small and rise.",tw:"Firi ketewa mu kɔ kɛseɛ.",ewe:"Tso ete va ɖo dzixɔxɔ.",ga:"Ba nana ba"}};
  $("#barContent").innerHTML=card(c,{minimal:true})+LAW.courts.map(function(x,i){return card({id:"bc"+i,emoji:x.emoji,art:x.art,t:x.t,b:x.b,d:x.d},{minimal:true});}).join("");
 }else{
  c=LAW.bar.find(function(b){return b.id===state.barTab;})||LAW.bar[0];
  $("#barContent").innerHTML=card(c);
 }
}

var QUIZ_NAMES=[{id:"rights",e:"⚖️"},{id:"bar",e:"🎓"},{id:"kids",e:"🧒"}];
function renderQuizPicker(){
 $("#quizPicker").innerHTML=QUIZZES.map(function(q){var def=QUIZZES.find(function(z){return z.id===q.id;});return '<button class="qlink" data-quiz="'+q.id+'"><span>'+q.e+'</span>'+esc(T(def.t))+'</button>';}).join("");
 $("#quizPicker").hidden=false;$("#quizRunner").hidden=true;
}
function startQuiz(id){
 state.quiz=id;state.qi=0;state.score=0;
 var def=QUIZZES.find(function(z){return z.id===id;});
 $("#quizPicker").hidden=true;$("#quizRunner").hidden=false;
 drawQuiz(def);
}
function drawQuiz(def){
 var q=def.qs[state.qi];
 var h='<div class="card"><p class="quiz-q">Q'+(state.qi+1)+'/'+def.qs.length+' — '+esc(q.q)+'</p><div class="quiz-opts">'+
 q.o.map(function(o,i){return '<button data-opt="'+i+'">'+esc(o)+'</button>';}).join("")+'</div></div>';
 $("#quizRunner").innerHTML=h;
 $$("#quizRunner .quiz-opts button").forEach(function(b){b.onclick=function(){answer(def,b);};});
}
function answer(def,btn){
 var q=def.qs[state.qi];var pick=+btn.getAttribute("data-opt");
 $$("#quizRunner .quiz-opts button").forEach(function(b,i){b.disabled=true;if(i===q.a)b.classList.add("correct");});
 if(pick!==q.a){btn.classList.add("wrong");}else{state.score++;}
 var h='<div class="card"><p><strong>'+(pick===q.a?"✅ Correct!":"❌ Not quite.")+'</strong> '+esc(q.x)+'</p><button class="btn primary" id="nextQ">'+(state.qi+1<def.qs.length?"Next ▶":"See score 🏁")+'</button></div>';
 $("#quizRunner").insertAdjacentHTML("beforeend",h);
 $("#nextQ").onclick=function(){state.qi++;if(state.qi<def.qs.length)drawQuiz(def);else finishQuiz(def);};
}
function finishQuiz(def){
 var msg=state.score===def.qs.length?"🏆 Perfect! You know your rights!":state.score>=def.qs.length/2?"🎉 Well done! Keep learning.":"💪 Good start — try again!";
 $("#quizRunner").innerHTML='<div class="card quiz-score"><p class="big">'+state.score+'/'+def.qs.length+'</p><p>'+msg+'</p><button class="btn primary" id="againBtn">🔄 Play again</button> <button class="btn" id="backBtn">Back</button></div>';
 $("#againBtn").onclick=function(){startQuiz(def.id);};
 $("#backBtn").onclick=renderQuizPicker;
}

var SEARCH_INDEX=[];
function buildIndex(){
 SEARCH_INDEX=[];
 function add(view,id,title,text,extra){
  SEARCH_INDEX.push({view:view,id:id,title:title,text:(title+" "+text+" "+(extra||"")).toLowerCase()});
 }
 DB.rights.forEach(function(r){add("rights",r.id,T(r.t),T(r.b)+" "+T(r.d)+" "+T(r.st),r.art);});
 DB.enforcement.forEach(function(r){add("enforcement",r.id,T(r.t),T(r.b)+" "+T(r.d),r.art);});
 DB.kids.kids.concat(DB.kids.adults).forEach(function(r){add("children",r.id,T(r.t),T(r.b),r.art);});
 LAW.courts.forEach(function(r){add("courts",r.id,T(r.t),T(r.b),r.art);});
 LAW.bar.forEach(function(r){add("bar",r.id,T(r.t),(r.items||[]).map(function(i){return T(i.t)+" "+T(i.s);}).join(" "),(r.steps||[]).map(function(s){return s.t+" "+s.s;}).join(" "));});
}
function doSearch(q){
 var out=[];q=q.toLowerCase().trim();
 if(q.length<2)return out;
 SEARCH_INDEX.forEach(function(i){
  var sc=0;
  q.split(/\s+/).forEach(function(w){if(i.text.indexOf(w)>-1)sc+=w.length>3?2:1;if(i.title.indexOf(w)>-1)sc+=3;});
  if(sc>0)out.push({item:i,sc:sc});
 });
 return out.sort(function(a,b){return b.sc-a.sc;}).slice(0,12);
}
function showSearchResults(q){
 var res=doSearch(q);
 $("#searchResults").innerHTML=res.length?res.map(function(r){
  return '<div class="card" data-goto="'+r.item.view+'" data-goto-id="'+r.item.id+'" style="cursor:pointer"><h3>🔍 '+esc(r.item.title)+'</h3></div>';
 }).join(""):'<div class="card"><p>No results for "'+esc(q)+'".</p></div>';
}
function ask(q,el){
 var ql=q.toLowerCase().trim();
 var best=null,bestSc=0;
 QA.forEach(function(a){
  var sc=0;a.kw.forEach(function(k){if(ql.indexOf(k)>-1)sc+=2;});
  if(sc>bestSc){bestSc=sc;best=a;}
 });
 if(best){el.innerHTML='<div class="card"><h3>💡 Answer</h3><p>'+esc(best.a)+'</p></div>';speakOff();}
 else{
  var res=doSearch(ql).slice(0,3);
  el.innerHTML=res.length?res.map(function(r){return '<div class="card" data-goto="'+r.item.view+'" data-goto-id="'+r.item.id+'" style="cursor:pointer"><h3>🔍 '+esc(r.item.title)+'</h3></div>'}).join(""):'<div class="card"><p>Try asking about: arrest, police, child, land, salary, lawyer, court…</p></div>';
 }
}
function speakOff(){}

function go(view,id){
 $$(".view").forEach(function(v){v.hidden=v.id!=="view-"+view;});
 $$(".bottom-nav button").forEach(function(b){b.classList.toggle("active",b.getAttribute("data-nav")===view);});
 window.scrollTo({top:0,behavior:"instant"});
 if(view==="rights")renderRights();
 if(view==="enforcement")renderEnf();
 if(view==="courts")renderCourts();
 if(view==="children")renderKids();
 if(view==="bar")renderBar();
 if(view==="quiz")renderQuizPicker();
 if(view==="home")rotateFacts(true);
 if(id){setTimeout(function(){var t=$("#card-"+id);if(t){t.scrollIntoView({block:"center"});t.style.outline="3px solid var(--gold)";setTimeout(function(){t.style.outline="";},1600);}},60);}
}
var FACTS_I=0,FACTS_H=null;
function rotateFacts(reset){
 if(reset){clearInterval(FACTS_H);FACTS_I=0;}
 var f=DB.facts[FACTS_I%DB.facts.length];$("#factText").textContent=T(f);
 FACTS_I++;clearInterval(FACTS_H);FACTS_H=setInterval(function(){var f2=DB.facts[FACTS_I%DB.facts.length];$("#factText").textContent=T(f2);FACTS_I++;},7000);
}
function setLang(l){
 state.lang=l;localStorage.setItem("kvr-lang",l);
 applyLabels();buildIndex();renderRights();renderEnf();renderCourts();renderKids();renderBar();renderQuizPicker();rotateFacts(true);
 $("#langMenu").hidden=true;
 toast(l.toUpperCase()+" ✓");
}

document.addEventListener("click",function(e){
 var n=e.target.closest("[data-nav]");
 if(n){go(n.getAttribute("data-nav"));return;}
 var f=e.target.closest("[data-filter]");
 if(f){state.filter=f.getAttribute("data-filter");renderRights();return;}
 var kt=e.target.closest("[data-kidtab]");
 if(kt){state.kidTab=kt.getAttribute("data-kidtab");renderKids();return;}
 var bt=e.target.closest("[data-bartab]");
 if(bt){state.barTab=bt.getAttribute("data-bartab");renderBar();return;}
 var qz=e.target.closest("[data-quiz]");
 if(qz){startQuiz(qz.getAttribute("data-quiz"));return;}
 var gt=e.target.closest("[data-goto]");
 if(gt){go(gt.getAttribute("data-goto"),gt.getAttribute("data-goto-id"));$("#searchOverlay").hidden=true;return;}
 var sp=e.target.closest("[data-speak]");
 if(sp){var id=sp.getAttribute("data-speak");var c=findCard(id);if(c)speak(cardText(c));return;}
 var ws=e.target.closest("[data-wshare]");
 if(ws){var id2=ws.getAttribute("data-wshare");var c2=findCard(id2);if(c2)waShare("⚖️ KNOW YOUR RIGHTS GH 🇬🇭\n\n"+T(c2.t)+" ("+(c2.art||"")+")\n\n"+T(c2.b||"")+"\n\n👉 "+siteUrl());return;}
 var fb=e.target.closest("[data-fb]");
 if(fb){var n=localStorage.getItem("kvr-fb-"+fb.getAttribute("data-id")+"-"+fb.getAttribute("data-fb"));localStorage.setItem("kvr-fb-"+fb.getAttribute("data-id")+"-"+fb.getAttribute("data-fb"),(+n||0)+1);toast(fb.getAttribute("data-fb")==="up"?"👍 +1":"👎 noted");return;}
});
function findCard(id){
 var all=DB.rights.concat(DB.enforcement,DB.kids.kids,DB.kids.adults,LAW.courts,LAW.bar);
 for(var i=0;i<all.length;i++){if(all[i].id===id)return all[i];}
 return null;
}
function wire(){
 $("#langBtn").onclick=function(e){e.stopPropagation();$("#langMenu").hidden=!$("#langMenu").hidden;};
 $$("#langMenu button").forEach(function(b){b.onclick=function(){setLang(b.getAttribute("data-lang"));};});
 $("#searchBtn").onclick=function(){$("#searchOverlay").hidden=false;$("#searchInput").focus();};
 $("#searchClose").onclick=function(){$("#searchOverlay").hidden=true;};
 $("#searchInput").addEventListener("input",function(){showSearchResults(this.value);});
 $("#askBtn").onclick=function(){ask($("#askInput").value,$("#askResult"));};
 $("#askInput").addEventListener("keydown",function(e){if(e.key==="Enter")ask(this.value,$("#askResult"));});
 $("#askBtn2").onclick=function(){ask($("#askInput2").value,$("#askResult2"));};
 $("#askInput2").addEventListener("keydown",function(e){if(e.key==="Enter")ask(this.value,$("#askResult2"));});
 $("#shareSiteBtn").onclick=function(){nativeShare("⚖️ Know Your Rights Ghana — learn your rights, kids' rights, the courts and how to become a lawyer. Free & works offline 🇬🇭\n"+siteUrl());};
 $("#reportBtn").onclick=function(){waShare("📩 Correction report (Know Your Rights Ghana)\nSection: \nError: \n");};
 $("#sosSpeak").onclick=function(){var txt=DB.sos.rights.map(function(r){return T(r.t)+". "+T(r.b);}).join(" ");speak("Your rights if arrested. "+txt);};
 $("#sosList").innerHTML=DB.sos.rights.map(function(r){return card(r,{minimal:false});}).join("");
 $("#sosContacts").innerHTML='<div class="card"><h3>📞 Emergency contacts</h3>'+DB.sos.contacts.map(function(c){return '<button class="contact-btn">'+esc(T(c))+'</button>';}).join("")+'</div>';
 document.body.addEventListener("click",function(e){if(!e.target.closest(".topbar"))$("#langMenu").hidden=true;});
 window.addEventListener("beforeinstallprompt",function(e){e.preventDefault();state.deferred=e;$("#installBanner").hidden=false;});
 $("#installBtn").onclick=function(){if(state.deferred){state.deferred.prompt();state.deferred=null;}$("#installBanner").hidden=true;};
 $("#installDismiss").onclick=function(){$("#installBanner").hidden=true;};
 if("serviceWorker" in navigator&&location.protocol.startsWith("http")){navigator.serviceWorker.register("sw.js").catch(function(){});}
}
wire();applyLabels();buildIndex();renderRights();renderEnf();renderCourts();renderKids();renderBar();renderQuizPicker();rotateFacts(true);
