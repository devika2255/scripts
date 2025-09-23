<!-- Consent Banner -->
<style>
  #consent-banner {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    border-top: 1px solid #ccc;
    padding: 16px;
    box-shadow: 0 -2px 8px rgba(0,0,0,0.1);
    font-family: sans-serif;
    z-index: 9999;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
  }
  #consent-banner button {
    margin-left: 8px;
    padding: 8px 12px;
    cursor: pointer;
  }
  #consent-banner label {
    margin-right: 12px;
    font-size: 14px;
  }
</style>

<div id="consent-banner">
  <div>
    <label><input type="checkbox" name="analytics"> Analytics</label>
    <label><input type="checkbox" name="marketing"> Marketing</label>
    <label><input type="checkbox" name="personalization"> Personalization</label>
  </div>
  <div>
    <button id="consent-save">Save Preferences</button>
  </div>
</div>

<script>
(async function() {
  const banner = document.getElementById('consent-banner');
  const saveBtn = document.getElementById('consent-save');
  const visitorId = localStorage.getItem('visitorId') || ('visitor_' + Date.now());
  localStorage.setItem('visitorId', visitorId);

  async function sendConsent(preferences) {
    try {
      const res = await fetch('https://consentbit-worker.consentapp.workers.dev/api/v2/cmp/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitorId, preferences })
      });
      return res.json();
    } catch (err) {
      console.error('Error sending consent:', err);
    }
  }

  saveBtn.addEventListener('click', async () => {
    const prefs = {
      analytics: banner.querySelector('[name="analytics"]').checked,
      marketing: banner.querySelector('[name="marketing"]').checked,
      personalization: banner.querySelector('[name="personalization"]').checked
    };

    const result = await sendConsent(prefs);
    console.log('Consent saved:', result);
    banner.style.display = 'none'; // hide banner
  });
})();
</script>
