## 📦 Simpan data!

Dari sini, mari kita tambahkan sedikit kehebatan pada kontrak kita.

Kita mahu membiarkan seseorang melambai kepada kita dan kemudian menyimpan lambaian itu.

Jadi, perkara pertama yang kita perlukan ialah fungsi yang membolehkan mereka untuk melambai kepada kita!

Blockchain = Anggap ia sebagai cloud server, seperti AWS, tetapi ia tidak dimiliki oleh sesiapa pun. Ia dikendalikan oleh komputer-komputer daripada mesin perlombongan di seluruh dunia. Biasanya orang ini dipanggil pelombong dan kita membayar mereka untuk menjalankan kod kita!

Kontrak pintar = Agak seperti kod server kita tetap dengan fungsi berbeza yang orang boleh tekan.

Jadi, inilah kontrak kita yang dikemas kini yang boleh kita gunakan untuk "menyimpan" lambaian orang.

``solidity
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

````


Boom!

Jadi, begitulah cara anda menulis fungsi dalam Solidity. Dan, kita juga menambah pembolehubah (variable) `totalWaves` yang dimulakan secara automatik kepada 0. Tetapi, pembolehubah ini istimewa kerana ia dipanggil "pembolehubah keadaan (state variable)" dan ia bagus kerana ia disimpan secara kekal dalam storan kontrak.

Kita juga menggunakan sedikit magik di sini dengan `msg.sender`. Ini ialah alamat dompet orang yang menghubungi fungsi tersebut. Bagus! Ia seperti pengesahan yang sudah terbina untuk kita. Kita tahu dengan tepat siapa yang memanggil fungsi itu kerana untuk memanggil fungsi kontrak pintar, anda perlu disambungkan dengan dompet yang sah!

Pada masa akan datang, kita boleh menulis fungsi yang hanya boleh dicapai oleh alamat dompet tertentu. Sebagai contoh, kita boleh menukar fungsi ini supaya hanya alamat kita dibenarkan untuk menghantar gelombang. Atau, mungkin ada di mana hanya rakan anda boleh melambai kepada anda!

✅ Mengemas kini run.js untuk memanggil fungsi kami
----------------------------------------------------

Jadi, `run.js` perlu berubah!

kenapa?

kita perlu memanggil secara manual fungsi yang telah kita buat.

Pada asasnya, apabila kami menggunakan kontrak kami ke rantaian blok (yang kita lakukan apabila kita menjalankan `waveContractFactory.deploy()`) fungsi kita menjadi tersedia untuk dipanggil pada rantaian blok kerana kita menggunakan kata kunci **public** khas itu pada fungsi kami.

Fikirkan ini seperti titik akhir API awam :).

Jadi sekarang kami mahu menguji fungsi tersebut secara khusus!

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
````

**VSCode mungkin mengimport `ethers` secara automatik. Kita tidak perlu mengimport `ethers`. Jadi, pastikan anda tidak mempunyai import. Ingat, apa yang kita bincangkan tentang pelajaran lepas tentang hre?**

## 🤔 Bagaimana ia berfungsi?

```javascript
const [owner, randomPerson] = await hre.ethers.getSigners();
```

Untuk menggunakan sesuatu ke blockchain, kita perlu mempunyai alamat dompet! Hardhat melakukan ini untuk kami secara ajaib di latar belakang, tetapi di sini saya mengambil alamat dompet pemilik kontrak dan saya juga mengambil alamat dompet secara rawak dan memanggilnya `randomPerson`. Ini akan lebih masuk akal dalam seketika.

Saya juga menambah:

```javascript
console.log("Kontrak digunakan oleh:", owner.address);
```

Saya melakukan ini hanya untuk melihat alamat orang yang menghantar kontrak kita. Saya ingin tahu!

Perkara terakhir yang saya tambah ialah ini:

```javascript
let waveCount;
waveCount = await waveContract.getTotalWaves();

let waveTxn = await waveContract.wave();
await waveTxn.wait();

waveCount = await waveContract.getTotalWaves();
```

Pada asasnya, kita perlu memanggil fungsi kita secara manual! Sama seperti mana-mana API biasa. Mula-mula saya memanggil fungsi untuk mengambil # jumlah lambaian. Kemudian, saya melakukan lambaian. Akhirnya, saya ambil waveCount sekali lagi untuk melihat sama ada ia berubah.

Jalankan skrip seperti biasa:

```bash
npx hardhat run scripts/run.js
```

Inilah output saya:

![](https://i.imgur.com/NgfOns3.png)

Agak hebat kan :)?

Anda juga boleh melihat alamat dompet yang dilambai bersamaan dengan alamat yang menggunakan kontrak. Saya melambai pada diri saya sendiri!

Jadi kami:\
1\. Dipanggil fungsi gelombang kami.\
2\. Menukar pembolehubah keadaan (state variable).\
3\. Baca nilai baharu pembolehubah (variable).

Ini adalah asas kepada kebanyakan kontrak pintar. Baca fungsi. Tulis fungsi. Dan menukar pembolehubah keadaan. Kita mempunyai blok bangunan yang kami ada
