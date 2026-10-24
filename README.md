# Teacher Growth & Development (TGD) — Frontend

Frontend statis untuk GitHub Pages. Backend: Google Apps Script (REST API).

## Struktur
```
index.html          <- halaman utama (dari Index.html lama + 3 baris tambahan)
js/config.js        <- ISI GAS_URL di sini
js/api.js           <- klien API (fetch ke GAS)
README.md
PANDUAN-INSTALASI.md
```

## Konfigurasi
Buka `js/config.js`, isi `GAS_URL` dengan URL `/exec` Web App Apps Script.

## Update
```
git add .
git commit -m "Deskripsi perubahan"
git push
```
