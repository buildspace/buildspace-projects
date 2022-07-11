## 🔗 Apa arti "on-chain" dan mengapa itu penting

Kita memiliki masalah besar sekarang dengan NFT kita.

Apa yang terjadi jika imgur turun? Nah — maka link `image` kita sama sekali tidak berguna dan NFT kita hilang dan Spongebob kita hilang! Lebih buruk lagi, apa yang terjadi jika situs web yang menghosting file JSON itu down? Nah — maka NFT kita benar-benar rusak karena metadata tidak dapat diakses.

Salah satu cara untuk memperbaiki masalah ini adalah dengan menyimpan semua data NFT kita "on-chain" yang berarti data hidup di kontrak itu sendiri vs di tangan pihak ketiga. Ini berarti NFT kita akan benar-benar permanen :). Dalam hal ini, satu-satunya situasi di mana kita kehilangan data NFT kita adalah jika blockchain itu sendiri turun. Dan jika itu terjadi — maka kita memiliki masalah yang lebih besar!

Tapi, dengan asumsi blockchain tetap aktif selamanya — NFT kita akan aktif selamanya! Ini sangat menarik karena itu juga berarti jika kamu menjual NFT, pembeli dapat yakin bahwa NFT tidak akan rusak. Banyak proyek populer menggunakan data on-chain, [Loot](https://techcrunch.com/2021/09/03/loot-games-the-crypto-world/) adalah salah satu contoh yang sangat populer!

## 🖼  Apa itu SVG?

Cara umum untuk menyimpan data NFT untuk gambar adalah menggunakan SVG. SVG adalah gambar, tetapi gambar itu sendiri dibuat dengan kode.

Misalnya, inilah SVG yang sangat sederhana yang membuat kotak hitam dengan beberapa teks putih di tengahnya.

```html
<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">
    <style>.base { fill: white; font-family: serif; font-size: 14px; }</style>
    <rect width="100%" height="100%" fill="black" />
    <text x="50%" y="50%" class="base" dominant-baseline="middle" text-anchor="middle">EpicLordHamburger</text>
</svg>
```

Buka situs web [ini](https://www.svgviewer.dev/) dan rekatkan kode di atas untuk melihatnya. Jangan ragu untuk mengacaukannya.

Ini sangat keren karena memungkinkan kita membuat **gambar dengan kode**.

SVG dapat disesuaikan **banyak.** Kamu bahkan dapat menganimasikannya haha. Jangan ragu untuk membaca lebih lanjut tentang mereka [di sini](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial).

## 🤘 Apa yang akan kita lakukan

Pertama, kita akan belajar bagaimana mendapatkan semua data NFT kita secara on-chain. NFT kita hanya akan menjadi sebuah kotak dengan **kombo tiga kata yang lucu di tengah**. Sama seperti SVG di atas. Kita akan membuat hardcode SVG di atas dalam kontrak kita yang mengatakan "EpicLordHamburger".

Setelah itu, kita akan mempelajari cara *menghasilkan secara dinamis* NFT ini di kontrak kita. Jadi, **setiap kali seseorang mencetak NFT, mereka akan mendapatkan kombinasi tiga kata yang berbeda dan lucu**. Sebagai contoh:

- EpicLordHamburger
- NinjaSandwichBoomerang
- SasukeInterstellarSwift

Ini akan menjadi epik :). Mari kita lakukan!
