# Product Requirement Document (PRD)

## 1. Identitas Produk

- **Nama Aplikasi:** QuizClash
- **Deskripsi Singkat:** Aplikasi kuis interaktif berbasis web menggunakan **Next.js** yang mengambil bank soal secara langsung dari spreadsheet (Google Sheets / Excel / CSV). Aplikasi menampilkan soal dalam bentuk _grid card_ interaktif untuk dimainkan secara _real-time_ dengan mekanisme rebutan antar kelompok.

---

## 2. Latar Belakang & Tujuan

- **Latar Belakang:** Kuis interaktif kelompok sering kali membutuhkan persiapan rumit. Penggunaan spreadsheet memudahkan host kuis untuk menyiapkan soal tanpa harus melakukan input manual berulang-ulang ke dalam sistem.
- **Tujuan:**
  - Memudahkan pengelolaan kuis via Google Sheets/CSV.
  - Menyediakan antarmuka kuis yang interaktif, menarik, dan responsif, ideal untuk ditampilkan di proyektor atau layar bersama.
  - Menerapkan praktik terbaik React (_Component-Driven Development_) agar kode modular, mudah dirawat, dan tidak menumpuk pada satu file raksasa.

---

## 3. Arsitektur Teknis (Tech Stack: Next.js)

- **Framework:** Next.js (App Router)
- **Bahasa:** TypeScript (Sangat direkomendasikan untuk _props typing_ antar komponen)
- **Styling & UI:** Tailwind CSS + Component Library (shadcn/ui atau HeroUI)
- **Parser Data:** `papaparse` (untuk CSV) / `xlsx` (SheetJS)
- **State Management:** React Context API / Zustand (untuk membagikan state skor dan status soal ke berbagai komponen secara efisien).

---

## 4. Arsitektur UI & Dekomposisi Komponen (React)

Untuk memastikan kode tidak terlalu panjang (menghindari _spaghetti code_) dan kapabilitas React digunakan semaksimal mungkin, UI akan dipecah menjadi komponen-komponen kecil yang modular dan memiliki tanggung jawab tunggal (_Single Responsibility Principle_).

### Struktur Hirarki Komponen:

```text
app/page.tsx (Main Page Container)
 ├── <Header /> (Judul Aplikasi & Navigasi)
 ├── <ScoreBoard /> (Papan Skor Global)
 │    └── <TeamScoreCard /> (Menampilkan poin individu per kelompok)
 ├── <QuizBoard /> (Container utama arena kuis)
 │    └── <QuizGrid /> (Sistem layout grid)
 │         └── <QuestionCard /> (Komponen individual kartu soal, di-map dari data spreadsheet)
 └── <QuestionModal /> (Pop-up/Dialog yang muncul saat QuestionCard diklik)
      ├── <GroupSelector /> (Dropdown/Radio Button pemilih kelompok penjawab)
      └── <OptionList /> (Daftar pilihan ganda)
           └── <OptionItem /> (Komponen tombol pilihan A/B/C/D)
```

### Detail Props & Fungsi Komponen Kunci:

1. **`<QuestionCard/>`**: Hanya bertugas menampilkan UI kartu.
   - _Props:_ `id`, `points`, `status` (unanswered, correct, wrong), `answeredBy` (kelompok), `onClick`.
2. **`<QuestionModal/>`**: Menangani UI pop-up pertanyaan. State apakah modal terbuka atau tertutup dikendalikan di level atasnya atau via Context.
3. **`<GroupSelector/>`**: Komponen terisolasi untuk memilih kelompok yang berhasil merebut soal.
4. **`<ScoreBoard/>`**: Secara otomatis mendengarkan perubahan global state skor dan me-render ulang nilai tim secara _real-time_ tanpa mengganggu render kartu soal.

---

## 5. Alur & Fitur Utama Aplikasi

### 5.1 Setup Kuis & Import Data

1. Host memasukkan tautan CSV Google Sheets atau mengunggah file.
2. Next.js memvalidasi data dan menyimpannya dalam _Global State_ agar bisa diakses oleh komponen `<QuizBoard/>`.

### 5.2 Halaman Kuis Utama (Grid Card View)

- **Indikator Visual `<QuestionCard/>`:**
  - **Default:** Menampilkan Poin (contoh: _100 Poin_).
  - **Correct (Hijau/Biru):** Terkunci, menampilkan _badge_ kelompok (contoh: _Diwakili: Kelompok 2_).
  - **Incorrect (Merah/Silang):** Menampilkan tanda peringatan bahwa soal telah dijawab salah, namun masih bisa dilempar ke kelompok lain.

### 5.3 Modal Soal & Evaluasi Jawaban

- Saat `<QuestionCard/>` diklik, state aktif berubah dan memanggil `<QuestionModal/>`.
- **Proses Menjawab:**
  1. Host memilih tim via `<GroupSelector/>`.
  2. Host membacakan/memilih jawaban tim via `<OptionList/>`.
  3. Klik Submit.
- **Evaluasi:**
  - Jika **BENAR**: State global diperbarui (poin tim bertambah, status soal menjadi _Correct_ dengan id tim). Modal otomatis tertutup.
  - Jika **SALAH**: State soal menjadi _Incorrect_ untuk tim tersebut. UI akan memberi tanda silang pada kartu, dan skor kelompok tidak bertambah.

---

## 6. Spesifikasi Data Spreadsheet

Format kolom wajib pada Google Sheets / CSV:

| Nama Kolom | Tipe Data | Keterangan                      |
| :--------- | :-------- | :------------------------------ |
| `id`       | String    | ID Unik Soal (contoh: `1`, `2`) |
| `question` | Text      | Pertanyaan kuis                 |
| `option_a` | Text      | Opsi A                          |
| `option_b` | Text      | Opsi B                          |
| `option_c` | Text      | Opsi C                          |
| `option_d` | Text      | Opsi D                          |
| `answer`   | String    | Kunci Jawaban (`A`/`B`/`C`/`D`) |
| `points`   | Number    | Bobot poin soal (contoh: `100`) |
