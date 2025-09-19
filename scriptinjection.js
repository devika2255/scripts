<script>
(async function() {
  // --- Helper: Check if token is expired ---
  function isTokenExpired(token) {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1] || ''));
      return !payload.exp || payload.exp < Math.floor(Date.now() / 1000);
    } catch {
      return true;
    }
  }

  // --- Helper: Generate or get visitor ID ---
  async function getOrCreateVisitorId() {
    let visitorId = localStorage.getItem('visitorId');
    if (!visitorId) {
      visitorId = crypto.randomUUID();
      localStorage.setItem('visitorId', visitorId);
    }
    return visitorId;
  }

  // --- Helper: Clean hostname ---
  function cleanHostname(hostname) {
    return hostname.replace(/^www\./, '').split('.')[0];
  }

  // --- Clear visitor session ---
  function clearVisitorSession() {
    localStorage.removeItem('visitorId');
    localStorage.removeItem('visitorSessionToken');
  }

  let tokenRequestInProgress = false;

  // --- Generate or fetch visitor token ---
  async function getVisitorSessionToken() {
    try {
      const existingToken = localStorage.getItem('visitorSessionToken');
      if (existingToken && !isTokenExpired(existingToken)) return existingToken;

      if (tokenRequestInProgress) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const token = localStorage.getItem('visitorSessionToken');
        if (token && !isTokenExpired(token)) return token;
      }

      tokenRequestInProgress = true;

      const visitorId = await getOrCreateVisitorId();
      const siteName = cleanHostname(window.location.hostname);

      const response = await fetch('https://cb-server.web-8fb.workers.dev/api/visitor-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitorId, siteName })
      });

      if (!response.ok) {
        clearVisitorSession();
        throw new Error('Failed to fetch visitor token');
      }

      const data = await response.json();

      // ✅ Store both visitor ID and token in localStorage
      localStorage.setItem('visitorId', visitorId);
      localStorage.setItem('visitorSessionToken', data.token);

      return data.token;
    } catch (err) {
      console.error('Error generating visitor token:', err);
      return null;
    } finally {
      tokenRequestInProgress = false;
    }
  }

  // --- Execute ---
  const token = await getVisitorSessionToken();
  const visitorId = localStorage.getItem('visitorId');
  if (token && visitorId) {
    console.log('🆔 Visitor ID:', visitorId);
    console.log('🔑 Visitor Token:', token);
  }
})();
</script>
