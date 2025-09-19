<script>
(async function() {
  function isTokenExpired(token) {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp < Math.floor(Date.now() / 1000);
    } catch {
      return true;
    }
  }

  async function getOrCreateVisitorId() {
    let visitorId = localStorage.getItem('visitorId');
    if (!visitorId) {
      visitorId = crypto.randomUUID();
      localStorage.setItem('visitorId', visitorId);
    }
    return visitorId;
  }

  async function getVisitorToken() {
    const existingToken = localStorage.getItem('visitorSessionToken');
    if (existingToken && !isTokenExpired(existingToken)) return existingToken;

    const visitorId = await getOrCreateVisitorId();
    const siteName = window.location.hostname.replace(/^www\./,'').split('.')[0];

    const res = await fetch('https://cb-server.web-8fb.workers.dev/api/visitor-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitorId, siteName })
    });

    const data = await res.json();
    localStorage.setItem('visitorSessionToken', data.token);
    return data.token;
  }

  const token = await getVisitorToken();
  const visitorId = localStorage.getItem('visitorId');

  console.log('🆔 Visitor ID:', visitorId);
  console.log('🔑 Visitor Token:', token);
})();
</script>
