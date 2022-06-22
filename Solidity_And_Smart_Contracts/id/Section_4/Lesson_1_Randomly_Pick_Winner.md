## 😈 Pilih pemenang secara acak-

Jadi sekarang, kode kita diatur untuk memberikan 0,0001 ETH setiap saat! Kontrak kita akan kehabisan uang cukup cepat, dan kemudian kesenangan berakhir dan kita perlu menambahkan lebih banyak dana ke kontrak kita. Dalam pelajaran ini, saya akan memandu kamu melalui cara:

1\. Pilih pemenang **secara acak**.

2\. Buat mekanisme **cooldown** untuk mencegah orang mengirim spam kepada kamu dalam upaya memenangkan hadiah atau mengganggumu.

Mari kita lakukan pemenang acak terlebih dahulu!

So, generating a random number in smart contracts is widely known as a **difficult problem**.

Jadi, menghasilkan angka acak dalam kontrak pintar dikenal luas sebagai **masalah sulit**.

Mengapa? Nah, pikirkan bagaimana angka acak dihasilkan secara normal. Saat kamu membuat angka acak secara normal dalam sebuah program, **ini akan mengambil sekumpulan angka berbeda dari komputermu sebagai sumber keacakan** seperti: kecepatan kipas, suhu CPU, berapa kali kamu telah menekan "L" pada 15:52 karena kamu telah membeli komputer, kecepatan internet kamu, dan banyak # lain yang sulit untuk kamu kendalikan. Dibutuhkan **semua** angka yang "acak" ini dan menggabungkannya ke dalam algoritma yang menghasilkan angka yang dianggap sebagai upaya terbaik pada angka yang benar-benar "acak". Masuk akal?

Di blockchain, **hampir tidak ada sumber keacakan**. Semua yang dilihat kontrak, dilihat publik. Karena itu, seseorang dapat mempermainkan sistem hanya dengan melihat kontrak pintar, melihat apa yang diandalkannya untuk keacakan, dan kemudian orang tersebut dapat memberikan angka pasti yang mereka butuhkan untuk menang.

Mari kita periksa kode di bawah ini :).

```solidity
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;

    /*
     * We will be using this below to help generate a random number
     */
    uint256 private seed;

    event NewWave(address indexed from, uint256 timestamp, string message);

    struct Wave {
        address waver;
        string message;
        uint256 timestamp;
    }

    Wave[] waves;

    constructor() payable {
        console.log("We have been constructed!");
        /*
         * Set the initial seed
         */
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function wave(string memory _message) public {
        totalWaves += 1;
        console.log("%s has waved!", msg.sender);

        waves.push(Wave(msg.sender, _message, block.timestamp));

        /*
         * Generate a new seed for the next user that sends a wave
         */
        seed = (block.difficulty + block.timestamp + seed) % 100;

        console.log("Random # generated: %d", seed);

        /*
         * Give a 50% chance that the user wins the prize.
         */
        if (seed <= 50) {
            console.log("%s won!", msg.sender);

            /*
             * The same code we had before to send the prize.
             */
            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
        }

        emit NewWave(msg.sender, block.timestamp, _message);
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        return totalWaves;
    }
}
```

Here, I take two numbers given to me by Solidity, `block.difficulty` and `block.timestamp` and combine them to create a random number. `block.difficulty` tells miners how hard the block will be to mine based on the transactions in the block. Blocks get harder for a # of reasons, but, mainly they get harder when there are more transactions in the block (some miners prefer easier blocks, but, these payout less). `block.timestamp` is just the Unix timestamp that the block is being processed.

Di sini, saya mengambil dua angka yang diberikan kepada saya oleh Solidity, `block.difficulty` dan `block.timestamp` dan menggabungkannya untuk membuat angka acak. `block.difficulty` memberi tahu penambang seberapa sulit blok itu akan ditambang berdasarkan transaksi di blok tersebut. Blok menjadi lebih sulit karena # alasan, tetapi, terutama semakin sulit saat ada lebih banyak transaksi di blok tersebut (beberapa penambang lebih menyukai blok yang lebih mudah, tetapi pembayarannya lebih sedikit). `block.timestamp` hanyalah stempel waktu Unix saat blok sedang diproses.

#s ini *cukup* acak. Namun, secara teknis, `block.difficulty` dan `block.timestamp` dapat dikendalikan oleh penyerang yang canggih. 

Untuk membuatnya lebih sulit, aku membuat variabel `seed` yang pada dasarnya akan berubah setiap kali pengguna mengirim lambaian baru. Jadi, aku menggabungkan ketiga variabel ini untuk menghasilkan benih acak baru. Kemudian aku hanya melakukan `% 100` yang akan memastikan angka diturunkan ke kisaran antara 0 - 99.

Itu dia! Kemudian aku hanya menulis pernyataan if sederhana untuk melihat apakah seednya kurang dari atau sama dengan 50, jika ya -- maka yang melambai memenangkan hadiahnya! Jadi, itu artinya sang waver memiliki peluang 50% untuk menang sejak kita menulis `seed <= 50`. Kamu dapat mengubah ini untuk apa pun yang kamu inginkan :). Aku baru saja membuatnya 50% karena lebih mudah untuk menguji seperti itu!!

Penting untuk dilihat di sini bahwa serangan secara teknis dapat mempermainkan sistemmu di sini jika mereka benar-benar menginginkannya. Ini akan sangat sulit. Ada cara lain untuk menghasilkan angka acak di blockchain tetapi Solidity tidak memberi kita apa pun yang dapat diandalkan karena tidak bisa! Semua #s kontrak kita dapat mengakses bersifat publik dan *tidak pernah* benar-benar acak.

Sungguh, ini adalah salah satu kekuatan blockchain. Tapi, bisa sedikit mengganggu untuk beberapa aplikasi seperti kita di sini!

Bagaimanapun, tidak ada yang akan menyerang aplikasi kecil kita, tetapi aku ingin kamu mengetahui semua ini saat kamu membuat dApp yang memiliki jutaan pengguna!

Menguji
-------

Mari kita pastikan itu berhasil! Inilah `run.js`ku yang diperbarui. Dalam hal ini, aku hanya ingin memastikan saldo kontrak berubah jika orang yang melambaikan tangan menang!

```javascript
const main = async () => {
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.1"),
  });
  await waveContract.deployed();
  console.log("Contract addy:", waveContract.address);

  let contractBalance = await hre.ethers.provider.getBalance(
    waveContract.address
  );
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  /*
   * Mari kita coba dua lambaian sekarang
   */
  const waveTxn = await waveContract.wave("This is wave #1");
  await waveTxn.wait();

  const waveTxn2 = await waveContract.wave("This is wave #2");
  await waveTxn2.wait();

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

Kamu tidak akan selalu memiliki tutorial yang bagus seperti ini untuk memandu kamu tentang cara menguji kodemu. Terserah kamu untuk mencari tahu 1) apa yang ingin kamu uji 2) cara mengujinya. Dalam hal ini, aku tahu aku ingin memastikan saldo kontrak turun 0,0001 hanya jika # acak kurang dari 50 dihasilkan!

Jadi, ketika aku menjalankan kode di atas, inilah yang aku dapatkan:

![](https://i.imgur.com/ArXRCsp.png)

Duar! Berhasil. Saat "79" dibuat, pengguna tidak memenangkan hadiah. Tapi, ketika 23 dihasilkan, yang melambai menang! Dan, saldo kontrak turun tepat 0,0001. Bagus :).

## Cooldown untuk mencegah spammer

Awesome. You have a way to randomly send ETH to people now! Now, it might be useful to add a cooldown function to your site so people can't just spam wave at you. Why? Well, maybe you just don't want them to keep on trying to win the prize over and over by waving at you. Or, maybe you don't want *just* *their* messages filling up your wall of messages.

Luar biasa. Aku memiliki cara untuk mengirim ETH secara acak kepada orang-orang sekarang! Sekarang, mungkin berguna untuk menambahkan fungsi cooldown ke situsmu sehingga orang tidak bisa hanya mengirim spam ke kamu. Mengapa? Yah, mungkin kamu hanya tidak ingin mereka terus mencoba memenangkan hadiah berulang kali dengan melambai padamu. Atau, mungkin kamu tidak ingin *hanya* pesan *mereka* memenuhi dinding pesanmu.

Lihat kodenya. Aku menambahkan komentar di mana aku menambahkan baris baru.

Aku menggunakan struktur data khusus yang disebut [map](https://medium.com/upstate-interactive/mappings-in-solidity-explained-in-under-two-minutes-ecba88aff96e).

```solidity
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;
    uint256 private seed;

    event NewWave(address indexed from, uint256 timestamp, string message);

    struct Wave {
        address waver;
        string message;
        uint256 timestamp;
    }

    Wave[] waves;

    /*
     * Ini adalah address => pemetaan uint, artinya aku dapat mengaitkan alamat dengan angka!
     * Dalam hal ini, aku akan menyimpan alamat dengan terakhir kali pengguna melambai pada kami.
     */
    mapping(address => uint256) public lastWavedAt;

    constructor() payable {
        console.log("We have been constructed!");
        /*
         * Set the initial seed
         */
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function wave(string memory _message) public {
        /*
         * Kita perlu memastikan stempel waktu saat ini setidaknya 15 menit lebih besar dari stempel waktu terakhir yang kita simpan
         */
        require(
            lastWavedAt[msg.sender] + 15 minutes < block.timestamp,
            "Wait 15m"
        );

        /*
         * Perbarui stempel waktu saat ini yang kita miliki untuk pengguna
         */
        lastWavedAt[msg.sender] = block.timestamp;

        totalWaves += 1;
        console.log("%s has waved!", msg.sender);

        waves.push(Wave(msg.sender, _message, block.timestamp));

        /*
         * Hasilkan seed baru untuk pengguna berikutnya yang mengirimkan lambaian
         */
        seed = (block.difficulty + block.timestamp + seed) % 100;

        if (seed <= 50) {
            console.log("%s won!", msg.sender);

            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than they contract has."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
        }

        emit NewWave(msg.sender, block.timestamp, _message);
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        return totalWaves;
    }
}
```


Coba dan jalankan `npx hardhat run scripts/run.js` dan lihat pesan kesalahan yang kamu dapatkan jika kamu mencoba melambai dua kali berturut-turut sekarang tanpa menunggu 15 menit :).

Bam! Dan begitulah cara kamu membangun cooldown!
