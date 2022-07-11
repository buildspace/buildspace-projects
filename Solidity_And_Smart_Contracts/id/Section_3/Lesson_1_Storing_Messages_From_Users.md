## 📦 Menyimpan pesan dalam array menggunakan struct

Jadi, kita sekarang memiliki aplikasi web lengkap yang dapat berbicara dengan blockchain!

Sekarang, jika kamu ingat, kita ingin aplikasi terakhir kita menjadi tempat di mana orang bisa datang melambai kepada kita dan mengirimi kita pesan. Kita juga ingin menunjukkan semua lambaian/pesan masa lalu yang kita dapatkan. Itulah yang akan kita lakukan dalam pelajaran ini!

Jadi di akhir pelajaran kita ingin:

1\. Biarkan pengguna mengirimkan pesan bersama dengan lambaian mereka.

2\. Simpan data itu entah bagaimana di blockchain.

3\. Tunjukkan data itu di situs kita sehingga siapa pun dapat datang untuk melihat semua orang yang telah melambai kepada kita dan pesan mereka.

Lihat kode kontrak pintarku yang diperbarui. Aku telah menambahkan banyak komentar di sini untuk membantu kamu melihat apa yang berubah :).

```solidity
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;

    /*
     * Sedikit keajaiban, Google acara apa yang ada di Solidity!
     */
    event NewWave(address indexed from, uint256 timestamp, string message);

    /*
     * Aku membuat struct di sini bernama Wave.
     * Sebuah struct pada dasarnya adalah tipe data khusus di mana kita dapat menyesuaikan apa yang ingin kita simpan di dalamnya.
     */
    struct Wave {
        address waver; // Alamat pengguna yang melambai.
        string message; // Pesan yang dikirim pengguna.
        uint256 timestamp; // Stempel waktu saat pengguna melambai.
    }

    /*
     * Aku mendeklarasikan variabel waves yang memungkinkanku menyimpan array struct.
     * Inilah yang memungkinkanku menyimpan semua lambaian yang pernah dikirimkan siapa pun kepadaku!
     */
    Wave[] waves;

    constructor() {
        console.log("I AM SMART CONTRACT. POG.");
    }

    /*
     * Kamu akan melihatku mengubah fungsi wave sedikit di sini juga dan
     * sekarang membutuhkan string yang disebut _message. Ini adalah pesan yang pengguna kita
     * kirimkan kepada kita dari frontend!
     */
    function wave(string memory _message) public {
        totalWaves += 1;
        console.log("%s waved w/ message %s", msg.sender, _message);

        /*
         * Di sinilah aku sebenarnya menyimpan data lambaian dalam array.
         */
        waves.push(Wave(msg.sender, _message, block.timestamp));

        /*
         * Aku menambahkan beberapa kemewahan di sini, Google dan coba cari tahu apa itu!
         * Beri tahu aku apa yang kamu pelajari di #general-chill-chat
         */
        emit NewWave(msg.sender, block.timestamp, _message);
    }

    /*
     * Aku menambahkan fungsi getAllWaves yang akan mengembalikan array struct, waves, kepada kita.
     * Ini akan memudahkan untuk mengambil lambaian dari situs web kita!
     */
    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        // Opsional: Tambahkan baris ini jika kamu ingin melihat kontrak mencetak nilainya!
        // Kita juga akan mencetaknya di run.js juga.
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }
}
```

## 🧐 Mengujinya

Setiap kali kita mengubah kontrak kita, kita ingin mengubah `run.js` untuk menguji fungsionalitas baru yang kita tambahkan. Begitulah cara kita tahu itu bekerja seperti yang kita inginkan! Inilah tampilanku sekarang.

Inilah `run.js`ku yang diperbarui.

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
   * Mari kita mengirim beberapa lambaian!
   */
  let waveTxn = await waveContract.wave("A message!");
  await waveTxn.wait(); // Tunggu transaksi ditambang

  const [_, randomPerson] = await hre.ethers.getSigners();
  waveTxn = await waveContract.connect(randomPerson).wave("Another message!");
  await waveTxn.wait(); // Tunggu transaksi ditambang

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

Inilah yang aku dapatkan di terminalku ketika aku menjalankan ini menggunakan `npx hardhat run scripts/run.js`.

![](https://i.imgur.com/oPKy2dP.png)

Duar! Cukup mengagumkan, kan :)?

Array terlihat sedikit menakutkan tetapi kita dapat melihat data di sebelah kata `waver`, `message`, dan `timestamp`!! Ini dengan benar menyimpan pesan kita `"A message"` dan `"Another message"` :).

Catatan: "timestamp" diberikan kembali kepada kita sebagai jenis "BigNumber". Kita akan belajar bagaimana bekerja dengannya nanti, tetapi ketahuilah bahwa tidak ada yang salah di sini!

Sepertinya semuanya berhasil, mari beralih ke **frontend** agar kita dapat melihat semua lambaian di situs web kita!

## ✈️ Menyebarkan Ulang

Jadi, sekarang kita telah memperbarui kontrak kita, kita perlu melakukan beberapa hal:

1\. Kita perlu menyebarkannya lagi.

2\. Kita perlu memperbarui alamat kontrak di frontend kita.

3\. Kita perlu memperbarui file abi di frontend kita.

**Orang selalu lupa untuk melakukan 3 langkah ini ketika mereka mengubah kontrak mereka. Jangan lupa ya.**

Mengapa kita perlu melakukan semua ini? Ya, karena kontrak pintar itu **tidak dapat diubah.** Kontrak tersebut tidak dapat diubah. Mereka permanen. Itu berarti mengubah kontrak membutuhkan pemindahan penuh. Ini juga akan **mengatur ulang** semua variabel karena akan diperlakukan sebagai kontrak baru. **Itu berarti kita akan kehilangan semua data lambaian jika ingin memperbarui kode kontrak.**

**Bonus**: Dalam #general-chill-chat, adakah yang bisa memberi tahu aku beberapa solusi di sini? Di mana lagi kita dapat menyimpan data lambaian kita di mana kita dapat memperbarui kode kontrak kita dan menyimpan data asli kita? Ada beberapa solusi di sini, beri tahu aku apa yang kamu temukan!

Jadi yang perlu kamu lakukan sekarang adalah:

1\. Terapkan lagi menggunakan `npx hardhat run scripts/deploy.js --network rinkeby`

2\. Ubah `contractAddress` di `App.js` menjadi alamat kontrak baru yang kita dapatkan dari langkah di atas di terminal seperti yang kita lakukan sebelum pertama kali kita menerapkan.

3\. Dapatkan file abi yang diperbarui dari `artifacts` seperti yang kita lakukan sebelumnya dan salin-tempel ke Replit seperti yang kita lakukan sebelumnya. Jika kamu lupa cara melakukannya, pastikan untuk membaca kembali pelajaran [di sini](https://app.buildspace.so/courses/CO02cf0f1c-f996-4f50-9669-cf945ca3fb0b/lessons/LE52134606-af90-47ed-9441-980479599350 )

**Sekali lagi -- kamu perlu melakukan ini setiap kali mengubah kode kontrak.**

## 🔌 Mengaitkan semuanya ke klien kita

Jadi, inilah fungsi baru yang aku tambahkan ke `App.js`.

```javascript
const [currentAccount, setCurrentAccount] = useState("");
  /*
   * Semua state untuk menyimpan semua lambaian
   */
  const [allWaves, setAllWaves] = useState([]);
  const contractAddress = "0xd5f08a0ae197482FA808cE84E00E97d940dBD26E";

  /*
   * Buat metode yang mendapatkan semua lambaian dari kontrakmu
   */
  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        /*
         * Panggil metode getAllWaves dari Kontrak Cerdasmu
         */
        const waves = await wavePortalContract.getAllWaves();


        /*
         * Kita hanya membutuhkan alamat, stempel waktu, dan pesan di UI kita, jadi mari
         * kita pilih itu
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
         * Simpan data kita di React State
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

Cukup sederhana dan sangat mirip dengan hal-hal yang kita kerjakan sebelumnya dengan cara kita terhubung ke penyedia, mendapatkan penandatangan, dan menghubungkan ke kontrak! Aku melakukan sedikit keajaiban di sini dengan mengulang semua lambaian kita dan menyimpannya dengan baik dalam sebuah array yang dapat kita gunakan nanti. Jangan ragu untuk console.log `waves` untuk melihat apa yang kamu dapatkan di sana jika kamu mengalami masalah.

Di mana kita memanggil fungsi `getAllWaves()` yang baru ini? Yah -- kita ingin menyebutnya ketika kita tahu pasti pengguna memiliki dompet yang terhubung dengan akun resmi karena kita memerlukan akun resmi untuk memanggilnya! Petunjuk: kamu harus memanggil fungsi ini di suatu tempat di `checkIfWalletIsConnected()`. Aku akan menyerahkannya kepada kamu untuk mencari tahu. Ingat, kita ingin menyebutnya ketika kita tahu pasti kita memiliki akun yang terhubung + resmi!

Hal terakhir yang aku lakukan adalah memperbarui kode HTML kita untuk membuat data untuk kita lihat!

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

Pada dasarnya, aku hanya menelusuri `allWaves` dan membuat div baru untuk setiap lambaian dan menampilkan data itu di layar.

## 🙀 Ah!! `wave()` rusak!

Jadi, di `App.js`, fungsi `wave()` kita tidak lagi berfungsi! Jika kita mencoba untuk melambai itu akan memberi kita kesalahan karena mengharapkan pesan untuk dikirim sekarang dengan itu sekarang! Untuk saat ini, kamu dapat memperbaikinya dengan melakukan hardcoding pada pesan seperti:

```
const waveTxn = await wavePortalContract.wave("this is a message")
```

Aku akan menyerahkan ini kepada kamu: cari tahu cara menambahkan kotak teks yang memungkinkan pengguna menambahkan pesan khusus mereka sendiri yang dapat mereka kirim ke fungsi wave :).

Hasilnya? Kamu ingin memberi pengguna kamu kemampuan untuk mengirimi kamu pesan khusus menggunakan kotak teks yang dapat mereka ketik! Atau, mungkin kamu ingin mereka mengirimimu tautan meme? Atau tautan Spotify? Terserah kamu!

## 👷‍♀️ Ayo buat UI!

Buat benda ini terlihat seperti yang kamu inginkan! Aku tidak akan mengajari kamu banyak hal di sini. Jangan ragu untuk mengajukan pertanyaan di #section-3-help!
