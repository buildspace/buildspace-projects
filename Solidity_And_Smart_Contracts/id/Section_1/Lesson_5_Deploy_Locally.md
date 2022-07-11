## 👀 Menulis skrip untuk disebarkan secara lokal

*"Tunggu, bukankah aku sudah men-deploy ke jaringan lokalku??"*

Ya, bisa dibilang.

Ingat, saat kamu menjalankan `scripts/run.js` itu sebenarnya

1\. Membuat jaringan Ethereum lokal baru.\
2\. Menyebarkan kontrak kamu.\
3\. Kemudian, ketika skrip berakhir, Hardhat akan secara otomatis **menghancurkan** jaringan lokal tersebut.

Kita membutuhkan cara untuk menjaga jaringan lokal tetap hidup. Mengapa? Nah, pikirkan tentang server lokal. Kamu ingin untuk membuatnya tetap hidup sehingga kamu dapat terus berbicara dengannya! Misalnya, jika kamu memiliki server lokal dengan API yang kamu buat, kamu ingin menjaga server lokal itu tetap hidup sehingga kamu dapat bekerja di situs web kamu dan mengujinya.

Kita akan melakukan hal yang sama di sini.

Buka terminal kamu dan buat jendela **baru**. Di jendela ini, cd kembali ke proyek `my-wave-portal` kamu. Kemudian, di sini cobalah untuk jalankan

```bash
npx hardhat node
```

DUAR.

Kamu baru saja memulai jaringan Ethereum lokal yang **tetap hidup**. Dan, seperti yang kamu lihat, Hardhat memberi kita 20 akun untuk digunakan dan memberi mereka semua 10.000 ETH, kita sekarang kaya! Wow! Proyek terbaik yang pernah ada.

Jadi saat ini, ini hanyalah blockchain kosong. Tidak ada blok!

Kita ingin membuat blok baru dan mendapatkan kontrak pintar kita di dalamnya! Mari lakukan itu.

Di bawah folder `scripts`, buat file bernama `deploy.js`. Berikut kode untuk itu. Isinya sangat mirip dengan `run.js`.

```javascript
const main = async () => {
  const [deployer] = await hre.ethers.getSigners();
  const accountBalance = await deployer.getBalance();

  console.log("Deploying contracts with account: ", deployer.address);
  console.log("Account balance: ", accountBalance.toString());

  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy();
  await waveContract.deployed();

  console.log("WavePortal address: ", waveContract.address);
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

## 🎉 MENYEBARKAN

Sekarang perintah yang akan kita jalankan untuk menyebarkan secara lokal adalah:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

**Kamu perlu memastikan kamu melakukannya dari direktori** `my-wave-portal` **dari jendela terminal yang berbeda. Kita tidak ingin mengacaukan jendela terminal yang menjaga jaringan Ethereum lokal kita tetap hidup.**

Oke, jadi setelah aku menjalankannya, inilah yang aku dapatkan:

![](https://i.imgur.com/ZXehYOk.png)

Hebat sekali. 

Kita telah menyebarkan kontrak, dan kita juga memiliki alamatnya di blockchain! Situs web kita akan membutuhkan ini sehingga ia tahu di mana mencarinya di blockchain untuk kontrakmu. (Bayangkan jika harus mencari seluruh blockchain untuk kontrak kita. Itu akan...buruk!).

Di jendela terminal kamu yang menjaga jaringan Ethereum lokal kamu tetap hidup, kamu akan melihat sesuatu yang baru!

![](https://i.imgur.com/DmhZRJN.png)

MENARIK. Tapi... apa itu gas? Apa yang dimaksud dengan blok #1? Apa kode besar di sebelah "Transaksi"? Aku ingin kamu mencoba dan Google hal ini. Ajukan pertanyaan di #general-chill-chat :).


## 🚨 Sebelum kamu mengklik "Pelajaran Berikutnya"

Sejujurnya, beri dirimu tepukan di punggung. Kamu telah melakukan banyak hal. Selanjutnya kita akan benar-benar membangun situs web yang akan berinteraksi dengan jaringan Ethereum lokal kita dan itu akan menjadi luar biasa. Buka #progress dan beri tahu aku bagaimana proyek ini berjalan sejauh ini untukmu. Aku akan senang dengan tanggapanmu.


## 🎁 Bagian Penutup

Bagus! kamu berhasil mencapai akhir bagian. Lihat [tautan ini](https://gist.github.com/adilanchian/9f745fdfa9186047e7a779c02f4bffb7) untuk memastikan kamu berada di jalur yang sesuai dengan kodemu!
