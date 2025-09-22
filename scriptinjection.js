<script>
(function() {
  // --- Generate or retrieve visitor ID ---
  let visitorId = localStorage.getItem('visitorId');
  if (!visitorId) {
    visitorId = crypto.randomUUID();
    localStorage.setItem('visitorId', visitorId);
  }

  // --- Generate or retrieve visitor token ---
  let visitorToken = localStorage.getItem('visitorToken');
  if (!visitorToken) {
    visitorToken = crypto.randomUUID();
    localStorage.setItem('visitorToken', visitorToken);
  }

  // --- Create popup ---
  const popup = document.createElement('div');
  popup.style.position = 'fixed';
  popup.style.top = '20px';
  popup.style.right = '20px';
  popup.style.padding = '15px 20px';
  popup.style.background = '#fff';
  popup.style.border = '2px solid #333';
  popup.style.borderRadius = '8px';
  popup.style.zIndex = 99999;
  popup.style.fontFamily = 'sans-serif';
  popup.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
  popup.style.maxWidth = '300px';
  popup.style.wordBreak = 'break-word';

  popup.innerHTML = `
    <h4 style="margin:0 0 10px 0">Visitor Info</h4>
    <p><b>ID:</b> ${visitorId}</p>
    <p><b>Token:</b> ${visitorToken}</p>
    <button id="closeVisitorPopup" style="margin-top:10px;padding:5px 10px;cursor:pointer;">Close</button>
  `;

  document.body.appendChild(popup);

  // --- Close button ---
  document.getElementById('closeVisitorPopup').onclick = () => popup.remove();
})();




/**
 * Detect visitor location and banner type from your Worker
 * @returns {Promise<{country:string, continent:string, state:string|null, bannerType:string}|null>}
 */
async function detectLocationAndGetBannerType() {
  try {
    // Retrieve the visitor token (optional, for JWT-protected endpoint)
    const visitorToken = localStorage.getItem('visitorToken');

    // Build siteName from hostname
    const siteName = window.location.hostname.replace(/^www\./, '').split('.')[0];

    // API URL
    const apiUrl = `https://consentbit-worker.consentapp.workers.dev/api/v2/cmp/detect-location?siteName=${encodeURIComponent(siteName)}`;

    // Prepare headers
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    if (visitorToken) {
      headers['Authorization'] = `Bearer ${visitorToken}`;
    }

    // Fetch location from Worker
    const response = await fetch(apiUrl, { method: 'GET', headers });

    if (!response.ok) {
      console.warn('Location API request failed', response.status);
      return null;
    }

    const data = await response.json();

    // Check for required fields
    if (!data.bannerType || !data.country || !data.continent) {
      return null;
    }

    // Optional: store globally
    window.currentLocation = {
      country: data.country,
      continent: data.continent,
      state: data.state || null,
      bannerType: data.bannerType
    };

    return window.currentLocation;

  } catch (error) {
    console.error('detectLocationAndGetBannerType error:', error);
    return null;
  }
}

/**
 * Detect visitor location and banner type from your Worker
 * @returns {Promise<{country:string, continent:string, state:string|null, bannerType:string}|null>}
 */
async function detectLocationAndGetBannerType() {
  try {
    // Retrieve the visitor token (optional, for JWT-protected endpoint)
    const visitorToken = localStorage.getItem('visitorToken');

    // Build siteName from hostname
    const siteName = window.location.hostname.replace(/^www\./, '').split('.')[0];

    // API URL
    const apiUrl = `https://consentbit-worker.consentapp.workers.dev/api/v2/cmp/detect-location?siteName=${encodeURIComponent(siteName)}`;

    // Prepare headers
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    if (visitorToken) {
      headers['Authorization'] = `Bearer ${visitorToken}`;
    }

    // Fetch location from Worker
    const response = await fetch(apiUrl, { method: 'GET', headers });

    if (!response.ok) {
      console.warn('Location API request failed', response.status);
      return null;
    }

    const data = await response.json();

    // Check for required fields
    if (!data.bannerType || !data.country || !data.continent) {
      return null;
    }

    // Optional: store globally
    window.currentLocation = {
      country: data.country,
      continent: data.continent,
      state: data.state || null,
      bannerType: data.bannerType
    };

    return window.currentLocation;

  } catch (error) {
    console.error('detectLocationAndGetBannerType error:', error);
    return null;
  }
}
</script>
