## 🔥 Meniru lingkungan blockchain untuk diuji

Kamu sudah melakukannya. Kamu sudah menulis kontrak cerdas. Kamu seorang juara!

Sekarang kita harus benar-benar\
1\. Mengkompilasi.\
2\. Menerapkan ke blockchain lokal kita.\
3\. Setelah itu ada, console.log itu akan berjalan :).

Kita perlu melakukan ini karena di dunia nyata, kontrak pintar hidup di blockchain. Dan, kita ingin situs web dan kontrak pintar kita digunakan oleh orang-orang nyata sehingga mereka dapat 👋 pada kita atau melakukan apa pun yang kamu ingin mereka lakukan!

Jadi, bahkan ketika kita bekerja secara lokal, kita ingin meniru lingkungan itu. Secara teknis, kita hanya dapat mengkompilasi dan menjalankan kode Solidity, tetapi yang membuat Solidity ajaib adalah bagaimana ia dapat berinteraksi dengan blockchain dan dompet Ethereum (yang akan kita lihat lebih lanjut di pelajaran berikutnya). Jadi, lebih baik hentikan ini sekarang.

Kita hanya akan menulis skrip khusus yang menangani 3 langkah tersebut untuk kita.

Ayo lakukan!

## 📝 Buat skrip untuk menjalankan kontrak kita

Masuk ke direktori **`scripts`** dan buat file bernama **`run.js`.**

Jadi, untuk menguji kontrak pintar, kita harus melakukan banyak hal dengan benar. Seperti: kompilasi, sebarkan, lalu jalankan.

Skrip kita akan membuatnya sangat mudah untuk beralih pada kontrak kita dengan sangat cepat :).

Jadi, inilah yang akan dimiliki **`run.js`**:

```javascript
const main = async () => {
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy();
  await waveContract.deployed();
  console.log("Contract deployed to:", waveContract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0); // keluar dari proses Node tanpa kesalahan
  } catch (error) {
    console.log(error);
    process.exit(1); // keluar dari proses Node sambil menunjukkan kesalahan 'Uncaught Fatal Exception'
  }
  // Baca lebih lanjut tentang kode status Node exit ('process.exit(num)') di sini: https://stackoverflow.com/a/47163396/7974948
};

runMain();
```

Luar biasa.

## 🤔 Bagaimana cara kerjanya?

Sekali lagi ikuti baris demi baris di sini.

```javascript
const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
```

Ini sebenarnya akan mengkompilasi kontrak kita dan menghasilkan file yang diperlukan untuk bekerja dengan kontrak kita di bawah direktori `artifacts`. Segera periksa setelah kamu menjalankan ini :).

```javascript
const waveContract = await waveContractFactory.deploy();
```

Ini cukup mewah :).

Apa yang terjadi di sini adalah Hardhat akan membuat jaringan Ethereum lokal untuk kita, tetapi hanya untuk kontrak ini. Kemudian, setelah skrip selesai, itu akan menghancurkan jaringan lokal itu. Jadi, setiap kali kamu menjalankan kontrak, itu akan menjadi blockchain baru. Apa gunanya? Ini seperti mengulang kembali server lokal kamu setiap saat sehingga kamu selalu memulai dari awal yang bersih yang memudahkan untuk men-debug kesalahan.

```javascript
await waveContract.deployed();
```

Kita akan menunggu hingga kontrak kita secara resmi dikerahkan ke blockchain lokal kita! `Constructor` kita berjalan saat kita benar-benar men-deploy.

```javascript
console.log("Contract deployed to:", waveContract.address);
```

Terakhir, setelah diterapkan `waveContract.address`  pada dasarnya akan memberi kita alamat kontrak yang diterapkan. Alamat ini adalah bagaimana kita benar-benar dapat menemukan kontrak kita di blockchain. Ada jutaan kontrak di blockchain yang sebenarnya. Jadi, alamat ini memberi kita akses mudah ke kontrak yang ingin kita tangani! Ini akan menjadi lebih penting nanti setelah kita menyebarkan ke jaringan Ethereum yang sebenarnya.

Ayo jalankan!

```bash
npx hardhat run scripts/run.js
```

Kamu akan melihat `console.log` kamu berjalan dari dalam kontrak dan kamu juga akan melihat alamat kontrak tercetak!!! Inilah yang aku dapatkan:

![](https://i.imgur.com/ug79rOM.png)


## 🎩 Hardhat & HRE

Dalam blok kode ini kamu akan terus-menerus melihat bahwa kita menggunakan `hre.ethers`, tetapi `hre` tidak pernah diimpor ke mana pun? Apa jenis trik sulap ini?

Langsung dari dokumen Hardhat sendiri, kamu akan melihat ini:

> Hardhat Runtime Environment, atau disingkat HRE, adalah objek yang berisi semua fungsionalitas yang ditampilkan Hardhat saat menjalankan tugas, pengujian, atau skrip. Pada kenyataannya, Hardhat adalah HRE.

Jadi apa artinya ini? Nah, setiap kali kamu menjalankan perintah terminal yang dimulai dengan `npx hardhat` kamu mendapatkan objek `hre` ini yang dibangun dengan cepat menggunakan `hardhat.config.js` yang ditentukan dalam kode kamu! Ini berarti kamu tidak perlu benar-benar melakukan semacam impor ke file kamu seperti:

`const hre = require("hardhat")`

**Singkat kata - kamu akan melihat banyak `hre` dalam kode kita, tetapi tidak pernah diimpor ke mana pun! Lihat [dokumentasi Hardhat](https://hardhat.org/advanced/hardhat-runtime-environment.html) yang keren ini untuk mempelajarinya lebih lanjut!**

## 🚨 Sebelum kamu mengklik "Pelajaran Berikutnya"

*Catatan: jika kamu tidak melakukan ini, Farza akan sangat sedih :(.*

Pergi ke #progress dan posting tangkapan layar terminal kamu dengan output.

Pastikan untuk membuat console.log itu apa pun yang kamu inginkan! Kamu sekarang sudah menulis kontrak kamu sendiri dan menjalankannya dengan menyebarkan ke blockchain lokal WOOOOOOOOOO AYO.
