## 💚 Mint NFT melalui situs web kita

Luar biasa. Kita berhasil. Kita telah menerapkan situs web kita. Kita telah menerapkan kontrak kita. Kita telah menghubungkan dompet kita. **Sekarang kita harus benar-benar memanggil kontrak kita dari aplikasi web** menggunakan kredensial yang dapat kita akses sekarang dari Metamask!

Jadi, ingat, kontrak kita memiliki fungsi `makeAnEpicNFT` yang sebenarnya akan mencetak NFT. Sekarang kita perlu memanggil fungsi ini dari aplikasi web kita. Lanjutkan dan tambahkan fungsi berikut di bawah fungsi `connectWallet`.

```javascript
const askContractToMintNft = async () => {
  const CONTRACT_ADDRESS = "INSERT_YOUR_DEPLOYED_RINKEBY_CONTRACT_ADDRESS";

  try {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

      console.log("Going to pop wallet now to pay gas...")
      let nftTxn = await connectedContract.makeAnEpicNFT();

      console.log("Mining...please wait.")
      await nftTxn.wait();
      
      console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);

    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log(error)
  }
}
```

Ini akan membuang beberapa kesalahan. Jangan khawatir! Kita akan memperbaikinya sebentar lagi. Mari kita melangkah melalui kode sedikit.

```javascript
const provider = new ethers.providers.Web3Provider(ethereum);
const signer = provider.getSigner();
```

`ethers` adalah perpustakaan yang membantu frontend kita berbicara dengan kontrak kita. Pastikan untuk mengimpornya di bagian atas menggunakan `import { ethers } from "ethers";`.

"Provider" adalah apa yang kita gunakan untuk benar-benar berbicara dengan node Ethereum. Ingat bagaimana kita menggunakan Alchemy untuk **menyebarkan**? Nah dalam hal ini kita menggunakan node yang disediakan Metamask di latar belakang untuk mengirim/menerima data dari kontrak yang kita terapkan.

[Ini](https://docs.ethers.io/v5/api/signer/#signers) tautan yang menjelaskan apa itu penandatangan di baris 2.

```javascript
const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);
```

Kita akan membahas ini sedikit. Ketahuilah bahwa baris inilah yang sebenarnya **membuat koneksi ke kontrak kita**. Dibutuhkan: alamat kontrak, sesuatu yang disebut file `abi`, dan `signer`. Ini adalah tiga hal yang selalu kita perlukan untuk berkomunikasi dengan kontrak di blockchain.

Perhatikan bagaimana aku melakukan hardcode `const CONTRACT_ADDRESS`? **Pastikan untuk mengubah variabel ini ke alamat kontrak yang diterapkan dari kontrak yang terakhir diterapkan**. Jika kamu lupa atau hilang, jangan khawatir, cukup gunakan kembali kontrak dan dapatkan alamat baru :).

```javascript
console.log("Going to pop wallet now to pay gas...")
let nftTxn = await connectedContract.makeAnEpicNFT();

console.log("Mining...please wait.")
await nftTxn.wait();

console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
```

Sisa kode seharusnya sudah masuk akal. Sepertinya kode yang kita gunakan :)! Kita memanggil kontrak kita menggunakan `makeAnEpicNFT`, tunggu sampai ditambang, lalu tautkan URL Etherscan!

Terakhir, kita ingin memanggil fungsi ini ketika seseorang mengklik tombol "Mint NFT".

```javascript
return (
  {currentAccount === "" 
    ? renderNotConnectedContainer()
    : (
      /** Tambahkan Aksi AskContractToMintNft untuk peristiwa onClick **/
      <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
        Mint NFT
      </button>
    )
  }
);
```


## 📂 File ABI

**Membuat video kecil di sini menjelaskan semua hal ABI ini. Tolong perhatikan aku membahas beberapa hal penting!**
[Loom](https://www.loom.com/share/2d493d687e5e4172ba9d47eeede64a37)

Jadi — ketika kamu mengkompilasi kontrak pintarmu, kompiler mengeluarkan banyak file yang diperlukan yang memungkinkan kamu berinteraksi dengan kontrak. Kamu dapat menemukan file-file ini di folder `artifacts` yang terletak di root proyek Soliditymu.

File ABI adalah sesuatu yang perlu diketahui oleh aplikasi web kita bagaimana berkomunikasi dengan kontrak kita. Baca tentang itu [di sini](https://docs.soliditylang.org/en/v0.5.3/abi-spec.html).

Isi file ABI dapat ditemukan dalam file JSON mewah di proyek hardhat kamu:

`artifacts/contracts/MyEpicNFT.sol/MyEpicNFT.json`

Jadi, pertanyaannya adalah bagaimana kita memasukkan file JSON ini ke frontend kita? Baru mau copy-paste.

Salin konten dari `MyEpicNFT.json`-mu, lalu buka aplikasi webmu. Kamu akan membuat folder baru bernama `utils` di bawah `src`. Di bawah `utils` buat file bernama `MyEpicNFT.json`. Jadi path lengkapnya akan terlihat seperti:

`src/utils/MyEpicNFT.json`

Rekatkan konten file ABI di sana di file baru kita.

Sekarang setelah file kamu dengan semua konten ABI siap digunakan, saatnya mengimpornya ke file `App.js`mu. Ini hanya akan menjadi:

```javascript
import myEpicNft from './utils/MyEpicNFT.json';
```

Dan kita semua sudah selesai. Seharusnya tidak ada kesalahan lagi! Kamu siap untuk mencetak beberapa NFT!

Yang perlu kamu lakukan dari sini adalah klik "Mint NFT", bayar gas (menggunakan ETH palsumu), tunggu transaksi ditambang, dan duar! NFT kamu akan segera muncul di OpenSea atau dalam jarak maksimal 5-15 menit.

Kamu mungkin bertanya pada diri sendiri apakah gas itu. Aku tidak akan menjawabnya di sini. Tapi, kamu bisa mulai meneliti [di sini](https://ethereum.org/en/developers/docs/gas/) ;).

## 🤩 Menguji

Kamu harus dapat pergi dan benar-benar mencetak NFT langsung dari situs webmu sekarang. **Ayo pergi!!! ITU EPIKKKK.** Ini pada dasarnya adalah bagaimana semua situs pencetakan NFT ini bekerja dan kamu baru saja menyelesaikannya sendiri :).

Aku benar-benar melalui dan menguji semuanya dalam video ABI yang sudah aku tautkan di atas. Pastikan untuk mencobanya! Aku membahas beberapa hal super penting seputar apa yang harus dilakukan ketika kamu **mengubah** kontrakmu. Karena kontrakmu bersifat permanen, perubahan mengharuskan kamu untuk menerapkan ulang, memperbarui alamat di frontendmu, dan terakhir memperbarui file ABI di frontend.

## ✈️ Catatan tentang pemindahan kontrak

Katakanlah kamu ingin mengubah kontrakmu. Kamu harus melakukan 3 hal:

1. Kita perlu menyebarkannya lagi.

2. Kita perlu memperbarui alamat kontrak di frontend kita.

3. Kita perlu memperbarui file abi di frontend kita.

**Orang selalu lupa untuk melakukan 3 langkah ini ketika mereka mengubah kontrak mereka. Jangan lupa ya.**

Mengapa kita perlu melakukan semua ini? Ya, karena kontrak pintar itu **tidak dapat diubah.** Kontrak tersebut tidak dapat diubah. Mereka permanen. Itu berarti mengubah kontrak membutuhkan pemindahan penuh. Ini juga akan **mengatur ulang** semua variabel karena akan diperlakukan sebagai kontrak baru. **Itu berarti kita akan kehilangan semua data NFT kita jika kita ingin memperbarui kode kontrak.**

## 🚨Laporan perkembangan

Posting tangkapan layar konsolmu setelah kamu mencetak beberapa NFT dan pamerkan semua `console.log` itu!
