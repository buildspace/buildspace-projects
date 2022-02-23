💻 Menetapkan Pelanggan
------------------

Sekarang masanya untuk kita membuat laman web! Kontrak kita agak mudah, tetapi, mari kita belajar bagaimana frontend berinteraksi dengan kontrak kita secepat mungkin!  

Ada 100 bermacam cara untuk kita sediakan asas projek react dan deploykannya. Saya akan tunjukkan cara untuk membuatnya dalam tempoh 10 minit dan di akhir pelajaran ini, anda akan dapat satu aplikasi react yang berfungsi sepenuhnya berserta domain dan lain-lain.

🤯 Replit
---------

**Nota: Anda tak perlu menggunakan replit untuk membina + deploy laman anda. Kalau anda ingin menggunakan create-react-app + Vercel/Heroku/AWS -- itu sangat bagus. [Di sini](https://github.com/buildspace/waveportal-starter-project) adalah pautan ke base repo yang anda boleh klonkan dan buat di tempat anda sendiri.**  

Kita akan menggunakan [Replit](https://replit.com/~)! Ia adalah IDE yang berasaskan pelayar yang membolehkan kita untuk membangunkan app web dengan mudah dan deploykannya daripada pelayar. Ia memang boleh diterima. Kita tidak perlu menyediakan persekitaran tempatan penuh dan menulis perintah untuk deploy, sebaliknya, semua telah tersedia.

Buat akaun di Replit sebelum kita teruskan.

Saya sudah membuat satu projek asas react yang anda boleh **fork** di Replit. **Pergi ke [di sini](https://replit.com/@adilanchian/waveportal-starter-project?v=1), dan di sebelah kanan anda akan nampak butang "Fork".** Pastikan anda log masuk, dan klik di sini. Dengan sekelip mata, anda akan dapat klonkan repo saya dan IDE sepenuhnya ke dalam pelayar anda untuk mula menulis kod. Sebaik saja ia berhenti memuat dan menunjukkan kod, klik butang "Run" di atas. Ini akan mengambil masa 2-3 minit untuk kali pertama. Replit akan boot projek anda dan mula deploykannya di domain yang sebenar.

**Perhatian: Sepanjang kita membuat projek ini, anda akan perasan yang kami merujuk fail`.js`. Di Replit, jikalau anda ingin membuat fail Javascript baharu, anda perlu menggunakan sambungan `.jsx`! Replit ada keperluan prestasi tertentu yang memerlukan anda untuk menggunakan sambungan fail `.jsx` :).**

Saya ada buat satu video cara untuk edit kod di Replit, deploy, dapatkan mod gelap. Boleh lihat di bawah:
[Loom](https://www.loom.com/share/babd8d81b83b4af2a196d6ea656e379a)  

🦊 Metamask
-----------

Bagus, sekarang kita sudah **deployed** projek React yang mudah untuk kita laksanakan. Ianya sangat mudah :).

Seterusnya kita perlukan dompet Ethereum. Ada pelbagai jenis dompet, tetapi, kita akan gunakan Metamask untuk projek ini. Muat turun sambungan pelayar dan pasang dompet anda [di sini](https://metamask.io/download.html). Walaupun anda sudah ada pembekal dompet yang lain, gunakan Metamask sahaja buat masa sekarang.

Kenapa kita perlukan Metamask? Kita hendaklah boleh memanggil fungsi pada kontrak pintar yang ada di blok rantai. Dan, untuk berbuat sedemikian kita perlu ada dompet yang mempunyai alamat Ethereum dan kunci peribadi.

**Tetapi, kita perlukan sesuatu untuk menyambungkan laman web kita dengan dompet supaya kita boleh melalui kelayakan dompet dengan selamat ke laman web dan laman web kita boleh menggunakan kelayakan tersebut untuk memanggil kontrak pintar. Anda perlu ada kelayakan yang sah untuk akses fungsi pada kontrak pintar.**   

Ia ibarat satu pengesahan. Kita perlukan sesuatu untuk "log masuk" ke blok rantai (blockchain) dan menggunakan log masuk kelayakan tersebut untuk membuat permintaan API daripada laman sesawang kita.

Jadi, mari teruskan dan sediakan semuanya! Aliran persediaannya adalah jelas dengan sendirinya :).

🚨 Sebelum anda klik "Pembelajaran Seterusnya"
-------------------------------------------

*Nota: Kalau anda tidak melakukannya, Farza akan berasa sedih :(.*

Kongsikan pautan laman sesawang anda dan hantarkan di #progress. Tukar CSS dan teks mengikut kehendak anda. Mungkin ada mahu jadikan ia lebih berwarna? Mungkin and tidak kisah dengan waves dan anda ingin membuat klon Twitter terdesentralisasi? Buat apa saja yang anda mahu ini adalah aplikasi anda :).
