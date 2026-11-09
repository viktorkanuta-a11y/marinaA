(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var burger = $('.js-burger'), menu = $('.js-menu');
  function setMenu(on) {
    if (!burger || !menu) return;
    burger.classList.toggle('js-burger_open', on);
    menu.classList.toggle('js-menu_open', on);
    var hd = $('#header'); if (hd) hd.classList.toggle('menu-open', on);
  }
  if (burger) burger.addEventListener('click', function () { setMenu(!menu.classList.contains('js-menu_open')); });
  $$('.s-header-type-1__link, .s-header-type-1__button, .sb-submenu-value').forEach(function (a) {
    a.addEventListener('click', function () { if (!a.closest('.sb-submenu-link') || a.classList.contains('sb-submenu-value')) setMenu(false); });
  });
  $$('.sb-submenu-link').forEach(function (li) {
    var head = $('.s-header-type-1__link', li);
    if (!head || !$('.sb-submenu-dropdown', li)) return;
    head.addEventListener('click', function (e) { e.preventDefault(); li.classList.toggle('sb-submenu-link_active'); });
  });
  $$('[data-pay]').forEach(function (b) {
    b.addEventListener('click', function (e) {
      var url = (window.PAY_LINKS || {})[b.getAttribute('data-pay')];
      if (url) { e.preventDefault(); window.location.href = url; }
    });
  });
  var bar = $('.js-banner-open');
  try { if (bar && localStorage.getItem('cookie_ok')) bar.classList.remove('js-banner-open'); } catch (e) {}
  var close = $('.js-footer-close');
  if (close && bar) close.addEventListener('click', function () {
    bar.classList.remove('js-banner-open');
    try { localStorage.setItem('cookie_ok', '1'); } catch (e) {}
  });
  var hdr = $('#header');
  var sc = function () { if (hdr) hdr.classList.toggle('sb-fixed-block_scrolled', window.scrollY > 0); };
  window.addEventListener('scroll', sc, { passive: true }); sc();
  var up = $('.s-back-to-top__image');
  if (up) {
    window.addEventListener('scroll', function () { up.classList.toggle('s-back-to-top__image_hidden', window.scrollY < 600); }, { passive: true });
    up.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }
  $$('.sb-input, .sb-textarea').forEach(function (box) {
    var f = $('.sb-input__field, .sb-textarea__field', box);
    var cls = box.classList.contains('sb-input') ? 'sb-input_active' : 'sb-textarea_active';
    var upd = function () { box.classList.toggle(cls, !!f.value || document.activeElement === f); };
    f.addEventListener('focus', upd); f.addEventListener('blur', upd); f.addEventListener('input', upd); upd();
  });
  var form = $('#lead');
  if (form) {
    var ok = $('[data-status-success]', form), errs = $$('[data-status-error]', form);
    var show = function (n) { [ok].concat(errs).forEach(function (x) { x.style.display = 'none'; }); if (n) n.style.display = 'block'; };
    show(null);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var agree = $('[data-agreement]', form);
      if (!form.checkValidity()) { form.reportValidity(); return; }
      if (agree && !agree.checked) { errs[1].textContent = 'Нужно согласие на обработку персональных данных.'; show(errs[1]); return; }
      var btn = $('input[type=submit]', form); btn.disabled = true;
      fetch(form.action, { method: 'POST', body: new FormData(form) })
        .then(function (r) { return r.json(); })
        .then(function (j) { if (j && j.ok) { show(ok); form.reset(); $$('.sb-input_active,.sb-textarea_active', form).forEach(function (b) { b.classList.remove('sb-input_active', 'sb-textarea_active'); }); } else show(errs[0]); })
        .catch(function () { show(errs[0]); })
        .then(function () { btn.disabled = false; });
    });
  }
})();
