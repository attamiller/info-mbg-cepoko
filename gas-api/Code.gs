/**
 * API data untuk website Netlify - Info MBG SPPG Cepoko
 * Spreadsheet dan struktur kolom tetap sama:
 * A=Hari, B=Menu, C=Catatan, D=Link Foto Google Drive, E=Status (LIBUR)
 */
const SPREADSHEET_ID = '1qdFk_Bf-ixv8GueO9hZGpzIwAwTWdFSFglQoh1W7uWA';
const SHEET_NAME = 'Jadwal';
const TIME_ZONE = 'Asia/Jakarta';

function doGet() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) throw new Error('Sheet "' + SHEET_NAME + '" tidak ditemukan.');

    const values = sheet.getRange('A2:E6').getDisplayValues();
    const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
    const items = values.map((row, i) => ({
      day: days[i],
      menu: row[1] || '(-)',
      note: row[2] || '',
      image: safeImage_(row[3]),
      holiday: String(row[4] || '').trim().toUpperCase() === 'LIBUR'
    }));

    const weekday = Number(Utilities.formatDate(new Date(), TIME_ZONE, 'u'));
    const today = weekday >= 1 && weekday <= 5 ? items[weekday - 1] : null;
    const payload = {
      ok: true,
      items: items,
      today: today,
      weekend: weekday === 6 || weekday === 7,
      updatedAt: Utilities.formatDate(new Date(), TIME_ZONE, "yyyy-MM-dd'T'HH:mm:ss")
    };

    return ContentService
      .createTextOutput(JSON.stringify(payload).replace(/</g, '\\u003c'))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    const payload = { ok: false, error: String(err && err.message ? err.message : err) };
    return ContentService.createTextOutput(JSON.stringify(payload))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/** Mengubah foto Google Drive menjadi data URI tanpa kompresi atau pengubahan resolusi. */
function safeImage_(link) {
  if (!link) return '';
  const match = String(link).match(/[-\w]{25,}/);
  if (!match) return '';
  try {
    const file = DriveApp.getFileById(match[0]);
    const blob = file.getBlob();
    const mime = blob.getContentType();
    if (!mime || !mime.startsWith('image/')) return '';
    const bytes = blob.getBytes();
    return 'data:' + mime + ';base64,' + Utilities.base64Encode(bytes);
  } catch (err) {
    console.warn('Foto tidak dapat dibaca: ' + err);
    return '';
  }
}
