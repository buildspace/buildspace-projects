🌅 Menggunakan window.ethereum()
--------------------------

Jadi, untuk membolehkan laman web kita 'bercakap' dengan blok rantai, kita perlu menyambungkan dompet kita dengannya. Sebaik sahaja kita menyambungkan dompet ke laman web, laman web kita akan memperoleh kebenaran untuk menghubungi kontrak pintar bagi pihak kita. Ingat, ia sama seperti pengesahan masuk ke suatu laman web.

Pergi ke Replit dan ke `App.jsx` di bawah `src`, di sinilah tempat kita akan melakukan semua kerja kita.

Jikalau kita log masuk ke Metamask, ia akan secara automatiknya memasukkan satu objek khas yang dipanggil 'ethereum' ke dalam tetingkap kita. Mari kita lihat sama ada kita mempunyainya dahulu.

```javascript
import React, { useEffect } from "react";
import "./App.css";

const App = () => {
  const checkIfWalletIsConnected = () => {
    /*
    * Pertama sekali pastikan kita mempunyai akses ke window.ethereum
    */
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
    } else {
      console.log("We have the ethereum object", ethereum);
    }
  }

  /*
  * Ini melancarkan fungsi kita apabila halaman dimuatkan.
  */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        👋 Hi!
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

🔒 Lihat sama ada kita boleh mengakses akaun pengguna
-----------------------------------------

Jadi bila anda melancarkannya, anda dapat lihat yang baris "We have the ethereum object" dicetak dalam konsol laman web apabila anda pergi untuk memeriksanya. Jika anda menggunakan Replit, pastikan anda melihat konsol projek laman web anda, bukan ruang kerja Replit! Anda boleh mengakses konsol laman sesawang anda dengan membukanya dalam tetingkap/tab dan melancarkan alat pembangun. URL anda sepatutnya kelihatan seperti ini - `https://waveportal-starter-project.yourUsername.repl.co/`

**BAGUS.**

Seterusnya, kita perlu lihat sama ada kita telah disahkan untuk mengakses dompet pengguna. Sebaik sahaja kita mempunyai akses tersebut, kita boleh memanggil kontrak pintar!

Metamask bukan sesuka hati memberi kelayakan dompet kita kepada setiap laman web yang kita pergi. Ia hanya memberikannya kepada laman web yang kita telah benarkan. Sekali lagi, ia sama seperti log masuk! Tetapi, apa yang kita lakukan di sini adalah **melihat sama ada kita "log masuk".**

Lihat kod di bawah.

```javascript
import React, { useEffect, useState } from "react";
import "./App.css";

const App = () => {
  /*
  * Sekadar variable keadaan yang kita gunakan untuk menyimpan dompet awam pengguna.
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
      * Lihat sama ada kita diberi pengesahan untuk mengakses dompet pengguna
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
          👋 Hi!
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

Jadi, kita menggunakan kaedah khas `eth_accounts` untuk lihat sama ada kita telah disahkan untuk mengakses mana-mana akaun dalam dompet pengguna. Satu perkara yang kita perlu ingat adalah pengguna boleh mempunyai berbilang akaun dalam dompet mereka. Dalam kes ini, kita hanya ambil yang pertama.

💰 Membina butang sambung dompet
--------------------------------

Bila anda melancarkan kod di atas, console.log yang dicetak sepatutnya jadi `Tiada akaun sah ditemui`. Mengapa? Ini kerana kita tidak pernah memberi tahu Metamask secara jelas, "hai MetaMask, sila berikan laman web ini akses kepada dompet saya".

Kita perlu membuat satu butang `connectWallet`. Dalam dunia Web3, menyambungkan dompet adalah sama seperti butang "Log Masuk" untuk pengguna anda :). Lihat sini:

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
  * Masukkan kaedah connectWallet anda di sini
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
        * Jika tiada currentAccount tunjukkan butang ini
        */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
    </div>S
  );
}

export default App
```

Kod kita dah agak panjang sedikit di sini, tapi anda dapat lihat betapa singkatnya fungsi 'connectWallet'. Dalam kes ini, saya menggunakan fungsi `eth_requestAccounts` kerana saya ingin meminta Metamask untuk memberi saya akses kepada dompet pengguna.

Di garisan 67, saya juga menambah satu butang supaya kita boleh memanggil fungsi `connectWallet`. Anda akan perasan yang saya cuma tunjukkan butang ini jika kita tidak mempunyai `currentAccount` sahaja. Jika kita sudah mempunyai currentAccount, itu bermaksud kita sudah pun mempunyai akses kepada akaun yang telah disahkan dalam dompet pengguna.

🌐 Sambungkan!
-----------

Sekarang, tiba masanya untuk buat magik! Lihat video di bawah:
[Loom](https://www.loom.com/share/1d30b147047141ce8fde590c7673128d?t=0)

🚨 Diperlukan: Sebelum anda klik "Pembelajaran Seterusnya"
-------------------------------------------

Banyak perkara yang kita dah lakukan dalam dua pembelajaran sebelum ini. Ada sebarang soalan? Pastikan anda bertanya dalam #section-2-help!
