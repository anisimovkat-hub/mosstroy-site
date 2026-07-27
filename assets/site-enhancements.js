(function () {
  const storageKey = 'edifice_cookie_consent';

  function saveConsent(value) {
    try {
      window.localStorage.setItem(storageKey, value);
    } catch (error) {
      document.cookie = storageKey + '=' + encodeURIComponent(value) + '; Max-Age=31536000; Path=/; SameSite=Lax';
    }
  }

  function hasConsentChoice() {
    try {
      return Boolean(window.localStorage.getItem(storageKey));
    } catch (error) {
      return document.cookie.split('; ').some(function (item) {
        return item.indexOf(storageKey + '=') === 0;
      });
    }
  }

  function mountCookieNotice() {
    if (hasConsentChoice()) return;

    const notice = document.createElement('aside');
    notice.className = 'cookie-notice';
    notice.setAttribute('role', 'dialog');
    notice.setAttribute('aria-label', 'Настройки файлов cookie');
    notice.innerHTML =
      '<p>Сайт использует только необходимые файлы cookie и локальное хранилище для корректной работы. Подробнее — в <a href="/privacy/">политике конфиденциальности</a>.</p>' +
      '<div class="cookie-actions">' +
      '<button class="cookie-button cookie-button-primary" type="button" data-cookie-choice="accepted">Понятно</button>' +
      '<button class="cookie-button" type="button" data-cookie-choice="necessary">Только необходимые</button>' +
      '</div>';

    notice.addEventListener('click', function (event) {
      const button = event.target.closest('[data-cookie-choice]');
      if (!button) return;
      saveConsent(button.getAttribute('data-cookie-choice'));
      notice.remove();
    });

    document.body.appendChild(notice);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountCookieNotice);
  } else {
    mountCookieNotice();
  }
})();
