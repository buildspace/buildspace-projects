## 🌊 Beri pengguna tautan OpenSea mereka

Satu hal yang luar biasa adalah setelah NFT dicetak, kita benar-benar memberikan tautan ke NFT mereka di OpenSea yang dapat mereka bagikan di Twitter atau dengan teman-teman mereka!!

Tautan untuk NFT di OpenSea terlihat seperti ini:

`https://testnets.opensea.io/assets/0x88a3a1dd73f982e32764eadbf182c3126e69a5cb/9`

Pada dasarnya, ini adalah variabel.

`https://testnets.opensea.io/assets/MASUKKAN_ALAMAT_KONTRAK_DI_SINI/MASUKKAN_ID_TOKEN_DI_SINI`


**Catatan: jika kamu menggunakan Rarible b/c OpenSea lambat untuk menampilkan metadata NFTmu -- lihat pengaturan tautan di bawah, ini sangat mirip! Aku sebenarnya suka menggunakan Rarible daripada OpenSea, biasanya jauh lebih cepat untuk menampilkan metadata. Itu bagus karena pengguna kamu dapat langsung melihat NFT mereka!**

Tautan untuk NFT di Rarible terlihat seperti ini:

`https://rinkeby.rarible.com/token/0xb6be7bd567e737c878be478ae1ab33fcf6f716e0:0`

Pada dasarnya, ini adalah variabel.

`https://rinkeby.rarible.com/token/MASUKKAN_ALAMAT_KONTRAK_DI_SINI:MASUKKAN_ID_TOKEN_DI_SINI`

Jadi, aplikasi web kita memiliki alamat kontrak, tetapi bukan id token! Jadi, kita perlu mengubah kontrak kita untuk mengambilnya. Ayo lakukan.

Kita akan menggunakan sesuatu yang disebut `Events` di Solidity. Ini agak seperti webhook. Mari kita menulis beberapa kode dan membuatnya bekerja terlebih dahulu!

Tambahkan baris ini di bawah baris tempat kamu membuat tiga array dengan kata-kata acak kamu!

`event NewEpicNFTMinted(address sender, uint256 tokenId);`

Kemudian, tambahkan baris ini di paling bawah fungsi `makeAnEpicNFT`, jadi, ini adalah baris terakhir dalam fungsi:

`emit NewEpicNFTMinted(msg.sender, newItemId);`

Pada tingkat dasar, peristiwa adalah pesan yang dikeluarkan oleh kontrak pintar kita yang dapat kita tangkap pada klien kita secara real-time. Dalam kasus NFT kita, hanya karena transaksi kita ditambang **tidak berarti transaksi tersebut mengakibatkan NFT dicetak**. Itu bisa saja error'd out!! Bahkan jika kesalahannya keluar, itu akan tetap ditambang dalam prosesnya.

Itu sebabnya aku menggunakan event di sini. Aku dapat `memancarkan` event di kontrak dan kemudian merekam acara itu di frontend. Perhatikan di `event`-ku, aku mengirim `newItemId` yang kita butuhkan di frontend, kan :)?

Sekali lagi, ini seperti kait web. Kecuali ini akan menjadi webhook termudah yang pernah disiapkan lol.

Pastikan untuk membaca lebih lanjut tentang event [di sini](https://docs.soliditylang.org/en/v0.4.21/contracts.html#events).

Seperti biasa ketika kita mengubah kontrak kita.

1. Memindahkan.
2. Perbarui alamat kontrak di `App.js`.
3. Perbarui file ABI di aplikasi web.

Jika kamu mengacaukan semua ini, kamu *akan* mendapatkan kesalahan :).

Sekarang di frontend kita, kita menambahkan garis ajaib ini (aku akan menunjukkan tempat untuk meletakkannya sedikit).

```javascript
connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
	console.log(from, tokenId.toNumber())
	alert(`Hey there! We've minted your NFT. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: <https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}>`)
});

```

Oke ini epik sekali. Secara real-time, kita akan merekam peristiwa mint, mendapatkan tokenId, dan memberi pengguna tautan OpenSea mereka untuk NFT mereka yang baru dicetak.

Kode untuk `App.js` dan kontraknya ada [di sini](https://Gist.github.com/farzaa/5015532446dfdb267711592107a285a9). Ini benar-benar tidak ada yang mewah. Hanya menyiapkan pendengar event! Aku memastikan untuk memberikan komentar pada baris yang aku tambahkan untuk memudahkan melihat apa yang aku ubah. Pastikan untuk menambahkan panggilan ke `setupEventListener()` di dua tempat seperti yang aku lakukan di kode! Jangan lewatkan itu :).

## 🖼 Latar belakang berwarna-warni!

Hanya untuk bersenang-senang, aku mengubah kontrak untuk secara acak memilih latar belakang berwarna-warni. Aku tidak akan membahas kode di sini karena itu hanya untuk bersenang-senang tetapi jangan ragu untuk melihat komentar [di sini](https://Gist.github.com/farzaa/b3b8ec8aded7e5876b8a1ab786347cc9). Ingat jika kamu mengubah kontrak, kamu harus menerapkan ulang, memperbarui abi, dan memperbarui alamat kontrak.

## 😎 Tetapkan batas pada # NFT yang dicetak

Jadi, aku tantang kamu untuk mengubah kontrakmu agar hanya mengizinkan satu set # NFT untuk dicetak (misalnya, mungkin kamu ingin hanya 50 NFT yang dicetak maksimal!!). Akan lebih epik jika di situs web kamu tertulis sesuatu seperti `4/50 NFT yang dicetak sejauh ini` atau sesuatu seperti itu untuk membuat pengguna kamu merasa sangat istimewa ketika mereka mendapatkan NFT!!!

Petunjuk, kamu memerlukan sesuatu yang solid yang disebut `require`. Dan, kamu juga perlu membuat fungsi seperti `getTotalNFTsMintedSoFar` agar aplikasi web kamu dapat memanggil.


## ❌ Beri tahu pengguna saat mereka berada di jaringan yang salah

Situs web kamu **hanya** akan berfungsi di Rinkeby (karena di situlah kontrakmu berlaku).

Kita akan menambahkan pesan bagus yang memberi tahu pengguna tentang ini!

Untuk itu, kita membuat permintaan RPC ke blockchain untuk melihat ID rantai yang terhubung dengan dompet kita. (Mengapa rantai dan bukan jaringan? [Pertanyaan bagus!](https://ethereum.stackexchange.com/questions/37533/what-is-a-chainid-in-ethereum-how-is-it-different-than-networkid-and-how-is-it))

Kita telah menangani permintaan ke blockchain. Kita menggunakan `ethereum.request` dengan metode `eth_accounts` dan `eth_requestAccounts`. Sekarang kita menggunakan `eth_chainId` untuk mendapatkan ID.

```javascript
let chainId = await ethereum.request({ method: 'eth_chainId' });
console.log("Connected to chain " + chainId);

// String, kode hex dari chainId jaringan uji Rinkeby
const rinkebyChainId = "0x4"; 
if (chainId !== rinkebyChainId) {
	alert("You are not connected to the Rinkeby Test Network!");
}
```
Di sana, sekarang pengguna akan tahu jika mereka berada di jaringan yang salah!
Permintaan sesuai dengan [EIP-695](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-695.md) sehingga mengembalikan nilai hex jaringan sebagai string.
Kamu dapat menemukan ID jaringan lain [di sini](https://docs.metamask.io/guide/ethereum-provider.html#chain-ids).


## 🙉 Animasi penambangan

Beberapa pengguna kamu mungkin sangat bingung ketika mereka mengklik mint dan tidak ada yang terjadi selama 15 detik haha! Mungkin menambahkan animasi pemuatan? Jadikan itu kenyataan! Tidak menutupinya di sini :).


## 🐦 Tambahkan Twittermu

Tambahkan Twittermu di bagian bawah :)! Sudah memberi kamu sedikit template untuk itu.

## 👀 Tambahkan tombol untuk membiarkan orang melihat koleksi!

Mungkin bagian terpenting!

Biasanya, ketika orang ingin melihat koleksi NFT, mereka melihatnya di OpenSea!! Ini adalah cara yang sangat mudah bagi orang-orang untuk merasakan koleksimu. Jadi jika kamu menautkan temanmu ke situsmu, mereka akan tahu bahwa itu sah!!

Tambahkan tombol kecil yang bertuliskan "🌊 Lihat Koleksi di OpenSea" dan kemudian ketika pengguna kamu mengkliknya, itu menautkan ke koleksimu! Ingat, tautan koleksimu berubah setiap kali kamu mengubah kontrak. Jadi pastikan untuk menautkan koleksi terbaru dan terakhir kamu. Misalnya, [ini](https://testnets.opensea.io/collection/squarenft-vu901lkj40) adalah koleksiku.

Catatan: Tautan ini harus kamu hardcode. Aku meninggalkan sebuah variabel di bagian atas untuk kamu isi. Itu tidak dapat dibuat secara dinamis kecuali kamu menggunakan OpenSea API (yang sekarang ini berlebihan haha).


## 🚨 Laporan perkembangan!

Kamu hampir di akhir :). Posting tangkapan layar di #progress dengan pop up kecil yang memberi pengguna kamu tautan OpenSea langsung!
