## 📒 Baca dari blockchain melalui situs web kita

Luar biasa. Kita berhasil. Kita telah menerapkan situs web kita. Kita telah menyebarkan kontrak kita. Kita telah menghubungkan dompet kita. Sekarang kita harus benar-benar memanggil kontrak kita dari situs web kita menggunakan kredensial yang kita miliki aksesnya sekarang dari Metamask!

Jadi, kontrak pintar kita memiliki fungsi yang dapat mengambil jumlah total lambaian.

```solidity
  function getTotalWaves() public view returns (uint256) {
      console.log("We have %d total waves!", totalWaves);
      return totalWaves;
  }
```

Mari kita panggil fungsi ini dari situs web kita :).

Silakan dan tulis fungsi ini tepat di bawah fungsi `connectWallet()` kita.

```javascript
const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
}
```

Penjelasan cepat di sini:

```javascript
const provider = new ethers.providers.Web3Provider(ethereum);
const signer = provider.getSigner();
```

`ethers` adalah perpustakaan yang membantu frontend kita berbicara dengan kontrak kita. Pastikan untuk mengimpornya di bagian atas menggunakan `import { ethers } from "ethers";`.

"Provider" adalah apa yang kita gunakan untuk benar-benar berbicara dengan node Ethereum. Ingat bagaimana kita menggunakan Alchemy untuk **menyebarkan**? Nah dalam hal ini kita menggunakan node yang disediakan Metamask di latar belakang untuk mengirim/menerima data dari kontrak yang kita terapkan.

[Ini adalah](https://docs.ethers.io/v5/api/signer/#signers) tautan yang menjelaskan apa itu penandatangan di baris 2.

Hubungkan fungsi ini ke tombol wave kita dengan memperbarui prop `onClick` dari `null` ke `wave`:

```html
<button className="waveButton" onClick={wave}>
    Wave at Me
</button>
```

Luar biasa.

Jadi, sekarang kode ini **rusak**. Di shell replit kita itu akan mengatakan:

![](https://i.imgur.com/JP2rryE.png)

Kita membutuhkan dua variabel itu!!

Jadi, alamat kontrak yang kamu miliki -- bukan? Ingat ketika kamu menyebarkan kontrak kamu dan aku menyuruh kamu untuk menyimpan alamatnya? Ini yang diminta!

Tapi, apa itu ABI? Jauh sebelumnya aku menyebutkan bagaimana ketika kamu mengkompilasi sebuah kontrak, itu membuat banyak file untuk kamu di bawah `artifacts`. ABI adalah salah satu file tersebut.

## 🏠 Mengatur Alamat Kontrakmu

Ingat ketika kamu menyebarkan kontrakmu ke Rinkeby Testnet (omong-omong itu hebat sekali)? Output dari penerapan itu termasuk alamat kontrak pintarmu yang akan terlihat seperti ini:

```
Deploying contracts with the account: 0xF79A3bb8d5b93686c4068E2A97eAeC5fE4843E7D
Account balance: 3198297774605223721
WavePortal address: 0xd5f08a0ae197482FA808cE84E00E97d940dBD26E
```

Kamu perlu mendapatkan akses ke ini di aplikasi React kamu. Ini semudah membuat properti baru di file `App.js` kamu yang disebut `contractAddress` dan menyetel nilainya ke `WavePortal address` yang dicetak di konsol kamu:

```javascript
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  /**
   * Buat variabel di sini yang menyimpan alamat kontrak setelah kamu terapkan!
   */
  const contractAddress = "0xd5f08a0ae197482FA808cE84E00E97d940dBD26E";
```

## 🛠 Mendapatkan Konten File ABI
Lihat dirimu, sudah setengah jalan di sini! Mari kembali ke folder kontrak pintar kita.

Saat kamu mengkompilasi kontrak pintar kamu, kompiler mengeluarkan banyak file yang diperlukan yang memungkinkan kamu berinteraksi dengan kontrak. Kamu dapat menemukan file-file ini di folder `artifacts` yang terletak di root proyek Solidity kamu.

File ABI adalah sesuatu yang perlu diketahui oleh aplikasi web kita bagaimana berkomunikasi dengan kontrak kita. Baca tentangnya [di sini](https://docs.soliditylang.org/en/v0.5.3/abi-spec.html).

Isi file ABI dapat ditemukan dalam file JSON yang indah di proyek hardhat kamu:

`artifacts/contracts/WavePortal.sol/WavePortal.json`


Jadi, pertanyaannya adalah bagaimana kita memasukkan file JSON ini ke frontend kita? Untuk proyek ini kita akan membuat "copy pasta" lama yang bagus!

Salin konten dari `WavePortal.json`mu, lalu buka aplikasi web kamu. Kamu akan membuat folder baru bernama `utils` di bawah `src`. Di bawah `utils` buat file bernama `WavePortal.json`. Jadi path lengkapnya akan terlihat seperti:

`src/utils/WavePortal.json`


Tempel seluruh file JSON di sana!

Sekarang setelah filemu dengan semua konten ABI siap digunakan, saatnya mengimpornya ke file `App.js` kamu dan membuat referensi untuk itu. Tepat di bawah tempat kamu mengimpor `App.css`, lanjutkan dan impor file JSONmu dan buat referensi kamu ke konten abi:


```javascript
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import abi from "./utils/WavePortal.json";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");

  const contractAddress = "0xd5f08a0ae197482FA808cE84E00E97d940dBD26E";
  /**
   * Buat variabel di sini yang mereferensikan konten abi!
   */
  const contractABI = abi.abi;
```
Mari kita lihat di mana kamu sebenarnya menggunakan konten ABI ini:

```javascript
const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        /*
        * Kamu menggunakan contractABI di sini
        */
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }
  ```

Setelah kamu menambahkan file itu dan mengklik tombol "Wave" -- **Kamu akan secara resmi membaca data dari kontrak kamu di blockchain melalui klien webmu**.

## 📝 Menulis data

Kode untuk menulis data ke kontrak kita tidak jauh berbeda dengan membaca data. Perbedaan utamanya adalah ketika kita ingin menulis data baru ke kontrak kita, kita perlu memberi tahu para penambang agar transaksi dapat ditambang. Saat kita membaca data, kita tidak perlu melakukan ini. Membaca adalah "gratis" karena yang kita lakukan hanyalah membaca dari blockchain, **kita tidak mengubahnya.**

Berikut kode untuk melambai:

```javascript
const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        /*
        * Jalankan melambai aktual dari kontrak pintar Anda
        */
        const waveTxn = await wavePortalContract.wave();
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }
```

Cukup sederhana, kan :)?

Yang luar biasa di sini adalah saat transaksi sedang ditambang, kamu benar-benar dapat mencetak hash transaksi, menyalin/menempelkannya ke [Etherscan](https://rinkeby.etherscan.io/), dan melihatnya diproses secara real-time : ).

Ketika kita menjalankan ini, kamu akan melihat bahwa jumlah total lambaian meningkat 1. Kamu juga akan melihat bahwa Metamask muncul dan meminta kita untuk membayar "gas" yang kita bayar untuk menggunakan $ palsu kita. Ada artikel bagus tentangnya [di sini](https://ethereum.org/en/developers/docs/gas/). Coba dan cari tahu apa itu gas :).

## 🎉 Sukses

**BAGUSSSSSSS :).**

Benar-benar barang yang bagus. Kita sekarang memiliki klien aktual yang dapat membaca dan menulis data ke blockchain. Dari sini, kamu dapat melakukan apa pun yang kamu inginkan. Kamu memiliki dasar-dasarnya. Kamu dapat membangun versi Twitter yang terdesentralisasi. Kamu dapat membangun cara bagi orang-orang untuk memposting meme favorit mereka dan memungkinkan orang untuk "memberi tip" kepada orang-orang yang memposting meme terbaik dengan ETH. Kamu dapat membangun sistem pemungutan suara terdesentralisasi yang dapat digunakan suatu negara untuk memilih politisi di mana semuanya terbuka dan jelas.

Kemungkinannya benar-benar tidak terbatas.

## 🚨 Sebelum kamu mengklik "Pelajaran Berikutnya"

*Catatan: jika kamu tidak melakukan ini, Farza akan sangat sedih :(.*

Sesuaikan situs kamu sedikit untuk menunjukkan jumlah total lambaian. Mungkin menunjukkan bilah pemuatan saat gelombang sedang ditambang, apa pun yang kamu inginkan. Lakukan sesuatu yang sedikit berbeda!

Setelah kamu merasa siap, bagikan tautan ke situs web kamu dengan kami di #progress sehingga kami dapat menghubungkan dompet kami dan melambaikan tangan kepada kamu :).

## 🎁 Rangkuman

Kamu sedang dalam perjalanan untuk menaklukkan web yang terdesentralisasi. MENAKJUBKAN. Lihat semua kode yang kamu tulis di bagian ini dengan mengunjungi [tautan ini](https://gist.github.com/adilanchian/71890bf4fcd8f78e94c77cf694b24659) untuk memastikan kamu berada di jalur yang sesuai dengan kodemu!
