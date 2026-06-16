// 都市名→緯度経度変換 & 天気取得
async function getWeather() {
  const city = document.getElementById("cityInput").value;
  if (!city) return alert("都市名を入力してください");

  // 1. ジオコーディング（都市名→緯度経度）
  const geoRes = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=ja`
  );
  const geoData = await geoRes.json();
  if (!geoData.results) return alert("都市が見つかりませんでした");

  const { latitude, longitude, name } = geoData.results[0];

  // 2. 天気データ取得
  const weatherRes = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
    `&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum` +
    `&timezone=Asia%2FTokyo&forecast_days=1`
  );
  const weatherData = await weatherRes.json();
  const daily = weatherData.daily;

  const weatherCode = daily.weathercode[0];
  const tempMax = daily.temperature_2m_max[0];
  const tempMin = daily.temperature_2m_min[0];
  const precipitation = daily.precipitation_sum[0];

  // Enterキーで検索できるようにする
document.getElementById("cityInput").addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    getWeather();
  }
});
  // 3. 画面に表示
  document.getElementById("cityName").textContent = `📍 ${name}`;
  document.getElementById("temperature").textContent =
    `🌡️ 最高 ${tempMax}℃ / 最低 ${tempMin}℃`;
  document.getElementById("precipitation").textContent =
    `☔ 降水量: ${precipitation}mm`;
  document.getElementById("weatherDesc").textContent =
    getWeatherLabel(weatherCode);
  document.getElementById("suggestion").textContent =
    getSuggestion(weatherCode, tempMax, precipitation);

  document.getElementById("weatherCard").classList.remove("hidden");
}

// 天気コード→日本語ラベル
function getWeatherLabel(code) {
  if (code === 0) return "☀️ 快晴";
  if (code <= 3) return "⛅ 曇りがち";
  if (code <= 67) return "🌧️ 雨";
  if (code <= 77) return "❄️ 雪";
  return "⛈️ 荒天";
}

// おでかけ提案ロジック
function getSuggestion(code, tempMax, precipitation) {
  if (precipitation > 5) return "💧 雨が多いので室内がおすすめ！映画館や博物館はいかがですか？";
  if (code === 0 && tempMax >= 20) return "🌳 絶好のおでかけ日和！公園やピクニックがおすすめです！";
  if (tempMax < 10) return "🧥 寒いので温かい場所へ。カフェやショッピングモールがおすすめ！";
  return "🚶 まずまずの天気です。軽い散歩やショッピングに出かけてみましょう！";
}