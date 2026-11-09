# Info MBG SPPG Cepoko — versi Netlify

Website ini memakai Netlify untuk tampilan, sedangkan Google Spreadsheet tetap menjadi sumber data menu.
Apps Script hanya menjadi API privat-sederhana untuk membaca Spreadsheet dan foto Google Drive.

## Isi folder

- `index.html` — halaman website, desain responsif, jam WIB, menu mingguan, popup foto, zoom, pinch, geser, dan unduh.
- `gas-api/Code.gs` — kode API yang dipasang di project Apps Script yang sudah terhubung ke Spreadsheet.
- `netlify/functions/menu.mjs` — penghubung server-side dari Netlify ke Apps Script.
- `netlify.toml` — konfigurasi Netlify.

## A. Pasang API Apps Script

1. Buka project Apps Script lama yang sekarang terhubung ke Spreadsheet.
2. Simpan/cadangkan kode lama terlebih dahulu.
3. Ganti isi `Code.gs` dengan isi file `gas-api/Code.gs` dari paket ini.
4. Klik **Deploy > New deployment**.
5. Pilih jenis **Web app**.
6. **Execute as:** Me.
7. **Who has access:** Anyone (atau opsi akses publik yang tersedia di akun Anda).
8. Klik Deploy, berikan izin yang diminta, lalu salin URL Web App yang berakhiran `/exec`.
9. Jangan bagikan URL `/exec` di halaman publik secara langsung; URL itu akan disimpan sebagai environment variable Netlify.

Catatan: API hanya mengirim data menu dan gambar. Siapa pun yang dapat membuka website dapat melihat data menu yang memang ditampilkan di website.

## B. Upload website ke Netlify lewat HP Android

Cara yang paling mudah lewat HP adalah melalui GitHub, karena Netlify dapat mengambil file dari repository.

1. Buka https://github.com dan masuk/buat akun.
2. Buat repository baru, misalnya `info-mbg-cepoko`.
3. Upload seluruh isi folder paket ini ke repository dengan struktur folder tetap sama.
4. Buka https://app.netlify.com dan masuk/buat akun.
5. Pilih **Add new project** / **Import an existing project**.
6. Pilih **Deploy with GitHub**, lalu izinkan Netlify mengakses repository `info-mbg-cepoko`.
7. Untuk pengaturan build:
   - Build command: kosongkan
   - Publish directory: `.`
8. Deploy site.

Alternatif: jika dashboard Netlify di HP menyediakan manual deploy, unggah folder hasil ekstrak. Bila unggah folder tidak nyaman di HP, gunakan cara GitHub.

## C. Hubungkan URL Apps Script ke Netlify

1. Buka project website di dashboard Netlify.
2. Masuk ke **Project configuration / Site configuration > Environment variables**.
3. Tambahkan variable:
   - Key: `GAS_WEB_APP_URL`
   - Value: tempel URL Web App Apps Script yang berakhiran `/exec`.
4. Simpan.
5. Jalankan **Trigger deploy > Deploy site** agar function membaca variable baru.

## D. Tes

Buka alamat Netlify yang diberikan. Jika menu gagal dimuat:
- Pastikan URL Apps Script berakhiran `/exec`.
- Pastikan deployment Apps Script memiliki akses yang sesuai.
- Pastikan `GAS_WEB_APP_URL` sudah tersimpan persis.
- Buka `https://ALAMAT-SITUS-NETLIFY/.netlify/functions/menu` untuk melihat apakah API mengembalikan JSON dengan `"ok": true`.

## E. Domain menu.bykaj.my.id

Setelah website Netlify berhasil:
1. Di Netlify buka **Domain management > Add a domain**.
2. Masukkan `menu.bykaj.my.id`.
3. Ikuti instruksi DNS yang ditampilkan Netlify.
4. Di tempat pengelolaan DNS domain `bykaj.my.id`, buat record sesuai instruksi Netlify. Jangan menebak nilai record; salin persis yang ditampilkan dashboard.
5. Tunggu DNS dan HTTPS aktif.

## Catatan penting tentang foto

- Kode Apps Script membaca file gambar dari Google Drive menggunakan akun pemilik deployment.
- Tidak ada kompresi atau pengubahan resolusi file gambar saat dibaca.
- Zoom hanya aktif di popup; gambar awal di halaman tidak diberi transform zoom.
- Tombol unduh mengambil data foto asli yang dikirim API.
- Untuk menghindari respons API terlalu besar, sebaiknya foto yang ditampilkan tidak berukuran file ekstrem. Jangan mengubah resolusi jika memang ingin mempertahankan kualitas.

## Catatan akses

Apps Script Web App harus dapat dipanggil oleh Netlify Function. Jika akun Google Workspace membatasi opsi akses "Anyone", deployment publik mungkin tidak tersedia. Dalam kondisi itu perlu pendekatan autentikasi server-side yang berbeda.
