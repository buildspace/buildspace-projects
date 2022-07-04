## ✅ Sediakan env anda untuk mula bekerja dengan blockchain

Sebelum apa-apa, kita perlu memastikan rangkaian Ethereum tempatan kita berfungsi. Inilah cara kita boleh menyusun dan menguji kod kontrak pintar kita! Anda tahu bagaimana anda perlu memutarkan persekitaran setempat untuk mengusahakannya? Perkara yang sama di sini!

Buat masa ini, semua yang anda perlu tahu ialah kontrak pintar ialah sekeping kod yang hidup di rantaian blok. Blockchain ialah tempat awam di mana sesiapa sahaja boleh membaca dan menulis data secara selamat dengan bayaran tertentu. Fikirkan ia seperti AWS atau Heroku, kecuali tiada siapa yang benar-benar memilikinya!

Jadi dalam kes ini, kita mahu orang 👋 kepada kita. Gambaran yang lebih besar di sini ialah:

1\. **Kita akan menulis kontrak pintar.** Kontrak itu mempunyai semua logik tentang cara 👋 dikendalikan. Ini seperti kod pelayan anda.

2\. **Kontrak pintar kita akan digunakan ke rantaian blok (blockchain).** Dengan cara ini, sesiapa sahaja di dunia akan dapat mengakses dan menjalankan kontrak pintar kita (jika kita memberi mereka kebenaran untuk berbuat demikian). Jadi, hampir seperti server :).

3\. **Kita akan membina laman sesawang klien** yang akan membolehkan orang ramai berinteraksi dengan mudah dengan kontrak pintar kita di rantaian blok (blockchain).

Saya akan menerangkan perkara tertentu secara mendalam seperti yang diperlukan (cth. cara perlombongan berfungsi, cara kontrak pintar disusun dan dijalankan, dsb) _tetapi buat masa ini mari kita fokus untuk menjalankan barangan_.

Jika anda menghadapi sebarang masalah di sini, sampaikan mesej pada Discord dalam  `#section-1-help`.

## ✨ Keajaiban Hardhat

1\. Kita akan banyak menggunakan alat yang dipanggil Hardhat. Ini akan membolehkan kita dengan mudah memulakan rangkaian Ethereum tempatan dan memberi kita ETH palsu dan akaun (dompet kripto) ujian palsu untuk digunakan. Ingat, ia sama seperti server biasa, kecuali "server" adalah rantaian blok.

2\. Cepat-cepat kumpulkan kontrak pintar dan ujinya pada blockchain tempatan (local) kita.

Mula-mula anda perlu mendapatkan nod/npm. Jika anda tidak mempunyainya, sila ke [sini](https://hardhat.org/tutorial/setting-up-the-environment.html).

Kami mengesyorkan menjalankan Hardhat menggunakan versi LTS Node.js semasa atau anda mungkin menghadapi beberapa isu! Anda boleh menemui keluaran semasa [di sini](https://nodejs.org/en/about/releases/).

Seterusnya, mari pergi ke terminal (Git Bash tidak akan berfungsi). Teruskan dan cd ke direktori yang anda ingin kerjakan. Sebaik sahaja anda berada di sana jalankan arahan ini:

```bash
mkdir my-wave-portal
cd my-wave-portal
npm init -y
npm install --save-dev hardhat
```

## 👏 Dapatkan contoh projek

Hebat, sekarang kita sepatutnya mempunyai Hardhat. Mari kita buat contoh projek.

Jalankan:

```bash
npx hardhat
```

_Nota: jika anda telah memasang Yarn bersama npm, anda mungkin mendapat kesilapan (error) seperti `npm ERR! could not determine executable to run`. Dalam kes ini, anda boleh melakukan `yarn add hardhat`._

Pilih pilihan untuk membuat contoh projek. Katakan ya kepada segala-galanya.

Projek sampel akan meminta anda memasang hardhat-waffle dan hardhat-ether. Ini adalah alat lain yang akan kami gunakan nanti :).

Teruskan dan pasang dependencies lain ini sekiranya ia tidak melakukannya secara automatik.

```bash
npm install --save-dev @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers
```

Akhir sekali, jalankan `npx hardhat accounts` dan ini akan mencetak sekumpulan rentetan yang kelihatan seperti ini:

`0xa0Ee7A142d267C1f36714E4a8F75612F20a79720`

Ini adalah alamat Ethereum yang Hardhat hasilkan untuk kami mensimulasikan pengguna sebenar pada rantaian blok. Ini akan membantu kita dengan banyak nanti dalam projek apabila kita ingin mensimulasikan pengguna 👋-menghadap kita!

## 🌟 Jalankan

Untuk memastikan semuanya berfungsi, jalankan:

```bash
 npx hardhat compile
```

Kemudian jalankan:

```bash
npx hardhat test
```

Anda sepatutnya melihat sesuatu seperti ini:

![](https://i.imgur.com/rjPvls0.png)

Mari lakukan sedikit pembersihan.

Teruskan dan buka kod untuk projek sekarang dalam editor kod kegemaran anda. Saya paling suka VSCode! Kita mahu memadamkan semua kod pemula yang dihasilkan untuk kita. Kita tidak memerlukan semua itu. Kita pro ;)!

Teruskan dan padamkan fail `sample-test.js` di bawah `test`. Juga, padamkan `sample-script.js` di bawah `scripts`. Kemudian, padamkan `Greeter.sol` di bawah `kontrak`. Jangan padamkan folder sebenar!

## 🚨 Sebelum anda klik "Pelajaran Seterusnya"

_Nota: kalau tak buat macam ni, Farza akan sedih sangat :(._

Pergi ke #progress dan siarkan tangkapan skrin (screenshot) terminal **anda** yang menunjukkan output ujian! Anda baru sahaja menjalankan kontrak pintar, itu benda besar!! Tunjukkan :).

PS: Jika anda **tidak** mempunyai akses kepada #progress, pastikan anda memautkan Discord anda, sertai Discord [di sini](https://discord.gg/mXDqs6Ubcc), hubungi kami di #umum kami' akan membantu anda mendapatkan akses kepada saluran yang betul!
