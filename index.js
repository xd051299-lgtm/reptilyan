const express = require('express');
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Bot 10 saniye periyoduyla aktif!");
});

app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda dinleniyor.`);
});

// --- AYARLAR ---
const token = "TOKENİ_BURAYA_YAZ"; // Buraya tırnak içine tokenini koy
const message = "#FERİŞTAHİNİZİ SİKECEĞİM TÜREMELER İNATLAŞİN XD.";
const channels = [
  "1502028419091796150"
];

let currentIndex = 0;

if (!token || !message) {
    console.error("HATA: TOKEN veya MESSAGE eksik!");
} else {
    console.log(">> 10 Saniyelik Döngü Başlatıldı <<");
    // 10000 ms = 10 Saniye
    setInterval(handleCycle, 10000);
}

async function handleCycle() {
  const currentChannelId = channels[currentIndex];

  try {
    // 1. Önce "Yazıyor..." animasyonunu gönder
    await axios.post(`https://discord.com/api/v9/channels/${currentChannelId}/typing`, {}, {
      headers: { "Authorization": token }
    });

    // 2. Gerçekçi görünmesi için 1.5 saniye sonra mesajı at
    setTimeout(() => {
      sendActualMessage(currentChannelId);
    }, 1500);

  } catch (err) {
    console.error(`❌ Typing hatası (${currentChannelId}):`, err.response?.status);
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
    console.log(`✅ [${new Date().toLocaleTimeString()}] Mesaj Gönderildi: ${channelId}`);
    currentIndex = (currentIndex + 1) % channels.length;
  }).catch((err) => {
    console.error(`❌ Mesaj Hatası (${channelId}):`, err.response?.status);
    currentIndex = (currentIndex + 1) % channels.length;
  });
}
