## 🌅 Menggunakan window.ethereum()

Jadi, agar situs web kita dapat berbicara dengan blockchain, kita perlu menghubungkan dompet kita dengannya. Setelah kita menghubungkan dompet kita ke situs web kita, situs web kita akan memiliki izin untuk memanggil kontrak pintar atas nama kita. **Ingat, ini seperti mengautentikasi ke situs web.**

Buka Replit dan buka `App.js` di bawah `src`, di sinilah kita akan melakukan semua pekerjaan kita.

Jika kita masuk ke Metamask, itu akan secara otomatis menyuntikkan objek khusus bernama `ethereum` ke dalam jendela kita yang memiliki beberapa metode ajaib. Mari kita periksa apakah kita memilikinya terlebih dahulu.

```javascript
import React, { useEffect } from "react";
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';

// Konstanta
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;

const App = () => {

  const checkIfWalletIsConnected = () => {
    /*
    * Pertama pastikan kita memiliki akses ke window.ethereum
    */
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }
  }

  // Metode Render
  const renderNotConnectedContainer = () => (
    <button className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  /*
  * Ini menjalankan fungsi kita saat halaman dimuat.
  */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          {/* Tambahkan metode render kamu di sini */}
          {renderNotConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
```

## 🔒 Lihat apakah kita dapat mengakses akun pengguna

Jadi ketika kamu menjalankan ini, kamu akan melihat baris "Kita memiliki objek Ethereum" tercetak di konsol situs web saat kamu memeriksanya. Jika kamu menggunakan Replit, pastikan kamu melihat konsol situs web proyek kamu, bukan ruang kerja Replit! Kamu dapat mengakses konsol situs web kamu dengan membukanya di jendela/tabnya sendiri dan meluncurkan alat pengembang. URL akan terlihat seperti ini - `https://nft-starter-project.yourUsername.repl.co/`

**BAIK.**

Selanjutnya, kita perlu benar-benar memeriksa apakah kita diotorisasi untuk benar-benar mengakses dompet pengguna. Setelah kita memiliki akses ke ini, kita dapat memanggil kontrak pintar kita!

Pada dasarnya, Metamask tidak hanya memberikan kredensial dompet kita ke setiap situs web yang kita kunjungi. Itu hanya memberikannya ke situs web yang kita otorisasi. Sekali lagi, ini seperti login! Namun, yang kita lakukan di sini adalah **memeriksa apakah kita "masuk".**

Lihat kode di bawah ini.

```javascript
import React, { useEffect, useState } from "react";
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';

// Konstanta
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;

const App = () => {

  /*
  * Hanya variabel status yang kita gunakan untuk menyimpan dompet publik pengguna kita. Jangan lupa untuk mengimpor useState.
  */
  const [currentAccount, setCurrentAccount] = useState("");
  
  /*
  * Harus memastikan ini async.
  */
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
    } else {
        console.log("We have the ethereum object", ethereum);
    }

    /*
    * Periksa apakah kita diizinkan untuk mengakses dompet pengguna
    */
    const accounts = await ethereum.request({ method: 'eth_accounts' });

    /*
    * Pengguna dapat memiliki beberapa akun resmi, kita ambil yang pertama jika ada!
    */
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  }

  // Metode Render
  const renderNotConnectedContainer = () => (
    <button className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  return (
     <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          {renderNotConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
```

## 🛍 Buat tombol hubungkan dompet

Saat kamu menjalankan kode di atas, console.log yang dicetak akan menjadi `Tidak ada akun resmi yang ditemukan`. Mengapa? Nah karena kita tidak pernah secara eksplisit memberitahu Metamask, *"hey Metamask, tolong beri akses website ini ke dompetku".*

Kita perlu membuat tombol `connectWallet`. Di dunia Web3, menghubungkan dompet kamu secara harfiah adalah tombol "Masuk" untuk penggunamu.

Siap untuk pengalaman "login" termudah untuk hidupmu :)? Saksikan berikut ini:

```javascript
import React, { useEffect, useState } from "react";
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';

const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  }

  /*
  * Terapkan metode connectWalletmu di sini
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      /*
      * Metode mewah untuk meminta akses ke akun.
      */
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      /*
      * Duar! Ini harus mencetak alamat publik setelah kita mengotorisasi Metamask.
      */
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
    } catch (error) {
      console.log(error);
    }
  }

  // Metode Render
  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  /*
  * Menambahkan render bersyarat! Kita tidak ingin menampilkan Connect to Wallet jika kita sudah terhubung :).
  */
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          {currentAccount === "" ? (
            renderNotConnectedContainer()
          ) : (
            <button onClick={null} className="cta-button connect-wallet-button">
              Mint NFT
            </button>
          )}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
```


## 🚨Laporan perkembangan

Posting tangkapan layar situs web kamu di #progress!
