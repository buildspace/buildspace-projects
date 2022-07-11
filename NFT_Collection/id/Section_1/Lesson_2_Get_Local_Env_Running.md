## 📚 Sebuah primer blockchain kecil
Sebelum apa pun, kita harus membuat jaringan Ethereum lokal kita berfungsi. Ini adalah bagaimana kita dapat mengkompilasi dan menguji kode kontrak pintar kita! Kamu tahu bagaimana kamu perlu menghidupkan lingkungan lokal untuk dikerjakan? Kesepakatan yang sama di sini!

Untuk saat ini, yang perlu kamu ketahui adalah bahwa kontrak pintar adalah bagian dari kode yang hidup di blockchain. Blockchain adalah tempat umum di mana siapa pun dapat dengan aman membaca dan menulis data dengan biaya tertentu. Anggap saja seperti AWS atau Heroku, kecuali tidak ada yang benar-benar memilikinya! Ini dijalankan oleh ribuan orang acak yang dikenal sebagai "penambang".

Gambaran yang lebih besar di sini adalah:

1 --Kita akan menulis kontrak cerdas. Kontrak itu memiliki semua logika di sekitar NFT kita.

2 -- Kontrak pintar kita akan disebarkan ke blockchain. Dengan cara ini, siapa pun di dunia akan dapat mengakses dan menjalankan kontrak pintar kita — dan kita akan membiarkan mereka mencetak NFT!

3 -- Kita akan membuat situs web klien yang memungkinkan orang dengan mudah mencetak NFT dari koleksi kita.

Aku sarankan juga membaca [dokumen ini](https://ethereum.org/en/developers/docs/intro-to-ethereum/) jika kamu bisa untuk bersenang-senang. Ini adalah panduan terbaik di internet untuk memahami cara kerja Ethereum menurutku!

## ⚙️ Siapkan perkakas lokal

Kita akan sering menggunakan alat yang disebut **Hardhat** yang memungkinkan kita dengan cepat mengkompilasi kontrak pintar dan mengujinya secara lokal. Pertama, kamu harus mendapatkan node/npm. Jika kamu tidak memilikinya, buka [di sini](https://hardhat.org/tutorial/setting-up-the-environment.html).

*Catatan: Aku menggunakan Node 16. Aku tahu beberapa orang mendapatkan "kesalahan memori" pada versi node yang lebih lama jadi jika itu terjadi, dapatkan Node 16!*

Selanjutnya, mari kita menuju ke terminal. Silakan dan `cd` ke direktori tempat kamu ingin bekerja. Setelah kamu di sana, jalankan perintah ini:

```bash
mkdir epic-nfts
cd epic-nfts
npm init -y
npm install --save-dev hardhat
```
Kamu mungkin melihat pesan tentang kerentanan setelah kamu menjalankan perintah terakhir dan menginstal Hardhat. Setiap kali kamu menginstal sesuatu dari NPM, ada pemeriksaan keamanan yang dilakukan untuk melihat apakah ada paket perpustakaan yang kamu instal memiliki kerentanan yang dilaporkan. Ini lebih merupakan peringatan bagimu agar kamu sadar! Google sekitar sedikit tentang kerentanan ini jika kamu ingin tahu lebih banyak!


## 🔨 Dapatkan proyek sampel berfungsi

Keren, sekarang kita harusnya sudah memiliki hardhat. Mari kita mulai proyek sampel.

```
npx hardhat
```

*Catatan: Jika kamu menggunakan Windows menggunakan Git Bash untuk menginstal hardhat, kamu mungkin mengalami kesalahan pada langkah ini (HH1). Kamu dapat mencoba menggunakan Windows CMD untuk melakukan instalasi HardHat jika kamu mengalami masalah. Info tambahan dapat ditemukan [di sini](https://github.com/nomiclabs/hardhat/issues/1400#issuecomment-824097242).*

Pilih opsi untuk membuat proyek sampel dasar. Katakan ya untuk semuanya.

Contoh proyek akan meminta kamu untuk menginstal `hardhat-waffle` dan `hardhat-ethers`. Ini adalah barang lain yang akan kita gunakan nanti.

Silakan dan instal dependensi lain ini untuk berjaga-jaga jika tidak melakukannya secara otomatis.

```bash
npm install --save-dev @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers
```

Kamu juga ingin menginstal sesuatu yang disebut **OpenZeppelin** yang merupakan pustaka lain yang banyak digunakan untuk mengembangkan kontrak pintar yang aman. Kita akan mempelajarinya lebih lanjut nanti. Untuk saat ini, hanya menginstalnya :).

```bash
npm install @openzeppelin/contracts
```

Lalu jalankan:

```bash
npx hardhat run scripts/sample-script.js
```

Kamu akan melihat sesuatu seperti ini:

![Untitled](https://i.imgur.com/LIYT9tf.png)

Duar! Jika kamu melihat ini, berarti lingkungan lokal kamu sudah diatur **dan** kamu juga menjalankan/menerapkan kontrak pintar ke blockchain lokal.

Ini cukup keren. Kita akan membahas ini lebih jauh tetapi pada dasarnya apa yang terjadi di sini selangkah demi selangkah adalah:

1. Hardhat mengkompilasi kontrak pintarmu dari soliditas ke bytecode.
2. Hardhat akan menjalankan "blockchain lokal" di komputermu. Ini seperti mini, versi uji Ethereum yang berjalan di komputermu untuk membantu kamu menguji barang dengan cepat!
3. Hardhat kemudian akan "menyebarkan" kontrak terkompilasimu ke blockchain lokal kamu. Itu alamat yang kamu lihat di ujung sana. Ini adalah kontrak yang kita terapkan, pada Ethereum versi mini kita.

Jika kamu penasaran, silakan lihat kode di dalam proyek untuk melihat cara kerjanya. Secara khusus, periksa `Greeter.sol` yang merupakan kontrak pintar dan `sample-script.js` yang benar-benar menjalankan kontrak.

Setelah kamu selesai menjelajah, mari menuju ke bagian berikutnya dan memulai kontrak NFT kita sendiri.

## 🚨 Laporan perkembangan!

Posting tangkapan layar terminalmu dengan keluaran `sample-script.js` di #progress :).
