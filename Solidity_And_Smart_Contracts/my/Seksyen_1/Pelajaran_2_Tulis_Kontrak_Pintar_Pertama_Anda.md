## 👩‍💻 Jom tulis kontrak

Hebat,Akhirnya kita berjaya.

Kita hanya akan melompat terus ke dalam projek.

Mari bina kontrak pintar yang membolehkan kita menghantar 👋 kepada kontrak kita dan kira jumlah # gelombang. Ini akan berguna kerana di laman sesawang anda, anda mungkin mahu mengira atau mengikuti # ini! Anda boleh menukar ini agar sesuai dengan bekas penggunaan anda.

Buat fail bernama **`WavePortal.sol`** di bawah direktori **`contracts`**. Struktur fail sangat penting apabila menggunakan Hardhat, jadi, berhati-hati di sini!

Kami akan bermula dengan struktur setiap kontrak bermula.

```solidity
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    constructor() {
        console.log("Yo yo, I am a contract and I am smart");
    }
}
```

Nota: Anda mungkin mahu memuat turun sambungan VS Code Solidity untuk penyerlahan sintaks yang mudah [di sini](https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity).

```solidity
// SPDX-License-Identifier: UNLICENSED
```

Hanya komen saja-saja. Ia dipanggil "SPDX-License-Identifier", sila ke Google apa itu :).

```solidity
pragma solidity ^0.8.0;
```

ni ialah versi pengkompil Solidity yang kita mahu kontrak kita gunakan. Ia pada asasnya mengatakan "apabila menjalankan ini, saya hanya mahu menggunakan versi 0.8.0 pengkompil Solidity, tiada yang lebih rendah. Ambil perhatian, pastikan versi pengkompil adalah sama dalam `hardhat.config.js`.

```solidity
import "hardhat/console.sol";
```

Beberapa magik yang diberikan kepada kita oleh Hardhat untuk melakukan beberapa log konsol dalam kontrak kita. Ia sebenarnya mencabar untuk menyahpepijat (membuang bug) kontrak pintar tetapi ini adalah salah satu kebaikan yang Hardhat berikan kepada kita untuk menjadikan hidup lebih mudah.

```solidity
contract WavePortal {
    constructor() {
        console.log("Yo yo, I am a contract and I am smart");
    }
}
```

Jadi, kontrak pintar kelihatan seperti `kelas` dalam bahasa lain, jika anda pernah melihatnya! Sebaik sahaja kita memulakan kontrak ini buat kali pertama, pembina itu akan menjalankan dan mencetak barisan kod itu. Tolong buat baris itu mengatakan apa sahaja yang anda mahu :)!

Dalam pelajaran seterusnya, kita akan menjalankan ini dan lihat apa yang kita dapat!

## 🚨 Sebelum anda klik "Pelajaran Seterusnya"

_Nota: kalau tak buat macam ni, Farza akan sedih sangat :(._

Pergi ke #progress dan siarkan tangkapan skrin kontrak mewah anda dalam fail WavePortal.sol :).
