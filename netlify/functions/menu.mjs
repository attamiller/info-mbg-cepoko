export const handler = async () => {
  const gasUrl = process.env.GAS_WEB_APP_URL;

  if (!gasUrl) {
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: "GAS_WEB_APP_URL belum diatur" })
    };
  }

  try {
    const response = await fetch(gasUrl);
    const data = await response.json();

    return {
      statusCode: response.status,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store"
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: "Gagal mengambil data dari Apps Script" })
    };
  }
};
