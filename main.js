(function(){
  var $=function(id){return document.getElementById(id)};
  var burger=$('burger'),menu=$('menu');
  burger.addEventListener('click',function(){
    var o=menu.classList.toggle('open');burger.setAttribute('aria-expanded',o);
  });
  menu.addEventListener('click',function(e){
    if(e.target.tagName==='A'&&e.target.getAttribute('href').charAt(0)==='#')menu.classList.remove('open');
  });
  var dd=$('ddbtn'),dl=$('ddlist');
  dd.addEventListener('click',function(e){e.stopPropagation();var o=dl.classList.toggle('open');dd.setAttribute('aria-expanded',o)});
  document.addEventListener('click',function(){dl.classList.remove('open')});
  // cookie
  var ck=$('cookie');
  try{ if(!localStorage.getItem('cookieOk'))ck.hidden=false; }catch(e){ck.hidden=false}
  $('cookieclose').addEventListener('click',function(){ck.hidden=true;try{localStorage.setItem('cookieOk','1')}catch(e){}});
  // pay buttons
  var links=window.PAY_LINKS||{};
  [].forEach.call(document.querySelectorAll('.pay'),function(a){
    var u=links[a.getAttribute('data-pay')];
    if(u){a.href=u;a.target='_blank';a.rel='noopener'}
  });
  // form
  var f=$('lead'),ok=$('ok'),err=$('err');
  f.addEventListener('submit',function(e){
    e.preventDefault();ok.hidden=err.hidden=true;
    if(!f.checkValidity()){f.reportValidity();return}
    var btn=f.querySelector('button[type=submit]');btn.disabled=true;
    fetch(f.action,{method:'POST',body:new FormData(f)})
      .then(function(r){return r.json()})
      .then(function(j){if(j.ok){ok.hidden=false;f.reset()}else{err.hidden=false}})
      .catch(function(){err.hidden=false})
      .then(function(){btn.disabled=false});
  });
})();
