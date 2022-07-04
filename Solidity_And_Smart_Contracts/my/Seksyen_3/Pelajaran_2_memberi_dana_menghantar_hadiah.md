💸 Memberikan ETH kepada pengguna yang melambai anda
----------------------------------------

Sekarang apa yang kita perlu buat adalah untuk memberikan sejumlah ETH kepada pengguna yang melambai kepada kita! Sebagai contoh, sekiranya anda mahu menjadikan situasi dimana terdapat peluang sebanyak 1% kepada seseorang dimana mereka menang $5 dengan hanya melambai kepada anda. Atau, mungkin anda mahu menjadikan situasi tersebut dimana setiap pengguna yang melambai akan menerima $0.01 di dalam ETH dengan hanya melambai kepada anda LOL.

Anda juga boleh menjadikan situasi dimana anda boleh menghantar ETH kepada penghantar mesej yang anda sayang sekali. Atau mereka menghantar anda lagu yang sangat menarik!

Untuk permulaan, kita hanya akan memberikan setiap orang yang melambai kepada kita `0.0001 ETH`. Jumlah ini merupakan $0.31 :) Dan semua ini berlaku di dalam testnet, jadi ia hanyalah duit $ palsu!

Cuba anda lihat `wave` function yang telah saya kemaskinikan di dalam `WavePortal.sol`

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

Kod ini sangat menarik ye kawan-kawan.

Dengan `prizeAmount` saya telah memulakan / initaite sejumlah hadiah. Solidity sebenarnya memberikan kita kemudahan dimana kita boleh guna `ether` sebagai keyword yang dapat mewakilkan sebagai sejumlah duit. Memudahkan :)!

Kita juga ada beberapa keyword yang baru. Anda dapat lihat `require` yang akan memeriksa sekiranya kondisi yang kita tetapkan itu sah atau tidak. Sekiranya ia tidah sah, function tersebut akan keluar atau quit dan membatalkan transaksi tersebut. Ia sebenarnya sebuah If statement yang fancy~

Di dalam kes ini, kod diatas akan memeriksa sekiranya `prizeAmount <= address(this)/balance`. `address(this).balance` adalah **baki address smart contract tersebut**

Kenapa kita perlu memeriksa dahulu? **Sekiranya kita mahu menghantar sejumlah ETH kepada seseorang, kita memerlukan sejumlah ETH yang mencukupi di dalam wallet contract tersebut**

Kita boleh fund contract yang kita deploy ini ketika mula-mula deploy contract tersebut. Buat masa sekarang, kita **tidak pernah** fund atau memberi sebarang ETH kedalam contract kita. Contract kita sentiasa bernilai 0 ETH. Ini bermaksud kotrak kita tidak dapat menghantar ETH kerana ia **tidak mempunyai apa-apa** Kita akan cuba memberi sejumlah Eth kedalam contract ini.

Apa yang menarik mengenai 

```solidity
require(prizeAmount <= address(this).balance, "Trying to withdraw more money than the contract has.");
```

adalah ia memastikan yang *balance contract kita* adalah lebih besar daripada *prize amount,* dan sekiranya kondisi ini sah, kita akan menghadiahkan pengguna tersebut! Jika tidak, `require` akan menghentikan transaksi tersebut.

`(msg.sender).call{value: prizeAmount}("")` adalah jampi yang akan menghantar duit tersebut ;) Syntax ini agak pelik! cuba lihat bagaimana kita meletakkan  `prizeAmount`!

`require(success)` digunakan untuk memberitahu kita bahawa transaksi tersebut telah sukses dan berjaya! Jika tidak berjaya, kod ini akan memangkah transaksi tersebut sebagai error dan menyatakan `"Failed to withdraw money from contract."`

Menarik bukan? :)

🏦 memberi dana ke dalam contract supaya kita boleh memberikan ETH!
-----------------------------------------------

Kita sekarang telah membina kod untuk menghantar ETH. Menarik! Sekarang kita perlu memastikan contract itu telah mempunyai dana. Jika tidak kita tiada ETH untuk dihantar!

Kita akan mulakan langkah kita dengan `run.js`. Ingat, `run.js` adalah tempat percubaan kita dimana kita mahu memastikan bahawa kesemua fungsi smart contract kita boleh digunakan sebelum kita deploy smart contract ini. Ia sebenarnya **sangat susah** untuk debug contract code dan frontend code pada masa yang sama, jadi kita akan bahagikan mereka!

Jom kita ke `run.js` dan membuat sedikit perubahan untuk memastikan kesemua fungsi berjalan dengan lancar. Ini adalah `run.js` saya yang telah dikemaskini.

```javascript
const main = async () => {
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.1"),
  });
  await waveContract.deployed();
  console.log("Contract addy:", waveContract.address);

  /*
   * Mendapatkan baki contract
   */
  let contractBalance = await hre.ethers.provider.getBalance(
    waveContract.address
  );
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  /*
   * Menghantar wave
   */
  let waveTxn = await waveContract.wave("A message!");
  await waveTxn.wait();

  /*
   * Mendapatkan baki contract untuk lihat apa yang telah berlaku
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

Jampi di dalam kemas kini ini adalah `hre.ethers.utils.parseEther("0.1")`. Di sini dimana saya suruh "pergi dan deploy contract saya dan berikan dana sebanya 0.1 ETH". Kod ini akan mengambil ETH di dalam wallet saya, dan gunakan ia untuk memberikan dana kepada contract tersebut. **Itu sahaja**

Kemudian saya menggunakan `hre.ethers.utils.formatEther(contractBalance)` untuk memeriksa contract saya sekiranya benar dana yang ada bernilai 0.1 ETH. Saya menggunakan function `getBalance` daripada function `ethers` untuk melakukan pemeriksaan ini.

Namun, kita juga mahu melihat sekiranya apabila kita memanggil `wave` adakah 0.0001 ETH itu telah berjaya dibuang daripada contract tersebut! Itulah sebabnya kenapa saya print baki contract itu sekali lagi setelah saya call `wave`.

Apabila kita run 

```bash
npx hardhat run scripts/run.js
```

Kita akan dapat melihat akan ada beberapa error yang keluar.

Error itu menyebut 

```bash
Error: non-payable constructor cannot override value
```

Apa yang dinyatakan di dalam error tersebut adalah contract kita tidak mempunyai kebenaran untuk menghadiahkan ETH kepada pengguna sekarang. Terdapat satu cara quick fix yang kita boleh lakukan. Kita perlu menambah keyword `payable` di dalam constructor `WavePortal.sol`. Lihat disini :

```solidity
constructor() payable {
  console.log("We have been constructed!");
}
```

It sahaja :)

Sekarang, sekiranya saya run code ini

```bash
npx hardhat run scripts/run.js
```

ini adalah hasil yang saya akan dapat 

![](https://i.imgur.com/8jZHL6b.png)

**Boom**

Kita telah menghantar sejumlah ETH daripada contract kita. Kejayaan yang besar! Kemudian, kita telah diberitahu bahawa kita telah berjaya kerana baki kontrak telah jatuh 0.0001 ETH daripada 0.1 kepada 0.0999!

✈️ mengemaskini script untuk deploy untuk memberi dana kedalam contract
----------------------------------------

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

Apa yang saya telah lakukan adalah saya telah memeberikan dana kedalam contract tersebut sebanyak 0.001 ETH.

```javascript
const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.001"),
});
```

Saya gemar untuk deploy ke testnets dengan jumlah yang sedikit untuk memeriksa sekiranya code saya itu berfungsi dengan baik.

Saya juga telah menambah `await waveContract.deployed()` untuk memudahkan saya untuk mengetahui sekirang contract ini telah di deploy ke blockchain.

Mudah dan jelas!

Jom kita deploy dengan syntax yang sama seperti sebelum ini :

```bash
npx hardhat run scripts/deploy.js --network rinkeby
```

Sekarang kita pergi ke [Etherscan](https://rinkeby.etherscan.io/) dan paste contract address yang kita baru dapat dari pada deployment tadi. Anda akan lihat contract anda bernilai 0.001 ETH. Berjaya!

***Peringatan untuk mengemaskini frontend anda dengan contract yang baru ini *dan* ABI file yang telah dikemas kii. Sekiranya tidak, UI anda akan break!**

Cuba semula wave function anda dan pastikan ia masih boleh digunakan!


🎁  Wrap Up
----------

Sesuatu yang sangat istimewa dengan menggunakan ETH yang sebenar didalam contract anda bukan? Lihat [disini] (https://gist.github.com/adilanchian/236fe9f3a56b73751060800cae3a780d) untuk melihat kesemua code yang ditulis di dalam bahagian ini! 





