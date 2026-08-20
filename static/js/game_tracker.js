/**
 * GameTracker module
 * Automatically handles CSRF header and sends score & try updates
 * to the backend Flask API (/user/api/tries and /user/api/score).
 */
window.GameTracker = {
  csrfToken: null,

  getCsrfToken() {
    if (this.csrfToken) return this.csrfToken;
    const meta = document.querySelector('meta[name="csrf-token"]');
    if (meta) this.csrfToken = meta.getAttribute('content');
    return this.csrfToken;
  },

  async trackTry(pageKey) {
    if (!pageKey) return;
    try {
      const headers = { 'Content-Type': 'application/json' };
      const token = this.getCsrfToken();
      if (token) headers['X-CSRFToken'] = token;

      const resp = await fetch('/user/api/tries', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ page_key: pageKey })
      });
      if (resp.ok) {
        const data = await resp.json();
        console.log(`[GameTracker] Try tracked for ${pageKey}: ${data.tries} total tries.`);
      }
    } catch (err) {
      console.warn(`[GameTracker] Failed to track try for ${pageKey}:`, err);
    }
  },

  async trackScore(pageKey, score) {
    if (!pageKey || score === undefined || score === null) return;
    try {
      const headers = { 'Content-Type': 'application/json' };
      const token = this.getCsrfToken();
      if (token) headers['X-CSRFToken'] = token;

      const resp = await fetch('/user/api/score', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ page_key: pageKey, score: Math.round(score) })
      });
      if (resp.ok) {
        const data = await resp.json();
        console.log(`[GameTracker] Score ${score} tracked for ${pageKey}: ${data.status}`);
        if (data.status === 'updated' || data.status === 'created') {
          this.showNotification(`🏆 High Score saved: ${data.score} pts!`);
        }
      }
    } catch (err) {
      console.warn(`[GameTracker] Failed to track score for ${pageKey}:`, err);
    }
  },

  showNotification(message) {
    let toast = document.getElementById('gt-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'gt-toast';
      toast.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#28a745;color:white;padding:12px 20px;border-radius:8px;font-weight:bold;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,0.25);transition:opacity 0.4s ease;font-family:sans-serif;';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.opacity = '1';
    toast.style.display = 'block';
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => { toast.style.display = 'none'; }, 400);
    }, 3500);
  }
};
