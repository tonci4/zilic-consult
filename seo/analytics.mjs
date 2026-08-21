import { site } from "./content.mjs";

const { measurementId, siteVerification } = site.analytics;

/* Search Console ownership proof for the https://www.zilic-consult.com/ property. */
export const verificationMeta = `<meta name="google-site-verification" content="${siteVerification}">`;

/* Google Analytics 4 with Consent Mode v2. Storage defaults to denied, so no
   analytics cookie is written until the visitor accepts in the consent banner. */
export const analyticsHead = `<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted',
    wait_for_update: 600
  });
  try {
    if (window.localStorage.getItem('zc-analytics-consent') === 'granted') {
      gtag('consent', 'update', { analytics_storage: 'granted' });
    }
  } catch (error) {}
  gtag('js', new Date());
  gtag('config', '${measurementId}', { anonymize_ip: true });
</script>
<script async src="https://www.googletagmanager.com/gtag/js?id=${measurementId}"></script>`;

/* Consent banner markup and behaviour, injected before the closing body tag. */
export const consentBanner = `<div class="consent" id="consent-banner" role="region" aria-label="Analytics cookies" hidden>
  <div class="consent__inner">
    <p class="consent__text">This site uses Google Analytics to see which pages are useful. Analytics cookies are set only if you accept. Read the <a href="/privacy/">privacy notice</a>.</p>
    <div class="consent__actions">
      <button type="button" class="consent__btn consent__btn--ghost" data-consent="denied">Decline</button>
      <button type="button" class="consent__btn" data-consent="granted">Accept</button>
    </div>
  </div>
</div>
<script>
  (function () {
    var key = 'zc-analytics-consent';
    var banner = document.getElementById('consent-banner');
    if (!banner) return;
    var read = function () {
      try { return window.localStorage.getItem(key) || ''; } catch (error) { return ''; }
    };
    var decided = function (value) { return value === 'granted' || value === 'denied'; };
    if (!decided(read())) banner.hidden = false;
    banner.addEventListener('click', function (event) {
      var target = event.target.closest ? event.target.closest('[data-consent]') : 0;
      if (!target) return;
      var choice = target.getAttribute('data-consent');
      try { window.localStorage.setItem(key, choice); } catch (error) {}
      if (choice === 'granted' && typeof window.gtag === 'function') {
        window.gtag('consent', 'update', { analytics_storage: 'granted' });
      }
      banner.hidden = true;
    });
    document.addEventListener('click', function (event) {
      var trigger = event.target.closest ? event.target.closest('[data-consent-reopen]') : 0;
      if (!trigger) return;
      event.preventDefault();
      banner.hidden = false;
    });
  })();
</script>`;

/* Footer control so a visitor can change or withdraw a stored choice. */
export const consentFooterLink = `<button type="button" class="footer-consent" data-consent-reopen>Cookie settings</button>`;
