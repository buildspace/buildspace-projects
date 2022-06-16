## 📤 Menyiapkan untuk menyebarkan ke blockchain

Lanjutkan dan tutup terminal dengan jaringan blockchain lokal kamu yang menjalankan `npx hardhat node`. Kita tidak akan membutuhkannya lagi ;). Aku terutama hanya ingin menunjukkan kepada kamu bagaimana penerapan bekerja secara lokal.

Sekarang kita akan melakukan kesepakatan nyata, menyebarkan ke blockchain yang sebenarnya.

Silakan dan buat akun dengan Alchemy [di sini](https://alchemy.com/?r=b93d1f12b8828a57).

Maaf karena kamu membuat begitu banyak akun, tetapi, ekosistem ini kompleks dan kita ingin memanfaatkan alat yang luar biasa di luar sana. Apa yang dilakukan Alchemy adalah memberi kita cara sederhana untuk menyebarkan ke blockchain Ethereum yang sebenarnya.

## 💳 Transaksi

Jadi, ketika kita ingin melakukan tindakan di blockchain Ethereum, kita menyebutnya *transaksi*. Misalnya, mengirim seseorang ETH adalah transaksi. Melakukan sesuatu yang memperbarui variabel dalam kontrak kita juga dianggap sebagai transaksi.

Jadi ketika kita memanggil `wave` dan melakukan `totalWaves += 1`, itu adalah transaksi! **Menerapkan kontrak pintar juga merupakan transaksi.**

Ingat, blockchain tidak memiliki pemilik. Hanya sekelompok komputer di seluruh dunia yang dijalankan oleh **penambang** yang memiliki salinan blockchain.

Saat kita menerapkan kontrak kita, kita perlu memberi tahu **semua** penambang itu, "hei, ini kontrak pintar baru, tolong tambahkan kontrak pintar aku ke blockchain, lalu beri tahu semua orang tentang hal itu juga".

Di sinilah Alchemy masuk.

Alchemy pada dasarnya membantu kita menyiarkan transaksi pembuatan kontrak kita sehingga dapat diambil oleh penambang secepat mungkin. Setelah transaksi ditambang, itu kemudian disiarkan ke blockchain sebagai transaksi yang sah. Dari sana, semua orang memperbarui salinan blockchain mereka.

Ini rumit. Dan, jangan khawatir jika kamu tidak sepenuhnya memahaminya. Saat kamu menulis lebih banyak kode dan benar-benar membuat aplikasi ini, tentu saja akan lebih masuk akal.

Jadi, buat akun dengan Alchemy [di sini](https://alchemy.com/?r=b93d1f12b8828a57).

Lihat video di bawah ini untuk melihat cara mendapatkan kunci API kamu untuk testnet!
[Loom](https://www.loom.com/share/21aa1d64ea634c0c9da8fc5faaf24283)

## 🕸️ Testnet

Kita tidak akan menerapkan ke "Ethereum mainnet" sampai akhir. Mengapa? Karena harganya $ nyata dan tidak layak untuk dikacaukan! Kita akan mulai dengan "testnet" yang merupakan tiruan dari "mainnet" tetapi menggunakan $ palsu sehingga kita dapat menguji hal-hal sebanyak yang kita inginkan. Namun, penting untuk diketahui bahwa testnet ini dijalankan oleh penambang yang sebenarnya dan meniru skenario dunia nyata.

Ini luar biasa karena kita dapat menguji aplikasi kita dalam skenario dunia nyata di mana kita benar-benar akan:

1\. Menyiarkan transaksi kita

2\. Menunggu sampai diambil oleh penambang yang sebenarnya

3\. Menunggu ditambang

4\. Menunggu sampai disiarkan kembali ke blockchain memberitahu semua penambang lain untuk memperbarui salinan mereka

Jadi, kamu akan melakukan semua ini dalam beberapa pelajaran berikutnya :).

## 🤑 Mendapatkan beberapa $ palsu

Ada beberapa testnet di luar sana dan yang akan kita gunakan disebut "Rinkeby" yang dijalankan oleh yayasan Ethereum.

Untuk menyebarkan ke Rinkeby, kita membutuhkan ether palsu. Mengapa? Karena jika kamu menyebarkan ke mainnet Ethereum yang sebenarnya, kamu akan menggunakan uang sungguhan! Jadi, testnet menyalin cara kerja mainnet, satu-satunya perbedaan adalah tidak ada uang nyata yang terlibat.

Untuk mendapatkan ETH palsu, kita harus meminta beberapa jaringan. **ETH palsu ini hanya akan bekerja pada testnet khusus ini.** Kamu dapat mengambil beberapa ETH palsu untuk Rinkeby melalui faucet. Pastikan dompet MetaMask kamu disetel ke "Rinkeby Test Network" sebelum menggunakan faucet.

Untuk MyCrypto, kamu harus menghubungkan dompetmu, membuat akun, lalu mengklik tautan yang sama lagi untuk meminta dana. Untuk faucet rinkeby resmi, jika mencantumkan 0 rekan, tidak ada gunanya membuat tweet/postingan Facebook publik.

| Nama             | Tautan                                  | Jumlah          | Waktu         |
| ---------------- | ------------------------------------- | --------------- | ------------ |
| MyCrypto         | https://app.mycrypto.com/faucet       | 0.01            | Tidak ada         |
| Official Rinkeby | https://faucet.rinkeby.io/            | 3 / 7.5 / 18.75 | 8j / 1h / 3h |
| Chainlink        | https://faucets.chain.link/rinkeby    | 0.1             | Tidak ada         |


## 🙃 Kesulitan mendapatkan Testnet ETH?

Jika cara di atas tidak berhasil, gunakan perintah `/faucet` di saluran #faucet-request dan bot kami akan mengirimkan kamu beberapa! Jika kamu menginginkan lebih, kirim alamat dompet publik kamu dan berikan gif lucu. Entah aku, atau seseorang dari proyek akan mengirimkan kamu beberapa ETH palsu sesegera mungkin. Semakin lucu gif, semakin cepat kamu dikirimi ETH palsu Haha.

## 📈 Terapkan ke Rinkeby testnet

Kita perlu mengubah file `hardhat.config.js` kita. Kamu dapat menemukannya di direktori root proyek kontrak pintarmu.

```javascript
require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.0",
  networks: {
    rinkeby: {
      url: "YOUR_ALCHEMY_API_URL",
      accounts: ["PRIVATE_KEY_AKUN_RINKEBY_ANDA"]
    },
  },
};
```

**Catatan: JANGAN COMMIT FILE INI KE GITHUB. FILE INI MEMILIKI KUNCI PRIBADIMU. KAMU AKAN DIRETAS + DIRAMPOK. PRIVATE KEY INI SAMA DENGAN PRIVATE KEY MAINNET KAMU.**

**Jika mengunggah ke Github atau menggunakan kontrol versi git secara umum, ini adalah praktik yang baik untuk melindungi dirimu dari mengunggah kunci rahasia ke suatu tempat yang tidak kamu inginkan. Pertama-tama, cara terbaik adalah tidak mengunggah file konfigurasi hardhat kamu dengan menambahkannya ke .gitignore.**

Cara lain untuk melindungi dirimu dan menjaga `hardhat.config.js` tetap aman adalah dengan menggunakan dotenv. Instal dengan:

```bash
npm install --save dotenv
```

Sekarang kita dapat memperbarui hardhat.config.js untuk menggunakan dotenv:

```javascript
require("@nomiclabs/hardhat-waffle");
// Impor dan konfigurasikan dotenv
require("dotenv").config();

module.exports = {
  solidity: "0.8.0",
  networks: {
    rinkeby: {
      // Nilai ini akan diganti saat runtime
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

Di folder proyek root, buat file `.env` dan tambahkan rahasiamu. Seharusnya terlihat seperti ini:

```
STAGING_ALCHEMY_KEY=GANTI_DENGAN_ALCHEMY_URL_SEBENARNYA
PROD_ALCHEMY_KEY=BLAHBLAH
PRIVATE_KEY=BLAHBLAH
```
Terakhir, tambahkan `.env` ke file `.gitignore` kamu sehingga Git mengabaikannya dan rahasia kamu tidak meninggalkan mesin kamu! Jika kamu bingung dengan semua ini, tonton saja video YouTube di dalamnya, itu mudah!

Selanjutnya, ambil URL API kamu dari dasbor Alchemy dan tempel di dalamnya. Kemudian, kamu memerlukan **private** key rinkeby (bukan alamat publik kamu!) yang dapat kamu ambil dari metamask dan tempelkan juga di sana.

**Catatan: Mengakses kunci pribadi kamu dapat dilakukan dengan membuka MetaMask, ubah jaringan menjadi "Rinkeby Test Network" lalu klik tiga titik dan pilih "Account Details" > "Export Private Key"**

Mengapa kamu perlu menggunakan kunci pribadimu? Karena untuk melakukan transaksi seperti menyebarkan kontrak, kamu harus "masuk" ke blockchain. Dan, nama penggunamu adalah alamat publik kamu dan kata sandimu adalah kunci pribadi kamu. Ini seperti masuk ke AWS atau GCP untuk menerapkan.

Setelah kamu mendapatkan pengaturan konfigurasi, kita siap untuk menerapkan dengan skrip penerapan yang kita tulis sebelumnya.

Jalankan perintah ini dari direktori root `my-wave-portal`. Perhatikan semua yang kita lakukan adalah mengubahnya dari `localhost` menjadi `rinkeby`.

```bash
npx hardhat run scripts/deploy.js --network rinkeby
```

## ❤️ Dikerahkan! 

Inilah hasilku:

```bash
Deploying contracts with the account: 0xF79A3bb8d5b93686c4068E2A97eAeC5fE4843E7D
Account balance: 3198297774605223721
WavePortal address: 0xd5f08a0ae197482FA808cE84E00E97d940dBD26E
```

Salin alamat kontrak yang digunakan di baris terakhir dan simpan di suatu tempat. Jangan sampai hilang! Kamu akan membutuhkannya untuk frontend nanti :). Milikmu akan berbeda dengan milikku.

**Kamu baru saja menerapkan kontrakmu. WOOOOOOOO.**

Kamu benar-benar dapat mengambil alamat itu dan kemudian menempelkannya ke Etherscan [di sini](https://rinkeby.etherscan.io/). Etherscan adalah tempat yang hanya menunjukkan kepada kita keadaan blockchain dan membantu kita melihat di mana transaksi kita berada. Kamu akan melihat transaksimu di sini :). Mungkin perlu satu menit untuk muncul!

Misalnya, [inilah](https://rinkeby.etherscan.io/address/0xd5f08a0ae197482FA808cE84E00E97d940dBD26E) milikku!

## 🚨 Sebelum kamu mengklik "Pelajaran Berikutnya"

**KAMU SUDAH MELAKUKAN BANYAK.**

Kamu harus benar-benar **tweet** bahwa kamu baru saja menulis dan menerapkan kontrak pintar pertamamu dan memberi tag @_buildspace. Jika kamu mau, sertakan tangkapan layar halaman Etherscan yang menunjukkan bahwa kontrak kamu ada di blockchain!

Ini kesepakatan besar yang kamu dapatkan sejauh ini. Kamu membuat dan menyebarkan sesuatu ke blockchain yang sebenarnya. **Astaga**. **Aku bangga padamu.**

Kamu sekarang adalah seseorang yang sebenarnya "melakukan" hal yang kebanyakan orang lain hanya "bicarakan".

Kamu selangkah lebih dekat untuk menguasai seni web3.

TERUS BERLANJUT :).

--

*Terima kasih kepada orang-orang yang telah men-tweet tentang kami, kalian adalah legenda <3.*

![](https://i.imgur.com/1lMrpFh.png)

![](https://i.imgur.com/W9Xcn4A.png)

![](https://i.imgur.com/k3lJlls.png)
