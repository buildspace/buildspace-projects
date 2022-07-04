*Catatan: pelajaran ini sedikit lebih lama dari yang lain!*

Sekarang setelah semua skrip kita siap dan dasar-dasarnya sudah selesai, kita akan mencetak beberapa NFT! Inilah tampilan `MyEpicNFT.sol`ku yang diperbarui:

```solidity
pragma solidity ^0.8.1;

// Pertama-tama kita mengimpor beberapa Kontrak OpenZeppelin.
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

// Kita mewarisi kontrak yang kita impor. Ini berarti kita akan memiliki akses
// ke metode kontrak yang diwarisi.
contract MyEpicNFT is ERC721URIStorage {
  // Sihir yang diberikan kepada kita oleh OpenZeppelin untuk membantu kita melacak tokenIds. menggunakan Counters untuk Counters.Counter;
  Counters.Counter private _tokenIds;

  // Kita harus memberikan nama token NFT kita dan simbolnya.
  constructor() ERC721 ("SquareNFT", "SQUARE") {
    console.log("This is my NFT contract. Woah!");
  }

  // Sebuah fungsi yang pengguna kita akan tekan untuk mendapatkan NFT mereka.
  function makeAnEpicNFT() public {
     // Dapatkan tokenId saat ini, ini dimulai dari 0.
    uint256 newItemId = _tokenIds.current();

     // Sebenarnya cetak NFT ke pengirim menggunakan msg.sender.
    _safeMint(msg.sender, newItemId);

    // Mengatur data NFT.
    _setTokenURI(newItemId, "blah");

    // Tingkatkan penghitung saat NFT berikutnya dicetak.
    _tokenIds.increment();
  }
}
```

Banyak hal yang terjadi di sini. Pertama, kamu akan melihat aku "mewarisi" kontrak OpenZeppelin menggunakan `is ERC721URIStorage` saat aku mendeklarasikan kontrak. Kamu dapat membaca lebih lanjut tentang pewarisan [di sini](https://solidity-by-example.org/inheritance/), tetapi pada dasarnya, itu berarti kita dapat memanggil kontrak lain dari kontrak kita. Ini hampir seperti mengimpor fungsi untuk kita gunakan!

Standar NFT dikenal sebagai `ERC721` yang dapat kamu baca sedikit [di sini](https://eips.ethereum.org/EIPS/eip-721). OpenZeppelin pada dasarnya mengimplementasikan standar NFT untuk kita dan kemudian memungkinkan kita menulis logika kita sendiri di atasnya untuk menyesuaikannya. Itu berarti kita tidak perlu menulis kode pelat boiler.

Akan gila untuk menulis server HTTP dari awal tanpa menggunakan perpustakaan, bukan? Tentu saja, kecuali jika kamu ingin menjelajah haha. Tapi kita hanya ingin bangun dan berlari di sini.

Demikian pula — akan gila jika hanya menulis kontrak NFT dari awal! Kamu dapat mempelajari kontrak `ERC721` yang kita warisi [di sini](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol).

Pertama, mari kita instal paket kontrak OpenZeppelin dengan npm. Jalankan perintah ini di terminalmu:

```
npm install @openzeppelin/contracts
```

Mari kita lakukan langkah demi langkah melalui fungsi `makeAnEpicNFT`.

```solidity
uint256 newItemId = _tokenIds.current();
```

Apa itu `_tokenIds`? Nah, ingat contoh Picasso? Dia memiliki 100 sketsa NFT bernama seperti Sketch #1, Sketch #2, Sketch #3, dll. Itu adalah pengidentifikasi unik.

Hal yang sama di sini, kita menggunakan `_tokenIds` untuk melacak pengenal unik NFT, dan itu hanya angka! Ini secara otomatis diinisialisasi ke 0 ketika kita mendeklarasikan `private _tokenIds`. Jadi, ketika kita pertama kali memanggil `makeAnEpicNFT`, `newItemId` adalah 0. Ketika kita menjalankannya lagi, `newItemId` akan menjadi 1, dan seterusnya!

`_tokenIds` adalah **variabel state** yang artinya jika kita mengubahnya, nilainya langsung disimpan di kontrak.

```solidity
_safeMint(msg.sender, newItemId);
```

Ketika kita melakukan `_safeMint(msg.sender, newItemId)` itu cukup banyak mengatakan: "mint NFT dengan id `newItemId` ke pengguna dengan alamat `msg.sender`". Di sini, `msg.sender` adalah variabel yang [Solidity sendiri menyediakan](https://docs.soliditylang.org/en/develop/units-and-global-variables.html#block-and-transaction-properties) agar mudah memberi kita akses ke **alamat publik** orang yang menelepon kontrak.

Yang luar biasa di sini adalah **cara super aman untuk mendapatkan alamat publik pengguna**. Merahasiakan alamat publik itu sendiri bukanlah masalah, itu sudah umum!! Semua orang melihatnya. Namun, dengan menggunakan `msg.sender` kamu tidak dapat "memalsukan" alamat publik orang lain kecuali kamu memiliki kredensial dompet mereka dan memanggil kontrak atas nama mereka!

**Kamu tidak dapat memanggil kontrak secara anonim**, kamu harus menghubungkan kredensial dompetmu. Ini hampir seperti "masuk" dan diautentikasi :).

```solidity
_setTokenURI(newItemId, "blah");
```

Kita kemudian melakukan, `_setTokenURI(newItemId, "blah")` yang akan mengatur pengidentifikasi unik NFT bersama dengan data yang terkait dengan pengidentifikasi unik itu. Secara harfiah kita mengatur data aktual yang membuat NFT berharga. Dalam hal ini, kita menetapkannya sebagai "blah" yang....tidak begitu berharga ;). Itu juga tidak mengikuti standar `ERC721`. Kita akan membahas `tokenURI` lebih banyak sebentar lagi.

```solidity
_tokenIds.increment();
```

Setelah NFT dicetak, kita menambahkan `tokenIds` menggunakan `_tokenIds.increment()` (yang merupakan fungsi yang diberikan OpenZeppelin kepada kita). Ini memastikan bahwa saat NFT dicetak, ia akan memiliki pengenal `tokenIds` yang berbeda. Tidak seorang pun dapat memiliki `tokenIds` yang telah dicetak juga.

## 🎟 `tokenURI` dan berjalan secara lokal

`tokenURI` adalah tempat data NFT aktual berada. Dan biasanya **link** ke file JSON yang disebut `metadata` yang terlihat seperti ini:

```bash
{
    "name": "Spongebob Cowboy Pants",
    "description": "A silent hero. A watchful protector.",
    "image": "https://i.imgur.com/v7U019j.png"
}
```

Kamu dapat menyesuaikan ini, tetapi, hampir setiap NFT memiliki nama, deskripsi, dan tautan ke sesuatu seperti video, gambar, dll. Bahkan dapat memiliki atribut khusus di dalamnya! Hati-hati dengan struktur metadatamu, jika strukturmu tidak sesuai dengan [Persyaratan OpenSea](https://docs.opensea.io/docs/metadata-standards) NFTmu akan tampak rusak di situs web.

Ini semua adalah bagian dari standar `ERC721` dan memungkinkan orang untuk membangun situs web di atas data NFT. Misalnya, [OpenSea](https://opensea.io/assets) adalah pasar untuk NFT. Dan, setiap NFT di OpenSea mengikuti standar metadata `ERC721` yang memudahkan orang untuk membeli/menjual NFT. Bayangkan jika setiap orang mengikuti standar NFT mereka sendiri dan menyusun metadata mereka sesuai keinginan mereka, itu akan menjadi kekacauan!

Kita dapat menyalin metadata JSON `Spongebob Cowboy Pants` di atas dan menempelkannya ke situs web [ini](https://jsonkeeper.com/). Situs web ini hanyalah tempat yang mudah bagi orang untuk meng-host data JSON dan kita akan menggunakannya untuk menyimpan data NFT kita untuk saat ini. Setelah kamu mengklik "Simpan", kamu akan mendapatkan tautan ke file JSON. (Misalnya, milikku adalah [`https://jsonkeeper.com/b/RUUS`](https://jsonkeeper.com/b/RUUS)). Pastikan untuk menguji tautanmu dan pastikan semuanya terlihat bagus!

**Catatan: Aku ingin kamu membuat metadata JSONmu sendiri, bukan hanya menyalin milikku. Gunakan gambar, nama, dan deskripsimu sendiri. Mungkin kamu ingin NFTmu menjadi gambar karakter anime favorit kamu, band favorit kamu, apa pun!! Jadikan itu khusus. Jangan khawatir, kita akan dapat mengubahnya di masa mendatang!**

Jika kamu memutuskan untuk menggunakan gambarmu sendiri, pastikan URL langsung menuju ke gambar yang sebenarnya, bukan situs web yang menghosting gambar tersebut! Tautan Imgur langsung terlihat seperti ini - `https://i.imgur.com/123123.png` BUKAN `https://imgur.com/gallery/123123`. Cara termudah untuk mengetahuinya adalah dengan memeriksa apakah URL diakhiri dengan ekstensi gambar seperti `.png` atau `.jpg`. Kamu dapat mengklik kanan gambar imgur dan "salin alamat gambar". Ini akan memberimu URL yang benar.

Sekarang, mari menuju ke kontrak pintar kita dan ubah satu baris. Dari pada:

```solidity
_setTokenURI(newItemId, "blah")
```

Kita akan benar-benar mengatur URI sebagai tautan ke file JSON kita.

```solidity
_setTokenURI(newItemId, "MASUKKAN_URL_JSON_ANDA_DI_SINI");
```

Di bawah baris itu, kita juga dapat menambahkan `console.log` untuk membantu kita melihat kapan NFT dicetak dan kepada siapa!

```solidity
console.log("An NFT w/ ID %s has been minted to %s", newItemId, msg.sender);
```

## 🎉 Cetak NFT secara lokal

Dari sini, yang perlu kita lakukan sebenarnya adalah mengubah file `run.js` kita menjadi benar-benar memanggil fungsi `makeAnEpicNFT()` kita. Inilah yang perlu kita lakukan:

```javascript
const main = async () => {
  const nftContractFactory = await hre.ethers.getContractFactory('MyEpicNFT');
  const nftContract = await nftContractFactory.deploy();
  await nftContract.deployed();
  console.log("Contract deployed to:", nftContract.address);

  // Panggil fungsi.
  let txn = await nftContract.makeAnEpicNFT()
  // Tunggu ditambang.
  await txn.wait()

  // Cetak NFT lain untuk bersenang-senang.
  txn = await nftContract.makeAnEpicNFT()
  // Tunggu ditambang.
  await txn.wait()

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

Ketika aku menjalankan ini menggunakan:

```bash
npx hardhat run scripts/run.js
```

Inilah yang aku dapatkan:

![Untitled](https://i.imgur.com/EfsOs5O.png)

Duar! Kita baru saja mencetak NFT dengan id `0` secara lokal untuk kita sendiri! Jadi, kita tahu bahwa kodenya berfungsi dan tidak ada yang mogok. Luar biasa. Kamu selalu ingin menggunakan `run.js` untuk memastikan semuanya berfungsi secara lokal dan tidak mogok. Ini adalah taman bermain kecil kamu sendiri!

Jadi, sekarang setiap kali seseorang mencetak NFT dengan fungsi ini, NFT selalu sama — `Spongebob Cowboy Pants`! Kita akan mempelajari di bagian berikut bagaimana cara mengubahnya sehingga setiap orang yang mencetak NFT dengan kamu akan mendapatkan NFT unik dan acak.

Sekarang, mari kita beralih ke langkah berikutnya — menyebarkan ke testnet :).

## 🎉 Terapkan ke Rinkeby dan lihat di OpenSea

Saat kita menggunakan `run.js`, hanya kita yang bekerja secara lokal.

Langkah selanjutnya adalah testnet yang dapat kamu anggap seperti lingkungan "staging". Saat menerapkan ke testnet, kita sebenarnya dapat **melihat NFT kita secara online** dan kita selangkah lebih dekat untuk menyampaikannya kepada **pengguna nyata.**

##  💳 Transaksi

Jadi, ketika kita ingin melakukan tindakan yang mengubah blockchain, kita menyebutnya sebagai *transaksi*. Misalnya, mengirim ETH kepada seseorang adalah transaksi karena kita mengubah saldo akun. Melakukan sesuatu yang memperbarui variabel dalam kontrak kita juga dianggap sebagai transaksi karena kita mengubah data. Mencetak NFT adalah transaksi karena kita menyimpan data di kontrak.

**Menerapkan kontrak pintar juga merupakan transaksi.**

Ingat, blockchain tidak memiliki pemilik. Hanya sekelompok komputer di seluruh dunia yang dijalankan oleh **penambang** yang memiliki salinan blockchain.

Saat kita menerapkan kontrak kita,kita perlu memberi tahu **semua** penambang itu, "hei, ini kontrak pintar baru, harap tambahkan kontrak pintar aku ke blockchain, lalu beri tahu semua orang tentang hal itu juga".

Di sinilah [Alchemy](https://alchemy.com/?r=b93d1f12b8828a57) masuk.

Alchemy pada dasarnya membantu kita menyiarkan transaksi pembuatan kontrak kita sehingga dapat diambil oleh penambang secepat mungkin. Setelah transaksi ditambang, itu kemudian disiarkan ke blockchain sebagai transaksi yang sah. Dari sana, semua orang memperbarui salinan blockchain mereka.

Ini rumit. Dan, jangan khawatir jika kamu tidak sepenuhnya memahaminya. Saat kamu menulis lebih banyak kode dan benar-benar membuat aplikasi ini, tentu saja akan lebih masuk akal.

Jadi, buat akun dengan Alchemy [di sini](https://alchemy.com/?r=b93d1f12b8828a57).

Dan kemudian lihat videoku di bawah ini untuk mempelajari cara mendapatkan kunci APImu untuk testnet:
[Loom](https://www.loom.com/share/21aa1d64ea634c0c9da8fc5faaf24283?t=0)

## 🕸 Testnet

Kita tidak akan menyebarkan ke "Ethereum mainnet" untuk saat ini. Mengapa? Karena harganya $ nyata dan tidak layak untuk dikacaukan! Kita baru belajar sekarang. Kita akan mulai dengan "testnet" yang merupakan tiruan dari "mainnet" tetapi menggunakan $ palsu sehingga kita dapat menguji hal-hal sebanyak yang kita inginkan. Namun, penting untuk diketahui bahwa testnet dijalankan oleh penambang yang sebenarnya dan meniru skenario dunia nyata.

Ini luar biasa karena kita dapat menguji aplikasi kita dalam skenario dunia nyata di mana kita benar-benar akan:


1. Menyiarkan transaksi kita

2. Menunggu sampai diambil oleh penambang yang sebenarnya

3. Menunggu sampai ditambang

4. Menunggu sampai disiarkan kembali ke blockchain memberitahu semua penambang lain untuk memperbarui salinan mereka


## 🤑 Mendapatkan beberapa $ palsu

Ada beberapa testnet di luar sana dan yang akan kita gunakan disebut "Rinkeby" yang dijalankan oleh yayasan Ethereum.

Untuk menyebarkan ke Rinkeby, kita membutuhkan ETH palsu. Mengapa? Karena jika kamu menyebarkan ke mainnet Ethereum yang sebenarnya, kamu akan menggunakan uang sungguhan! Jadi, testnet menyalin cara kerja mainnet, satu-satunya perbedaan adalah tidak ada uang nyata yang terlibat.

Untuk mendapatkan ETH palsu, kita harus meminta jaringan. **ETH palsu ini hanya akan bekerja pada testnet khusus ini.** Kamu dapat mengambil beberapa Ethereum palsu untuk Rinkeby melalui faucet. Kamu hanya harus menemukan satu yang bekerja haha.

Untuk MyCrypto, kamu harus menghubungkan dompetmu, membuat akun, lalu mengklik tautan yang sama lagi untuk meminta dana. Untuk faucet rinkeby resmi, jika mencantumkan 0 rekan, tidak ada gunanya membuat tweet/postingan Facebook publik.

Kamu memiliki beberapa faucet untuk dipilih:

| Nama             | Tautan                                  | Jumlah          | Waktu         |
| ---------------- | ------------------------------------- | --------------- | ------------ |
| MyCrypto         | https://app.mycrypto.com/faucet       | 0.01            | Tidak ada         |
| Official Rinkeby | https://faucet.rinkeby.io/            | 3 / 7.5 / 18.75 | 8j / 1h / 3h |
| Chainlink        | https://faucets.chain.link/rinkeby    | 0.1             | Tidak ada         |

## 🙃 Kesulitan mendapatkan Testnet ETH?

Jika cara di atas tidak berhasil, gunakan perintah `/faucet` di saluran #faucet-request dan bot kami akan mengirimkan kamu beberapa! Jika kamu menginginkan lebih, kirim alamat dompet publik kamu dan berikan gif lucu. Entah aku, atau seseorang dari proyek akan mengirimkan kamu beberapa ETH palsu sesegera mungkin. Semakin lucu gif, semakin cepat kamu dikirimi ETH palsu HAHA.

## 🚀 Siapkan file deploy.js

Sebaiknya pisahkan skrip penerapanmu dari skrip `run.js`mu. `run.js` adalah tempat kita sering dipusingkan, kita ingin memisahkannya. Lanjutkan dan buat file bernama `deploy.js` di bawah folder `scripts`. Copy-paste semua `run.js` ke `deploy.js`. Ini akan menjadi persis sama sekarang. Aku menambahkan beberapa pernyataan `console.log`.

```javascript
const main = async () => {
  const nftContractFactory = await hre.ethers.getContractFactory('MyEpicNFT');
  const nftContract = await nftContractFactory.deploy();
  await nftContract.deployed();
  console.log("Contract deployed to:", nftContract.address);

  // Panggil fungsi.
  let txn = await nftContract.makeAnEpicNFT()
  // Tunggu ditambang.
  await txn.wait()
  console.log("Minted NFT #1")

  txn = await nftContract.makeAnEpicNFT()
  // Tunggu ditambang.
  await txn.wait()
  console.log("Minted NFT #2")
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

## 📈 Terapkan ke Rinkeby testnet

Kita perlu mengubah file `hardhat.config.js` kita. Kamu dapat menemukannya di direktori root proyek kontrak pintarmu.

```javascript
require('@nomiclabs/hardhat-waffle');
require("dotenv").config({ path: ".env" });

module.exports = {
  solidity: '0.8.1',
  networks: {
    rinkeby: {
      url: process.env.ALCHEMY_API_KEY_URL,
      accounts: [process.env.RINKEBY_PRIVATE_KEY],
    },
  },
};
```
Di sini pada dasarnya kita mengonfigurasi `hardhat.config.js` untuk menggunakan variabel env dengan aman yang merupakan **process.env.ALCHEMY_API_KEY_URL** & **process.env.RINKEBY_PRIVATE_KEY** kita. Kamu sekarang harus membuka terminal dan mengetik
```
npm install dotenv
```
Ini pada dasarnya hanya menginstal paket `dotenv` yang memungkinkan kita menggunakan variabel env.

Dan sekarang kamu dapat membuat file **.env** di root proyekmu. Yang pasti, itu harus cocok dengan jalur yang berisi file **hardhat.config.js**.

Kamu dapat mengambil URL APImu dari dasbor Alchemy dan menempelkannya. Kemudian, kamu memerlukan kunci rinkeby **pribadi**mu (bukan alamat publikmu!) yang dapat kamu [ambil dari metamask](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-Export-an-Account-Private-Key) dan tempel di sana juga.

Buka file **.env** dan rekatkan dua yang telah kita ambil seperti yang ditunjukkan di bawah ini.
```
ALCHEMY_API_KEY_URL=<URL API KAMU>
RINKEBY_PRIVATE_KEY=<KUNCI PRIBADI KAMU>
```

**Catatan: JANGAN COMMIT FILE INI KE GITHUB. INI MEMILIKI KUNCI PRIBADIMU. KAMU AKAN DIRETAS + DIRAMPOK. PRIVATE KEY INI SAMA DENGAN PRIVATE KEY MAINNETMU.
BUKA FILE `.gitignore`MU DAN TAMBAHKAN LINE UNTUK `.env` JIKA TIDAK ADA**

`.gitignore`mu akan terlihat seperti ini sekarang.
```
node_modules
.env
coverage
coverage.json
typechain

#Hardhat files
cache
artifacts
```

Mengapa kamu perlu menggunakan kunci pribadimu? Karena untuk melakukan transaksi seperti menyebarkan kontrak, kamu perlu "masuk" ke blockchain dan menandatangani/menyebarkan kontrak. Dan, nama penggunamu adalah alamat publik kamu dan kata sandimu adalah kunci pribadi kamu. Ini seperti masuk ke AWS atau GCP untuk menerapkan.

Setelah kamu mendapatkan pengaturan konfigurasi, kita siap untuk menerapkan dengan skrip penerapan yang kita tulis sebelumnya.

Jalankan perintah ini dari direktori root `epic-nfts`.

```bash
npx hardhat run scripts/deploy.js --network rinkeby
```

Biasanya dibutuhkan waktu 20-40 detik untuk menyebarkan. Kita tidak hanya menyebarkan! Kita juga mencetak NFT di `deploy.js` sehingga akan memakan waktu juga. Kita sebenarnya perlu menunggu transaksi ditambang + diambil oleh penambang. Cukup epik :). Satu perintah itu melakukan semua itu!

Ketika aku menjalankan ini, inilah hasilnya (milik kamu akan terlihat berbeda):

![carbon (7).png](https://i.imgur.com/nLSX6PM.png)

Kita dapat memastikan semuanya berfungsi dengan baik menggunakan [Rinkeby Etherscan](https://rinkeby.etherscan.io/) tempatmu dapat menempelkan alamat kontrak dan melihat apa yang terjadi dengannya!

Biasakan untuk gunakan Etherscan karena ini seperti cara termudah untuk melacak penerapan dan jika terjadi kesalahan. Jika tidak muncul di Etherscan, berarti masih diproses atau ada yang tidak beres!

Jika berhasil — LUARRR BIAAASA KAMU SUDAH MENGERAHKAN KONTRAK YESSSSS.

## 🌊 Lihat di OpenSea

Percaya atau tidak. NFT yang baru saja kamu buat akan ada di situs TestNet OpenSea.

Buka [testnets.opensea.io](https://testnets.opensea.io/). Cari alamat kontrak kamu yang merupakan alamat yang kita gunakan yang dapat kamu temukan di terminalmu, **Jangan klik enter**, klik koleksi itu sendiri ketika muncul dalam pencarian.

![Untitled](https://i.imgur.com/ePDlYX1.png)

Jadi di sini, kamu akan mengklik "SquareNFT" di bawah "Collections", dan duar kamu akan melihat NFT yang kamu buat!

![Untitled](https://i.imgur.com/Q96NYK4.png)

SIAAALAN AYO PERGI. AKU HYPE **UNTUK**MU.

Cukup epik, kita telah membuat kontrak NFT kita sendiri *dan* mencetak dua NFT. Epik. SAAT INI EPIK, *agak membosankan —* kan? Itu hanya gambar Spongebob yang sama setiap saat! Bagaimana kita bisa menambahkan beberapa keacakan untuk ini dan menghasilkan barang dengan cepat? Itulah yang akan kita bahas selanjutnya :).

## 🙀 Tolong NFT-ku tidak muncul di OpenSea!
 **Jika NFT-mu tidak muncul di OpenSea** — tunggu beberapa menit, terkadang OpenSea bisa memakan waktu sekitar 5 menit. Ini saranku, jika sudah 5 menit dan metadata kamu masih terlihat seperti ini:

![Untitled](https://i.imgur.com/dVACrDl.png)

**Kemudian gunakan Rarible alih-alih OpenSea.** Rarible adalah pasar NFT lain seperti OpenSea. Berikut cara mengaturnya:

1. Buka `rinkeby.rarible.com`.
2. Buat url ini: `https://rinkeby.rarible.com/token/INSERT_DEPLOY_CONTRACT_ADDRESS_HERE:INSERT_TOKEN_ID_HERE.`

Sebagai contoh, inilah tautanku: https://rinkeby.rarible.com/token/0xb6be7bd567e737c878be478ae1ab33fcf6f716e0:0 untuk Spongebob NFT!! `tokenId`ku adalah `0` karena ini adalah koin pertama dari kontrak itu.

**Pada dasarnya, jika kamu tidak melihat NFT-mu di OpenSea dalam beberapa menit, coba URL Rarible dan Rarible untuk sisa proyek.**


## 💻 Kodenya

[Di sini](https://Gist.github.com/farzaa/483c04bd5929b92d6c4a194bd3c515a5) adalah tautan ke tampilan kode kita hingga saat ini.

## 🚨Laporan perkembangan

WOOOOOO. BERIKAN DIRI SENDIRI TEPUKAN DI BELAKANG. KAMU MENYEDIAKAN KONTRAK CERDAS YANG MEMBUAT NFT. WOW.

Barang bagus :).

Kamu harus benar-benar **tweet** bahwa kamu baru saja menulis dan menerapkan kontrak pintarmu yang dapat mencetak NFT dan menandai @_buildspace. Jika mau, sertakan tangkapan layar halaman OpenSea/Rarible yang menunjukkan bahwa NFT-mu :)!

Kamu harus merasa luar biasa tentang kenyataan bahwa kamu benar-benar membangun hal-hal yang dibicarakan orang lain. Kamu punya kekuatan super :).

*Terima kasih untuk orang-orang yang telah men-tweet tentang kami, kalian adalah legenda <3.*

![](https://i.imgur.com/ftXoVsn.png)

![](https://i.imgur.com/HBMIgu2.png)

![](https://i.imgur.com/KwbO0Ib.png)
