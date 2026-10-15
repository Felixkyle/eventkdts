/* ============================================================
   Kadis mobile navigation
   Builds a hamburger button + slide-in drawer from whatever
   .nav-links markup already exists on the page. Works on every
   page site-wide without needing page-specific menu markup.
   ============================================================ */
(function () {
  function initMobileNav() {
    var nav = document.querySelector('nav');
    if (!nav) return;

    var navLinks = nav.querySelector('.nav-links');
    var navActions = nav.querySelector('.nav-actions');
    if (!navLinks || !navActions) return;

    /* ---- Hamburger button ---- */
    var hamburger = document.createElement('button');
    hamburger.className = 'hamburger';
    hamburger.type = 'button';
    hamburger.setAttribute('aria-label', 'Open menu');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.innerHTML = '<span></span><span></span><span></span>';
    navActions.appendChild(hamburger);

    /* ---- Backdrop + drawer shell ---- */
    var backdrop = document.createElement('div');
    backdrop.className = 'mobile-backdrop';

    var drawer = document.createElement('div');
    drawer.className = 'mobile-drawer';
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-label', 'Site menu');
    drawer.innerHTML =
      '<div class="mobile-drawer-head">' +
        '<span class="mono mobile-drawer-tag">MENU</span>' +
        '<button type="button" class="mobile-drawer-close" aria-label="Close menu">&#10005;</button>' +
      '</div>' +
      '<div class="mobile-drawer-inner"></div>' +
      '<div class="mobile-drawer-foot"></div>';

    document.body.appendChild(backdrop);
    document.body.appendChild(drawer);

    /* ---- Clone the existing nav links into the drawer ---- */
    var drawerInner = drawer.querySelector('.mobile-drawer-inner');
    var clone = navLinks.cloneNode(true);
    drawerInner.appendChild(clone);

    /* Turn each dropdown nav-item into a tap-to-expand accordion.
       The category label itself still links straight to its page;
       a separate chevron button expands the submenu. */
    var items = clone.querySelectorAll(':scope > .nav-item');
    items.forEach(function (item) {
      var link = item.querySelector(':scope > a');
      var drop = item.querySelector(':scope > .nav-drop');
      if (!link || !drop) return;

      var row = document.createElement('div');
      row.className = 'm-row';
      item.insertBefore(row, link);
      row.appendChild(link);

      var chevBtn = document.createElement('button');
      chevBtn.type = 'button';
      chevBtn.className = 'm-chev-btn';
      chevBtn.setAttribute('aria-expanded', 'false');
      chevBtn.setAttribute('aria-label', 'Toggle ' + link.textContent.trim() + ' submenu');
      chevBtn.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
        'stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';
      row.appendChild(chevBtn);

      chevBtn.addEventListener('click', function () {
        var isOpen = item.classList.toggle('open');
        chevBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    });

    /* ---- Drawer footer: reuse the existing CTA buttons ---- */
    var footCtas = drawer.querySelector('.mobile-drawer-foot');
    navActions.querySelectorAll('a.btn-dark, a.btn-primary').forEach(function (btn) {
      footCtas.appendChild(btn.cloneNode(true));
    });

    /* ---- Open / close behaviour ---- */
    function openMenu() {
      drawer.classList.add('open');
      backdrop.classList.add('open');
      hamburger.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.classList.add('no-scroll');
    }
    function closeMenu() {
      drawer.classList.remove('open');
      backdrop.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('no-scroll');
    }

    hamburger.addEventListener('click', function () {
      if (drawer.classList.contains('open')) closeMenu(); else openMenu();
    });
    backdrop.addEventListener('click', closeMenu);
    drawer.querySelector('.mobile-drawer-close').addEventListener('click', closeMenu);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });

    /* Close the drawer whenever an actual link is tapped
       (chevron buttons are <button>, not <a>, so they're unaffected) */
    drawer.addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (a) closeMenu();
    });

    /* If the viewport is resized back up past the breakpoint
       while the drawer is open, close it so state doesn't stick. */
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1100) closeMenu();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileNav);
  } else {
    initMobileNav();
  }
})();