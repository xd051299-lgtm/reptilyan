const express = require('express');
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Bot aktif ve 5 saniyede bir yardırıyor!");
});

app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda dinleniyor.`);
});

// --- AYARLAR ---
// Tokenini ve Mesajını buraya tırnak içine yazabilirsin
const token = "SENİN_TOKENİN_BURAYA"; 
const message = "#FERİŞTAHİNİZİ SİKECEĞİM TÜREMELER İNATLAŞİN XD.";
const channels = [
  "1502028419091796150",
  // Diğer kanal ID'lerini buraya ekleyebilirsin
];

let currentIndex = 0;

if (!token || !message) {
    console.error("HATA: TOKEN veya MESSAGE eksik! Lütfen kodun içindeki ayarları kontrol et.");
} else {
    console.log(">> 5 Saniye Döngüsü Başlatıldı <<");
    // Tam 5000ms (5 saniye) ayarlandı
    setInterval(handleCycle, 5000);
}

async function handleCycle() {
  const currentChannelId = channels[currentIndex];

  try {
    // 1. Önce "Yazıyor..." animasyonunu gönder
    await axios.post(`https://discord.com/api/v9/channels/${currentChannelId}/typing`, {}, {
      headers: { "Authorization": token }
    });

    // 2. Çok kısa bir bekleyişten (500ms) sonra mesajı at ki 5 saniyelik periyot şaşmasın
    setTimeout(() => {
      sendActualMessage(currentChannelId);
    }, 500);

  } catch (err) {
    console.error(`❌ Typing hatası (${currentChannelId}):`, err.response?.status || "Bağlantı Yok");
    currentIndex = (currentIndex + 1) % channels.length;
  }
}

function sendActualMessage(channelId) {
  axios.post(`https://discord.com/api/v9/channels/${channelId}/messages`, {
    content: message
  }, {
    headers: {
      "Authorization": token,
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
    }
  }).then(() => {
    console.log(`✅ [${new Date().toLocaleTimeString()}] Mesaj Gidildi: ${channelId}`);
    currentIndex = (currentIndex + 1) % channels.length;
  }).catch((err) => {
    console.error(`❌ Mesaj Hatası (${channelId}):`, err.response?.status);
    currentIndex = (currentIndex + 1) % channels.length;
  });
}
