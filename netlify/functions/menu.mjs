// Netlify Function: mengambil JSON dari Google Apps Script di sisi server.
// Atur environment variable GAS_WEB_APP_URL ke URL deployment Apps Script yang berakhiran /exec.
export default async (request, context) => {
  const gasUrl = Netlify.env.get("GAS_WEB_APP_URL");
  if (!gasUrl) {
    return new Response(JSON.stringify({
      ok: false,
      error: "Environment variable GAS_WEB_APP_URL belum diatur di Netlify."
    }), {
      status: 500,
      headers: { "content-type": "application/json; charset=utf-8" }
    });
  }

  try {
    const response = await fetch(gasUrl, {
      method: "GET",
      redirect: "follow",
      headers: { "accept": "application/json" }
    });

    if (!response.ok) {
      throw new Error(`Google Apps Script merespons HTTP ${response.status}`);
    }

    const body = await response.text();
    let data;
    try {
      data = JSON.parse(body);
    } catch {
      throw new Error("Respons Apps Script bukan JSON. Pastikan URL deployment berakhiran /exec dan aksesnya tersedia.");
    }

    return new Response(JSON.stringify(data), {
      status: data.ok ? 200 : 502,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "public, max-age=60, s-maxage=60"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      ok: false,
      error: error instanceof Error ? error.message : String(error)
    }), {
      status: 502,
      headers: { "content-type": "application/json; charset=utf-8" }
    });
  }
};
