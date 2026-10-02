function parseImage(dataUrl) {
  const m = /^data:(image\/(?:png|jpeg|jpg|webp));base64,(.+)$/i.exec(dataUrl || "");
  if (!m) return null;
  return {
    mime_type: m[1].toLowerCase().replace("image/jpg", "image/jpeg"),
    data: m[2]
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY belum diatur di Vercel." });
    }

    const { prompt, references = [], aspectRatio = "16:9", imageSize = "1K" } = req.body || {};

    if (!prompt?.trim()) {
      return res.status(400).json({ error: "Deskripsi adegan belum diisi." });
    }
    if (!Array.isArray(references) || references.length > 4) {
      return res.status(400).json({ error: "Maksimal 4 gambar referensi." });
    }

    const input = [{
      type: "text",
      text: `You are creating a child-friendly educational 3D cartoon image.

CHARACTER CONSISTENCY IS THE HIGHEST PRIORITY.
Use the supplied reference images as the identity/design source.

Preserve each character's:
- face and recognizable facial features
- eyes, mouth and expression style
- body shape and proportions
- colors and markings
- accessories and defining design details
- overall 3D cartoon appearance

Do not redesign, replace, age, beautify, simplify, or invent a different character.
Only change pose, expression, camera, lighting, and environment as requested.

Keep the image clean, friendly, colorful, polished, and suitable for elementary-school learning media.

SCENE:
${prompt.trim()}`
    }];

    for (const ref of references) {
      const img = parseImage(ref);
      if (img) input.push({ type: "image", ...img });
    }

    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey
      },
      body: JSON.stringify({
        model: "gemini-3.1-flash-image",
        input,
        response_format: {
          type: "image",
          mime_type: "image/jpeg",
          aspect_ratio: aspectRatio,
          image_size: imageSize
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || "Gemini API error."
      });
    }

    const image = data?.output_image;
    if (!image?.data) {
      return res.status(502).json({ error: "Gemini tidak mengembalikan gambar." });
    }

    res.status(200).json({
      imageDataUrl: `data:${image.mime_type || "image/png"};base64,${image.data}`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Server error." });
  }
}
