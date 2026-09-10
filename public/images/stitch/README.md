# Aset Stitch Antosan

Sumber: screen **Antosan Landing Page (Simulasi Interaktif Arsitektur)**,
project `14784201623519037146`, screen `b031a7bba17748c2ab73371de2cde111`.
Diambil melalui MCP Stitch pada 10 September 2026 sesuai pilihan pengguna.

- `gateway.webp`: ilustrasi gerbang teal pada hero (1280 × 720), dipakai juga
  sebagai gambar Open Graph.
- `gateway-640.webp`: varian kecil dari gambar yang sama (640 × 360) untuk
  `srcset` di layar sempit atau DPR rendah.
- `app-icon.webp`: ikon aplikasi Antosan (512 × 512, transparan).
- `wordmark.webp`: lambang dan wordmark Antosan (512 × 384, transparan).

Aset PNG dari ekspor Stitch dikodekan ke WebP agar ukuran transfer lebih kecil.
Bukan gambar yang dihasilkan ulang. Ikon yang sama dipakai untuk favicon lokal.

Kedua varian `gateway` di-encode ulang dari `waitingroom/assets/background.png`
(1672 × 941) pada 11 September 2026, menggantikan ekspor 512 × 288 yang sudah
ter-upscale di hero (lebar render sebenarnya mencapai 594 px CSS, jadi 512 px
kurang bahkan pada DPR 1). Perintahnya:

```
cwebp -q 82 -sharp_yuv -metadata none -resize 1280 720 background.png -o gateway.webp
cwebp -q 82 -sharp_yuv -metadata none -resize 640 360  background.png -o gateway-640.webp
```
