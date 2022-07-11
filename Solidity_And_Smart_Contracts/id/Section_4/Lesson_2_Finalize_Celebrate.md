## 🎨 Selesaikan UImu, buat UI kamu sendiri

Kamu memiliki semua fungsi inti! Sekarang, saatnya bagi kamu untuk benar-benar menjadikannya milik kamu sendiri jika kamu belum melakukannya. Ubah CSS, teks, tambahkan beberapa penyematan YouTube yang lucu, tambahkan bio kamu sendiri, apa pun. Membuat barang terlihat keren :).

**Luangkan waktu 30 menit untuk ini jika kamu mau!! Aku sangat merekomendasikannya!**

Ngomong-ngomong, saat kita sedang menguji -- Kamu mungkin ingin mengubah timer cooldown kontrakmu menjadi seperti 30 detik, bukan 15 menit seperti ini:

```
require(lastWavedAt[msg.sender] + 30 seconds < block.timestamp, "Must wait 30 seconds before waving again.");
```

Mengapa? Yah itu bisa mengganggu saat kamu menguji hanya bisa melambai setiap 15 menit!

Jadi, aku mengubah milikku menjadi 30 detik!

Saat kamu menerapkan kontrak **final**, kamu dapat menyetelnya ke apa pun yang kamu inginkan!

## ⛽️ Menyetel batas gas

Saat kamu mencoba "melambai" sekarang, kamu mungkin memperhatikan bahwa terkadang kamu mendapatkan kesalahan yang terlihat seperti "kehabisan gas". Mengapa?

Nah, pada dasarnya Metamask akan mencoba memperkirakan berapa banyak gas yang akan digunakan suatu transaksi. Tapi, terkadang itu salah! Dalam hal ini, itu dibuat lebih sulit oleh fakta bahwa kita memiliki beberapa keacakan yang terlibat. Jadi, jika kontrak mengirimkan hadiah maka orang yang ragu harus membayar lebih banyak gas karena kita menjalankan kode **lebih**.

Memperkirakan gas adalah masalah yang sulit dan solusi yang mudah untuk ini (agar pengguna kita tidak marah ketika transaksi gagal) adalah dengan menetapkan batas.

Di App.js, aku mengubah jalur yang mengirimkan lambaian ke

```solidity
wavePortalContract.wave(message, { gasLimit: 300000 })
```

Apa yang dilakukan adalah membuat pengguna membayar sejumlah gas sebesar 300.000. Dan, jika mereka tidak menggunakan semuanya dalam transaksi, mereka akan secara otomatis dikembalikan.

Jadi, jika suatu transaksi menghabiskan 250.000 gas maka *setelah* transaksi tersebut selesai, sisa 50.000 gas yang tidak digunakan pengguna akan dikembalikan :).

## 🔍 Memvalidasi transaksi

Ketika kontrakmu telah diterapkan dan kamu mengujinya dengan UI dan dompetmu, mungkin akan membingungkan pada awalnya untuk menentukan apakah akun dompet kamu berhasil diberi hadiah. Akunmu akan menghabiskan sejumlah gas dan berpotensi diberi hadiah ETH. Jadi bagaimana kamu bisa memvalidasi apakah kontrakmu bekerja seperti yang diharapkan?

Untuk memvalidasi, kamu dapat membuka alamat kontrakmu di [Rinkeby Etherscan](https://rinkeby.etherscan.io/) dan melihat transaksi yang telah terjadi. kamu akan menemukan segala macam informasi berguna di sini, termasuk metode yang dipanggil, yang dalam hal ini adalah `Wave`. Jika kamu mengklik transaksi `Wave`, kamu akan melihat bahwa di properti `To`, ini akan mengidentifikasi bahwa alamat kontrak telah dipanggil. Jika pengguna telah memenangkan hadiah, kamu akan melihat di bidang itu, bahwa kontrak telah mentransfer 0,0001 ETH dari alamat kontrak ke alamat akunmu.

Perhatikan bahwa `Value` transaksi masih 0 ETH, karena pengguna tidak pernah membayar apa pun untuk memulai wave. Transfer ETH secara internal dari kontrak pintar disebut "transaksi internal" dan kamu dapat melihatnya dengan mengalihkan tab pada Etherscan.

## 🎤 Event

Ingat bagaimana kita menggunakan garis ajaib di bawah ini dalam kontrak pintar kita? Aku memberi tahu kamu untuk Google bagaimana event di Solidity bekerja. Silakan lakukan itu sekarang jika kamu belum melakukannya!

```solidity
emit NewWave(msg.sender, block.timestamp, _message);
```

Pada tingkat dasar, event adalah pesan yang dikeluarkan oleh kontrak pintar kita yang dapat kita tangkap pada klien kita secara real-time.

Katakanlah aku sedang bersantai di situs webmu dan aku baru saja membukanya. Saat aku melakukan ini, temanmu yang lain Jeremy melambai padamu. Saat ini, satu-satunya caraku melihat lambaian Jeremy adalah jika aku menyegarkan halamanku. Ini sepertinya buruk. Bukankah lebih keren jika aku tahu bahwa kontrak itu telah diperbarui dan UIku diperbarui secara ajaib?

Bahkan sekarang, agak menjengkelkan ketika kita sendiri yang mengirimkan pesan, dan kemudian kita harus menunggu untuk ditambang dan kemudian menyegarkan halaman untuk melihat semua daftar pesan yang diperbarui, bukan? Mari kita perbaiki itu.

Lihat kodeku di sini tempat aku memperbarui `getAllWaves` di `App.js.`

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
 * Dengarkan event emitor!
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

Di bagian paling bawah kamu akan melihat kode ajaib yang aku tambahkan :). Di sini, aku benar-benar dapat "mendengarkan" ketika kontrakku melempar event `NewWave`. Seperti webhook :). Cukup keren, kan?

Aku juga dapat mengakses data tersebut pada event tersebut seperti `message` dan `from`. Di sini, aku melakukan `setAllWaves` ketika aku mendapatkan acara ini yang berarti pesan pengguna akan secara otomatis ditambahkan ke array `allWaves`ku ketika kita menerima event dan UI kita akan diperbarui!

Ini sangat kuat. Ini memungkinkan kita membuat aplikasi web yang diperbarui secara real-time :). Pikirkan jika kamu membuat sesuatu seperti Uber atau Twitter di blockchain, aplikasi web yang diperbarui secara real-time menjadi sangat penting.

Aku ingin kamu meretas ini dan membangun apa pun yang kamu inginkan :).


## 🙉 Catatan di github

**Jika mengunggah ke Github, jangan mengunggah file konfigurasi hardhatmu dengan kunci pribadi kamu ke repomu. Kamu akan dirampok.**

Aku menggunakan dotenv untuk ini.

```bash
npm install --save dotenv
```

File hardhat.config.js kamu akan terlihat seperti:

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

Dan file .env kamu akan terlihat seperti:

```
STAGING_ALCHEMY_KEY=BLAHBLAH
PROD_ALCHEMY_KEY=BLAHBLAH
PRIVATE_KEY=BLAHBLAH
```

Pastikan untuk memiliki .env di .gitignore kamu.

## 🎉 Itu selesai

Kamu telah melakukannya. Kamu telah menerapkan kontrak cerdas dan kamu telah menulis aplikasi web yang membahasnya. Ini adalah dua keterampilan yang akan lebih mengubah dunia saat kita bergerak menuju kenyataan di mana aplikasi web terdesentralisasi menjadi lebih umum.

Aku harap ini adalah pengantar yang menyenangkan untuk web3 dan aku harap kamu melanjutkan perjalananmu.

Aku akan membuat kalian semua diposting di proyek baru di Discord :).

## 🤟 NFTmu!

Kami akan mengirimkan NFT kamu dalam waktu satu jam dan akan mengirim email kepada kamu setelah ada di dompetmu. Ini berjalan pada pekerjaan cron! Jika kamu tidak menerima email dalam waktu 24 jam, mohon kirimkan pesan kepada kami di #feedback dan tag @ **alec#8853**.


## 🚨 Sebelum kamu keluar

Buka #showcase di Discord dan tunjukkan kepada kami produk akhirmu yang dapat kami mainkan :).

Juga, kamu harus benar-benar men-tweet proyek akhirmu dan menunjukkan kepada dunia kreasi epikmu! Apa yang kamu lakukan tidak mudah dengan cara apapun. Bahkan mungkin membuat video kecil yang memamerkan proyek kamu dan melampirkannya ke tweet. Jadikan tweetmu terlihat cantik dan pamer :).

Dan jika kamu merasa sanggup, tag @_buildspace :). Kami akan RT. Plus, itu memberi kami banyak motivasi setiap kali kami melihat orang mengirimkan proyek mereka.

Terakhir, yang juga akan luar biasa adalah jika kamu memberi tahu kami di #feedback betapa kamu menyukai proyek ini dan struktur proyeknya. Apa yang paling kamu sukai dari buildspace? Apa yang ingin kami ubah untuk proyek masa depan? Umpan balikmu akan luar biasa!!


Sampai jumpa!!!


## 🎁 Merangkumkan

*KAMU MELAKUKANNYA.* Tepuk tangan di sekeliling ! Ingin melihat semua kode yang kami tulis untuk bagian ini? Klik [tautan ini](https://gist.github.com/adilanchian/93fbd2e06b3b5d3acb99b5723cebd925) untuk melihat semuanya!
