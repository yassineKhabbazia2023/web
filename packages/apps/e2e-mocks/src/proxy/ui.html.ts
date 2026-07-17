/**
 * Self-contained HTML page served at `/__proxy__`.
 * Lets the developer switch the proxy mode (passthrough / mock / hybrid / remote-first) and browse
 * the list of recorded mocks. Pure HTML + vanilla JS, no framework or build step required.
 */
export const PROXY_UI_HTML = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Pulse Proxy Devtools</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    * { box-sizing: border-box }
    body { font: 14px/1.4 -apple-system, Segoe UI, Roboto, sans-serif; margin: 0; padding: 24px; background: #0f172a; color: #e2e8f0 }
    h1 { margin: 0 0 16px; font-size: 20px }
    h2 { font-size: 14px; text-transform: uppercase; letter-spacing: .08em; color: #94a3b8; margin: 24px 0 8px }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 16px; margin-bottom: 16px }
    .modes { display: flex; gap: 8px; flex-wrap: wrap }
    button { background: #334155; color: #e2e8f0; border: 1px solid #475569; border-radius: 6px; padding: 8px 14px; cursor: pointer; font: inherit }
    button:hover { background: #475569 }
    button.active { background: #2563eb; border-color: #3b82f6 }
    button.danger { background: #7f1d1d; border-color: #b91c1c }
    button.danger:hover { background: #991b1b }
    .target { color: #94a3b8; font-family: monospace; margin-top: 8px; font-size: 12px; word-break: break-all }
    table { width: 100%; border-collapse: collapse; font-size: 13px }
    th, td { text-align: left; padding: 6px 8px; border-bottom: 1px solid #334155 }
    th { color: #94a3b8; font-weight: 500; text-transform: uppercase; letter-spacing: .06em; font-size: 11px }
    td.path { font-family: monospace; word-break: break-all }
    td.method { font-weight: 600 }
    .method.GET { color: #34d399 } .method.POST { color: #fbbf24 } .method.PUT { color: #60a5fa } .method.DELETE { color: #f87171 } .method.PATCH { color: #c084fc }
    .empty { color: #64748b; font-style: italic; padding: 16px 0 }
    .filter { width: 100%; padding: 8px 10px; border-radius: 6px; border: 1px solid #475569; background: #0f172a; color: #e2e8f0; margin-bottom: 8px; font: inherit }
    .badge { background: #475569; color: #e2e8f0; padding: 2px 8px; border-radius: 999px; font-size: 11px; margin-left: 6px }
  </style>
</head>
<body>
  <h1>Pulse Proxy Devtools</h1>

  <div class="card">
    <h2>Mode</h2>
    <div class="modes">
      <button data-mode="passthrough">Passthrough <span class="badge">record</span></button>
      <button data-mode="mock">Mock only</button>
      <button data-mode="hybrid">Hybrid</button>
      <button data-mode="remote-first">Remote first <span class="badge">fallback</span></button>
    </div>
    <div class="target" id="target"></div>
  </div>

  <div class="card">
    <h2>Recorded mocks <span id="count" class="badge">0</span></h2>
    <input id="filter" class="filter" placeholder="Filter by path or method..." />
    <table>
      <thead>
        <tr><th>Method</th><th>Path</th><th>Status</th><th>Recorded</th><th></th></tr>
      </thead>
      <tbody id="mocks"></tbody>
    </table>
    <div class="empty" id="empty" style="display:none">No recorded mocks yet — run the app in passthrough or hybrid mode.</div>
  </div>

  <script>
    const buttons = document.querySelectorAll('button[data-mode]')
    const mocksBody = document.getElementById('mocks')
    const emptyEl = document.getElementById('empty')
    const countEl = document.getElementById('count')
    const filterEl = document.getElementById('filter')
    const targetEl = document.getElementById('target')
    let allMocks = []

    function renderMode(mode) {
      buttons.forEach((b) => b.classList.toggle('active', b.dataset.mode === mode))
    }

    async function loadMode() {
      const r = await fetch('/__proxy__/mode')
      const j = await r.json()
      renderMode(j.mode)
      targetEl.textContent = 'Target: ' + (j.target || '(not configured)')
    }

    async function setMode(mode) {
      const r = await fetch('/__proxy__/mode', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ mode }),
      })
      const j = await r.json()
      renderMode(j.mode)
    }

    async function loadMocks() {
      const r = await fetch('/__proxy__/mocks')
      allMocks = await r.json()
      renderMocks()
    }

    function renderMocks() {
      const filter = filterEl.value.toLowerCase()
      const filtered = allMocks.filter((m) =>
        filter === '' || m.path.toLowerCase().includes(filter) || m.method.toLowerCase().includes(filter)
      )
      countEl.textContent = String(filtered.length)
      emptyEl.style.display = allMocks.length === 0 ? 'block' : 'none'
      mocksBody.innerHTML = filtered.map((m) => \`
        <tr>
          <td class="method"><span class="method \${m.method}">\${m.method}</span></td>
          <td class="path">\${escapeHtml(m.path)}</td>
          <td>\${m.status}</td>
          <td>\${new Date(m.recordedAt).toLocaleString()}</td>
          <td><button class="danger" data-del="\${m.hash}" data-method="\${m.method}" data-path="\${encodeURIComponent(m.path)}">Delete</button></td>
        </tr>
      \`).join('')
    }

    function escapeHtml(s) {
      return s.replaceAll(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
    }

    buttons.forEach((b) => b.addEventListener('click', () => setMode(b.dataset.mode)))
    filterEl.addEventListener('input', renderMocks)
    mocksBody.addEventListener('click', async (e) => {
      const t = e.target
      if (t.matches('button[data-del]')) {
        const hash = t.dataset.del
        const method = t.dataset.method
        const path = t.dataset.path
        await fetch(\`/__proxy__/mocks?hash=\${hash}&method=\${method}&path=\${path}\`, { method: 'DELETE' })
        await loadMocks()
      }
    })

    loadMode()
    loadMocks()
    setInterval(loadMocks, 3000)
  </script>
</body>
</html>`
