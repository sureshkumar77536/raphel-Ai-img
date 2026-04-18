// Cloudflare Worker — Raphael Image Generator
// Uses Raphael Basic model (free, unlimited, no auth needed)

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
      return Response.json({ ok: true, model: 'raphael-basic', version: '1.0.0' });
    }

    if (request.method === 'POST' && url.pathname === '/api/generate') {
      return handleGenerate(request);
    }

    if (request.method === 'GET' && url.pathname.startsWith('/api/proxy-image/')) {
      return handleProxyImage(request);
    }

    return new Response('Not Found', { status: 404 });
  },
};

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15',
];

function getRandomUA() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

function getRandomIP() {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

async function generateImage(params) {
  const { prompt, aspect, quantity } = params;
  const ua = getRandomUA();
  const spoofIP = getRandomIP();

  const body = JSON.stringify({
    prompt,
    model_id: 'raphael-basic',
    aspect: aspect || '1:1',
    number_of_images: Math.min(Math.max(parseInt(quantity) || 1, 1), 4),
    isSafeContent: true,
    autoTranslate: true,
  });

  const resp = await fetch('https://raphael.app/api/generate-image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': ua,
      'Origin': 'https://raphael.app',
      'Referer': 'https://raphael.app/',
      'Accept': '*/*',
      'Accept-Language': 'en-US,en;q=0.9',
      'Sec-Ch-Ua': '"Google Chrome";v="135", "Not-A.Brand";v="8"',
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Platform': '"Windows"',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin',
      'X-Forwarded-For': spoofIP,
      'X-Real-IP': spoofIP,
    },
    body,
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`API error ${resp.status}: ${text.slice(0, 200)}`);
  }

  const text = await resp.text();
  const lines = text.trim().split('\n').filter(l => l.trim());
  const images = [];

  for (const line of lines) {
    try {
      const data = JSON.parse(line);
      if (data.url) {
        images.push({
          url: data.url.startsWith('http') ? data.url : `https://raphael.app${data.url}`,
          seed: data.seed || 0,
          width: data.width || 0,
          height: data.height || 0,
        });
      }
    } catch { /* skip non-json lines */ }
  }

  if (images.length === 0) {
    throw new Error('No images generated');
  }

  return { images };
}

async function handleGenerate(request) {
  try {
    const body = await request.json();
    const { prompt, aspect, quantity } = body;

    if (!prompt || prompt.trim().length < 3) {
      return Response.json({ error: 'Prompt must be at least 3 characters' }, { status: 400 });
    }

    const result = await generateImage({ prompt: prompt.trim(), aspect, quantity });

    return Response.json({
      success: true,
      data: result,
    });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

async function handleProxyImage(request) {
  const url = new URL(request.url);
  const imagePath = url.pathname.replace('/api/proxy-image/', '');
  const upstreamUrl = `https://raphael.app/api/proxy-image/${imagePath}${url.search}`;

  const resp = await fetch(upstreamUrl, {
    headers: {
      'User-Agent': getRandomUA(),
      'Referer': 'https://raphael.app/',
    },
  });

  if (!resp.ok) {
    return new Response('Image not found', { status: resp.status });
  }

  const headers = new Headers(resp.headers);
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Cache-Control', 'public, max-age=86400');

  return new Response(resp.body, { headers });
}
