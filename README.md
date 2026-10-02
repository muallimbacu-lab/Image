# Magi Character Creator — Vercel

Web app untuk menghasilkan gambar dengan Gemini 3.1 Flash Image dan gambar referensi karakter.

## Deploy paling mudah dari HP

1. Buat project di Vercel.
2. Import folder/repository ini.
3. Di Vercel buka Project Settings → Environment Variables.
4. Tambahkan:
   - Name: `GEMINI_API_KEY`
   - Value: API key Gemini kamu
5. Deploy / Redeploy.
6. Buka URL Vercel dari Chrome Android.

API key tidak pernah dikirim ke browser. Browser hanya memanggil `/api/generate`, lalu fungsi Vercel yang memanggil Gemini API.

## Catatan
- Model: `gemini-3.1-flash-image`.
- Maksimal 4 gambar referensi di UI ini.
- Output mendukung 1K/2K/4K dan beberapa rasio yang didukung model.
- Biaya/quota mengikuti Gemini API project, bukan sekadar langganan aplikasi Gemini.
