## 📤 Melaraskan untuk digunakan di blok rantai

Teruskan dan tutup terminal dengan rangkaian blok rantai tempatan yang sedang berjalan iaitu di mana anda menjalankan `npx hardhat node`. Kita tidak memerlukannya lagi ;). Saya cuma ingin menunjukkan kepada anda bagaimana cara deploy berfungsi secara tempatan.

Sekarang kita akan buat betul-betul, deploy di blok rantai sebenar.

Teruskan dan buat akaun dengan Alchemy [di sini](https://alchemy.com/?r=b93d1f12b8828a57).

Maaf kerana meminta anda buat begitu banyak akaun, tetapi, ekosistem ini rumit dan kami ingin memanfaatkan alatan yang menarik di luar sana. Apa yang Alchemy lakukan adalah ia memberi kita cara yang mudah untuk deploy ke blok rantai Ethereum sebenar.

## 💳 Transaksi

Jadi, apabila kita ingin melakukan suatu tindakan pada blok rantai Ethereum kita panggil ia sebagai _transaksi_. Sebagai contoh, menghantar ETH kepada seseorang adalah satu transaksi. Membuat sesuatu pengemaskinian ke atas variable dalam kontrak juga dianggap sebagai satu transaksi.

Jadi apabila kita memanggil `wave` dan ia menjadi `totalWaves += 1`, itu adalah transaksi! **Menggunakan kontrak pintar juga merupakan satu transaksi.**

Ingat, blok rantai tidak mempunyai pemilik. Ia cuma sekumpulan komputer di seluruh dunia yang dikendalikan oleh **miners** yang mempunyai salinan blok rantai.

Apabila kita menggunakan kontrak, kita perlu memberitahu **semua** pelombong (miners) itu, "hei, ini ialah kontrak pintar baharu, sila tambahkan kontrak pintar saya pada blok rantai dan kemudian bagitahu semua orang tentangnya juga ya".

Di sinilah Alchemy memainkan peranan.

Alchemy membantu kita untuk menyiarkan transaksi penciptaan kontrak kita supaya ia boleh diambil oleh pelombong (miners) secepat mungkin. Sebaik sahaja transaksi dilombong, ia kemudiannya disiarkan ke blok rantai sebagai satu transaksi yang sah. Dari situ, semua orang mengemaskini salinan blok rantai mereka.

Ia rumit. Dan, jangan risau jika anda tidak memahami sepenuhnya. Bila anda menulis banyak kod dan benar-benar menghasilkan aplikasi ini, lama kelamaan ia akan jadi lebih mudah untuk difahami.

Jadi, buat satu akaun dengan Alchemy [di sini](https://alchemy.com/?r=b93d1f12b8828a57).

Lihat video di bawah untuk mengetahui cara bagaimana untuk mendapatkan kunci API anda untuk testnet!
[Loom](https://www.loom.com/share/21aa1d64ea634c0c9da8fc5faaf24283)

## 🕸️ Testnets

Kita tidak akan deploykannya di "Ethereum mainnet" sehingga akhir. Mengapa? Kerana ia melibatkan $ sebenar dan tidak berbaloi langsung untuk menggunakannya! Kita akan mulakan dengan "testnet" yang merupakan klon kepada "mainnet" tetapi dengan menggunakan $ palsu jadi kita boleh menguji sebanyak mana yang kita mahu. Tetapi, ia penting untuk kita tahu bahawa testnets dikendalikan oleh pelombong (miners) sebenar dan meniru senario dunia sebenar.

Ini menakjubkan kerana kita akan menguji aplikasi kita dalam senario dunia sebenar di mana kita sebenarnya akan:

1\. Menyiarkan transaksi kita

2\. Tunggu untuk ia diambil oleh pelombong (miners) sebenar

3\. Tunggu untuk ia dilombong

4\. Tunggu sehingga ia disiarkan kembali ke blok rantai memberitahu semua pelombong (miners) untuk mengemaskini salinan mereka

Jadi, anda akan lakukan semua ini dalam pelajaran yang akan datang :).

## 🤑 Mendapatkan $ palsu

Terdapat beberapa testnets di luar sana dan yang akan kita gunakan dipanggil sebagai "Rinkeby" yang dikendalikan oleh yayasan Ethereum.

Untuk menggunakan Rinkeby, kita perlukan ether palsu. Mengapa? Kerana jika anda menggunakannya di mainnet Ethereum sebenar, anda perlu menggunakan wang yang sebenar! Jadi, testnets menyalin cara mainnet berfungsi, cuma perbezaanya adalah ia tidak melibatkan wang sebenar.

Untuk mendapatkan ETH palsu, kita perlu meminta sedikit daripada rangkaian. **ETH palsu ini hanya akan berfungsi pada testnet khusus ini.** Anda boleh mendapatkan beberapa ETH palsu untuk Rinkeby melalui faucet. Pastikan dompet MetaMask anda ditetapkan kepada "Rinkeby Test Network" sebelum menggunakan faucet.

Untuk MyCrypto, anda perlu menyambungkan dompet anda, buat satu akaun, dan kemudian klik pautan yang sama sekali lagi untuk meminta dana. Untuk faucet Rinkeby yang rasmi, jika ia menyenaraikan 0 peers, ia tidak berbaloi untuk membuat sebarang tweet/ siaran Facebook awam.

| Nama             | Pautan                                | Jumlah          | Masa         |
| ---------------- | ------------------------------------- | --------------- | ------------ |
| MyCrypto         | https://app.mycrypto.com/faucet       | 0.01            | Tiada        |
| Buildspace       | https://buildspace-faucet.vercel.app/ | 0.025           | 1d           |
| Official Rinkeby | https://faucet.rinkeby.io/            | 3 / 7.5 / 18.75 | 8h / 1d / 3d |
| Chainlink        | https://faucets.chain.link/rinkeby    | 0.1             | Tiada        |

## 🙃 Ada masalah untuk mendapatkan Testnet ETH?

Jika perkara di atas tidak berfungsi, gunakan perintah `/faucet` dalam saluran #faucet-request dan bot kami akan menghantar beberapa jumlah kepada anda! Jika anda mahu lebih, hantar alamat dompet anda dan tinggalkan gif yang lucu. Sama ada saya, atau seseorang daripada projek ini akan menghantar beberapa ETH palsu secepat yang mungkin. Lagi lucu gif anda, lagi cepat anda akan dihantar ETH palsu LOL.

## 📈 Deploy di testnet Rinkeby.

Kita perlu menukar fail `hardhat.config.js`. Anda boleh menemuinya dalam direktori asal kontrak pintar anda.

```javascript
require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.0",
  networks: {
    rinkeby: {
      url: "YOUR_ALCHEMY_API_URL",
      accounts: ["YOUR_PRIVATE_RINKEBY_ACCOUNT_KEY"],
    },
  },
};
```

**Nota: JANGAN KOMIT FAIL INI KE GITHUB. IA MENGANDUNGI KUNCI PERIBADI ANDA. ANDA AKAN DIGODAM + DIROMPAK. KUNCI PERIBADI INI ADALAH SAMA DENGAN KUNCI PERIBADI MAINNET ANDA.** Kita akan bercakap tentang variable `.env` dan cara untuk merahsiakan perkara ini.

Anda boleh dapatkan URL API daripada papan pemuka Alchemy dan tampalkannya. Kemudian, anda memerlukan kunci **peribadi** Rinkeby anda (bukan alamat awam anda!) yang anda boleh ambil daripada metamask dan tampalkannya di sana juga.

**Nota: Anda boleh mengakses kunci peribadi anda dengan membuka Metamask, tukar rangkaian kepada "Rinkeby Test Network" dan kemudian klik tiga titik dan pilih "Butiran Akaun" > "Eksport Kunci Peribadi"**

Mengapa anda perlu menggunakan kunci peribadi anda? Kerana untuk melakukan transaksi seperti deploy sesuatu kontrak, anda perlu "log masuk" ke blok rantai. Dan, nama pengguna anda ialah alamat awam anda dan kata laluan anda ialah kunci peribadi anda. Ia seolah-olah seperti log masuk ke dalam AWS atau GCP untuk deploykannya.

Sebaik sahaja anda sudah selesai menyediakan konfigurasi kita sedia untuk deploy skrip deploy yang telah kita tulis sebelum ini.

Lancarkan arahan ini daripada direktori asal `my-wave-portal`. Perhatikan apa yang kita lakukan adalah menukarkannya daripada `localhost` kepada `rinkeby`.

```bash
npx hardhat run scripts/deploy.js --network rinkeby
```

## ❤️ Deploykannya!

Ini ialah output saya:

```bash
Deploying contracts with the account: 0xF79A3bb8d5b93686c4068E2A97eAeC5fE4843E7D
Account balance: 3198297774605223721
WavePortal address: 0xd5f08a0ae197482FA808cE84E00E97d940dBD26E
```

Salin alamat kontrak yang telah di deploy dalam baris terakhir dan simpankannya di suatu tempat. Jangan hilangkannya! Anda akan memerlukannya untuk frontend nanti :). Anda punya akan berbeza daripada saya punya.

**Anda baru sahaja deploy kontrak anda. WOOOOOOOOO.**

Anda sebenarnya boleh mengambil alamat itu dan kemudian menampalkannya ke dalam Etherscan [sini](https://rinkeby.etherscan.io/). Etherscan ialah tempat yang hanya menunjukkan kepada kita keadaan blok rantai dan membantu kita untuk melihat di mana transaksi kita berada. Anda boleh lihat transaksi anda di sini :). Ia mungkin mengambil sedikit masa untuk muncul!

Sebagai contoh, [ini ialah](https://rinkeby.etherscan.io/address/0xd5f08a0ae197482FA808cE84E00E97d940dBD26E) saya punya!

## 🚨 Sebelum anda klik "Pembelajaran Seterusnya"

**BANYAK YANG ANDA TELAH LAKUKAN.**

Anda sepatutnya **tweet** apa yang anda telah tulis dan deploykan kontrak pintar pertama anda dan tag @\_buildspace. Jika anda mahu, sertakan tangkapan skrin laman Etherscan yang menunjukkan kontrak anda di blok rantai!

Ia suatu perkara yang sangat mengujakan kerana anda sudah sampai sejauh ini. Anda telah membuat dan deploy sesuatu ke blok rantai yang sebenar. **Holy shit**. **Saya bangga dengan anda.**

Anda sekarang ialah seorang yang betul-betul "melakukan" satu perkara yang kebanyakan orang lain hanya "bercakap" sahaja.

Anda sudah hampir untuk menguasai seni web3.

TERUSKAN :).

--

_Terima kasih kepada mereka yang telah twit tentang kami, anda semua memang hebat <3._

![](https://i.imgur.com/1lMrpFh.png)

![](https://i.imgur.com/W9Xcn4A.png)

![](https://i.imgur.com/k3lJlls.png)
