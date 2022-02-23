📒 Baca dari blok rantai melalui laman web kami
-----------------------------------------------

Bagus. Kita berjaya melakukannya. Kita telah deploy kontrak kita. Kita telah menyambungkan dompet kita. Sekarang kita perlu memanggil kontrak kita daripada laman web dengan menggunakan kelayakan yang kita sudah dapat aksesnya daripada Metamask!

Jadi, kontrak pintar kita mempunyai fungsi yang boleh mendapatkan semula jumlah waves.

```solidity
  function getTotalWaves() public view returns (uint256) {
      console.log("We have %d total waves!", totalWaves);
      return totalWaves;
  }
```

Mari panggil fungsi ini dari laman web kita :).

Teruskan dan tulis fungsi ini di bawah fungsi `connectWallet()` kita.

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

Sedikit penjelasan di sini:

```javascript
const provider = new ethers.providers.Web3Provider(ethereum);
const signer = provider.getSigner();
```

`ethers` ialah perpustakaan yang membantu frontend kita bercakap dengan kontrak kita. Pastikan anda mengimportnya di atas dengan menggunakan `import { ethers } from "ethers";`.

"Penyedia" ialah apa yang kita gunakan untuk bercakap dengan nod Ethereum. Ingat tak bagaimana kita menggunakan Alchemy untuk **deploy**? Dalam kes ini kita menggunakan nod yang Metamask sediakan di latar belakang untuk menghantar/menerima data daripada kontrak yang telah dideploy.

[Ini ialah](https://docs.ethers.io/v5/api/signer/#signers) pautan untuk menerangkan maksud penandatangan pada baris 2.

Sambungkan fungsi ini kepada butang wave kita dengan mengemaskini prop `onClick` daripada `null` kepada `wave`:

```html
<button className="waveButton" onClick={wave}>
    Wave at Me
</button>
```

Bagus sekali.

Jadi, sekarang kod ini **terungkai**. Dalam shell replit kita ia akan berkata:

![](https://i.imgur.com/JP2rryE.png)

Kita perlukan dua variables tersebut!!

Anda ada alamat kontrak -- betul? Ingat sewaktu anda deploy kontrak anda saya ada bagitahu anda untuk simpan alamat tersebut? Ini yang ia minta!

Tetapi, apakah itu ABI? Sebelum ini saya ada menyebut bahawa apabila anda menyusun kontrak, ia mencipta sekumpulan fail untuk anda di bawah `artifacts`. ABI ialah salah satu daripada fail tersebut.

🏠 Menetapkan Alamat Kontrak Anda
-----------------------------

Ingatkah anda ketika anda deploy kontrak ke Testnet Rinkeby (epik bukan)? Output daripada deployment tersebut termasuk dalam alamat kontrak pintar anda yang sepatutnya kelihatan seperti ini:

```
Deploying contracts with the account: 0xF79A3bb8d5b93686c4068E2A97eAeC5fE4843E7D
Account balance: 3198297774605223721
WavePortal address: 0xd5f08a0ae197482FA808cE84E00E97d940dBD26E
```

Anda perlu mendapatkan akses ke sini dalam app React anda. Ia semudah mencipta satu property baharu dalam `App.js` yang dipanggil sebagai `contractAddress` dan menetapkan nilainya kepada `WavePortal address` yang dicetak dalam konsol anda:

```javascript
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  /**
   * Buat satu variable yang memegang alamat kontrak selepas anda deploy!
   */
  const contractAddress = "0xd5f08a0ae197482FA808cE84E00E97d940dBD26E";
```

🛠 Mendapatkan Kandungan Fail ABI
---------------------------
Lihat, anda sudah pun separuh jalan di sini! Jom kita kembali semula ke folder kontrak pintar kita.

Apabila anda menyusun kontrak pintar anda, penyusun mengeluarkan sekumpulan fail yang diperlukan untuk membolehkan anda berinteraksi dengan kontrak tersebut. Anda boleh cari fail-fail ini dalam folder `artifacts` yang terletak dalam permulaan projek Solidity anda.

Fail ABI ialah sesuatu yang perlu diketahui oleh app web untuk berkomunikasi dengan kontrak kita. Baca mengenainya [di sini](https://docs.soliditylang.org/en/v0.5.3/abi-spec.html).

Kandungan fail ABI boleh didapati dalam bentuk fail JSON dalam projek hardhat anda:

`artifacts/contracts/WavePortal.sol/WavePortal.json`


Jadi, persoalannya adalah bagaimana cara untuk memasukkan fail JSON ini ke frontend kita? Untuk projek ini kita akan menggunakan cara yang begitu klasik iaitu "copy pasta"!

Salin kandungan daripada `WavePortal.json` anda dan pergi ke app web anda. Anda akan membuat satu folder baharu yang dipanggil `utils` di bawah `src`. Di bawah `utils` buat satu fail bernama `WavePortal.json`. Jadi laluan penuh akan kelihatan seperti:

`src/utils/WavePortal.json`


Tampalkan keseluruhan fail JSON di sana!

Memandangkan anda sudah mempunyai fail yang mengandungi ABI, sudah tiba masanya untuk mengimportnya ke dalam fail `App.js` dan buat satu rujukan kepadanya. Di bawah tempat anda mengimport `App.css` teruskan dan import fail JSON anda dan buat satu rujukan kepada kandungan ABI:


```javascript
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import abi from "./utils/WavePortal.json";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");

  const contractAddress = "0xd5f08a0ae197482FA808cE84E00E97d940dBD26E";
  /**
   * Create a variable here that references the abi content!
   */
  const contractABI = abi.abi;
```
Mari kita lihat di mana sebenarnya anda menggunakan kandungan ABI ini:

```javascript
const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        /*
        * You're using contractABI here
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

Sebaik sahaja anda menambah fail tersebut dan klik butang "Wave" -- **secara rasminya anda akan membaca data daripada kontrak anda di blok rantai melalui web pelanggan anda**.

📝 Menulis data
---------------

Kod untuk menulis data pada kontrak kita tidak jauh berbeza daripada membaca data. Perbezaan utamanya ialah apabila kita ingin menulis satu data baharu pada kontrak kita, kita perlu memberitahu pelombong (miners) supaya transaksi boleh dilombong. Apabila kita membaca data, kita tidak perlu melakukan ini. Bacaan adalah "percuma" kerana apa yang kita lakukan hanyalah membaca daripada blok rantai, **kita tidak akan mengubahnya. **

Ini ialah kod untuk kita wave:

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
        * Lancarkan wave daripada kontrak pintar anda
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

Agak mudah, bukan :)?

Apa yang menarik di sini adalah ketika transaksi sedang dilombong anda sebenarnya boleh mencetak transaksi hash, salin/tampalkannya ke [Etherscan](https://rinkeby.etherscan.io/), dan lihat ia sedang diproses dalam masa yang sebenar :).

Apabila kita melancarkan ini, anda akan lihat yang jumlah kiraan wave meningkat sebanyak 1. Anda juga akan lihat yang Metamask muncul dan meminta kita untuk membayar "gas" yang mana kita bayar menggunakan $ palsu. Ada satu artikel menarik mengenainya [di sini](https://ethereum.org/en/developers/docs/gas/). Cuba fikirkan apa yang dimaksudkan dengan gas :).

🎉 Kejayaan
----------

**BAGUSSSSSSS :).**

Sangat bagus. Sekarang kita mempunyai pelanggan sebenar yang membaca dan menulis data ke blok rantai. Dari sini, anda boleh melakukan apa sahaja yang anda mahu. Anda sudahpun mempunyai segala asas penting. Anda boleh membina Twitter versi terdesentralisasi. Anda boleh membina cara untuk orang ramai menyiarkan meme kegemaran mereka dan membenarkan orang ramai "memberi tip" kepada mereka yang menyiarkan meme terbaik dengan ETH. Anda boleh membina sistem pengundian terdesentralisasi yang boleh digunakan oleh sesebuah negara untuk mengundi ahli politik di mana segala-galanya terbuka dan jelas.

Kebarangkaliannya sangat tidak terbatas.

🚨 Sebelum anda klik "Pembelajaran Seterusnya"
-------------------------------------------

*Nota: jika anda tidak melakukan ini, Farza akan berasa sedih :(.*

Ubahsuai laman anda sedikit dengan menunjukkan jumlah waves. Mungkin boleh tunjukkan bar pemuatan ketika wave sedang dilombong, apa saja yang anda mahukan. Buat sesuatu yang agak berlainan!

Apabila anda rasa sudah bersedia, kongsikan pautan ke laman web anda kepada kami dalam #progress supaya kami boleh menyambungkan dompet kami dan melambai kepada anda :).

🎁 Kesimpulan
--------------------

Anda sedang dalam perjalanan untuk menakluki web terdesentralisasi. SANGAT MENAKJUBKAN. Lihat semua kod yang anda telah tulis di bahagian ini dengan melawati [pautan ini](https://gist.github.com/adilanchian/71890bf4fcd8f78e94c77cf694b24659) untuk memastikan anda berada di landasan yang betul dengan kod anda!
