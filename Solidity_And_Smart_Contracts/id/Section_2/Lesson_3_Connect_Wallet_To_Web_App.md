## 🌅 Menggunakan window.ethereum()

Jadi, agar situs web kita dapat berbicara dengan blockchain, kita perlu menghubungkan dompet kita dengannya. Setelah kita menghubungkan dompet kita ke situs web kita, situs web kita akan memiliki izin untuk memanggil kontrak pintar atas nama kita. Ingat, ini seperti mengautentikasi ke situs web.

Buka Replit dan buka `App.jsx` di bawah `src`, di sinilah kita akan melakukan semua pekerjaan kita.

Jika kita masuk ke Metamask, maka secara otomatis akan menyuntikkan objek khusus bernama `ethereum` ke dalam jendela kita. Mari kita periksa apakah kita memilikinya terlebih dahulu.

```javascript
import React, { useEffect } from "react";
import "./App.css";

const App = () => {
  const checkIfWalletIsConnected = () => {
    /*
    * Pertama pastikan kita memiliki akses ke window.ethereum
    */
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
    } else {
      console.log("We have the ethereum object", ethereum);
    }
  }

  /*
  * Ini menjalankan fungsi kita saat halaman dimuat.
  */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
          I am farza and I worked on self-driving cars so that's pretty cool right? Connect your Ethereum wallet and wave at me!
        </div>

        <button className="waveButton" onClick={null}>
          Wave at Me
        </button>
      </div>
    </div>
  );
}

export default App
```

## 🔒 Lihat apakah kita dapat mengakses akun pengguna

Jadi ketika kamu menjalankan ini, kamu akan melihat baris "We have the ethereum object" tercetak di konsol situs web saat kamu memeriksanya. Jika kamu menggunakan Replit, pastikan kamu melihat konsol situs web proyek kamu, bukan ruang kerja Replit! Kamu dapat mengakses konsol situs web kamu dengan membukanya di jendela/tabnya sendiri dan meluncurkan alat pengembang. URL akan terlihat seperti ini - `https://waveportal-starter-project.usernameKamu.repl.co/`

**BAGUS.**

Selanjutnya, kita perlu benar-benar memeriksa apakah kita diotorisasi untuk benar-benar mengakses dompet pengguna. Setelah kita memiliki akses ke ini, kita dapat memanggil kontrak pintar kita!

Pada dasarnya, Metamask tidak hanya memberikan kredensial dompet kita ke setiap situs web yang kita kunjungi. Itu hanya memberikannya ke situs web yang kita otorisasi. Sekali lagi, ini seperti login! Tapi, yang kita lakukan di sini adalah **memeriksa apakah kita "sudah masuk".**

Lihat kode di bawah ini.

```javascript
import React, { useEffect, useState } from "react";
import "./App.css";

const App = () => {
  /*
  * Hanya variabel state yang kita gunakan untuk menyimpan dompet publik pengguna kita.
  */
  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      /*
      * Periksa apakah kita berwenang untuk mengakses dompet pengguna
      */
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          👋 Hey there!
        </div>

        <div className="bio">
          I am farza and I worked on self-driving cars so that's pretty cool right? Connect your Ethereum wallet and wave at me!
        </div>

        <button className="waveButton" onClick={null}>
          Wave at Me
        </button>
      </div>
    </div>
    );
  }
export default App
```

Jadi, kita menggunakan metode khusus `eth_accounts` untuk melihat apakah kita diizinkan untuk mengakses salah satu akun di dompet pengguna. Satu hal yang perlu diingat adalah bahwa pengguna dapat memiliki banyak akun di dompet mereka. Dalam hal ini, kita hanya mengambil yang pertama.

## 💰 Buat tombol hubungkan dompet

Saat kamu menjalankan kode di atas, console.log yang tercetak seharusnya `No authorized account found`. Mengapa? Yah karena kita tidak pernah secara eksplisit memberi tahu Metamask, "hei Metamask, tolong beri situs web ini akses ke dompetku". 

Kita perlu membuat tombol `connectWallet`. Di dunia Web3, menghubungkan dompet kamu secara harfiah adalah tombol "Masuk" untuk pengguna kamu :). Lihat ini:

```javascript
import React, { useEffect, useState } from "react";
import "./App.css";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
  * Terapkan metode connectWallet kamu di sini
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
          I am farza and I worked on self-driving cars so that's pretty cool right? Connect your Ethereum wallet and wave at me!
        </div>

        <button className="waveButton" onClick={null}>
          Wave at Me
        </button>

        {/*
        * Jika tidak ada currentAccount, render tombol ini
        */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
}

export default App
```

Kode kita semakin panjang di sini, tetapi kamu dapat melihat seberapa pendek fungsi `connectWallet` kita. Dalam hal ini, aku menggunakan fungsi `eth_requestAccounts` karena aku benar-benar meminta Metamask untuk memberiku akses ke dompet pengguna.

Pada baris 67, aku juga menambahkan sebuah tombol sehingga kita dapat memanggil fungsi `connectWallet` kita. Kamu akan melihat aku hanya menampilkan tombol ini jika kita tidak memiliki `currentAccount`. Jika kita sudah memiliki currentAccount, berarti kita sudah memiliki akses ke akun resmi di dompet pengguna.

## 🌐 Hubungkan!

Sekarang, saatnya untuk keajaiban! Lihat video di bawah ini:
[Loom](https://www.loom.com/share/1d30b147047141ce8fde590c7673128d?t=0)

## 🚨 Diperlukan: Sebelum kamu mengklik "Pelajaran Berikutnya"

Kita baru saja melakukan banyak hal dalam dua pelajaran terakhir. Ada pertanyaan? Pastikan untuk bertanya di #section-2-help!
