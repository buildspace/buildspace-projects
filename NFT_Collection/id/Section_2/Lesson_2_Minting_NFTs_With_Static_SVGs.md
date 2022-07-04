## 🤘 Buat SVG kita

Ini SVG kotak hitam kita lagi.

```html
<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">
    <style>.base { fill: white; font-family: serif; font-size: 14px; }</style>
    <rect width="100%" height="100%" fill="black" />
    <text x="50%" y="50%" class="base" dominant-baseline="middle" text-anchor="middle">EpicLordHamburger</text>
</svg>
```

Selanjutnya, kita ingin cara untuk mendapatkan data ini di NFT kita tanpa menghostingnya di suatu tempat seperti imgur (yang dapat turun atau mati kapan saja!). Buka situs web [ini](https://www.utilities-online.info/base64). Rekatkan kode SVG lengkap kamu di atas dan kemudian klik "encode" untuk mendapatkan SVG yang disandikan base64-mu. Sekarang, siap untuk sihir? Buka tab baru. Dan di bilah URL, rekatkan ini:

```plaintext
data:image/svg+xml;base64,MASUKKAN_SVG_BERENCODE_BASE64_KAMU_DI_SINI
```

Jadi misalnya, milikku terlihat seperti ini:

```plaintext
data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaW5ZTWluIG1lZXQiIHZpZXdCb3g9IjAgMCAzNTAgMzUwIj4NCiAgICA8c3R5bGU+LmJhc2UgeyBmaWxsOiB3aGl0ZTsgZm9udC1mYW1pbHk6IHNlcmlmOyBmb250LXNpemU6IDE0cHg7IH08L3N0eWxlPg0KICAgIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9ImJsYWNrIiAvPg0KICAgIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBjbGFzcz0iYmFzZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RXBpY0xvcmRIYW1idXJnZXI8L3RleHQ+DQo8L3N2Zz4=
```

Kita mengubah kode SVG kita menjadi string yang bagus :). base64 pada dasarnya adalah standar yang diterima untuk menyandikan data ke dalam string. Jadi ketika kita mengatakan `data:image/svg+xml;base64`, pada dasarnya mengatakan, "Hei, aku akan memberi kamu data yang disandikan base64, tolong proses sebagai SVG, terima kasih!".

Ambil seluruh string `data:image/svg+xml;base64,MASUKKAN_SVG_BERENCODE_BASE64_KAMU_DI_SINI` dan tempel di bilah alamat browser kamu dan duar, kamu akan melihat SVG! Catatan: jika kamu mendapatkan kesalahan, periksa kembali apakah kamu mengikuti semua langkah dengan benar. Sangat mudah untuk mengacaukannya :).

Oke, **epik**. Ini adalah cara untuk menjaga data gambar NFT kita tetap dan tersedia selamanya. Semua pusat data di dunia dapat terbakar tetapi karena kita memiliki string yang disandikan base64 ini, kita akan selalu melihat SVG selama kita memiliki komputer dan browser.

![Untitled](https://i.imgur.com/f9mXVSb.png)

## ☠️ Singkirkan JSON yang dihosting

Ingat metadata JSON kita?

Yah, aku mengubahnya sedikit untuk NFT tiga kata kita :). Hal yang sama! Nama, deskripsi, dan gambar. Tapi sekarang alih-alih menunjuk ke tautan imgur, kita menunjuk ke string yang disandikan base64 kita.

```json
{
    "name": "EpicLordHamburger",
    "description": "An NFT from the highly acclaimed square collection",
    "image": "data:image/svg+xml;base64,MASUKKAN_SVG_BERENCODE_BASE64_KAMU_DI_SINI"
}
```

Catatan: jangan lupa tanda kutip di sekitar `data:image/svg+xml;base64,MASUKKAN_SVG_BERENCODE_BASE64_KAMU_DI_SINI`.

Misalnya, milikku terlihat seperti ini:

```json
{
    "name": "EpicLordHamburger",
    "description": "An NFT from the highly acclaimed square collection",
    "image": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaW5ZTWluIG1lZXQiIHZpZXdCb3g9IjAgMCAzNTAgMzUwIj4NCiAgICA8c3R5bGU+LmJhc2UgeyBmaWxsOiB3aGl0ZTsgZm9udC1mYW1pbHk6IHNlcmlmOyBmb250LXNpemU6IDE0cHg7IH08L3N0eWxlPg0KICAgIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9ImJsYWNrIiAvPg0KICAgIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBjbGFzcz0iYmFzZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RXBpY0xvcmRIYW1idXJnZXI8L3RleHQ+DQo8L3N2Zz4="
}
```

Tapi tunggu — kemana file JSON baru kita yang mewah akan pergi? Saat ini, kita menghostingnya di situs web acak [ini](https://jsonkeeper.com/). Jika situs web itu mati, NFT indah kita hilang selamanya! Inilah yang akan kita lakukan. **Kita akan mengkodekan base64 seluruh file JSON kita.** Sama seperti kita mengkodekan SVG kita.

Buka situs web [ini](https://www.utilities-online.info/base64) lagi. Rekatkan metadata JSON lengkap kamu dengan SVG yang disandikan base64 (seharusnya terlihat seperti yang aku miliki di atas) dan kemudian klik "encode" untuk membuat kamu mengkodekan JSON.

Buka tab baru. Dan di bilah URL, rekatkan ini:

```plaintext
data:application/json;base64,MASUKKAN_JSON_BERENCODE_BASE64_KAMU_DI_SINI
```

Misalnya, milikku terlihat seperti ini:

```plaintext
data:application/json;base64,ewogICAgIm5hbWUiOiAiRXBpY0xvcmRIYW1idXJnZXIiLAogICAgImRlc2NyaXB0aW9uIjogIkFuIE5GVCBmcm9tIHRoZSBoaWdobHkgYWNjbGFpbWVkIHNxdWFyZSBjb2xsZWN0aW9uIiwKICAgICJpbWFnZSI6ICJkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBITjJaeUI0Yld4dWN6MGlhSFIwY0RvdkwzZDNkeTUzTXk1dmNtY3ZNakF3TUM5emRtY2lJSEJ5WlhObGNuWmxRWE53WldOMFVtRjBhVzg5SW5oTmFXNVpUV2x1SUcxbFpYUWlJSFpwWlhkQ2IzZzlJakFnTUNBek5UQWdNelV3SWo0TkNpQWdJQ0E4YzNSNWJHVStMbUpoYzJVZ2V5Qm1hV3hzT2lCM2FHbDBaVHNnWm05dWRDMW1ZVzFwYkhrNklITmxjbWxtT3lCbWIyNTBMWE5wZW1VNklERTBjSGc3SUgwOEwzTjBlV3hsUGcwS0lDQWdJRHh5WldOMElIZHBaSFJvUFNJeE1EQWxJaUJvWldsbmFIUTlJakV3TUNVaUlHWnBiR3c5SW1Kc1lXTnJJaUF2UGcwS0lDQWdJRHgwWlhoMElIZzlJalV3SlNJZ2VUMGlOVEFsSWlCamJHRnpjejBpWW1GelpTSWdaRzl0YVc1aGJuUXRZbUZ6Wld4cGJtVTlJbTFwWkdSc1pTSWdkR1Y0ZEMxaGJtTm9iM0k5SW0xcFpHUnNaU0krUlhCcFkweHZjbVJJWVcxaWRYSm5aWEk4TDNSbGVIUStEUW84TDNOMlp6ND0iCn0=
```

Saat kamu menempelkan URI lengkap itu ke bilah alamat browsermu, kamu akan melihat JSON lengkap dengan segala kemegahannya. **DUARRRR!** Sekarang kita memiliki cara untuk menjaga metadata JSON kita tetap permanen dan tersedia selamanya.

Berikut tangkapan layarku:

![Untitled](https://i.imgur.com/y1ZaYGf.png)

Catatan: **Sangat mudah** untuk mengacaukan di sini saat penyandian + penyalinanmu. Jadi, berhati-hatilah!!! Dan periksa kembali semuanya berfungsi. Jika ada yang rusak, ikuti semua langkah lagi!


## 🚀 Ubah kontrak kita, sebarkan

Oke luar biasa, kita punya file JSON yang disandikan base64 yang mewah ini. Bagaimana kita mendapatkannya di kontrak kita? Cukup buka `MyEpicNFT.sol` dan — kita hanya menyalin-tempel seluruh string besar ke dalam kontrak kita.

Kita hanya perlu mengubah satu baris.

```solidity
_setTokenURI(newItemId, "data:application/json;base64,MASUKKAN_JSON_BERKODE_BASE_64_DI_SINI")
```

Misalnya, milikku terlihat seperti:

```solidity
_setTokenURI(newItemId, "data:application/json;base64,ewogICAgIm5hbWUiOiAiRXBpY0xvcmRIYW1idXJnZXIiLAogICAgImRlc2NyaXB0aW9uIjogIkFuIE5GVCBmcm9tIHRoZSBoaWdobHkgYWNjbGFpbWVkIHNxdWFyZSBjb2xsZWN0aW9uIiwKICAgICJpbWFnZSI6ICJkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBITjJaeUI0Yld4dWN6MGlhSFIwY0RvdkwzZDNkeTUzTXk1dmNtY3ZNakF3TUM5emRtY2lJSEJ5WlhObGNuWmxRWE53WldOMFVtRjBhVzg5SW5oTmFXNVpUV2x1SUcxbFpYUWlJSFpwWlhkQ2IzZzlJakFnTUNBek5UQWdNelV3SWo0TkNpQWdJQ0E4YzNSNWJHVStMbUpoYzJVZ2V5Qm1hV3hzT2lCM2FHbDBaVHNnWm05dWRDMW1ZVzFwYkhrNklITmxjbWxtT3lCbWIyNTBMWE5wZW1VNklERTBjSGc3SUgwOEwzTjBlV3hsUGcwS0lDQWdJRHh5WldOMElIZHBaSFJvUFNJeE1EQWxJaUJvWldsbmFIUTlJakV3TUNVaUlHWnBiR3c5SW1Kc1lXTnJJaUF2UGcwS0lDQWdJRHgwWlhoMElIZzlJalV3SlNJZ2VUMGlOVEFsSWlCamJHRnpjejBpWW1GelpTSWdaRzl0YVc1aGJuUXRZbUZ6Wld4cGJtVTlJbTFwWkdSc1pTSWdkR1Y0ZEMxaGJtTm9iM0k5SW0xcFpHUnNaU0krUlhCcFkweHZjbVJJWVcxaWRYSm5aWEk4TDNSbGVIUStEUW84TDNOMlp6ND0iCn0=")
```

Terakhir, mari kita terapkan kontrak terbaru kita, buat NFT, dan pastikan itu berfungsi dengan baik di OpenSea! Terapkan menggunakan perintah yang sama. Aku sedikit mengubah skrip penerapanku menjadi hanya mencetak satu NFT, bukan dua, jangan ragu untuk melakukan hal yang sama!

```bash
npx hardhat run scripts/deploy.js --network rinkeby
```

Kemudian sama seperti sebelumnya, tunggu satu atau dua menit, ambil alamat kontrak, cari di [https://testnets.opensea.io/](https://testnets.opensea.io/) dan kamu akan melihat NFT-mu di sana :). Sekali lagi, jangan klik "Enter" saat mencari -- Kamu harus benar-benar mengklik koleksi tersebut saat muncul di bilah pencarian.

Catatan: Ingatlah untuk menggunakan `https://rinkeby.rarible.com/token/MASUKKAN_ALAMAT_KONTRAK_DEPLOY_DI_SINI:MASUKKAN_TOKEN_ID_DISINI` jika OpenSea lambat.

![Untitled](https://i.imgur.com/Z2mKTpK.png)

## 🚨Laporan perkembangan

Jika kamu mendapatkan NFT mewah, pastikan untuk mengirim tangkapan layarnya di OpenSea di saluran `#progress` di Discord!
