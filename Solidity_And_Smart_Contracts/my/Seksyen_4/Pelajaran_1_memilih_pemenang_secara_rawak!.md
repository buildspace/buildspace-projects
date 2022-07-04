😈 Memilih pemenang secara rawak
-----------------------

Buat masa sekarang, code yang kita tulis akan memberikan 0.0001 ETH setiap kali pengguna berinteraksi dengan webapp kita. Baki di dalam contract kita akan cepat kering dan hal ini akan membuatkan keseronokkan itu hilang dan kita perlu memberi dana lagi kedalam contract kita.  Di dalam bahagian ini, kita akan belajar mengenai :

1\. Memilih pemenang secara **rawak**

2\. Mencipta sebuah mekanisma **cooldown** untuk menghalang pengguna untuk spam anda untuk mendapat kan hadiah atau untuk mengacau ketenteraman anda.

Jom kita buat pemenang secara rawak dahulu!

Untuk menghasil nombor rawak di dalam smart contract adalah sesuatu perkara yang **susah dan sulit**

Kenapa? Fikirkan bagaimana nombor rawak ini dibuat dengan secara normal. Apabila anda membuat nombor secara rambang di dalam program, **Ia akan mengambil beberapa no didalam komputer anda untuk menghasilkan nombor rawak** Contohnya: kelajuan kipas komputer, suhu CPU , berapa kali anda menekan huruf "L" pada 3:25PM sejak anda pertama kali membeli laptop anda, kelajuan internet anda, dan pelbagai lagi perkara yang sukar untuk anda kawal. Ia akan mengambil **kesemua** nombor tersebut yang rawak dan meletakkan ia didalam sebuah algorithm yang akan menghasilkan sebuah nombor yang ia rasakan paling random. Ada faham?

Di dalam blockchain, hampir tiada langsung elemen rawak yang boleh digunakan. Kesemuanya yang dilihat oleh contract dapat dilihat oleh para public. Oleh yang demikian, sesorang boleh mencuba mempermainkan system tersebut untuk mempengaruhi nombor rawak yang dihasilkan.

Mari lihat code dibawah :

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

Disini, saya mengambil dua nombor yang diberi kepada saya oleh Solidity, `block.difficulty` dan `block.timestamp` dan gabungkan kedua nilai ini untuk mendapatkan sebuah nombor yang rawak. `block.difficulty` memberitahu para miners betapa sukar block ini untuk di mine berdasarkan keadaan transaksi pada block itu. Block semakin susah untuk di-mine kerana bebera faktor, tetapi ia menjadi susah apabila terdapat banyak transaksi di dalam block tersebut (sesetengah miner menyukai block yang mudah, tetapi ganjaran yang mereka dapat akan sedikit). `block.timestamp` adalah hanya Unix timestamp yang di process oleh block tersebut.

Nombor-nombor ini *agak* rawak. Namun, secara teknikalnya, kedua-dua `block.difficulty` dan `block.timestamp` dapat dikontrol oleh penyerang yang lebih handal.

Untuk menyukarkan lagi keadaan, saya cipta satu variable baru bernama `seed` yang akan berubah pada setiap kali seseorang pengguna itu menghantar wave yang baru. Jadi, saya menggabungkan ketiga-tiga variable tersebut untuk menghasilkan sebuah seed yang rawak. Kemudia saya melakukan `% 100` yang akan pastikan nombor yang dihasilkan itu diantara 0 hingga 99.

It sahaja! kemudian saya menulis if statement yang mudah untuk melihat seed tersebut adalah kurang atau sama dengan 50, sekiranya betul, pengguna tersebut akan memenangi hadiah! Jadi, pengguna akan mempunyai peluang sebanyak 50% untuk memenangi kerana kita telah menetapkan `seed <=50`. Anda boleh mengubah kondisi yang ditetapkan ini mengikut citarasa anda.  Saya membuat ia 50% kerana lebih mudah untuk test!

Amat penting untuk kita kenalpasti dimana sebuah serangan mampu memanipulasikan sistem yang telah anda bina. Namun semestinya ia susah dan sukar. Terdapat pelbagai cara lain untuk mendapatkan nombor rawak namun Solidity tidak mampu untuk berbuat demikian. Kesemua nombor yang contract kita dapat access adalah public dan *tidak* rawak sepenuhnya.

Namun, hal ini merupakan kekuatan blockchin. Tetapi agak menjengkelkan untuk sesetengah aplikasi yang memerlukan nombor rawak untuk berfungsi.

Walaubagaimanapun, tiada siapa ingin menyerang aplikasi kecil yang kita sedang bina ini. Tetapi saya mahu mengingatkan anda semua tentang perkara ini sebelum anda membina aplikasi untuk jutaan pengguna di dunia ini!

Mari kita test code ini
------------------------


Mari kita pastikan code yang ditulis ini berfungsi dengan baik. Dibawah adalah `run.js` saya yang telah dikemaskini. Didalam hal ini, saya hanya ingin memastikan baki di dalam kontrak berubah sekiranya sesiapa yang wave memenangi cabutan bertuah ini!

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
   * Let's try two waves now
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
Anda tidak semesti akan mudah mendapati tutorial yang seperti ini yang mengajar anda bagaimana untuk test code yang telah anda bina. Ia terletak kepada inisiatif anda untuk mengetahui tentang 1) apa yang perlu anda test 2 bagaimana untuk test. Di dalam kes ini, saya mahu memastikan baki didalam contract turun sebanyak 0.0001 sekiranya nombor rawak yang dihasilkan tersebut kurang daripada 50.

Jadim apabila saya run code di atas, saya akan dapat :

![](https://i.imgur.com/ArXRCsp.png)


boom! code ini berjaya. Apabila "79" dihasilkan, pengguna tidak memenangi hadiah tersebut. Namun , apabila 23 dihasilkan, pengguna tersebut menang! dan baki di dalam contract tersebut berkurang sebanyak 0.0001. Baek :)


Cooldown untuk spammers
-----------------------

Caiyalah! Kita telah jumpa cara untuk menghantar ETH secara rawak! Sekarang, kita boleh menambah fungsi cooldown untuk site kita ini supaya pengguna tidak boleh spam wave kepada anda. Kenapa anda tanya? Hal ini supaya kita tidak mahu pengguna asyik menang selalu dengan spamming. Kita juga tidak mahu mesej daripada *pengguna* *tersebut* memenuhi ruang wall anda.

Cuba anda lihat code dibawah. Saya telah menambah beberapa komen di beberapa line baharu yang saya tulis.

Saya menggunakan struktur data istimewa yang dipanggil [map](https://medium.com/upstate-interactive/mappings-in-solidity-explained-in-under-two-minutes-ecba88aff96e).

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
     * Ini adalah sebuah address => uint mapping, yang bermaksud saya dapat mengkaitkan address ini dengan sebuah nombor
     * Dalam hal ini, saya akan menyimpan address tersebut dengan masa terakhir pengguna melambai kepada kita
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
         * Kita perlu memastikan timestamp terkini adalah 15 minit lebih besar daripada timestamp yang kita simpan
         */
        require(
            lastWavedAt[msg.sender] + 15 minutes < block.timestamp,
            "Wait 15m"
        );

        /*
            * mengemaskini timestamp terkini untuk pengguna ini
         */
        lastWavedAt[msg.sender] = block.timestamp;

        totalWaves += 1;
        console.log("%s has waved!", msg.sender);

        waves.push(Wave(msg.sender, _message, block.timestamp));

        /*
         * Menghasilkan seed baru untuk pengguna seterusnya yang ingin wave
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


Cuba run `npx hardhat run scripts/run.js` dan anda akan dapat lihat error sekiranya anda spam wave dengan berturut-turut.

Bam! begitulah cara yang betul untuk membina cooldown!
