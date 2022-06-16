## ✅ Siapkan env kamu untuk mulai bekerja dengan blockchain

Sebelum memulai, kita harus membuat jaringan Ethereum lokal kita berfungsi. Dengan ini kita dapat mengkompilasi dan menguji kode kontrak pintar kita! kamu tahu bagaimana kamu perlu menghidupkan lingkungan lokal untuk mengerjakannya? Situasi yang sama di sini!

Untuk saat ini, yang perlu kamu ketahui adalah bahwa kontrak pintar adalah bagian dari kode yang hidup di blockchain. Blockchain adalah tempat umum di mana siapa pun dapat dengan aman membaca dan menulis data dengan biaya tertentu. Anggap saja seperti AWS atau Heroku, kecuali benar-benar tidak ada yang memilikinya!

Jadi dalam hal ini, kita ingin orang-orang 👋 pada kita. Gambaran yang lebih besar di sini adalah:

1\. **Kita akan menulis kontrak pintar.** Kontrak tersebut memiliki semua logika seputar bagaimana 👋 ditangani.

2\. **Kontrak pintar kita akan disebarkan ke blockchain.** Dengan cara ini, siapa pun di dunia akan dapat mengakses dan menjalankan kontrak pintar kita (jika kita memberi mereka izin untuk melakukannya). Jadi, cukup mirip dengan server :).

3\. **Kita akan membangun situs web klien** yang memungkinkan orang berinteraksi dengan mudah dengan kontrak pintar kita di blockchain.

Aku akan menjelaskan hal-hal tertentu secara mendalam sesuai kebutuhan (cth. cara kerja penambangan, cara kontrak cerdas dikompilasi dan dijalankan, dll) *tetapi untuk saat ini mari kita fokus untuk menjalankannya*.

Jika kamu memiliki masalah apa pun di sini, cukup kirimkan pesan di Discord di  `#section-1-help`.

## ✨ Keajaiban Hardhat

1\. Kita akan sering menggunakan alat yang disebut Hardhat. Alat ini akan memungkinkan kita dengan mudah memutar jaringan Ethereum lokal dan memberi kita ETH palsu dan akun palsu yang digunakan untuk pengujian. Ingat, ini seperti server lokal, kecuali "server" tersebut adalah blockchain.

2\. Kompilasi kontrak pintar dengan cepat dan uji di blockchain lokal kita.

Pertama, kamu harus mendapatkan node/npm. Jika kamu tidak memilikinya, kunjungi [di sini](https://hardhat.org/tutorial/setting-up-the-environment.html).

Kami merekomendasikan menjalankan Hardhat menggunakan versi LTS Node.js saat ini atau kamu mungkin mengalami beberapa masalah! kamu dapat menemukan rilis saat ini [di sini](https://nodejs.org/en/about/releases/).

Selanjutnya, saatnya menuju ke terminal (Git Bash tidak akan berfungsi). Silakan dan cd ke direktori tempat kamu ingin bekerja. Setelah kamu di sana, jalankan perintah ini:

```bash
mkdir my-wave-portal
cd my-wave-portal
npm init -y
npm install --save-dev hardhat
```

## 👏 Jalankan proyek sampel

Keren, sekarang kita sudah memiliki Hardhat. Mari kita mulai proyek sampel.

Jalankan:

```bash
npx hardhat
```

*Catatan: jika kamu telah memasang yarn bersama dengan npm, kamu mungkin mendapatkan kesalahan seperti `npm ERR! could not determine executable to run`. Dalam kasus ini, kamu dapat melakukan `yarn add hardhat`.*

Pilih opsi untuk membuat proyek sampel. Katakan yes untuk semuanya.

Proyek sampel akan meminta kamu untuk menginstal hardhat-waffle dan hardhat-ethers. Ini adalah barang lain yang akan kita gunakan nanti :).

Silakan dan instal dependensi lain ini untuk berjaga-jaga jika tidak terinstal secara otomatis.

```bash
npm install --save-dev @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers
```

Terakhir, jalankan `npx hardhat accounts` dan perintah ini akan mencetak sekumpulan string yang terlihat seperti ini:

`0xa0Ee7A142d267C1f36714E4a8F75612F20a79720`

These are Ethereum addresses that Hardhat generates for us to simulate real users on the blockchain. This is going to help us a ton later in the project when we want to simulate users 👋-ing at us!

Ini adalah alamat Ethereum yang dihasilkan Hardhat untuk kita dalam mensimulasikan pengguna nyata di blockchain. Ini akan sangat membantu kita nanti dalam proyek ketika kita ingin mensimulasikan pengguna yang sedang 👋 kita!

## 🌟 Menjalankannya

Untuk memastikan semuanya berfungsi, jalankan:

```bash
 npx hardhat compile
```
Then jalankan:

```bash
npx hardhat test
```

Kamu akan melihat sesuatu seperti ini:

![](https://i.imgur.com/rjPvls0.png)

Mari kita lakukan sedikit pembersihan.

Silakan dan buka kode untuk proyek sekarang di editor kode favorit kamu. Aku paling suka VSCode! Kita ingin menghapus semua kode starter membosankan yang dibuat untuk kita. Kita tidak membutuhkan semua itu. Kita pro ;)!

Lanjutkan dan hapus file `sample-test.js` di bawah `test`. Juga, hapus `sample-script.js` di bawah `scripts`. Kemudian, hapus `Greeter.sol` di bawah `contracts`. Jangan hapus folder yang sebenarnya!

## 🚨 Sebelum kamu mengklik "Pelajaran Berikutnya"

*Catatan: jika kamu tidak melakukan ini, Farza akan sangat sedih :(.*

Buka #progress dan posting tangkapan layar terminal **kamu** yang menunjukkan hasil pengujian! kamu baru saja menjalankan kontrak cerdas, itu masalah besar!! Pamerkan :).

Catatan: Jika kamu **tidak** memiliki akses ke #progress, pastikan kamu menautkan Discord kamu, bergabung dengan Discord [di sini](https://discord.gg/mXDqs6Ubcc), hubungi kami di #general kami akan membantu kamu mendapatkan akses ke saluran yang tepat!
