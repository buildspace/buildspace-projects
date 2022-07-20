## 🙉 Catatan di github

**Jika mengunggah ke Github, jangan mengunggah file konfigurasi hardhat kamu dengan kunci pribadimu ke repomu. Kamu akan dirampok.**

Aku menggunakan dotenv untuk ini.

```bash
npm install --save dotenv
```

```javascript
require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

module.exports = {
  solidity: "0.8.1",
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

```plaintext
STAGING_ALCHEMY_KEY=BLAHBLAH
PROD_ALCHEMY_KEY=BLAHBLAH
PRIVATE_KEY=BLAHBLAH
```

(jangan komit `.env` kamu setelah ini haha, pastikan itu ada di file `.gitignore` kamu).

Ingat perubahan yang kita buat pada `.gitignore` sebelumnya? Sekarang kamu dapat mengembalikannya dengan menghapus baris `hardhat.config.js`, karena sekarang file tersebut hanya berisi variabel yang mewakili kunci kamu, dan bukan info kunci kamu yang sebenarnya.

## 🌎 Tingkatkan NFT abadi kamu dengan IPFS

Pikirkan tentang di mana aset NFT kamu sebenarnya disimpan sekarang. Mereka ada di blockchain Ethereum! Ini luar biasa karena banyak alasan, tetapi memiliki beberapa masalah. Terutama, **sangat mahal** karena berapa banyak biaya penyimpanan di Ethereum. Kontrak juga memiliki batas panjang, jadi jika kamu membuat SVG animasi yang sangat mewah yang sangat panjang, itu tidak akan muat dalam kontrak.

Untungnya kita memiliki sesuatu yang disebut [IPFS](https://en.wikipedia.org/wiki/InterPlanetary_File_System), yang pada dasarnya adalah sistem file terdistribusi. Hari ini — kamu mungkin menggunakan sesuatu seperti Penyimpanan S3 atau GCP. Tapi, dalam hal ini kita bisa mempercayai IPFS yang dijalankan oleh orang asing yang menggunakan jaringan. Berikan [ini](https://decrypt.co/resources/how-to-use-ipfs-the-backbone-of-web3) bacaan cepat jika kamu bisa! Mencakup banyak pengetahuan dasar yang baik :). Sungguh, yang perlu kamu ketahui adalah bahwa IPFS adalah standar industri untuk menyimpan aset NFT. Itu tidak berubah, permanen, dan terdesentralisasi.

Menggunakannya cukup sederhana. Yang perlu kamu lakukan adalah mengunggah NFT kamu ke IPFS dan kemudian menggunakan hash ID konten unik yang diberikannya kembali ke kontrakmu alih-alih URL Imgur atau data SVG.

Pertama, kamu harus mengunggah gambar kamu ke layanan yang berspesialisasi dalam "[menyematkan](https://docs.ipfs.io/how-to/pin-files/)" — yang berarti file kamu pada dasarnya akan di-cache sehingga mudah diambil kembali. Aku suka menggunakan [**Pinata**](https://www.pinata.cloud/?utm_source=buildspace) sebagai layanan penyematanku — mereka memberi kamu penyimpanan gratis sebesar 1 GB, yang cukup untuk 1000-an aset. Cukup buat akun, unggah file gambar karakter kamu melalui UI mereka, dan hanya itu!

![Untitled](https://i.imgur.com/lTpmIIj.png)

Silakan dan salin file "CID". Ini adalah alamat konten file di IPFS! Yang kerennya sekarang kita bisa buat link ini :

```javascript
https://cloudflare-ipfs.com/ipfs/MASUKKAN_CID_KAMU_DI_SINI
```

Jika kamu menggunakan **Brave Browser** (yang memiliki IPFS bawaan), kamu cukup mengetikkan tempel ini ke dalam URL:

```javascript
ipfs://MASUKKAN_CID_KAMU_DI_SINI
```

Dan itu benar-benar akan memulai simpul IPFS di mesin lokal kamu dan mengambil file! Jika kamu mencoba melakukannya pada sesuatu seperti Chrome, itu hanya melakukan pencarian Google haha. Sebagai gantinya, kamu harus menggunakan tautan `cloudflare-ipfs`.

![Untitled](https://i.imgur.com/tWHtVbO.png)

Dari sini, kita hanya perlu memperbarui fungsi `tokenURI` untuk menambahkan `ipfs://`. Pada dasarnya, OpenSea suka ketika URI gambar kita disusun seperti ini: `ipfs://MASUKKAN_CID_KAMU_DI_SINI`.

Seperti inilah seharusnya fungsi `_setTokenURI`mu:

```javascript
_setTokenURI(newItemId, "ipfs://MASUKKAN_CID_KAMU_DI_SINI");
```

Dan sekarang kmu tahu cara menggunakan IPFS! Ada masalah dalam skenario kita - kita secara dinamis menghasilkan kode SVG on-chain. Kamu tidak dapat mengunggah aset ke IPFS dari kontrak dalam, jadi kamu harus membuat SVG di browser atau server khusus, mengunggahnya ke IPFS, dan meneruskan CID ke fungsi mint kamu sebagai string.

Aku hanya akan meninggalkan ini untuk kamu jelajahi, tetapi, terkadang kamu tidak ingin menyimpan NFT kamu secara on-chain. Mungkin kamu ingin memiliki video sebagai NFT. Melakukannya secara on-chain akan sangat mahal karena biaya gas.

Ingat, NFT hanyalah file JSON pada akhirnya yang tertaut ke beberapa metadata. Kamu dapat meletakkan file JSON ini di IPFS. Kamu juga dapat menempatkan data NFT itu sendiri (misalnya gambar, video, dll) di IPFS. Jangan terlalu rumit :).

**Sebagian besar NFT menggunakan IPFS. Ini adalah cara paling populer untuk menyimpan data NFT saat ini.**

Aku akan menyerahkan kepada kamu untuk mengeksplorasi!! ;)

## 📝 Verifikasi kontrak di Etherscan

Tahukah kamu bahwa kamu dapat menunjukkan kode sumber kontrak pintar kamu kepada dunia? Melakukannya akan memungkinkan logika kamu menjadi sangat transparan. Sesuai dengan semangat blockchain publik. Setiap orang yang ingin berinteraksi dengan kontrak pintar kamu di blockchain dapat mengintip logika kontrak terlebih dahulu! Untuk itu, Etherscan memiliki fungsi **Verifikasi Kontrak**. [Di sini](https://rinkeby.etherscan.io/address/0x902ebbecafc54f7a8013a9d7954e7355309b50e6#code) adalah contoh tampilan kontrak terverifikasi. Jangan ragu untuk memeriksa kontrak pintar sendiri.

Jika kamu memilih tab **Contract** di Etherscan, kamu akan melihat daftar panjang karakter teks yang dimulai dari `0x608060405234801...` Hmm.. apa itu ?

![image](https://user-images.githubusercontent.com/60590919/139609052-f4bba83c-f224-44b1-be74-de8eaf31b403.png)

Ternyata kelompok karakter yang panjang dan tampak omong kosong ini sebenarnya adalah bytecode dari kontrak yang telah kamu terapkan! Bytecode mewakili serangkaian opcode di EVM yang akan melakukan instruksi untuk kita secara onchain.

Ini adalah banyak informasi baru untuk dipahami, jadi jangan khawatir jika itu tidak masuk akal sekarang. Luangkan waktu sejenak untuk mencari tahu apa arti bytecode dan EVM! Gunakan Google atau hubungi `#general-chill-chat` di Discord :). [Ini juga artikel keren](https://ethervm.io/) tentang opcode EVM .

Jadi, kita tahu bahwa bytecode tidak dapat dibaca oleh kita. Kita ingin dapat melihat kode yang kita tulis tepat di Etherscan. Untungnya, Etherscan memiliki keajaiban untuk membantu kita melakukannya!

Perhatikan bahwa ada permintaan yang meminta kita untuk **Memverifikasi dan Memublikasikan** kode sumber kontrak kita. Jika kita mengikuti tautan, kita diharuskan untuk memilih pengaturan kontrak kita secara manual dan menempelkan kode kita untuk menerbitkan kode sumber kita.

Untungnya bagi kita hardhat menawarkan cara yang lebih cerdas untuk melakukan ini.

Kembali ke proyek hardhat kamu dan instal `@nomiclabs/hardhat-etherscan` dengan menjalankan perintah:

```
npm i -D @nomiclabs/hardhat-etherscan
```

Kemudian di `hardhat.config.js`mu tambahkan berikut ini

```javascript
require("@nomiclabs/hardhat-etherscan");

// Sisa kode
...

module.exports = {
  solidity: "0.8.1",

  // Sisa konfigurasi
  ...,
  etherscan: {
    // Kunci API kamu untuk Etherscan
    // Dapatkan satu di https://etherscan.io/
    apiKey: "",
  }
};

```

Kita hampir sampai! Kamu mungkin telah memperhatikan bahwa objek `etherscan` dalam konfigurasi kita memerlukan `apiKey`! Ini berarti kamu memerlukan akun dengan Etherscan untuk mendapatkan kunci ini.

Jika kamu belum memiliki akun, buka [https://etherscan.io/register](https://etherscan.io/register) untuk membuat akun pengguna gratis. Setelah itu buka pengaturan profil kamu dan di bawah `API-KEYs` buat apikey baru

![image](https://user-images.githubusercontent.com/60590919/139610459-b590bbc1-0d4e-4e78-920b-c45e61bf2d7e.png)

Manis Kamu mendapatkan kunci APImu. Saatnya kembali ke file `hardhat.config.js`mu dan ubah properti `apiKey` menjadi kunci yang baru kamu buat.

**Catatan: Jangan bagikan kunci api Etherscan Kamu dengan orang lain**

Kita turun ke langkah terakhir kita, aku berjanji. Yang tersisa sekarang adalah menjalankan perintah

```
npx hardhat verify YOUR_CONTRACT_ADDRESS --network rinkeby
```

Jika semuanya berjalan lancar, kamu akan melihat beberapa output di terminal. Milikku terlihat seperti ini:

![image](https://user-images.githubusercontent.com/60590919/139611432-16d8c3fc-04b1-44c8-b58a-27f49e94d492.png)

Kembali ke halaman kontrak di Rinkeby Etherscan dengan mengikuti tautan yang dikembalikan di terminal dan kamu akan melihat bahwa Etherscan secara ajaib (dengan bantuanmu) mengubah bytecode menjadi kode Solidity yang lebih mudah dibaca.

![image](https://user-images.githubusercontent.com/60590919/139611635-3d1d7aae-8bb8-47f5-9396-6a4544badebf.png)

Semua orang dapat melihat betapa hebatnya kontrak pintarmu sekarang!

Tunggu dan masih ada lagi. Sekarang ada dua sub tab baru `Read Contract` & `Write Contract` yang dapat kita gunakan untuk langsung berinteraksi dengan onchain kontrak pintar kita. Cukup rapi!

![image](https://user-images.githubusercontent.com/60590919/139611805-b2a41039-ec79-402d-b198-4936d25ff277.png)

## 😍 Kamu telah melakukannya

Sangat menarik bahwa kamu berhasil sampai akhir. Cukup besar!

Sebelum kamu pergi, pastikan untuk menambahkan beberapa sentuhan akhir kecil dari pelajaran sebelumnya jika kamu mau. Mereka benar-benar membuat perbedaan. Saat kamu siap, poskan tautan ke proyek kamu di #showcase. Rekan sekelasmu akan menjadi yang pertama mencetak beberapa NFT kamu yang luar biasa!

Terima kasih telah berkontribusi untuk masa depan web3 dengan mempelajari hal ini. Fakta bahwa kamu tahu cara kerjanya dan cara mengkodekannya adalah kekuatan super. Gunakan kekuatan kamu dengan bijak ;).

## 🔮 Mengambil proyek kamu lebih jauh!

Apa yang kamu pelajari dalam proyek ini hanyalah permulaan! Masih banyak lagi yang dapat kamu lakukan dengan NFT dan kontrak pintar, berikut beberapa contoh yang dapat kamu teliti lebih lanjut ✨

- **Jual NFT Kamu** - Saat ini pengguna kamu hanya perlu membayar biaya bensin untuk mencetak nftmu yang luar biasa dan kamu tidak akan mendapatkan uang itu! Ada beberapa cara untuk mengubah kontrak pintar kamu yang membuat pengguna membayarmu untuk mencetak transaksimu, seperti menambahkan `payable` ke kontrakmu dan menggunakan `require` untuk menetapkan jumlah minimum. Karena kamu berurusan dengan uang sungguhan di sini, sebaiknya lakukan riset dengan cermat dan tanyakan kepada para ahli bahwa kodemu aman. OpenZeppelin memiliki forum tempat kamu dapat mengajukan pertanyaan seperti ini [di sini!](https://forum.openzeppelin.com/t/implementation-of-sellable-nft/5517/)
- **Tambahkan Royalti** - Kamu juga dapat menambahkan royalti ke kontrak pintarmu yang akan memberi kamu persentase dari setiap penjualan NFTmu di masa mendatang! Baca selengkapnya di sini: [EIP-2981: NFT Royalty Standard](https://eips.ethereum.org/EIPS/eip-2981)
- **Uji kontrakmu secara lokal** - Jika kamu ingin menguji kontrakmu secara lebih ekstensif tanpa menggunakan jaringan uji seperti Rinkeby, Hardhat tentu saja akan mengizinkan kamu melakukannya! Cara terbaik untuk mencapainya adalah dengan membuka jendela terminal terpisah, navigasikan ke direktori proyekmu, lalu jalankan `npx hardhat node` dan biarkan jendela itu tetap terbuka! Sama seperti di awal proyek, kamu akan melihat banyak akun dengan banyak ether. Di jendela terminal kamu yang lain, kamu dapat menjalankan skrip pengujianmu dan melihatnya memengaruhi jendela nodemu!

## 🤟 NFTmu!

Kami akan mengirimkan NFTmu dalam waktu satu jam dan akan mengirim email kepada kamu setelah ada di dompetmu. Ini berjalan pada pekerjaan cron! Jika kamu tidak menerima email dalam waktu 24 jam, mohon kirimkan pesan kepada kami di #feedback dan tag @ **alec#8853**.

## 🌈 Sebelum kamu keluar

Buka #showcase di Discord dan tunjukkan kepada kami produk akhirmu yang dapat kami mainkan :).

Juga, harus benar-benar men-tweet proyek akhir kamu dan tunjukkan kepada dunia kreasi epikmu! Apa yang kamu lakukan tidak mudah dengan cara apapun. Bahkan mungkin membuat video kecil yang memamerkan proyekmu dan melampirkannya ke tweet. Jadikan tweetmu terlihat cantik dan pamer :).

Dan jika kamu merasa sanggup, tag @\_buildspace :). Kami akan RT. Tambah, itu memberi kami banyak motivasi setiap kali kami melihat orang mengirimkan proyek mereka.

Terakhir, yang juga akan luar biasa adalah jika kamu memberi tahu kami di #feedback betapa kamu menyukai proyek ini dan struktur proyeknya. Apa yang paling kamu sukai dari buildspace? Apa yang ingin kami ubah untuk proyek masa depan? Umpan balik kamu akan luar biasa!!

Sampai jumpa!!!
