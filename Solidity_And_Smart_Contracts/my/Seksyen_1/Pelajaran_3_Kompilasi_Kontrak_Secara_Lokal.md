## 🔥 Imitasi persekitaran blockchain untuk menguji

Anda telah melakukannya. Anda telah menulis kontrak pintar. Anda seorang juara!

Sekarang kita perlu sebenarnya\
1\. Susunnya.\
2\. Gunakannya ke rangkaian blok tempatan kami.\
3\. Sebaik sahaja ia berada di sana, console.log itu dan ia akan berjalan :).

Kita perlu melakukan ini kerana dalam dunia nyata, kontrak pintar hidup di blockchain. Dan, kita mahu laman sesawang dan kontrak pintar kita digunakan oleh orang sebenar supaya mereka boleh 👋 kepada kita atau melakukan apa sahaja yang anda mahu mereka lakukan!

Jadi, walaupun ketika kita bekerja secara lokal, kita mahu meniru persekitaran itu. Secara teknikalnya, kita hanya boleh menyusun dan menjalankan kod Solidity, tetapi perkara yang membuatkan Solidity ajaib ialah cara ia boleh berinteraksi dengan dompet blockchain dan Ethereum (yang akan kita lihat lebih lanjut dalam pelajaran seterusnya). Jadi, lebih baik kita hapuskan perkara ini sekarang.

Kita hanya akan menulis skrip yang mengendalikan 3 langkah tersebut untuk kami.

Mari lakukannya!

## 📝 Bina skrip untuk menjalankan kontrak kita

Pergi ke direktori **`scripts`** dan buat fail bernama **`run.js`.**

Jadi, untuk menguji kontrak pintar kita perlu melakukan banyak perkara dengan betul. Seperti: menyusu (compile)n, menggunakan (deploy), kemudian melaksanakan (execute).

Skrip kita akan menjadikannya sangat mudah untuk mengulangi kontrak kita dengan cepat :).

Jadi, inilah yang **`run.js`** akan ada:

```javascript
const utama = async () => {
  const waveContractFactory = menunggu hre.ethers.getContractFactory("WavePortal");
  const waveContract = menunggu waveContractFactory.deploy();
  tunggu waveContract.deployed();
  console.log("Kontrak digunakan untuk:", waveContract.address);
};

const runMain = async () => {
  cuba {
    tunggu main();
    process.exit(0);
  } tangkap (ralat) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
```

Hebat.

## 🤔 Bagaimana ia berfungsi?

Sekali lagi pergi baris demi baris di sini.

```javascript
const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
```

Ini sebenarnya akan menyusun kontrak kita dan menjana fail yang diperlukan yang kami perlukan untuk bekerja dengan kontrak kita di bawah direktori `artifacts`. Pergi semak selepas anda menjalankan ini :).

```javascript
const waveContract = await waveContractFactory.deploy();
```

Ini cukup hebat :).

Apa yang berlaku di sini ialah Hardhat akan mencipta rangkaian Ethereum tempatan untuk kita, tetapi hanya untuk kontrak ini. Kemudian, selepas skrip selesai ia akan memusnahkan rangkaian tempatan itu. Jadi, setiap kali anda menjalankan kontrak, ia akan menjadi rantaian baru. Apa gunanya? Ia agak seperti menyegarkan server tempatan anda setiap kali supaya anda sentiasa bermula dari senarai yang bersih yang memudahkan untuk menyahpepijat (debugging).

```javascript
await waveContract.deployed();
```

Kita akan menunggu sehingga kontrak kita digunakan secara rasmi ke blockchain tempatan kita! `Constructor` kita akan dijalankan apabila kami benar-benar deploy.

```javascript
console.log("Contract deployed to:", waveContract.address);
```

Akhir sekali, sebaik sahaja ia digunakan `waveContract.address`  pada asasnya akan memberi kita alamat kontrak yang digunakan. Alamat ini ialah bagaimana kita sebenarnya boleh mencari kontrak kita di blockchain. Terdapat berjuta-juta kontrak pada blockchain sebenar. Jadi, alamat ini memberi kita akses mudah kepada kontrak yang kita berminat untuk bekerjasama! Ini akan menjadi lebih penting sedikit kemudian apabila kita menggunakan rangkaian Ethereum sebenar.

Jom lancarkan!

```bash
npx hardhat run scripts/run.js
```

Anda sepatutnya melihat `console.log` anda dijalankan dari dalam kontrak dan kemudian anda juga harus melihat alamat kontrak dicetak!!! Inilah yang saya dapat:

![](https://i.imgur.com/ug79rOM.png)

## 🎩 Hardhat & HRE

Dalam blok kod ini anda akan sentiasa perasan bahawa kita menggunakan `hre.ethers`, tetapi `hre` tidak pernah diimport ke mana-mana sahaja? Apakah jenis silap mata ini?

Terus dari dokumen Hardhat sendiri anda akan melihat ini:

> Hardhat Runtime Environment, atau singkatannya HRE, ialah objek yang mengandungi semua fungsi yang Hardhat dedahkan semasa menjalankan tugas, ujian atau skrip. Pada hakikatnya, Hardhat ialah HRE.

Jadi apa maksudnya? Setiap kali anda menjalankan perintah terminal yang bermula dengan `npx hardhat` anda mendapat objek `hre` ini dibina dengan cepat menggunakan `hardhat.config.js` yang dinyatakan dalam kod anda! Ini bermakna anda tidak perlu melakukan beberapa jenis import ke dalam fail anda seperti:

`const hre = require("hardhat")`

**TL;DR - anda akan melihat banyak `hre` dalam kod kita, tetapi tidak pernah diimport ke mana-mana! Lihat [dokumentasi Hardhat] yang hebat ini (https://hardhat.org/advanced/hardhat-runtime-environment.html) untuk mengetahui lebih lanjut mengenainya!**

## 🚨 Sebelum anda klik "Pelajaran Seterusnya"

_Nota: kalau tak buat macam ni, Farza akan sedih sangat :(._

Pergi ke #progress dan siarkan tangkapan skrin terminal anda dengan output.

Pastikan anda membuat console.log itu apa sahaja yang anda mahu! Anda kini telah menulis kontrak anda sendiri dan menjalankannya dengan menggunakan rangkaian blok tempatan WOOOOOOOOOO LETS GOOO.
