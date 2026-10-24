# PANDUAN INSTALASI — TGD (Backend GAS REST API + Frontend GitHub Pages)

Ada 3 bagian: **A. Backend**, **B. Siapkan folder frontend**, **C. Deploy ke GitHub Pages**.
Kerjakan berurutan. Database Google Sheets Anda **tidak berubah**, semua data & akun lama tetap dipakai.

---

## A. BACKEND (Google Apps Script)

1. Buka project Apps Script TGD yang sekarang.
2. Ganti seluruh isi **Code.gs** dengan file **Code.gs** terbaru dari saya (Ctrl+A, hapus, paste). Satu-satunya perbedaan dari versi lama: `function doGet() {` kini bernama `function doGetLegacyHtml_() {`.
3. Klik **+** di samping "Files" → **Script** → beri nama `Api` → hapus isi bawaan → paste seluruh isi **Api.gs**. Simpan (Ctrl+S).
4. Pilih fungsi **testApi** di dropdown → ▶ **Run** → buka **Execution log**. Harus muncul:
   - `GET : {"success":true,...}`
   - `Blokir setupSystem ... "Fungsi tidak tersedia."`
   - `Token palsu ... "Sesi berakhir..."`
   - `✅ Semua 50 fungsi whitelist ditemukan.`
   Kalau ada `⚠️ ... TIDAK ditemukan`, kirim screenshot-nya.
5. **Deploy → New deployment** (jangan edit deployment lama, supaya versi lama tetap jadi cadangan):
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Klik **Deploy** → **salin URL yang berakhiran `/exec`**.
6. Cek di browser: buka URL `/exec` tadi. Harus tampil teks JSON `"status":"online"`.

> Setiap kali Anda mengubah kode backend, lakukan **Deploy → Manage deployments → ✏️ → Version: New version → Deploy**.

---

## B. SIAPKAN FOLDER FRONTEND

1. Ekstrak **tgd-frontend.zip**. Folder hasil ekstraksi (`tgd-frontend`) **adalah folder proyek** — di sinilah nanti `git init` dijalankan.
2. `index.html` **sudah ada** di dalam folder ini (sudah termasuk 3 baris tambahan di `<head>`). Tidak ada yang perlu diedit.
3. (dilewati)
4. Buka `js/config.js`, ganti `PASTE_URL_EXEC_DI_SINI` dengan URL `/exec` dari langkah A.5. Contoh:
   ```js
   GAS_URL: 'https://script.google.com/macros/s/AKfycb.../exec',
   ```
5. Isi folder `tgd-frontend` harus seperti ini:
   ```
   index.html
   README.md
   PANDUAN-INSTALASI.md
   js/
     config.js
     api.js
   ```
   Jangan ada file `.gs` di folder ini.

---

## C. DEPLOY KE GITHUB PAGES

Dikerjakan **satu langkah per langkah** sambil saya cek screenshot Anda. Ringkasannya:

1. Pasang Git (`git --version` harus muncul versi).
2. Siapkan akun GitHub, buat repository **Public** baru (jangan centang README/.gitignore/license).
3. Buka PowerShell **di folder `tgd-frontend`**, lalu `dir` — **`index.html` harus terlihat di daftar teratas**. Kalau yang terlihat folder `tgd-frontend` lagi, masuk satu level.
4. Jalankan satu per satu:
   ```
   git init
   git add .
   git commit -m "Upload pertama"
   git branch -M main
   git remote add origin https://github.com/USERNAME/NAMA-REPO.git
   git push -u origin main
   ```
   Saat diminta password, tempel **Personal Access Token** (layar tampak kosong — itu normal).
5. GitHub → repo → **Settings → Pages** → Source: *Deploy from a branch* → Branch **main** / **(root)** → Save. Centang **Enforce HTTPS**.
6. Tunggu 1–2 menit, buka `https://USERNAME.github.io/NAMA-REPO/`.

**Update berikutnya:** `git add .` → `git commit -m "catatan"` → `git push`, lalu Ctrl+Shift+R.

---

## UJI SETELAH ONLINE

- [ ] Halaman login tampil dengan styling lengkap
- [ ] Login admin berhasil, menu admin muncul
- [ ] Login guru: Dashboard, Self-Reflection, Training & IDP terbuka
- [ ] Login supervisor: daftar guru, Competency Assessment & Readiness terbuka
- [ ] Simpan sesuatu (misal KPI), lalu cek di Google Sheets
- [ ] F12 → Console: tidak ada error merah

## MASALAH UMUM

| Gejala | Penyebab | Solusi |
|---|---|---|
| "GAS_URL belum diisi" | config.js belum diubah | Isi URL `/exec`, lalu add-commit-push |
| "Respons server tidak valid" | Deployment bukan *Me / Anyone*, atau belum deploy ulang | Cek pengaturan deploy, buat New version |
| "Tidak dapat terhubung ke server" | URL salah / internet putus | Buka URL `/exec` di browser, harus muncul JSON |
| Halaman 404 | `index.html` tidak di root repo | Lihat isi repo di GitHub; push ulang dari folder yang benar |
| Login ditolak terus | 5× gagal = terkunci 10 menit | Tunggu 10 menit |
| Tampil versi lama | Cache browser | Ctrl+Shift+R |
| Pesan `Fungsi tidak tersedia` | Fungsi baru belum masuk `API_ALLOWED` di Api.gs | Tambahkan nama fungsi ke daftar, deploy New version |

## CATATAN KEAMANAN

- Repo GitHub Pages bersifat publik: hanya berisi HTML/JS dan URL API. **Spreadsheet ID, password, dan data tidak ada di repo.**
- Hanya fungsi di `API_ALLOWED` yang bisa dipanggil dari web. Fungsi pemeliharaan (`setupSystem`, `backupDatabase`, dll) tidak terbuka.
- Pastikan password default **admin / Admin123!** sudah diganti.
- Pemanggilan fungsi baru dari frontend: tambahkan namanya di `API_ALLOWED` (Api.gs).
