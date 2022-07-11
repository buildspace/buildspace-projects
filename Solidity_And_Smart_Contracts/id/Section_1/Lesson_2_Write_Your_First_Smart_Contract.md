## 👩‍💻 Mari kita menulis kontrak

Luar biasa, kita berhasil.

Kita hanya akan langsung masuk ke proyek kita.

Mari buat kontrak cerdas yang memungkinkan kita mengirim 👋 ke kontrak kita dan melacak total # lambaian. Ini akan berguna karena di situs kamu, kamu mungkin ingin melacak # ini! Jangan ragu untuk mengubah kontrak cerdas ini agar sesuai dengan kasus penggunaan kamu.

Buat file bernama **`WavePortal.sol`** di bawah direktori **`contracts`**. Struktur file sangat penting saat menggunakan Hardhat, jadi berhati-hatilah di sini!

Kita akan memulai dengan struktur setiap kontrak dimulai.

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

Catatan: Kamu mungkin ingin mengunduh ekstensi VS Code Solidity untuk penyorotan sintaks yang mudah [di sini](https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity).

```solidity
// SPDX-License-Identifier: UNLICENSED
```

Hanya komentar mewah. Ini disebut "SPDX license identifier", jangan ragu untuk Google apa itu :).

```solidity
pragma solidity ^0.8.0;
```

Ini adalah versi kompiler Solidity yang kita ingin kontrak kita gunakan. Pada dasarnya tertulis "saat menjalankan ini, aku hanya ingin menggunakan kompiler Solidity versi 0.8.0, tidak ada yang lebih rendah. Catatan, pastikan bahwa versi kompiler sama di `hardhat.config.js`.

```solidity
import "hardhat/console.sol";
```

Beberapa sihir yang diberikan kepada kita oleh Hardhat untuk melakukan beberapa log konsol dalam kontrak kita. Sebenarnya sulit untuk men-debug kontrak pintar, tetapi ini adalah salah satu manfaat yang diberikan Hardhat kepada kita untuk membuat hidup lebih mudah.

```solidity
contract WavePortal {
    constructor() {
        console.log("Yo yo, I am a contract and I am smart");
    }
}
```

Jadi, kontrak pintar terlihat seperti `class` dalam bahasa lain, jika kamu pernah melihatnya! Setelah kita menginisialisasi kontrak ini untuk pertama kalinya, konstruktor itu akan menjalankan dan mencetak baris itu. Tolong buat kalimat itu mengatakan apa pun yang kamu inginkan :)!

Dalam pelajaran berikutnya, kita akan menjalankan ini dan melihat apa yang kita dapatkan!

## 🚨 Sebelum kamu mengklik "Pelajaran Berikutnya"

*Catatan: jika kamu tidak melakukan ini, Farza akan sangat sedih :(.*

Pergi ke #progress dan posting tangkapan layar kontrak mewah kamu di file WavePortal.sol :).
