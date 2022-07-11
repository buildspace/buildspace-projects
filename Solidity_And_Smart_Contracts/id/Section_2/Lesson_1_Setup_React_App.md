## 💻 Siapkan klien

Saatnya untuk mulai bekerja di situs web kita! Kontrak kita cukup sederhana, tetapi, mari pelajari bagaimana front end kita dapat berinteraksi dengan kontrak kita secepatnya!

Jadi, ada sekitar 100 cara berbeda untuk menyiapkan proyek react dasar dan menerapkannya. Aku akan menunjukkan cara melakukannya di sini dalam 10 menit dan pada akhirnya kamu akan benar-benar memiliki aplikasi react yang sepenuhnya diterapkan dengan domainnya sendiri dan semuanya.

## 🤯 Replit

**Catatan: Kamu tidak perlu menggunakan replit untuk membangun + menerapkan situs kamu. Jika kamu ingin menggunakan create-react-app + Vercel/Heroku/AWS -- itu sangat keren. [Di sini](https://github.com/buildspace/waveportal-starter-project) adalah tautan ke repo dasar yang dapat kamu tiru dan kerjakan secara lokal.**

Kita akan menggunakan [Replit](https://replit.com/~)! Ini adalah IDE berbasis browser yang memungkinkan kita dengan mudah membangun aplikasi web dan menyebarkan semuanya dari browser. Ini sangat keren. Daripada harus menyiapkan lingkungan lokal lengkap dan menulis perintah untuk diterapkan, semuanya diberikan kepada kita.

Buat akun di Replit sebelum melanjutkan.

Aku telah membuat proyek reaksi dasar yang dapat kamu **fork** di Replit. **Cukup pergi [ke sini](https://replit.com/@adilanchian/waveportal-starter-project?v=1), dan di dekat kanan kamu akan melihat tombol "Fork".** Pastikan kamu' login ulang, lalu klik ini. Kamu akan secara ajaib mengkloning repo-ku dan IDE lengkap di browser kamu untuk bekerja dengan kode. Setelah berhenti memuat dan menunjukkan kepada kamu beberapa kode, klik tombol "Run" di bagian atas. Ini bisa memakan waktu 2-3 menit untuk pertama kalinya. Pada dasarnya, Replit mem-boot proyek kamu dan menyebarkannya ke domain yang sebenarnya.

**Harap Dicatat: Saat kamu mengerjakan proyek ini, kamu mungkin memperhatikan bahwa kita mereferensikan file `.js`. Di Replit, jika kamu membuat file JavaScript baru, kamu harus menggunakan ekstensi `.jsx` sebagai gantinya! Replit memiliki beberapa kemewahan kinerja yang mengharuskan kamu menggunakan ekstensi file `.jsx` :).**

Aku membuat video singkat tentang cara mengedit kode di Replit, deploy, dapatkan mode gelap. Lihat di bawah ini:
[Loom](https://www.loom.com/share/8e8f47eacf6d448eb5d25b6908021035)

## 🦊 Metamask

Luar biasa, kita memiliki proyek React yang sudah **diterapkan** yang dapat kita kerjakan dengan mudah. Itu sederhana :).

Selanjutnya kita membutuhkan dompet Ethereum. Ada banyak dari ini, tetapi, untuk proyek ini kita akan menggunakan Metamask. Unduh ekstensi browser dan siapkan dompetmu [di sini](https://metamask.io/download.html). Bahkan jika kamu sudah memiliki penyedia dompet lain, gunakan saja Metamask untuk saat ini.

Mengapa kita membutuhkan Metamask? Sehat. Kita harus dapat memanggil fungsi pada kontrak pintar kita yang hidup di blockchain. Dan, untuk melakukan itu kita perlu memiliki dompet yang memiliki alamat Ethereum dan kunci pribadi kita.

**Tapi, kita memerlukan sesuatu untuk menghubungkan situs web kita dengan dompet kita sehingga kita dapat dengan aman meneruskan kredensial dompet kita ke situs web kita sehingga situs web kita dapat menggunakan kredensial tersebut untuk memanggil kontrak pintar kita. Kamu harus memiliki kredensial yang valid untuk mengakses fungsi pada kontrak pintar.**

Ini hampir seperti otentikasi. Kita membutuhkan sesuatu untuk "masuk" ke blockchain dan kemudian menggunakan kredensial masuk tersebut untuk membuat permintaan API dari situs web kita.

Jadi, lanjutkan dan atur semuanya! Alur pengaturan mereka cukup jelas :).

## 🚨 Sebelum kamu mengklik "Pelajaran Berikutnya"

*Catatan: jika kamu tidak melakukan ini, Farza akan sangat sedih :(.*

Bagikan tautan ke situs web kamu dan poskan di #progress. Ubah CSS dan teks menjadi apa pun yang kamu inginkan. Mungkin kamu ingin lebih berwarna? Mungkin kamu tidak peduli dengan lambaian dan ingin membuat tiruan Twitter yang terdesentralisasi? Lakukan apa pun yang kamu inginkan, ini adalah aplikasimu :).
