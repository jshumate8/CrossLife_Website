// CrossLife — nav toggle and form handling (Web3Forms)
(function () {
  var WEB3FORMS_KEY = 'b5d7a61a-fa2a-4dfc-8794-bfb8a1d61e65';

  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  document.querySelectorAll('form[data-w3f]').forEach(function (form) {
    var status = form.querySelector('.form-status');
    var button = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      var data = new FormData(form);
      data.append('access_key', WEB3FORMS_KEY);
      if (button) { button.disabled = true; button.dataset.label = button.textContent; button.textContent = 'Sending…'; }
      if (status) { status.textContent = ''; status.className = 'form-status'; }
      try {
        var res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: data });
        var json = await res.json();
        if (!json.success) throw new Error(json.message || 'Submission failed');
        form.reset();
        if (status) { status.textContent = form.dataset.success || 'Thank you — your message has been sent.'; status.className = 'form-status ok'; }
      } catch (err) {
        if (status) { status.textContent = 'Something went wrong. Please try again in a moment.'; status.className = 'form-status err'; }
      } finally {
        if (button) { button.disabled = false; button.textContent = button.dataset.label; }
      }
    });
  });
})();
