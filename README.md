# Zaenal Syamsyul Arief — Editorial Portfolio

Portofolio Data & AI Engineer berbahasa Inggris dengan halaman pembuka tipografis, latar kertas hangat, teks charcoal, dan navigasi Work / About / Contact. Studi kasus, profil, CV, dan kontak tersedia sebagai HTML; sapuan warna pada tautan, reveal teks bertahap, dan transisi halaman menghormati reduced motion dari OS. Penanda peran memakai teks tebal hijau, dan lokasi ditampilkan pada footer.

## Menjalankan dan memeriksa

Gunakan Node.js minimal 20.9 dan npm. Alur ini memakai `package-lock.json`.

```sh
npm ci
npm run dev -- --port 3000
```

Pratinjau development: `http://localhost:3000` (alias `http://127.0.0.1:3000` juga didukung). `allowedDevOrigins` secara eksplisit mengizinkan host loopback `127.0.0.1` agar koneksi HMR dan hydration tidak ditolak. Untuk menjalankan build produksi dan pengujian pada port 3001:

```sh
npm run validate:content
npm run test:content
npm run test:contact
npx tsc --noEmit
npm run lint
npm run build
npm start -- --port 3001
# Jalankan di terminal terpisah setelah server siap:
npx playwright install chromium
npm run test:browser
```

`build` memvalidasi konten sebelum `next build`. `PLAYWRIGHT_BASE_URL` dapat mengganti alamat server pengujian; `PLAYWRIGHT_CHROMIUM_EXECUTABLE` dapat menunjuk Chromium yang sudah terpasang. Runner browser tidak memulai atau menghentikan server pengguna.

## Arsitektur dan rute

Next.js 16.4.5 App Router, React 18, TypeScript, CSS variables, dan Tailwind CSS. Instrument Serif regular/italic dimuat lokal melalui `next/font/local`; lisensi SIL Open Font License 1.1 disimpan di `public/fonts/InstrumentSerif-OFL.txt`. Inter lokal dipakai untuk teks pendamping. Dependensi dan engine Three.js/Rapier telah dihapus dari website ini.

| Rute | Isi |
| --- | --- |
| `/` | Pembuka tipografis dan navigasi utama |
| `/work` | Empat karya unggulan dan karya pendukung |
| `/about` | Profil, pengalaman, pendidikan, kredensial, keahlian |
| `/contact` | Email yang membuka formulir internal, LinkedIn, GitHub, dan tautan CV |
| `/contact/message` | Formulir nama, email, subjek, dan pesan; noindex |
| `POST /api/contact` | Validasi server dan pengiriman melalui Gmail SMTP |
| `/projects/modnance` | Asisten keuangan percakapan |
| `/projects/stuntlytics` | Workspace analitik dan decision support |
| `/projects/mycareai` | Emotion-aware AI assistant |
| `/projects/data-pipeline-sentiment-analysis` | Validator Panel / Social Data Validator |
| `/projects/hybrid-recommendation-system` | Hybrid Recommender |
| `/cv` | Redirect ke CV PDF lokal yang sebenarnya |
| `/sitemap.xml`, `/robots.txt` | Metadata distribusi; mengikuti kebijakan deployment |

URL proyek lama dipertahankan. Migrasi hash lama berjalan di browser pada beranda: `#work` / `#projects` menuju `/work`, `#work-[slug]` menuju anchor karya, `#about` menuju `/about`, `#experience` / `#skills` menuju bagian terkait pada `/about`, dan `#contact` menuju `/contact`. URL proyek tidak dikenal atau draft menghasilkan 404. Navigasi utama memakai URL halaman langsung.

Modul utama: `lib/portfolio-data.ts` untuk authoring; `lib/content-validation.mjs` untuk aturan; `components/case-study.tsx` untuk narasi/bukti/galeri; `components/legacy-anchors.tsx` untuk migrasi hash; `lib/deployment.ts` untuk canonical dan indexing.

## Formulir kontak dan Gmail SMTP

Klik alamat email pada Contact membuka `/contact/message`. Pengunjung mengisi nama, email balasan, subjek, dan pesan, lalu mengirim dari website. Tautan CV berada pada Contact; tombol salin email telah dihapus.

`components/contact-form.tsx` mengirim ke endpoint same-origin `/api/contact`; `lib/contact-service.mjs` memvalidasi input dan mengirim melalui Nodemailer ke **smtp.gmail.com:465 dengan TLS**. Penerima tetap **zaenalsyamsyularief@gmail.com**, ditetapkan server dari `siteConfig.email`, dan tidak dapat diganti oleh input pengunjung. Form HTML native memakai endpoint yang sama, lalu kembali dengan status hasil.

Server membatasi ukuran input, memeriksa origin, menolak honeypot, dan memakai pembatas frekuensi per proses. Pembatas tersebut bukan kuota terdistribusi lintas instance. Status `sent` berarti server SMTP menerima pesan untuk dikirim. Bila konfigurasi belum tersedia, API mengembalikan **HTTP 503 / `configuration_required`**; form native kembali dengan status `unavailable`. Kegagalan autentikasi, koneksi, atau pengiriman menjadi error dan tidak dilaporkan sebagai sukses.

Konfigurasi lokal berada pada `.env.local`, yang diabaikan Git; `.env.example` menyediakan template tanpa secret:

```dotenv
GMAIL_USER=zaenalsyamsyularief@gmail.com
GMAIL_APP_PASSWORD=
```

Pemilik mengisi `GMAIL_APP_PASSWORD` secara lokal setelah membuat App Password Google untuk aplikasi ini. Google mensyaratkan 2-Step Verification; beberapa jenis akun tidak menyediakan opsi App Password. Gunakan App Password tersebut, bukan password akun Google utama, dan jangan kirim nilainya melalui chat. [Panduan resmi Google](https://support.google.com/mail/answer/185833) menjelaskan persyaratan dan pembuatannya. Restart server setelah konfigurasi environment berubah.

Kedua variabel hanya dibaca server dan tidak memakai awalan `NEXT_PUBLIC_`. Pada deployment Vercel, tambahkan `GMAIL_USER` dan `GMAIL_APP_PASSWORD` melalui Environment Variables untuk environment yang digunakan, lalu redeploy. `.env.local` pada komputer tidak otomatis menjadi konfigurasi hosting. [Panduan environment Vercel](https://vercel.com/docs/environment-variables).

**Pemilik menunda pengisian App Password; autentikasi dan pengiriman email aktual belum terverifikasi.** Pemeriksaan read-only berhasil melakukan handshake TLS terverifikasi ke Gmail SMTP, tetapi tidak melakukan autentikasi atau mengirim pesan. Tes otomatis memakai transport tiruan; kelulusan tes tidak membuktikan pesan sudah masuk Gmail.

Catatan historis: satu percobaan FormSubmit berakhir HTTP 504. Integrasi aktif kini Gmail SMTP, tanpa retry atau fallback FormSubmit otomatis.

## Konten, sumber, dan aset

Empat unggulan berurutan: **Modnance**, **StuntLytics**, **MyCareAI**, dan **Validator Panel**. Validator Panel dan Social Data Validator adalah tool internship NoLimit yang sama, sehingga memakai satu slug. Regional Risk Intelligence adalah modul pemetaan StuntLytics dan menunjuk repository yang sama; tidak dihitung sebagai proyek independen. MyCareAI menautkan capstone asli dan ekstensi tesis secara terpisah; StuntLytics menautkan workspace baru dan versi hackathon asli.

Pilihan arsip GitHub setelah pencocokan README dan kode: **AgriMind**, **Customer Support Agent**, **LLM adaptation experiments**, **Research Agent**, **Price Tracker**, dan **Fashion Product ETL**. Hybrid Recommender tetap memiliki studi kasus pendukung. PlantApp-Detect tidak dipilih karena repository publiknya kosong. Price Tracker diberi konteks mock fallback; notebook fine-tuning dan ETL tetap dijelaskan sebagai eksperimen atau proyek belajar. Modnance dan pekerjaan internal NoLimit tidak diberi tautan repository yang belum tersedia.

`lib/portfolio-data.ts` dibatasi dengan `server-only`. Halaman dan props client hanya memakai `publishedProjects` / `featuredProjects`: draft, bukti belum terverifikasi, dan `confirmationNotes` authoring tidak dikirim ke payload publik. Metrik publik berasal dari bukti terverifikasi dengan konteks dan sumber. Klaim akurasi MyCareAI 92% tetap internal dan tidak ditampilkan sebagai hasil publik.

Setiap proyek menyimpan periode/status, narasi, implementasi, keputusan, hasil, batasan, stack, tautan, media berdimensi, dan galeri opsional. Validator menolak bidang wajib kosong, slug/order duplikat, file hilang, protokol tidak aman, referensi tidak valid, tanggal tidak konsisten, dan kebocoran authoring/bukti.

Sumber pemilik yang ditinjau: `CV_Zaenal Syamsyul Arief-V9.pdf` (dua halaman), `Zaenal Syamsyul Arief_Portofolio (1).pdf` (enam halaman), dan `Aktivitas yang Dilakukan Selama Magang Di no limit indonesia.docx`. CV final disajikan sebagai `public/Zaenal-Syamsyul-Arief-Resume.pdf`. Foto formal pemilik tetap di `public/zaenal-portrait.png` pada About; foto informal tambahan dari `Downloads/image.png` dioptimalkan menjadi `public/zaenal-informal.webp` tanpa mengubah komposisinya dan menyatu dengan undangan Let's talk di Contact. Konten foto dan perkenalan Contact dikelola dalam `contactProfile`.

Laporan aktivitas magang mendukung empat mode Validator Panel, iterasi/UAT, handover, prototipe deteksi bot hibrida, serta deteksi bahasa dan inferensi sentimen menurut bahasa. Pengembangan dan evaluasi NLP juga berasal dari pernyataan langsung pemilik. Angka **85%** yang disebut pemilik belum dipublikasikan karena task, dataset, kelas, split, serta perhitungan metrik belum tersedia; laporan aktivitas tidak memuat angka itu. Confidence **98%** pada satu contoh foto tidak dipakai sebagai akurasi bot detection. Periode magang tetap dari CV; tanggal capture screenshot bukan tanggal kerja.

Dua screenshot asli dari laporan aktivitas yang dipilih tidak menampilkan isi postingan, nama klien, project UUID, atau index internal: initial review dan kontrol LLM. Keduanya dioptimalkan sebagai WebP 1920 × 1200 di `public/projects/validator-initial-review.webp` dan `public/projects/validator-llm-review.webp`. Angka batch dalam gambar diberi konteks sebagai contoh. Media laporan lain dan dokumen lengkap tidak disalin ke folder publik.

| Aset hasil ekstraksi | Sumber | Dimensi asli |
| --- | --- | --- |
| `public/projects/stuntlytics-dashboard-source.jpg` | PDF portofolio halaman 1 | 814 × 462 |
| `public/projects/stuntlytics-regional-risk-source.jpg` | PDF portofolio halaman 3 | 369 × 200 |
| `public/projects/mycareai-source.jpg` | PDF portofolio halaman 3 | 369 × 200 |
| `public/projects/validator-panel-source.jpg` | PDF portofolio halaman 3 | 369 × 200 |

Keempat JPEG diekstrak sebagai byte asli dari PDF, tanpa sintesis UI atau peningkatan resolusi. Galeri mencantumkan sumber dan konteks; gambar beresolusi rendah tetap ditandai demikian. Thumbnail Validator memakai tampilan UI dari PDF. Logo MyCareAI, video/poster StuntLytics, ilustrasi workflow Modnance, dan ilustrasi proyek lama dipertahankan. Workflow adalah ilustrasi arsitektur; video presentasi StuntLytics tidak dianggap bukti validasi klinis atau hasil produksi independen.

Hal yang masih memerlukan konfirmasi pemilik, disimpan sebagai `confirmationNotes` internal:

- Jabatan/peran formal Modnance dan MyCareAI, serta pembagian kontribusi tim.
- Bulan pengembangan lanjutan StuntLytics/MyCareAI pada 2026; data bulan yang ada menjelaskan proyek awal, bukan tanggal akhir extension.
- CV mencantumkan proyek awal StuntLytics Oktober 2025, sedangkan sertifikat kompetisi dalam PDF bertanggal September 2025. Label publik membedakan tanggal proyek dari partisipasi kompetisi.
- Peran dan periode Hybrid Recommender belum disebutkan sumber. Tanggal mulai freelance PURU juga belum tersedia; tetap `null` dan tidak ditebak.

Data sintetis StuntLytics tetap diberi konteks sintetis. Status peserta kompetisi tidak diubah menjadi kemenangan. Keputusan `verified` memerlukan review sumber; schema tidak membuktikan kebenaran eksperimen.

## Referensi visual dan pemeriksaan tautan

Arah editorial mengacu pada Lauren Waller: gambar Open Graph resmi diperiksa secara visual dan teks halaman web dibaca. Host browser interaktif untuk referensi tidak tersedia; hover, transisi, dan tampilan mobile referensi belum diperiksa langsung. Hasil ini mengadaptasi arah tipografi/komposisi untuk identitas dan konten Zaenal.

Pencocokan GitHub pada 5 November 2026 memakai daftar repository publik, README, dan kode terpilih. Versi tesis MyCareAI memakai Gemini API, Vite, layanan Flask/TensorFlow, serta FER opsional TFLite/MediaPipe; Vertex AI dijelaskan sebagai stack capstone awal. Regional Risk sengaja berbagi repository StuntLytics. Modnance dan Validator tidak diberi tautan repository/demo yang belum tersedia.

Tautan sertifikat `https://bit.ly/SertifikatZaenalSyamsyulArief` merespons HTTP 200 setelah redirect ke folder Google Drive `1UNij_DLgMrJXydGYgFKTf9HOyR-PlZy0`; ini memverifikasi keterjangkauan folder, bukan memvalidasi isi setiap sertifikat. Pemeriksaan LinkedIn dibatasi proteksi bot dan tidak ditandai sebagai tautan rusak.

## Deployment dan status verifikasi

Canonical produksi berasal dari `siteConfig.website`: `https://zaenalsyamsyularief-porto.vercel.app`. Indexing hanya diizinkan pada build produksi tanpa `PORTFOLIO_PREVIEW=true`, dengan `VERCEL_ENV` tidak diisi atau bernilai `production`. Preview/development memakai noindex, robots menolak indexing, dan sitemap kosong. Tetapkan environment preview sebelum build. URL tunnel sementara tidak disimpan dalam repository atau dipakai sebagai canonical.

Validasi konten, **26 tes data**, **79 tes kontak/SMTP**, build produksi preview, lint, dan TypeScript lulus setelah pergantian ke Gmail SMTP. **24 tes browser** lulus pada build produksi, termasuk ukuran 390, 768, dan 1440 px, navigasi keyboard, reduced motion, tanpa JavaScript, CV, dan status formulir. Seluruh pengiriman pada tes otomatis dicegat atau dimock; hasil tersebut tidak membuktikan email sudah masuk Gmail. Angka performa dan hasil QA versi 3D sebelumnya tidak digunakan sebagai bukti desain editorial atau formulir ini.

Revisi terbaru untuk video StuntLytics, foto Contact, dan pemulihan identitas kembali lulus build preview, lint, TypeScript, 26 tes data, serta seluruh 24 tes browser. Pengujian mencakup autoplay ketika video terlihat, pause di luar layar, reduced motion dengan pemutaran manual, navigasi, CV, formulir kontak dengan mock, dan ukuran 390/768/1440 px. Komposisi Contact, video, dan screenshot Validator juga diperiksa secara visual. Tidak ada overflow atau console error pada pemeriksaan tersebut; seluruh pengiriman formulir pada tes tetap dicegat.

Identitas utama tetap **Data & AI Engineer**. Label **Data Science / NLP** berlaku pada proyek magang NoLimit; jabatan historis, pendidikan, sertifikat, serta topik ETL tetap sesuai sumber. Empat proyek unggulan disusun dalam grid dua kolom sejajar (satu kolom pada ponsel), dengan nomor 01-04 dan bingkai 4:3 yang setara. Gambar serta video memakai object-fit: contain sehingga rasio asli dan isi sumber tetap utuh, termasuk Modnance 1000:760 dan screenshot Validator. StuntLytics memakai video MP4 asli dengan kontrol native, autoplay saat terlihat, serta pause saat keluar layar atau tab tersembunyi. Reduced motion dan Save-Data mematikan autoplay; tombol putar native tetap tersedia. Video tidak dibungkus tautan; judul proyek dan View case study menuju detail. Overlay panah dan zoom gambar dihapus.

Review manusia yang tetap diperlukan: fakta/peran yang belum pasti, kualitas gambar sumber beresolusi rendah, audit aksesibilitas menyeluruh, kompatibilitas perangkat/browser fisik, dan environment indexing saat deployment. Perubahan source belum berarti deployment produksi baru.

Revisi tipografi dan motion menaikkan teks kecil 1-3 px, menyamakan ukuran teks footer, serta menghapus label pembuka dan lokasi berulang. Menu Work/About/Contact dan CTA Let's talk memiliki sapuan warna dengan panah dekat teks. Reveal memakai Web Animations API tanpa dependensi tambahan, diulang pada perubahan pathname dan dibatalkan saat reduced motion aktif atau fokus keyboard masuk. Baseline HTML tetap terlihat tanpa JavaScript. Build produksi, lint, dan delapan pengujian browser terarah lulus, termasuk grid 2 x 2, hover, pembatalan animasi, navigasi, reduced motion, tanpa JavaScript, serta ukuran 390/768/1440 px. Pemeriksaan visual tambahan pada 320/390/768 px tidak menemukan overflow atau browser error.

Koreksi motion berikutnya memeriksa HTML serta modul publik Lauren Waller secara langsung. Hover menu dan CTA kini memiringkan teks 15 derajat dan menggesernya 20 px dengan spring CSS 700 ms, selain sapuan warna. Reveal teks memiliki jeda bertahap yang terlihat, dan tirai dekoratif 900 ms membuka halaman dari atas pada Home serta dari bawah pada halaman lain. Warna tirai dikontraskan terhadap halaman (ink pada latar kertas, paper pada Contact). Tirai tidak menangkap klik dan langsung dibatalkan untuk reduced motion atau fokus keyboard. Tujuh pengujian browser terarah lulus, termasuk posisi/skew hover, tirai yang benar-benar berjalan saat klik, pembersihan animasi, keyboard, tanpa JavaScript, reduced motion, dan ukuran responsif; pemeriksaan hover tambahan 320/390/768 px tidak menemukan overflow atau browser error.

Foto informal pada Contact kini menjadi latar besar yang samar, dilapisi gradasi hijau agar teks tetap jelas. Pada desktop foto menyatu dari sisi kanan; pada ponsel foto memenuhi panel dengan opacity lebih rendah. Caption tetap tersedia, dan email, profil sosial, serta CV berada di atas lapisan gambar. Build produksi, lint, serta lima pengujian browser terarah lulus. Pemeriksaan visual pada 1440/390 px dan pengukuran 320/390/768/1440 px tidak menemukan overflow atau browser error.

Perbaikan hover berikutnya menyembunyikan panah menu desktop sampai pilihan terkait di-hover atau menerima fokus keyboard; perangkat tanpa hover tetap menampilkan panah. Teks menu dan CTA memakai rollover huruf bergantian, selain skew dan sapuan warna. Label asli tetap tersedia untuk pembaca layar. Efek CSS bekerja tanpa menunggu hydration, sementara reduced motion tetap menghentikan gerakan. Waktu masuk judul digeser agar tidak selesai di balik tirai. Build, lint, dan tujuh pengujian browser terarah lulus; pemeriksaan default Chromium pada localhost:3000, 127.0.0.1:3000, serta 127.0.0.1:3001 memastikan hydration aktif, hanya panah pilihan yang disorot terlihat, dan tidak ada browser error.

Rujukan animasi terakhir adalah rekaman Lauren Waller milik pemilik (46,3 detik). Rollover per huruf telah diganti gerakan kata utuh: skew 15 derajat dan pergeseran 20 px dengan spring 700 ms/bounce .25. Teks masuk memakai blur 10 px menuju tajam selama 500 ms, gerakan vertikal 20 px, jeda mulai 600 ms, dan stagger 100 ms. Judul proyek mendapat hover serupa; gambar/video tidak ikut diburamkan. Panah hover saja tetap mengikuti permintaan pemilik. Build, lint, dan tujuh tes browser terarah lulus; hover judul proyek juga diperiksa pada 320/390/768/1440 px tanpa overflow. Rekaman hasil lokal dibuat untuk peninjauan gerakan.
