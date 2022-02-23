## 👀 Menulis skrip untuk digunakan secara setempat

_"Tunggu, bukankah saya sudah menggunakan rangkaian tempatan saya??"_

lebih kurang.

Ingat, apabila anda menjalankan `scripts/run.js` ia sebenarnya

1\. Mencipta rangkaian Ethereum tempatan baharu.\
2\. Menggunakan kontrak anda.\
3\. Kemudian, apabila skrip tamat, Hardhat secara automatik akan **memusnahkan** rangkaian tempatan itu.

Kita memerlukan satu cara untuk memastikan rangkaian tempatan hidup. kenapa? Fikirkan tentang pelayan tempatan. Anda mahu mengekalkannya supaya anda boleh terus bercakap dengannya! Sebagai contoh, jika anda mempunyai pelayan setempat dengan API yang anda buat, anda ingin memastikan pelayan setempat itu hidup supaya anda boleh bekerja di tapak web anda dan mengujinya.

Kita akan melakukan perkara yang sama di sini.

Pergi ke terminal anda dan buat tetingkap **baharu**. Dalam tetingkap ini, cd kembali ke projek `my-wave-portal` anda. Kemudian, di sini pergi ke hadapan dan jalankan

```bash
npx hardhat node
```

BOOM.

Anda baru sahaja memulakan rangkaian Ethereum tempatan yang **kekal**. Dan, seperti yang anda lihat, Hardhat memberi kita 20 akaun untuk digunakan dan memberi mereka semua 10000 ETH! Wah! Projek terbaik yang pernah ada.

Jadi sekarang ini, ini hanyalah blok blok kosong. Tiada blok!

Kita mahu mencipta blok baharu dan mendapatkan kontrak pintar kita! Mari lakukan itu.

Di bawah folder `skrip`, buat fail yang dipanggil `deploy.js`. Inilah kod untuknya. Ia kelihatan sangat serupa dengan `run.js`.

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

## 🎉 MENGELUARKAN/DEPLOY

Sekarang arahan yang akan kita jalankan untuk digunakan secara tempatan ialah:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

**Anda perlu pastikan anda melakukan ini daripada** `my-wave-portal` **dari terminal yang berbeza. Kami tidak mahu mengacaukan terminal yang mengekalkan rangkaian Ethereum tempatan yang hidup.**

Okay, jadi sebaik sahaja saya menjalankannya, inilah yang saya dapat:

![](https://i.imgur.com/ZXehYOk.png)

Epik.

Kita menggunakan kontrak itu, dan kita juga mempunyai alamatnya di rantaian blok! Laman sesawang kita akan memerlukan ini supaya ia tahu di mana hendak melihat pada rantaian blok untuk kontrak anda. (Bayangkan jika ia perlu mencari seluruh blokchain untuk kontrak kami. Itu akan menjadi...teruk!).

Dalam tetingkap terminal anda yang mengekalkan rangkaian Ethereum tempatan anda hidup, anda akan melihat sesuatu yang baharu!

![](https://i.imgur.com/DmhZRJN.png)

MENARIK. Tetapi...apa itu gas? Apakah yang dimaksudkan dengan blok #1? Apakah kod besar di sebelah "Transaksi"? Saya mahu anda mencuba dan Google perkara ini. Tanya soalan dalam #general-chill-chat :).

## 🚨 Sebelum anda klik "Pelajaran Seterusnya"

Sejujurnya, tepuk belakang diri anda. Anda telah melakukan banyak perkara. Seterusnya, kita sebenarnya akan membina tapak web yang akan berinteraksi dengan rangkaian Ethereum tempatan kita dan ia akan menjadi hebat. Pergi ke #progress dan beritahu saya bagaimana projek ini berjalan sejauh ini untuk anda. Saya suka maklum balas anda.

## 🎁 Menutup tirai Seksyen

bagus! Anda berjaya sampai ke penghujung bahagian. Lihat [pautan ini](https://gist.github.com/adilanchian/9f745fdfa9186047e7a779c02f4bffb7) untuk memastikan anda berada di landasan yang betul dengan kod anda!
