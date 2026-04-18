import { HTML } from './ui.js';

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (request.method === 'GET' && (url.pathname === '/' || url.pathname === '/index.html')) {
      return new Response(HTML, {
        headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-cache' },
      });
    }

    if (url.pathname === '/api/health') {
      return Response.json({ ok: true, model: 'raphael-basic', version: '5.0-top-level' });
    }

    if (request.method === 'POST' && url.pathname === '/api/generate') {
      return handleGenerate(request);
    }

    return new Response('Not Found', { status: 404 });
  },
};

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0'
];

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateIPv4() {
  const octet = () => Math.floor(Math.random() * 254) + 1;
  let a = octet();
  while (a === 10 || a === 127 || a === 192 || a === 172 || a === 104) a = octet();
  return `${a}.${octet()}.${octet()}.${octet()}`;
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function createSession() {
  return { ip: generateIPv4(), ua: pickRandom(USER_AGENTS), cookies: '', deviceId: generateUUID() };
}

async function fetchWithTimeout(url, options, timeoutMs = 35000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const resp = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timer);
    return resp;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

function buildHeaders(session, extra = {}) {
  return {
    'User-Agent': session.ua,
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Origin': 'https://raphael.app',
    'Referer': 'https://raphael.app/',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'cross-site',
    'X-Forwarded-For': session.ip,
    'X-Real-IP': session.ip,
    'Client-IP': session.ip,
    ...(session.cookies ? { 'Cookie': session.cookies } : {}),
    ...extra,
  };
}

// 🛡️ The Ultimate Free Proxy Router (corsproxy.io is completely removed)
function getTargetUrl(basePath, routeIndex) {
  const target = `https://raphael.app${basePath}`;
  if (routeIndex === 0) return target; // Direct attack (Fake IP)
  if (routeIndex === 1) return `https://corsproxy.org/?${encodeURIComponent(target)}`; // Proxy 1
  if (routeIndex === 2) return `https://api.allorigins.win/raw?url=${encodeURIComponent(target)}`; // Proxy 2
  return target;
}

async function getFreshSession(session, routeIndex) {
  const targetUrl = getTargetUrl('/', routeIndex);
  try {
    const resp = await fetchWithTimeout(targetUrl, {
      method: 'GET',
      headers: buildHeaders(session, { 'Accept': 'text/html,application/xhtml+xml' }),
    }, 15000);
    const setCookies = resp.headers.getSetCookie?.() || [];
    if (setCookies.length === 0) {
      const sc = resp.headers.get('set-cookie');
      if (sc) setCookies.push(sc);
    }
    if (setCookies.length > 0) {
      session.cookies = setCookies.map(c => c.split(';')[0]).join('; ');
    }
    return session;
  } catch {
    return session;
  }
}

async function generateFromRaphael(prompt, aspect, quantity) {
  let session = createSession();
  const maxRoutes = 3; // Hum 3 alag raste try karenge (Direct -> Proxy1 -> Proxy2)
  let lastErrorLog = "";

  for (let route = 0; route < maxRoutes; route++) {
    // Har naye raste ke liye naya Fake Identity
    session = createSession(); 
    await getFreshSession(session, route);

    const apiPath = `/api/generate-image?_cb=${Date.now()}`;
    const targetUrl = getTargetUrl(apiPath, route);

    try {
      const resp = await fetchWithTimeout(targetUrl, {
        method: 'POST',
        headers: buildHeaders(session, { 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          prompt,
          model_id: 'raphael-basic',
          aspect: aspect || '1:1',
          number_of_images: Math.min(Math.max(parseInt(quantity) || 1, 1), 4),
          isSafeContent: true,
          autoTranslate: true,
          device_id: session.deviceId,
          client_id: session.deviceId,
          anonymous_id: session.deviceId
        }),
      }, 40000);

      if (resp.ok) {
        const text = await resp.text();
        const lines = text.trim().split('\n').filter(l => l.trim());
        const images = [];
        
        for (const line of lines) {
          try {
            const cleanLine = line.replace(/^data:\s*/, '').trim();
            if (cleanLine === '[DONE]' || !cleanLine) continue;
            const data = JSON.parse(cleanLine);
            if (data.url) {
              images.push({
                url: data.url.startsWith('http') ? data.url : `https://raphael.app${data.url}`,
                seed: data.seed || 0,
              });
            }
          } catch {}
        }
        
        if (images.length === 0) {
          try {
             const fallbackData = JSON.parse(text);
             if (fallbackData.url) images.push({ url: fallbackData.url.startsWith('http') ? fallbackData.url : `https://raphael.app${fallbackData.url}`, seed: fallbackData.seed || 0 });
             else if (fallbackData.images) fallbackData.images.forEach(img => { if(img.url) images.push({ url: img.url.startsWith('http') ? img.url : `https://raphael.app${img.url}`, seed: img.seed||0 }); });
          } catch {}
        }

        if (images.length > 0) return { images };
      } else {
        const errText = await resp.text();
        lastErrorLog = `HTTP ${resp.status} (Route ${route}): ${errText.substring(0, 80)}`;
      }

      await sleep(2000);
    } catch (err) {
      lastErrorLog = `Fetch Error (Route ${route}): ${err.message}`;
      await sleep(1500);
    }
  }

  return { _error: lastErrorLog };
}

async function handleGenerate(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { prompt, aspect, quantity } = body;

  const result = await generateFromRaphael(prompt.trim(), aspect, quantity);

  if (result && result._error) {
    return Response.json({ error: `API Blocks -> ${result._error}` }, { status: 502 });
  }

  if (!result || !result.images || result.images.length === 0) {
    return Response.json({ error: 'Generation failed. No images received.' }, { status: 502 });
  }

  return Response.json({ success: true, data: { images: result.images } });
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}
