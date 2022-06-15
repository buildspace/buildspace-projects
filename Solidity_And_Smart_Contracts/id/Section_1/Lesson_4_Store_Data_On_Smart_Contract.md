## 📦 Simpan datanya!

Dari sini, mari tambahkan beberapa kemewahan pada kontrak kita.

Kita ingin dapat membiarkan seseorang melambai pada kita dan kemudian menyimpan lambaian itu.

Jadi, hal pertama yang kita butuhkan adalah fungsi yang bisa mereka pakai untuk melambai pada kita!

Blockchain = Anggap saja sebagai penyedia cloud, seperti AWS, tetapi tidak dimiliki oleh siapa pun. Ini dijalankan dengan daya komputasi dari mesin pertambangan di seluruh dunia. Biasanya orang-orang ini disebut penambang dan kita membayar mereka untuk menjalankan kode kita!

Kontrak cerdas = Agak seperti kode server kita dengan fungsi berbeda yang dapat dicapai orang.

Jadi, inilah kontrak terbaru kita yang dapat kita gunakan untuk "menyimpan" lambaian.

```solidity
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;

    constructor() {
        console.log("Yo yo, I am a contract and I am smart");
    }

    function wave() public {
        totalWaves += 1;
        console.log("%s has waved!", msg.sender);
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }
}
```

Dor!

Jadi, begitulah cara kamu menulis fungsi di Solidity. Dan, kita juga menambahkan variabel `totalWaves` yang secara otomatis diinisialisasi ke 0. Tapi, variabel ini istimewa karena disebut "state variable" dan keren karena disimpan secara permanen di penyimpanan kontrak.

Kita juga menggunakan beberapa keajaiban di sini dengan `msg.sender`. Ini adalah alamat dompet orang yang memanggil fungsi tersebut. Ini luar biasa! Ini seperti otentikasi bawaan. Kita tahu persis siapa yang memanggil fungsi tersebut karena bahkan untuk memanggil fungsi kontrak pintar, kamu harus terhubung dengan dompet yang valid!

Di masa depan, kita dapat menulis fungsi yang hanya dapat dilakukan oleh alamat dompet tertentu. Misalnya, kita dapat mengubah fungsi ini sehingga hanya alamat kita yang diizinkan untuk mengirim lambaian. Atau, mungkin memilikinya di mana hanya teman kamu yang bisa melambai pada kamu!

## ✅ Memperbarui run.js untuk memanggil fungsi kita

Jadi, `run.js` perlu diubah!

Mengapa?

Nah, kita perlu memanggil fungsi yang telah kita buat secara manual.

Pada dasarnya, ketika kita menerapkan kontrak kita ke blockchain (yang kita lakukan ketika kita menjalankan `waveContractFactory.deploy()`), fungsi kita akan tersedia untuk dipanggil di blockchain karena kita menggunakan kata kunci **public** khusus pada fungsi kita.

Pikirkan ini seperti titik akhir API publik :).

Jadi sekarang kita ingin menguji fungsi-fungsi tersebut secara khusus!

```javascript
const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy();
  await waveContract.deployed();

  console.log("Contract deployed to:", waveContract.address);
  console.log("Contract deployed by:", owner.address);

  let waveCount;
  waveCount = await waveContract.getTotalWaves();

  let waveTxn = await waveContract.wave();
  await waveTxn.wait();

  waveCount = await waveContract.getTotalWaves();
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
**VSCode mungkin mengimpor `ethers` secara otomatis. Kita tidak perlu mengimpor `ethers`. Jadi, pastikan kamu tidak memiliki imports. Ingat, apa yang kita bicarakan tentang pelajaran terakhir tentang ini?**

## 🤔 Bagaimana cara kerjanya?

```javascript
const [owner, randomPerson] = await hre.ethers.getSigners();
```

Untuk menyebarkan sesuatu ke blockchain, kita harus memiliki alamat dompet! Hardhat melakukan ini untuk kita secara ajaib di latar belakang, tetapi di sini aku mengambil alamat dompet pemilik kontrak dan aku juga mengambil alamat dompet acak dan menyebutnya `randomPerson`. Ini akan lebih masuk akal dalam beberapa saat.

Aku juga menambahkan:

```javascript
console.log("Contract deployed by:", owner.address);
```

Aku melakukan ini hanya untuk melihat alamat orang yang menerapkan kontrak kita. Aku penasaran!

Hal terakhir yang aku tambahkan adalah ini:

```javascript
let waveCount;
waveCount = await waveContract.getTotalWaves();

let waveTxn = await waveContract.wave();
await waveTxn.wait();

waveCount = await waveContract.getTotalWaves();
```

Pada dasarnya, kita perlu memanggil fungsi kita secara manual! Sama seperti yang kita lakukan pada API biasa. Pertama aku memanggil fungsi untuk mengambil # dari total lambaian. Kemudian, aku melambai. Akhirnya, aku mengambil waveCount sekali lagi untuk melihat apakah itu berubah.

Jalankan skrip seperti biasanya:

```bash
npx hardhat run scripts/run.js
```

Inilah hasil keluaranku:

![](https://i.imgur.com/NgfOns3.png)

Cukup mengagumkan, ya :)?

Kamu juga dapat melihat alamat dompet yang melambai sama dengan alamat yang menyebarkan kontrak. Aku melambai pada diriku sendiri!

Jadi kita:\
1\. Memanggil fungsi melambai kita.\
2\. Mengubah variabel state.\
3\. Membaca nilai baru variabel.

Ini adalah dasar dari sebagian besar kontrak pintar. Membaca fungsi. Menulis fungsi. Dan mengubah variabel state. Kita memiliki blok bangunan yang kita butuhkan sekarang untuk terus mengerjakan WavePortal epik kita.

Tidak lama lagi, kita akan dapat memanggil fungsi-fungsi ini dari aplikasi react kita yang akan kita kerjakan :).


## 🤝 Uji pengguna lain

Jadi, kita mungkin ingin orang lain selain kita mengirimi kita lambaian kan? Akan sangat membosankan jika hanya kita yang bisa mengirim lambaian!! Kita ingin membuat situs web kita **multipemain**!

Lihat ini. Aku menambahkan beberapa baris di bagian bawah fungsi. Aku tidak akan menjelaskan banyak (tapi tolong ajukan pertanyaan di #general-chill-chat). Pada dasarnya ini adalah bagaimana kita dapat mensimulasikan orang lain yang memukul fungsi kita :). Awasi alamat dompet di terminal kamu setelah kamu mengubah kode dan menjalankannya.

```javascript
const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy();
  await waveContract.deployed();

  console.log("Contract deployed to:", waveContract.address);
  console.log("Contract deployed by:", owner.address);

  let waveCount;
  waveCount = await waveContract.getTotalWaves();

  let waveTxn = await waveContract.wave();
  await waveTxn.wait();

  waveCount = await waveContract.getTotalWaves();

  waveTxn = await waveContract.connect(randomPerson).wave();
  await waveTxn.wait();

  waveCount = await waveContract.getTotalWaves();
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

Item terbaru yang ditambahkan ke blok kode ini adalah:

```javascript
waveTxn = await waveContract.connect(randomPerson).wave();
await waveTxn.wait();

waveCount = await waveContract.getTotalWaves();
```

## 🚨 Sebelum kamu mengklik "Pelajaran Berikutnya"

*Catatan: jika kamu tidak melakukan ini, Farza akan sangat sedih :(.*

Ubahlah kode kamu sedikit!! Mungkin kamu ingin menyimpan sesuatu yang lain? Aku ingin kau main-main. Mungkin kamu ingin menyimpan alamat pengirim dalam array? Mungkin kamu ingin menyimpan peta alamat dan jumlah lambaian sehingga kamu dapat melacak siapa yang paling sering melambai kepada kamu? Bahkan jika kamu hanya mengubah nama variabel dan nama fungsi menjadi sesuatu yang menurut kamu menarik, itu adalah kesepakatan besar. Cobalah untuk tidak langsung meniruku! Pikirkan situs web akhir kamu dan jenis fungsi yang kamu inginkan. Bangun fungsionalitas **yang kamu inginkan**.

Setelah kamu selesai di sini, pastikan untuk memposting tangkapan layar dari keluaran terminal kamu di #progress.
