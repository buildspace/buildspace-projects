## 📝 Tulis kontrak awal kita

*Catatan: Jika kamu sudah tahu cara melakukan banyak hal di bagian ini dari proyek "WavePortal" yang kita jalankan sebelumnya, luar biasa! Kamu akan melewati ini dengan cepat :). Banyak yang diulang.*

Mari kita lakukan sedikit pembersihan.

Kita ingin menghapus semua kode starter membosankan yang dibuat untuk kita. Kita akan menulis hal ini sendiri! Lanjutkan dan hapus file `sample-test.js` di bawah `test`. Selain itu, hapus `sample-script.js` di bawah `scripts`. Kemudian, hapus `Greeter.sol` di bawah `contracts`. **Jangan hapus folder yang sebenarnya!**

Sekarang, buka proyek di VSCode dan mari kita mulai menulis kontrak NFT kita. Jika kamu belum pernah menulis kontrak pintar, jangan khawatir. **Ikuti saja. Google hal-hal yang kamu tidak mengerti. Ajukan pertanyaan di Discord.**

Buat file bernama `MyEpicNFT.sol` di bawah direktori `contracts`. Struktur file sangat penting saat menggunakan Hardhat, jadi berhati-hatilah di sini!

Catatan: Aku sarankan mengunduh [Ekstensi Solidity](https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity) untuk VSCode yang memberikan penyorotan sintaks yang bagus.

Aku selalu suka memulai dengan kontrak yang sangat mendasar, hanya untuk menyelesaikan sesuatu.

```solidity
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.1;

import "hardhat/console.sol";

contract MyEpicNFT {
    constructor() {
        console.log("This is my NFT contract. Whoa!");
    }
}
```

Catatan: Terkadang VSCode sendiri akan memunculkan kesalahan yang tidak nyata, misalnya, mungkin menggarisbawahi impor hardhat dan mengatakan itu tidak ada. Ini terjadi karena compiler Solidity global kamu tidak disetel secara lokal. Jika kamu tidak tahu cara memperbaikinya, jangan khawatir. Abaikan ini untuk saat ini. Aku juga menyarankan kamu untuk tidak menggunakan terminal VSCode, gunakan terminal terpisahmu sendiri! Terkadang terminal VSCode memberikan masalah jika kompiler tidak disetel.

Mari kita pergi baris demi baris di sini.

```solidity
// SPDX-License-Identifier: UNLICENSED
```

Hanya komentar mewah. Ini disebut "SPDX license identifier", kamu dapat membaca lebih lanjut tentang itu [di sini](https://spdx.org/licenses/).

```solidity
pragma solidity ^0.8.1;
```

Ini adalah versi kompiler Solidity yang kita ingin kontrak kita gunakan. Pada dasarnya tertulis "saat menjalankan ini, aku hanya ingin menggunakan kompiler Solidity dengan versi 0.8.1 atau lebih tinggi, tetapi tidak lebih tinggi dari 0.9.0. Catatan, pastikan kompilermu disetel sesuai (mis. 0.8.1) di `hardhat.config.js`.

```solidity
import "hardhat/console.sol";
```

Beberapa sihir yang diberikan kepada kita oleh Hardhat memungkinkan kita untuk melakukan beberapa log konsol dalam kontrak kita. Sebenarnya sulit untuk men-debug kontrak pintar, tetapi ini adalah salah satu manfaat yang diberikan Hardhat kepada kita untuk membuat hidup lebih mudah.

```solidity
contract MyEpicNFT {
    constructor() {
        console.log("This is my NFT contract. Whoa!");
    }
}
```

Jadi, kontrak pintar terlihat seperti `class` dalam bahasa lain, jika kamu pernah melihatnya! Setelah kita menginisialisasi kontrak ini untuk pertama kalinya, konstruktor itu akan menjalankan dan mencetak baris itu. Tolong buat kalimat itu mengatakan apa pun yang kamu inginkan. Bersenang-senanglah dengannya.

## 😲 Bagaimana kita menjalankannya?

Luar biasa — kita memiliki kontrak cerdas! Tapi, kita tidak tahu apakah itu berhasil. Kita perlu benar-benar:

1. Kompilasi.

2. Terapkan ke blockchain lokal kita.

3. Setelah itu ada, console.log tersebut akan berjalan.

Kita hanya akan menulis skrip khusus yang menangani 3 langkah itu untuk kita.

Masuk ke direktori `scripts` dan buat file bernama `run.js`. Inilah yang `run.js` akan punya di dalamnya:

```javascript
const main = async () => {
  const nftContractFactory = await hre.ethers.getContractFactory('MyEpicNFT');
  const nftContract = await nftContractFactory.deploy();
  await nftContract.deployed();
  console.log("Contract deployed to:", nftContract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
```

## 🤔 Bagaimana cara kerjanya?

**Catatan: VSCode mungkin mengimpor ether secara otomatis. Kita tidak perlu mengimpor ether.**

Sekali lagi mulai baris demi baris di sini.

```javascript
const nftContractFactory = await hre.ethers.getContractFactory("MyEpicNFT");
```

Ini sebenarnya akan mengompilasi kontrak kita dan menghasilkan file yang diperlukan untuk bekerja dengan kontrak kita di bawah direktori `artifacts`. Pergi periksa setelah kamu menjalankan ini :).

```javascript
const nftContract = await nftContractFactory.deploy();
```

Ini cukup mewah :).

Apa yang terjadi di sini adalah Hardhat akan membuat jaringan Ethereum lokal untuk kita, tetapi hanya untuk kontrak ini. Kemudian, setelah skrip selesai, itu akan menghancurkan jaringan lokal itu. Jadi, setiap kali kamu menjalankan kontrak, itu akan menjadi blockchain baru. Apa gunanya? Ini seperti menyegarkan server lokal kamu setiap saat sehingga kamu selalu memulai dari awal yang bersih yang memudahkan untuk men-debug kesalahan.

```javascript
await nftContract.deployed();
```

Kita akan menunggu sampai kontrak kita secara resmi ditambang dan disebarkan ke blockchain lokal kita! Itu benar, hardhat sebenarnya menciptakan "penambang" palsu di mesin kamu untuk mencoba yang terbaik untuk meniru blockchain yang sebenarnya.

`Constructor` kita berjalan saat kita benar-benar di-deploy!


```javascript
console.log("Contract deployed to:", nftContract.address);
```

Terakhir, setelah diterapkan `nftContract.address` pada dasarnya akan memberi kita alamat kontrak yang diterapkan. Alamat ini adalah bagaimana kita benar-benar dapat menemukan kontrak kita di blockchain. Saat ini di blockchain lokal kita, hanya kita. Jadi, ini tidak terlalu keren.

Tapi, ada jutaan kontrak di blockchain yang sebenarnya. Jadi, alamat ini memberi kita akses mudah ke kontrak yang ingin kita tangani! Ini akan berguna ketika kita menerapkan ke blockchain yang sebenarnya dalam beberapa pelajaran.

## 💨 Menjalankannya

Sebelum kamu menjalankan ini, pastikan untuk mengubah `solidity: "0.8.4",` menjadi `solidity: "0.8.1",` di `hardhat.config.js` kamu.

Ayo jalankan! Buka terminalmu dan jalankan:

```bash
npx hardhat run scripts/run.js
```

Kamu akan melihat `console.log` berjalan dari dalam kontrak, lalu kamu juga akan melihat alamat kontrak tercetak!!! Inilah yang aku dapatkan:

![Untitled](https://i.imgur.com/CSBimfv.png)

## 🎩 Hardhat & HRE

Dalam blok kode ini kamu akan terus-menerus melihat bahwa kita menggunakan `hre.ethers`, tetapi `hre` tidak pernah diimpor ke mana pun? Apa jenis sihir ini?

Langsung dari dokumen Hardhat sendiri kamu akan melihat ini:

> Hardhat Runtime Environment, atau disingkat HRE, adalah objek yang berisi semua fungsionalitas yang ditampilkan Hardhat saat menjalankan tugas, pengujian, atau skrip. Pada kenyataannya, Hardhat adalah HRE.

Jadi apa artinya ini? Nah, setiap kali kamu menjalankan perintah terminal yang dimulai dengan `npx hardhat` kamu mendapatkan objek `hre` ini dibangun dengan cepat menggunakan `hardhat.config.js` yang ditentukan dalam kodemu! Ini berarti kamu tidak perlu benar-benar melakukan semacam impor ke filemu seperti:

`const hardhat = require("hardhat")`

**Terlalu Panjang; Tidak Membaca - Kamu akan melihat banyak `hre` dalam kode kita, tetapi tidak pernah diimpor ke mana pun! Lihat [dokumentasi Hardhat](https://hardhat.org/advanced/hardhat-runtime-environment.html) yang keren ini untuk mempelajarinya lebih lanjut!**

## 🚨 Laporan perkembangan!

Posting tangkapan layar di #progress dengan keluaran `npx hardhat run scripts/run.js` :).
