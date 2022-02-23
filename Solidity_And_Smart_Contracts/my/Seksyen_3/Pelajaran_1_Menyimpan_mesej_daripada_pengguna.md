📦 Menyimpan mesej di dalam array menggunakan structs
-------------------------------------------

Jadi, kita sekarang telah berjaya buat sebuah web app yang mempunyai kebolehan untuk bercakap dengan blockchain. Menarik bukan?

Sekarang, sekirannya anda ingat, app yang sedang kita bina ini perlu dijadikan tempat untuk orang ramai datang melambai dan menghantar mesej. Kita juga mahu menunjuk kesemua lambaian / mesej yang telah dibuat sebelum ini. Sekarang kita akan membuat kemudahan ini di dalam web app kita.

Jadi di penghujung pembelajaran kita, kita mahu :

1\. Memberikan kemudahan kepada pengguna untuk menghantar mesej dan melambai pada waktu yang sama.

2\. Menyimpan data interaksi tersebut di dalam blockchain.

3\. Menunjukkan data tersebut di dalam web app kita supaya sesiapa yang datang melawat dapat melihat kesemua interaksi yang pernah direkod sebelum ini.

Mari lihat kod smart contract yang telah saya kemas kini. Saya telah menambah ruang komen untuk membantu anda semua melihat dimanakah perubah yang telah saya lakukan kepada smart contract tersebut.

```solidity
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;

    /*
     * Sedikit magik, cuba Google apakah itu events di *didalam Solidity
     */
    event NewWave(address indexed from, uint256 timestamp, string message);

    /* Saya telah membina sebuah struct disini yang  
     * dinamakan Wave. Struct adalah sebuah custom datatype dimana kita boleh mengubah apa yang *disimpan di dalam ia.
     * 
     */
    struct Wave {
        address waver; // The address of the user who waved.
        string message; // The message the user sent.
        uint256 timestamp; // The timestamp when the user waved.
    }

    /*
     * Saya telah declare atau isytihar sebuah variable waves yang mampu menyimpan sebuah array struct.
     * Variable ini mampu menympan kesemua lambaian / waves yang pernah diberikan menerusi web app ini.
     */
    Wave[] waves;

    constructor() {
        console.log("Saya sebuah smart contract. POG.");
    }

    /*
     * Anda dapat perasan dimana saya telah mengubah wave function sedikit disini dan
     * sekarang ia memerlukan sebuah string yang dipanggil _message. Ini adalah mesej yang dihantar oleh pengguna
     * menerusi frontend!
     */
    function wave(string memory _message) public {
        totalWaves += 1;
        console.log("%s waved w/ message %s", msg.sender, _message);

        /*
         * Di sini adalah tempat sebenar dimana saya menyimpan wave data di dalam array
         */
        waves.push(Wave(msg.sender, _message, block.timestamp));

        /*
         * Saya meletakkan beberapa benda menarik disini. Cuba google dan cuba ketahui apakah yang saya cuba lakukan.
         * Beritahu saya apakah yang anda belajar di #general-chill-chat
         */
        emit NewWave(msg.sender, block.timestamp, _message);
    }

    /*
     * Saya menambah sebuah function bernama getAllWaves dimana ia akan memberikan array didalam struct sebelum ini kepada kita.
     * Hal ini akan memudahkan kita untuk mengambil kesemua waves daripada website kita.
     */
    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        // Pilihan: Tambah lini ini jika anda ingin melihat contract ini print value tersebut.
        // Kita juga akan print di run.js juga.
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
        
    }
}
```

🧐 Mari cuba!
----------

Setiap kali kita mengubah contract yang kita bina, kita juga mahu mengubah `run.js` untuk test
fungsi baru yang telah kita tambah. Beginilah caranya untuk memastikan apa yang kita buat itu 
berfungsi dengan betul. Dibawah adalah bagaimana 'run.js' saya sekarang ini.

```javascript
const main = async () => {
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy();
  await waveContract.deployed();
  console.log("Contract addy:", waveContract.address);

  let waveCount;
  waveCount = await waveContract.getTotalWaves();
  console.log(waveCount.toNumber());

  /**
   * Mari hantar waves!
   */
  let waveTxn = await waveContract.wave("A message!");
  await waveTxn.wait(); // Menunggu untuk transaksi tersebut digali

  const [_, randomPerson] = await hre.ethers.getSigners();
  waveTxn = await waveContract.connect(randomPerson).wave("Another message!");
  await waveTxn.wait(); //  Menunggu untuk transaksi tersebut digali

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

Ini adalah apa yang saya dapat di dalam terminal apabila saya run code ini menggunakan 
'npx hardhat run scripts/run.js'.

![](https://i.imgur.com/oPKy2dP.png)

Boom! menarik bukan :) ?

Array yang dikeluarkan itu agak menyeramkan tetapi kita dapat melihat data di setiap `waver`, `message', dan `timestamp'!!
Ia menyimpan mesej dengan tepat di dalam `"A message"' dan `"Another message"` :).

Nota penting : "timestamp" telah dipulangkan kepada kita balik di dalam type "BigNumber". 
Kita akan pelajari bagaimana untuk menggunakan data tersebut di dalam bahagain seterusnya tetapi buat masa sekarang 
yakinlah bahawa tiada apa-apa yang salah daripada kod kita.

Nampaknya kesemua fungsi berjalan dengan lancar. Jadi mari kita pindah **frontend** kita supaya kita dapat lihat kesemua waves di
dalam website kita!

✈️ Re-deploy
------------

Jadi, sekarang kita telah update contract kita, kita perlu melakukan beberapa perkara :
1\. Kita perlu deploy sekali lagi

2\. Kita perlu kemas kini contract address di dalam frontend kita.

3\. Kita juga perlu kemas kini abi file di dalam frontend kita.

**Kebanyakkan orang selalu lupa langkah ketiga. Jadi jangan lupa ya LOL!**

Kenapa kita perlukan kesemua langkah-langkah di atas? Hal ini kerana smart contract itu bersifat **tidak boleh diubah**. Smart contract yang telah dideploy memang tidak boleh diubah. Ia bersifat kekal. Jadi, setiap perubahan yang kita ingin lakukan kepada smart contract tersebut kita perlu redeploy. Hal ini akan **set semula** kesemua variables kerana smart contract yanf di redeploy dikira sebagai smart contract yang baru. **Jadi, kita akan kehilangan kesemua wave data kita jika kita ingin kemas kini smart contract kita**

**Bonus** : Di dalam #general-chill-chat, bolehkah sesiapa bagitahu saya bagaimana kita boleh menyelesaikan permasalahan ini? Dimanakah atau bagaimanakah kita boleh menyimpan wave data kita sekiranya kita kemas kini smart contract kita, segala data yang kita kumpul itu tidak terjejas dan boleh dihubungkan dengan smart contract yang baru di deploy. Diluar sana mungkin bnyak solusi yang kita boleh guna pakai di dalam hal ini.

Jadi, di bawah adalah apa yang anda perlu buat sekarang :

1\. deploy semula menggunakan `npx hardhat run scripts/deploy.js --network rinkeby`

2\. ubah `contractAddress` di dalam `app.js` kepada alamat contract yang baru yang kita dapat daripada langkah diatas seperti yang diterima di dalam terminal.

3\. Dapatkan abi file yang telah dikemaskini daripada `artifacts` sepertimana yang kita lakukan di masa peringkat awal. Copy-paste code tersebut di dalam Replit seperti sebelum ini. Jika anda lupa bagaimana untuk melakukan langkah ini, sila pergi ke [sini] (https://app.buildspace.so/courses/CO02cf0f1c-f996-4f50-9669-cf945ca3fb0b/lessons/LE52134606-af90-47ed-9441-980479599350)

**Peringatan -- anda perlu lakukan langkah-langkah ini setiap kali anda menukar apa-apa di dalam contract code anda**



🔌 Menyambungkan kesemuanya di dalam client kita
----------------------------------

jadi, di bawah adalah function baru yang saya tambah di dalam `App.js`.

```javascript
const [currentAccount, setCurrentAccount] = useState("");
  /*
   * Kesemua state property untuk menyimpan kesemua waves
   */
  const [allWaves, setAllWaves] = useState([]);
  const contractAddress = "0xd5f08a0ae197482FA808cE84E00E97d940dBD26E";

  /*
   * membina sebuah method yang akan mendapatkan kesemua wave daripada contract anda
   */
  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        /*
         * memanggil method getAllwaves daripada smart contract anda
         */
        const waves = await wavePortalContract.getAllWaves();


        /*
         * Kita hanya perlukan address, timestamp dan meseh daripada UI kita. 
         * Jadi marilah kita menggambil value tersebut terlebih dahulu.
         */
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        /*
         * Menyimpan data wave kita di dalam React State
         */
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }
  ```

  Langkah-langkah ini mudah dan lebih kurang sama dengan segala benda yang telah kita lakukan sebelum ini dimana cara kita berhubung dengan provider, mengetahui signer yang terlibat dan berhubung dengan contract kita! Saya telah melakukan sedikit silap mata disini dengan menge-loop menerusi kesemua waves dan menyimpan dengan cantik di dalam array yang bakal kita guna nanti. Anda semua boleh menggunakan console.log `waves` untuk melihat apa yang anda simpan sekiranya anda mengalami sebarang isu.

  Jadi dimanakah kita akan gunakan function `getAllWaves()` yang baru kita bina ini? Kita ingin gunakan ia ketika kita tahu yang pengguna telah menghubungkan wallet dengan menggunakan account yang sah sebab kita memerlukan akaun yang sah untuk berhubung dengan function tersebut yang terletak di dalam smart contract kita. Petunjuk berguna : Anda perlu menggunakan function ini `checkIfWalletIsConnected()`. Saya akan tinggalkan bahagian ini untuk anda untuk fikirkan solusi. Ingat, kita ingin gunakan function ini untuk kita tahu sekiranya kita telah connected menggunkana authorized account.

  Benda terakhir yang saya kemas-kinikan didalam HTML code kita adalah cara untuk render kesemua data untuk kita lihat di UI.

  ```javascript
return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          👋 Hey there!
        </div>

        <div className="bio">
          I am farza and I worked on self-driving cars so that's pretty cool right? Connect your Ethereum wallet and wave at me!
        </div>

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}
      </div>
    </div>
  );
  ```

  Secara ringkasnya, saya hanya menyemak `allWaves` dan bina divs yang baru untuk kesetiap wave dan menunjukkan data di skrin.

  🙀 Alamak!! `wave()` dah rosak!
---------------------------

Jadi di dalam `App.js`, `wave()` function kita tidak dapat berfungsi dengan elok. Sekiranya kita cuba untuk melambai, ia akan memberikan kita error kerana function tersebut  menjangkakan sebuah mesej untuk dihantar dengan lambaian tersebut. Sekarang, anda boleh hardcode seperti dibawah untuk jalan mudah menangani error ini :

```
const waveTxn = await wavePortalContract.wave("this is a message")
```

saya akan membiarkan perkara ini kepada anda : cuba cari cara untuk menambah sebuah textbox yang memberikan kemampuan kepada pengguna untuk menambah mesej mereka yang tersendiri menerusi wave function tersebut :)

Dengan tujuan? Anda mahu memberikan pengguna anda kebolehan untuk menghantar mesej kustom menggunakan sebuah textbox yang mereka boleh menaip di dalam itu. Ataupun anda mahu mereka untuk menghantar link meme? atau link spotify? terserah kepada anda! tepuk dada tanya selera :P

👷‍♀️ Jom bina UI!
--------------------

Cantikkan website anda dengan kreativiti masing-masing. Hal ini saya tidak mahu mempengaruhi anda. Jika anda tersekat dimana-mana, cuba dapatkan bantuan di #section-3-help!

