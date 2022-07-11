## 💸 Kirim ETH ke orang-orang yang melambai padamu

Sekarang yang ingin kita lakukan adalah mengirim beberapa ETH kepada orang-orang yang melambai pada kita! Misalnya, mungkin kamu ingin membuatnya di mana ada peluang 1% seseorang dapat memenangkan $5 dari melambai padamu. Atau, mungkin kamu ingin membuat semua orang yang melambai padamu mendapatkan $0,01 dalam ETH karena melambai pada kamu haha.

Kamu bahkan dapat membuatnya di mana kamu dapat mengirim ETH secara manual ke orang-orang yang pesannya paling kamu sukai. Mungkin mereka mengirimi kamu lagu yang luar biasa!!

**Mengirim ETH dengan mudah ke pengguna adalah bagian inti dari kontrak pintar dan salah satu bagian paling keren tentang mereka**, jadi, ayo lakukan!

Untuk memulai, kita hanya akan memberi semua orang yang melambai kepada kita `0,0001 ETH`. Yaitu $0,31 :). Dan ini semua terjadi di testnet, jadi, itu $ palsu!

Lihat fungsi `wave`ku yang diperbarui di `WavePortal.sol`.

```solidity
function wave(string memory _message) public {
    totalWaves += 1;
    console.log("%s has waved!", msg.sender);

    waves.push(Wave(msg.sender, _message, block.timestamp));

    emit NewWave(msg.sender, block.timestamp, _message);

    uint256 prizeAmount = 0.0001 ether;
    require(
        prizeAmount <= address(this).balance,
        "Trying to withdraw more money than the contract has."
    );
    (bool success, ) = (msg.sender).call{value: prizeAmount}("");
    require(success, "Failed to withdraw money from contract.");
}
```

Ini cukup mengagumkan.

Dengan `prizeAmount` aku hanya memulai jumlah hadiah. Solidity sebenarnya memungkinkan kita menggunakan kata kunci `ether` sehingga kita dapat dengan mudah mewakili jumlah uang. Nyaman :)!

Kita juga memiliki beberapa kata kunci baru. Kamu akan melihat `require` yang pada dasarnya memeriksa untuk melihat bahwa beberapa kondisi benar. Jika tidak benar, maka akan keluar dari fungsi dan membatalkan transaksi. Ini seperti pernyataan if yang mewah!

Dalam hal ini, ia memeriksa apakah `prizeAmount <= address(this).balance`. Di sini, `address(this).balance` adalah **saldo kontrak itu sendiri.**

Mengapa? **Nah, bagi kita untuk mengirim ETH kepada seseorang, kontrak kita harus memiliki ETH di dalamnya.**

Cara kerjanya adalah ketika kita pertama kali menyebarkan kontrak, kita "mendanai" itu :). Sejauh ini, kita **tidak pernah** mendanai kontrak kita!! Itu selalu bernilai 0 ETH. Itu berarti kontrak kita tidak dapat mengirim ETH kepada orang-orang karena **tidak ada**! Kita akan membahas pendanaan di bagian berikutnya!

Apa yang keren tentang

```solidity
require(prizeAmount <= address(this).balance, "Trying to withdraw more money than the contract has.");
```

adalah bahwa itu memungkinkan kita memastikan bahwa *saldo kontrak* lebih besar dari *jumlah hadiah,* dan jika ya, kita dapat melanjutkan dengan memberikan hadiah! Jika tidak `require` pada dasarnya akan mematikan transaksi dan menjadi seperti, "Yo, kontrak ini bahkan tidak dapat membayarmu!".

`(msg.sender).call{value: prizeAmount}("")` adalah jalur ajaib tempat kita mengirim uang :). Sintaksnya agak aneh! Perhatikan bagaimana kita memberikannya `prizeAmount`!

`require(success` adalah dimana kita tahu transaksi berhasil :). Jika tidak, itu akan menandai transaksi sebagai kesalahan dan mengatakan `"Failed to withdraw money from contract."`

Cukup mengagumkan, kan :)?

## 🏦 Danai kontraknya sehingga kita dapat mengirim ETH!

Kita sekarang telah menyiapkan kode kita untuk mengirim ETH. Bagus! Sekarang kita harus benar-benar memastikan kontrak kita didanai, jika tidak, kita tidak memiliki ETH untuk dikirim!

Pertama-tama kita akan bekerja di `run.js`. Ingat, `run.js` seperti tempat pengujian kita di mana kita ingin memastikan fungsionalitas inti kontrak kita berfungsi sebelum kita pergi dan menerapkannya. **Sangat sulit** untuk men-debug kode kontrak dan kode frontend secara bersamaan, jadi, kita memisahkannya!

Mari menuju ke `run.js` dan buat beberapa perubahan untuk memastikan semuanya berfungsi. Inilah `run.js`ku yang diperbarui.

```javascript
const main = async () => {
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.1"),
  });
  await waveContract.deployed();
  console.log("Contract addy:", waveContract.address);

  /*
   * Dapatkan saldo Kontrak
   */
  let contractBalance = await hre.ethers.provider.getBalance(
    waveContract.address
  );
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  /*
   * Kirim Lambaian
   */
  let waveTxn = await waveContract.wave("A message!");
  await waveTxn.wait();

  /*
   * Dapatkan saldo Kontrak untuk melihat apa yang terjadi!
   */
  contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  let allWaves = await waveContract.getAllWaves();
  console.log(allWaves);
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

Keajaibannya ada di `hre.ethers.utils.parseEther("0.1"),`. Di sinilah aku berkata, "pergi dan gunakan kontrakku dan danai dengan 0,1 ETH". Ini akan menghapus ETH dari dompetku, dan menggunakannya untuk mendanai kontrak. **Itu dia**.

Aku kemudian melakukan `hre.ethers.utils.formatEther(contractBalance)` untuk menguji apakah kontrakku benar-benar memiliki saldo 0,1. Aku menggunakan fungsi yang diberikan `ethers` kepadaku di sini yang disebut `getBalance` dan memberikannya alamat kontrakku!

Tapi kemudian, kita juga ingin melihat apakah ketika kita memanggil `wave` jika 0,0001 ETH dihapus dengan benar dari kontrak!! Itu sebabnya aku mencetak saldo lagi setelah aku memanggil `wave`.

Saat kita menjalankan

```bash
npx hardhat run scripts/run.js
```

Kamu akan melihat kita mengalami sedikit kesalahan!

Itu akan mengatakan sesuatu seperti

```bash
Error: non-payable constructor cannot override value
```

Maksudnya adalah, kontrak kita tidak diperbolehkan untuk membayar orang sekarang! Ini adalah perbaikan cepat, kita perlu menambahkan kata kunci `payable` ke konstruktor kita di `WavePortal.sol`. Saksikan berikut ini:

```solidity
constructor() payable {
  console.log("We have been constructed!");
}
```

Itu dia :).

Sekarang, ketika aku melakukan

```bash
npx hardhat run scripts/run.js
```

Inilah yang aku dapatkan:

![](https://i.imgur.com/8jZHL6b.png)

**DUAR**.

Kita baru saja mengirim beberapa ETH dari kontrak kita, sukses besar! Dan, kita tahu kita berhasil karena saldo kontrak turun 0,0001 ETH dari 0,1 menjadi 0,0999!

## ✈️ Perbarui skrip penerapan untuk mendanai kontrak

Kita perlu melakukan sedikit pembaruan pada `deploy.js`.

```javascript
const main = async () => {
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.001"),
  });

  await waveContract.deployed();

  console.log("WavePortal address: ", waveContract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();
```

Yang aku lakukan hanyalah mendanai kontrak 0,001 ETH seperti ini:

```javascript
const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.001"),
});
```
Aku suka menyebarkan ke testnets dengan jumlah ETH yang lebih kecil terlebih dahulu untuk diuji!

Dan aku juga menambahkan `await waveContract.deployed()` untuk memudahkan aku mengetahui kapan itu di-deploy!

Gampang!

Mari kita terapkan kontrak kita menggunakan jalur lama yang sama

```bash
npx hardhat run scripts/deploy.js --network rinkeby
```

Sekarang ketika kamu membuka [Etherscan](https://rinkeby.etherscan.io/) dan menempelkan alamat kontrakmu, kamu akan melihat bahwa kontrakmu sekarang memiliki nilai 0,001 ETH! Sukses!

**Ingatlah untuk memperbarui frontend kamu dengan alamat kontrak baru *dan* file ABI baru. Jika tidak, itu akan** **patah**.

Uji fungsi wave kamu dan pastikan itu masih berfungsi!

## 🎁 Bungkus

Ada sesuatu tentang menggunakan ETH yang sebenarnya untuk mengisi kontrakmu, bukan? Lihat [link ini](https://gist.github.com/adilanchian/236fe9f3a56b73751060800cae3a780d) untuk melihat semua kode yang tertulis di bagian ini!
