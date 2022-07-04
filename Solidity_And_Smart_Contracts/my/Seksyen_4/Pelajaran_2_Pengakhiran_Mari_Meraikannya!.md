🎨 sempurnakan UI anda dengan citara tersindiri!
--------------------------------------

Anda telah lengkap dengan kesemua fungsi teras yang kita inginkan di dalam dapp ini. Sekarang adalah masanya untuk anda untuk menjadikan dapp ini anda punya! Tukar CSS, text, letakkan YouTube video yang kelakar, letakkan bio anda, apa-apa sahaja mengikut citarasa anda. Biar website anda terlihat segak!

**Cuba gunakan 30 minit anda untuk perkara ini. Saya sangat syorkan!**

Untuk testing, anda boleh mengubah cooldown contract daripada 15 minit ke 30 saat dengan code dibawah:

```
require(lastWavedAt[msg.sender] + 30 seconds < block.timestamp, "Must wait 30 seconds before waving again.");
```

Hal ini dapat mengurangkan masa untuk anda tunggu untuk setiap wave. Terbaik untuk test dalam masa yang singkat dan tidak menjengkelkan.

Jadi, saya telah mengubahkan ia ke 30 saat.

Apabila anda deploy contract **terakhir** anda, anda boleh tetapkan kepada durasi yang anda inginkan.


⛽️ Menetapkan limit gas
--------------------

Apabila anda cuba untuk menghantar wave sekarang, anda akan perasan kadang-kadang
anda akan dapat error seperti ini "out of gas". Kenapa ek?

Sebenarnya, Metamask sedang cuba untuk membuat anggaran berapa banyak gas yang akan digunakan untuk transaksi tersebut. Namun, di sesetengah masa, anggaran yang dibuat itu salah! Hal ini menjadi sukar dek kerana anggaran tersebut melibatkan nombor yang rawak. Jadi, sekiranya contract itu menghantar hadiah, ia akan dikenakan bayaran gas yang lebih tinggi disebabkan kita cuba untuk run code yang **lebih banyak**.

Membuat anggaran gas itu adalah satu tugas yang sukar dan jalan mudah bagi menangani masalah ini adalah untuk meletakkan had gas untuk setiap transaksi.

Di dalam App.js, saya telah mengubah satu line code yang menghantar wave kepada 

```solidity
wavePortalContract.wave(message, { gasLimit: 300000 })
```

Apa yang code ini cuba lakukan adalah ia memaksa pengguna untuk membayar 300,000 sebagai gas. Sekiranya 300,000 itu tidak habis diguna, baki akan dipulangkan semula kepada pengguna.

Jadi, sekiranya transaksi tersebut mempunyai kos berharga 250,000, *selepas* transaksi itu lengkap, ia akan menghantar kembali 50,000 baki kepada pengguna :)

🔍 Mengesahkan transaksi
---------------------------

Apabila contract anda telah dideploy dan anda sedang testing segala fungsi menerusi UI dan wallet, ia mungkin agak memeningkan sedikit pada mulanya untu mengetahui sekiranya wallet anda telah memenangi hadiah tersebut. Account anda mungkin telah menggunakan beberapa ETH sebagai gas dan pada masa yang sama anda memenangi hadiah sekiranya dipilih secara rawak. Jadi bagaimanakah cara untuk menegesahkan yang contract anda sedang berfungsi dengan betul?

Untuk mengesahkan kejadian tersebut, anda boleh membuka contract address anda di [Rinkeby Etherscan](https://rinkeby.etherscan.io/) dan lihat kesemua transaksi yang pernah berlaku di wallet anda. Anda akan jumpa pelbgai jenis maklumat yang berguna di sini, termasuklah method yang telah dicall, yang dipanggil `Wave`. Jika anda click transaksi `wave`, anda akan perasan yang `to` property merupakan contract address yang call. Sekiranya pengguna itu menang, anda akan perasan yang di dalam field tersebut yang contract telah menghantar 0.0001 ETH daripada contract address kepada account address anda.

Cuba ambil perhatian dimana `Value` untuk transaksi tersebut masih 0 ETH, hal ini kerana pegguna tidak pernah membayar apa-apa untuk memulakan wave. Penghantaran diantara komponen di dalam ETH dipanggil "internal transaction".

🎤 Events
---------

Ingat tak bagaimana kita guna jampi dibawah di dalam smart contract kita? Saya sudah mengingatkan awak sebelum ini untuk Google bagaimana events berfungsi di dalam Solidty. Sekiranya belum, pergi buat sekarang!

```solidity
emit NewWave(msg.sender, block.timestamp, _message);
```

Secara ringkasnya, events adalah mesej yang dihantar oleh smart contract kita yang kita boleh tangkap di dalam client kita.

Sekiranya saya tengah chill di website anda dan saya cuma membiarkan ia terbuka. Semasa saya membuka website ini, kawan anda yang lain bernama Jeremy memberi wave kepada anda. Sekarang, satu-satunya cara untuk saya melihat wave Jeremy tersebut adalah saya perlu refresh website ini. Ini adalah interaksi yang tidak okay. Alangkah lebih cool dan mesra sekiranya saya dapat tahu contract tersebut telah mengemaskini transaksi tersebut dan saya dapat menikmati dengan melihat wave dan mesej tersebut muncul di dalam UI?

Ia agak menjengkelkan apabila kita sendiri yang menghantar mesej dan kita perlu tunggu transaksi tersebut untuk di mined dahulu dan refresh page tersebut untuk melihat di dalam senarai yang telah diupdate. Mari kita selesaikan masalah ini.

Cuba anda lihat code saya dibawah yang telah saya kemas kini di `getAllWaves` di dalam `App.js`

```javascript
const getAllWaves = async () => {
  const { ethereum } = window;

  try {
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
      const waves = await wavePortalContract.getAllWaves();

      const wavesCleaned = waves.map(wave => {
        return {
          address: wave.waver,
          timestamp: new Date(wave.timestamp * 1000),
          message: wave.message,
        };
      });

      setAllWaves(wavesCleaned);
    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * mendengar daripada event emitter disini!
 */
useEffect(() => {
  let wavePortalContract;

  const onNewWave = (from, timestamp, message) => {
    console.log("NewWave", from, timestamp, message);
    setAllWaves(prevState => [
      ...prevState,
      {
        address: from,
        timestamp: new Date(timestamp * 1000),
        message: message,
      },
    ]);
  };

  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
    wavePortalContract.on("NewWave", onNewWave);
  }

  return () => {
    if (wavePortalContract) {
      wavePortalContract.off("NewWave", onNewWave);
    }
  };
}, []);
```

Di bahagian bawah sekali anda dapat lihat magis yang di dalam bentuk code yang telah saya tambah :) Disini, saya menggunakan "listen" apabila contract saya sedang memberikan `newWave` event. Ini mirip seperti webhook :) Sangat dope bukan?

Saya juga dapat mengakses data di dalam event tersebut seperti `message` dan `from`. Di sini, saya telah membuat `setAllwaves` apabila saya mendapat event ini dimana setiap wave yang dihantar oleh pengguna akan ditambah di dalam `allWaves` array yang kita akan terima di dalam event dan UI kita akan dikemas kini!

Ini adalah sangat menakjubkan. Ia memberikan kita peluang untuk membina web app yang dapat dikemaskini dalam waktu sebenar. Cuba anda fikir sejenak jika kita dapat menggunakan fungsi ini untuk menghasilkan Twitter atau Uber di dalam blockchain.

Saya mahu anda hack fungsi ini dan lihat apa yang anda dapat lakukan :)

🙉 Peringatan mengenai github
----------------

**Sekiranya anda memuat naik projek ini ke dalam github, jangan muat naik hardhat config file anda yang masih menyimpan private ke dalam repo anda. Anda akan dirompak**

Saya menggunakan dotenv untuk mengelakkan risiko ini daripada berlaku.

```bash
npm install --save dotenv
```

Hardhat.config.js anda akan terlihat seperti dibawah :

```javascript
require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

module.exports = {
  solidity: "0.8.0",
  networks: {
    rinkeby: {
      url: process.env.STAGING_ALCHEMY_KEY,
      accounts: [process.env.PRIVATE_KEY],
    },
    mainnet: {
      chainId: 1,
      url: process.env.PROD_ALCHEMY_KEY,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
```

dan .env anda akan terlihat seperti ini :

```
STAGING_ALCHEMY_KEY=BLAHBLAH
PROD_ALCHEMY_KEY=BLAHBLAH
PRIVATE_KEY=BLAHBLAH
```
Peringatan untuk meletakkan .env di dalam .gitignore anda.

🎉 That's a wrap
----------------

Anda telah berjaya! anda sudah berada di penghujung projek ini. Anda telah deploy sebuah smart contract dan anda telah membina sebuah web app yang dapat berkomunikasi dengan smart contract tersebut. Terdapat dua skill berbeza yang telah anda dapat yang mempunyai potensi yang besar untuk mengubah dunia ini yang makin menerima teknologi blockchain.

Saya harap anda seronok mempelajari pengenalan mengenai web3 dan saya harap anda meneruskan pembelajaran ini.

Saya akan memberitahu anda sekiranya terdapat projek baru yang dapat kita selami di dalam Discord :)

🤟 NFT anda!
-----------

Kami akan airdrop NFT yang anda selepas 1 jam dan akan mengemail anda setelah NFT tersebut berada di dalam wallet anda. Ini adalah cron job yang berlaku setiap masa! Sekiranya anda tidak dapat email tersebut di dalam tempoh 24 jam, anda boleh menghubungi kami menerusi #feedback dan tag @ **alec#8853**.

🚨 Sebelum anda pergi...
-------------------------

Pergi ke #showcase di dalam Discord dan tunjukkanlah hasil kerja anda supaya kami boleh menggunakan web app anda :)

Anda juga digalakkan untuk tweet final project ini dan tunjukkan kepada dunia mengenai ciptaan hebat anda ini! Apa yang anda telah lakukan bukannya senang. Mungkin dengan menaikkan video yang menerangkan mengenai projek anda ini di dalam tweet anda. Buatkan tweet anda lebih menarik dan tunjukkan hasil anda kepada dunia!

Dan sekiranya anda sudi, silalah tag @_buildspace :) Kami akan RT tweet tersebut. Ia juga akan memberikan satu motivasi yang kuat kepada kami sekiranya kami melihat hasil kerja anda di luar sana.

Akhir sekali, cuba beritahu pengalam anda mengenai projek ini di dalam #feedback. Apa yang anda suka mengenai buildspace? Apakah penambahbaikkan yang kami boleh gunakan untuk projek di masa hadapan?
komen anda sangat dihargai!

Jumpa lagi !!!

🎁 Akhir kata
----------

*ANDA TELAH BERJAYA* Mari tepuk tangan 👏!  Mahu melihat kesemua code yang kami tulis di dalam bahagian ini? click [di sini](https://gist.github.com/adilanchian/93fbd2e06b3b5d3acb99b5723cebd925) untuk melihat semuanya!