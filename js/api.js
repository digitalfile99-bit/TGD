// =====================================================
// TGD API CLIENT — fetch ke GAS REST API
// Menggantikan google.script.run (tidak tersedia di GitHub Pages).
// Semua pemanggilan lama call('namaFungsi', ...) di index.html
// tetap berjalan tanpa perubahan.
// =====================================================
(function () {
  'use strict';

  async function rpc(fn, args) {
    const cfg = window.TGD_CONFIG || {};
    const url = String(cfg.GAS_URL || '').trim();
    if (!url || url.indexOf('PASTE_') === 0) {
      throw new Error('GAS_URL belum diisi di js/config.js.');
    }

    const ctrl = new AbortController();
    const timer = setTimeout(function () { ctrl.abort(); }, cfg.TIMEOUT_MS || 90000);
    let text;
    try {
      const res = await fetch(url, {
        method: 'POST',
        // WAJIB text/plain agar tidak memicu CORS preflight yang diblok GAS
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'rpc', fn: fn, args: args || [] }),
        signal: ctrl.signal
      });
      text = await res.text();
    } catch (e) {
      if (e && e.name === 'AbortError') throw new Error('Server terlalu lama merespons. Silakan coba lagi.');
      throw new Error('Tidak dapat terhubung ke server. Periksa koneksi internet atau GAS_URL.');
    } finally {
      clearTimeout(timer);
    }

    let json;
    try {
      json = JSON.parse(text);
    } catch (e) {
      throw new Error('Respons server tidak valid. Pastikan Web App: Execute as "Me", akses "Anyone", dan sudah di-deploy ulang.');
    }
    if (!json.success) throw new Error(json.message || 'Terjadi kesalahan di server.');
    return json.data;
  }

  // Adaptor: meniru google.script.run.withSuccessHandler().withFailureHandler()[fn](...)
  function runner(ok, fail) {
    return new Proxy({}, {
      get: function (_, prop) {
        if (prop === 'withSuccessHandler') return function (f) { return runner(f, fail); };
        if (prop === 'withFailureHandler') return function (f) { return runner(ok, f); };
        return function () {
          const args = Array.prototype.slice.call(arguments);
          rpc(String(prop), args).then(
            function (d) { if (ok) ok(d); },
            function (e) { if (fail) fail(e); else console.error(e); }
          );
        };
      }
    });
  }

  window.TGD_API = { call: rpc };
  window.google = window.google || {};
  window.google.script = { run: runner(null, null) };
})();
