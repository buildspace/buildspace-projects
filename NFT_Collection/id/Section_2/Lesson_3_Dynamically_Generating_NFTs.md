## 🔤 Secara acak menghasilkan kata-kata pada gambar

Keren — kita membuat kontrak yang sekarang menghasilkan NFT semua on-chain. Tapi, itu masih selalu sama NFT argh!!! Mari kita membuatnya dinamis.

**Aku menulis semua kode [di sini](https://Gist.github.com/farzaa/b788ba3a8dbaf6f1ef9af57eefa63c27) yang akan menghasilkan SVG dengan kombinasi tiga kata acak.**

Aku pikir ini akan menjadi cara terbaik bagi orang untuk melihat semua kode sekaligus dan memahami cara kerjanya.

Aku juga menulis komentar di atas sebagian besar baris yang aku tambahkan/ubah! Saat kamu melihat kode ini, coba dan tulis sendiri. Google fungsi yang kamu tidak mengerti!

Aku ingin membuat beberapa catatan tentang beberapa baris ini.

## 📝 Pilih kata-katamu sendiri!

```solidity
string[] firstWords = ["KATAMU", "KATAMU", "KATAMU", "KATAMU", "KATAMU", "KATAMU"];

string[] secondWords = ["KATAMU", "KATAMU", "KATAMU", "KATAMU", "KATAMU", "KATAMU"];

string[] thirdWords = ["KATAMU", "KATAMU", "KATAMU", "KATAMU", "KATAMU", "KATAMU"];
```

Ini adalah kata-kata acak kita!! Silakan bersenang-senang dengan ini. Pastikan setiap kata adalah satu kata tanpa spasi!

Semakin lucu kata-katanya, semakin baik ini haha. Aku suka membuat setiap array menjadi tema tertentu. Misalnya, `firstWords` bisa menjadi nama depan karakter anime favoritmu. Kemudian, `secondWords` bisa menjadi makanan yang kamu sukai. Dan, `thirdWords` bisa berupa nama-nama hewan acak. Bersenang-senang dengan itu!!! Jadikan ini milikmu.

Berikut adalah beberapa dariku. Aku suka baris pertama menjadi kata-kata yang terasa seperti "menggambarkan" sesuatu!

![](https://i.imgur.com/ADawgrB.png)

Mungkin kamu ingin menghasilkan nama band acak. Mungkin kamu ingin membuat nama karakter acak untuk game Dungeons and Dragons-mu. Melakukan apapun yang kamu inginkan. Mungkin kamu tidak peduli tentang kombinasi tiga kata dan hanya ingin membuat SVG dari penguin seni piksel. Pergi untuk itu. Lakukan apapun yang kamu inginkan :).

Catatan: Aku merekomendasikan seperti 15-20 kata per array. Aku perhatikan sekitar 10 biasanya tidak cukup acak.

## 🥴 Nomor acak

```solidity
function pickRandomFirstWord
```

Fungsi ini terlihat agak eksentrik. Benar? Mari kita bicara tentang bagaimana kita secara acak memilih barang dari array.

Jadi, menghasilkan angka acak dalam kontrak pintar secara luas dikenal sebagai **masalah sulit**.

Mengapa? Nah, pikirkan tentang bagaimana angka acak dihasilkan secara normal. Saat kamu membuat angka acak secara normal dalam sebuah program, **ini akan mengambil sekumpulan angka berbeda dari komputermu sebagai sumber keacakan** seperti: kecepatan kipas, suhu CPU, berapa kali kamu telah menekan "L" pada 15:52 karena kamu telah membeli komputer, kecepatan internetmu, dan banyak hal lain yang sulit untuk kamu kendalikan. Dibutuhkan **semua** angka yang "acak" ini dan menggabungkannya ke dalam algoritma yang menghasilkan angka yang dianggap sebagai upaya terbaik pada angka yang benar-benar "acak". Masuk akal?

Di blockchain, **hampir tidak ada sumber keacakan**. Ini deterministik dan semua yang dilihat kontrak, dilihat publik. Karena itu, seseorang dapat memainkan sistem hanya dengan melihat kontrak pintar, melihat apa yang diandalkannya untuk keacakan, dan kemudian orang tersebut dapat memainkannya jika mereka mau.


```solidity
random(string(abi.encodePacked("FIRST_WORD", Strings.toString(tokenId))));
```

Apa yang dilakukan adalah mengambil dua hal: String sebenarnya `FIRST_WORD` dan versi string dari `tokenId`. Aku menggabungkan dua string ini menggunakan `abi.encodePacked` dan kemudian string gabungan itulah yang aku gunakan sebagai sumber keacakan.

**Ini bukan keacakan yang sebenarnya.** Tapi ini yang terbaik yang kita dapatkan untuk saat ini!

Ada cara lain untuk menghasilkan angka acak di blockchain (lihat [Chainlink](https://docs.chain.link/docs/chainlink-vrf/)) tetapi Solidity tidak memberi kita apa pun yang dapat diandalkan karena itu tidak bisa! Semua hal kontrak kita dapat akses bersifat publik dan tidak pernah benar-benar acak.

Ini bisa sedikit mengganggu untuk beberapa aplikasi seperti kita di sini! Bagaimanapun, tidak ada yang akan menyerang aplikasi kecil kita, tetapi aku ingin kamu mengetahui semua ini saat kamu membuat dApp yang memiliki jutaan pengguna!

## ✨  Membuat SVG secara dinamis

Lihat variabel `string baseSvg` pada kontrak. Ini terlihat liar haha. Pada dasarnya, satu-satunya bagian dari SVG kita yang pernah berubah adalah kombo tiga kata, bukan? Jadi yang kita lakukan adalah membuat variabel `baseSvg` yang dapat kita gunakan kembali berulang kali saat kita membuat NFT baru.

Kita kemudian menggabungkan semuanya menggunakan:

```
string memory finalSvg = string(abi.encodePacked(baseSvg, first, second, third, "</text></svg>"));
```

`</text></svg>` adalah tag penutup! Jadi untuk `finalSvg` kita berkata, "Hei — gabungkan baseSVG-ku, kombo tiga kata yang baru saja aku buat, dan kemudian tag penutupku. Itu dia :)! Kelihatannya menakutkan tetapi yang kita lakukan hanyalah bekerja dengan kode SVG.

## 😎 Menjalankannya!

Setelah kamu menulis semuanya, lanjutkan dan jalankan menggunakan `npx hardhat run scripts/run.js`. Lihat apa yang dihasilkan oleh `console.log(finalSvg);`.

Inilah yang aku dapatkan di terminal-ku.

```plaintext
This is my NFT contract. Woah!
Contract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3

--------------------
<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='black' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>SandwichSakuraNinja</text></svg>
--------------------

An NFT w/ ID 0 has been minted to 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266

--------------------
<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='black' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>GoatSasukeNinja</text></svg>
--------------------

An NFT w/ ID 1 has been minted to 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
```

Haha, itu banyak hal. Lanjutkan dan salin salah satu SVG yang dihasilkan di terminal kamu dan tempel [di sini](https://www.svgviewer.dev/) untuk melihat apa yang kamu dapatkan.

Kamu akan dapat melihat SVG yang dihasilkan! Ini milikku:

![Untitled](https://i.imgur.com/uS8SXYu.png)

**AYOOOOOO!!!!** Kita membuat ini secara acak dalam kontrak kita! Jika kamu mengambil SVG lain yang kamu hasilkan, kamu juga akan melihatnya berbeda. Semuanya dihasilkan dengan cepat. YEY.

👩‍💻 Menghasilkan metadata secara dinamis.
------------------

Sekarang, kita harus benar-benar mengatur metadata JSON! Pertama, kita membutuhkan beberapa fungsi pembantu. Buat folder bernama `libraries` di bawah `contracts`. Di `libraries` buat file bernama `Base64.sol` dan salin-tempel kode dari [sini](https://Gist.github.com/farzaa/f13f5d9bda13af68cc96b54851345832) ke sana. File ini memiliki beberapa fungsi pembantu yang dibuat oleh orang lain untuk membantu kita mengonversi SVG dan JSON kita ke Base64 dalam Solidity.

Oke, sekarang untuk kontrak kita yang diperbarui.

**Hal yang sama, aku menulis semua kode dan menambahkan komentar [di sini](https://Gist.github.com/farzaa/dc45da3eb91a41913767f3eb4d7830f1).**

Silakan copy-paste beberapa bagian ini dan pahami cara kerjanya setelah kamu menjalankannya :). Aku terkadang suka melakukan ini karena aku dapat melihat kode berjalan dan memahami cara kerjanya setelahnya!!

Setelah aku menjalankan kontrak sekarang, inilah yang aku dapatkan:

```plaintext
Compilation finished successfully
This is my NFT contract. Woah!
Contract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3

--------------------
data:application/json;base64,eyJuYW1lIjogIlNhbmR3aWNoU2FrdXJhTmluamEiLCAiZGVzY3JpcHRpb24iOiAiQSBoaWdobHkgYWNjbGFpbWVkIGNvbGxlY3Rpb24gb2Ygc3F1YXJlcy4iLCAiaW1hZ2UiOiAiZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCxQSE4yWnlCNGJXeHVjejBuYUhSMGNEb3ZMM2QzZHk1M015NXZjbWN2TWpBd01DOXpkbWNuSUhCeVpYTmxjblpsUVhOd1pXTjBVbUYwYVc4OUozaE5hVzVaVFdsdUlHMWxaWFFuSUhacFpYZENiM2c5SnpBZ01DQXpOVEFnTXpVd0p6NDhjM1I1YkdVK0xtSmhjMlVnZXlCbWFXeHNPaUIzYUdsMFpUc2dabTl1ZEMxbVlXMXBiSGs2SUhObGNtbG1PeUJtYjI1MExYTnBlbVU2SURJMGNIZzdJSDA4TDNOMGVXeGxQanh5WldOMElIZHBaSFJvUFNjeE1EQWxKeUJvWldsbmFIUTlKekV3TUNVbklHWnBiR3c5SjJKc1lXTnJKeUF2UGp4MFpYaDBJSGc5SnpVd0pTY2dlVDBuTlRBbEp5QmpiR0Z6Y3owblltRnpaU2NnWkc5dGFXNWhiblF0WW1GelpXeHBibVU5SjIxcFpHUnNaU2NnZEdWNGRDMWhibU5vYjNJOUoyMXBaR1JzWlNjK1UyRnVaSGRwWTJoVFlXdDFjbUZPYVc1cVlUd3ZkR1Y0ZEQ0OEwzTjJaejQ9In0=
--------------------

An NFT w/ ID 0 has been minted to 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266

--------------------
data:application/json;base64,eyJuYW1lIjogIkdvYXRTYXN1a2VOaW5qYSIsICJkZXNjcmlwdGlvbiI6ICJBIGhpZ2hseSBhY2NsYWltZWQgY29sbGVjdGlvbiBvZiBzcXVhcmVzLiIsICJpbWFnZSI6ICJkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBITjJaeUI0Yld4dWN6MG5hSFIwY0RvdkwzZDNkeTUzTXk1dmNtY3ZNakF3TUM5emRtY25JSEJ5WlhObGNuWmxRWE53WldOMFVtRjBhVzg5SjNoTmFXNVpUV2x1SUcxbFpYUW5JSFpwWlhkQ2IzZzlKekFnTUNBek5UQWdNelV3Sno0OGMzUjViR1UrTG1KaGMyVWdleUJtYVd4c09pQjNhR2wwWlRzZ1ptOXVkQzFtWVcxcGJIazZJSE5sY21sbU95Qm1iMjUwTFhOcGVtVTZJREkwY0hnN0lIMDhMM04wZVd4bFBqeHlaV04wSUhkcFpIUm9QU2N4TURBbEp5Qm9aV2xuYUhROUp6RXdNQ1VuSUdacGJHdzlKMkpzWVdOckp5QXZQangwWlhoMElIZzlKelV3SlNjZ2VUMG5OVEFsSnlCamJHRnpjejBuWW1GelpTY2daRzl0YVc1aGJuUXRZbUZ6Wld4cGJtVTlKMjFwWkdSc1pTY2dkR1Y0ZEMxaGJtTm9iM0k5SjIxcFpHUnNaU2MrUjI5aGRGTmhjM1ZyWlU1cGJtcGhQQzkwWlhoMFBqd3ZjM1puUGc9PSJ9
--------------------

An NFT w/ ID 1 has been minted to 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
```

INI EPIK.

KITA HANYA MENGHASILKAN NFT PENUH SECARA DINAMIS. ON-CHAIN. INI ADALAH MOMEN EPIC.

Jika kamu mengambil salah satu dari gumpalan `data:application/json;base64` dan meletakkannya di bilah alamat browser, kamu akan melihat semua metadata JSON seperti sebelumnya. Kecuali sekarang, itu semua dilakukan secara otomatis dan kontrak kita :).

👀 Bagaimana cara kerja `finalTokenUri`?
------------------

Garis besar dengan `string memory json = Base64.encode` mungkin terlihat cukup membingungkan, tetapi, itu hanya terlihat membingungkan karena semua tanda kutip haha. Yang kita lakukan hanyalah mengkodekan base64 metadata JSON! Tapi — semuanya **on-chain**. Jadi, semua JSON itu akan hidup di kontrak itu sendiri.

Kita juga menambahkan `name` dan SVG yang dikodekan base64 secara dinamis juga!

Akhirnya, kita mendapatkan `finalTokenUri` ini di mana kita menggabungkan semuanya di mana kita melakukan:

```solidity
abi.encodePacked("data:application/json;base64,", json)
```

Semua yang terjadi di sini adalah kita menggabungkan semuanya dan menambahkan `data:application/json;base64,` lama yang sama yang kita lakukan sebelumnya dan kemudian kita menambahkan json yang dikodekan base64!!

## 🛠 Men-debug konten `finalTokenUri`

Sekarang setelah kamu menyiapkan tokenURI, bagaimana kita tahu apakah itu benar? Lagi pula, ini menyimpan semua data kita untuk NFT kita! Kamu dapat menggunakan alat keren seperti - [Pratinjau NFT](https://nftpreview.0xdev.codes/) untuk melihat pratinjau cepat gambar dan konten json tanpa menyebarkannya lagi dan lagi di opensea testnet.

Untuk mempermudah, kamu dapat meneruskan kode `tokenURI` sebagai parameter kueri seperti ini,

```solidity
string memory finalTokenUri = string(
    abi.encodePacked("data:application/json;base64,", json)
);

console.log("\n--------------------");
console.log(
    string(
        abi.encodePacked(
            "https://nftpreview.0xdev.codes/?code=",
            finalTokenUri
        )
    )
);
console.log("--------------------\n");
```
![image](https://i.imgur.com/CsBxROj.png)

## 🚀 Menyebarkan ke Rinkeby

Bagian yang paling keren adalah kita bisa melakukan re-deploy tanpa mengubah skrip kita menggunakan:

```bash
npx hardhat run scripts/deploy.js --network rinkeby
```

Setelah kita menerapkan ulang, kamu akan dapat melihat NFT kamu di [https://testnets.opensea.io/](https://testnets.opensea.io/) setelah kamu menelusuri alamat kontrak yang baru diterapkan. Sekali lagi, **jangan klik enter**. OpenSea itu aneh jadi kamu harus mengklik koleksi itu sendiri saat muncul.

Catatan: Ingatlah untuk menggunakan `https://rinkeby.rarible.com/token/MASUKKAN_ALAMAT_KONTRAK_Deploy_DI_SINI:MASUKKAN_ID_TOKEN_DI_SINI` jika kamu menggunakan Rarible.

Kontrak bersifat **permanen**. Jadi, setiap kali kita menerapkan kembali kontrak kita, kita sebenarnya membuat koleksi baru.

Kamu seharusnya dapat melihat koleksi baru di OpenSea atau Rarible :)!

## 🤖 Mengizinkan pengguna untuk mencetak

Epik — sekarang kita dapat mencetak NFT secara dinamis dan kita memiliki fungsi `makeAnEpicNFT` yang dapat dipanggil oleh pengguna. Banyak kemajuan telah dibuat!! Taaaaaapi tidak ada cara bagi orang acak untuk benar-benar mencetak NFT saat ini :(.

Yang kita butuhkan hanyalah situs web yang memungkinkan pengguna membuat NFT sendiri.

Jadi, mari kita membangun itu :)!

## 🚨Laporan perkembangan

Jika kamu mendapatkannya, kirimkan tangkapan layar #progress dari NFT baru kamu yang dihasilkan secara dinamis di OpenSea/Rarible :). Juga -- jika kamu belum menge-tweet gambar koleksi NFT lucu kamu, sekaranglah saatnya untuk melakukannya!! Ingatlah untuk menandai @_buildspace!!! Kami akan RT sebanyak mungkin orang!
