const statusEl = document.getElementById("status");
const clockEl = document.getElementById("clock");
const btn = document.getElementById("btn");
const apiEl = document.getElementById("api");
function tick() {
const now = new Date();
clockEl.textContent = now.toLocaleTimeString("pt-BR");
}
setInterval(tick, 1000);
tick();
statusEl.textContent = "Site carregado com sucesso. (Sem Node, sem instalacao.)";
btn.addEventListener("click", async () => {
apiEl.textContent = "Consultando API...";
try {
const resp = await fetch("https://api.agify.io?name=rafael");
if (!resp.ok) throw new Error("HTTP " + resp.status);
const data = await resp.json();
apiEl.textContent = JSON.stringify(data, null, 2);
} catch (err) {
apiEl.textContent = "Erro no fetch: " + err.message;
}
});


const out = document.getElementById("out");
const btnGet = document.getElementById("btnGet");
const btnPost = document.getElementById("btnPost");
function show(obj) {
out.textContent = typeof obj === "string" ? obj : JSON.stringify(obj, null, 2);
}

async function httpGetWeather() {
show("Buscando clima (GET)...");
try {
// Open-Meteo (sem chave). Exemplo: coordenadas aproximadas do Oeste do PR.
const url = "https://api.open-meteo.com/v1/forecast?latitude=-24.33&longitude=-53.85&current=temperature_2m,wind_speed_10m";
const resp = await fetch(url);
if (!resp.ok) throw new Error("HTTP " + resp.status);
const data = await resp.json();
show({
fonte: "open-meteo.com",
temperatura: data.current?.temperature_2m,
vento: data.current?.wind_speed_10m,
unidade_temp: data.current_units?.temperature_2m,
unidade_vento: data.current_units?.wind_speed_10m,
bruto: data
});
} catch (err) {
show("Erro no GET: " + err.message + "\nDica: veja F12 > Network/Console.");
}
}
async function httpPostSimulado() {
show("Enviando dados (POST simulado)...");
try {
const resp = await fetch("https://jsonplaceholder.typicode.com/posts", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
turma: "Serviços em Nuvem",
atividade: "Semana 2",
timestamp: new Date().toISOString()
})
});
if (!resp.ok) throw new Error("HTTP " + resp.status);
const data = await resp.json();
show({ fonte: "jsonplaceholder.typicode.com", resposta: data });
} catch (err) {
show("Erro no POST: " + err.message);
}
}
btnGet.addEventListener("click", httpGetWeather);
btnPost.addEventListener("click", httpPostSimulado);
const cityEl = document.getElementById("city");
const btnCity = document.getElementById("btnCity");
const cityOut = document.getElementById("cityOut");

function showCity(obj) {
cityOut.textContent = typeof obj === "string" ? obj : JSON.stringify(obj, null, 2);
}

async function geocodeCity(name) {
const url = "https://geocoding-api.open-meteo.com/v1/search?name=" +
encodeURIComponent(name) + "&count=1&language=pt&format=json";
const resp = await fetch(url);
if (!resp.ok) throw new Error("HTTP " + resp.status);
const data = await resp.json();
const first = data.results && data.results[0];
if (!first) throw new Error("Cidade não encontrada");
return { name: first.name, lat: first.latitude, lon: first.longitude, country: first.country };
}

async function fetchWeather(lat, lon) {
const url = "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lon +
"&current=temperature_2m,wind_speed_10m";
const resp = await fetch(url);
if (!resp.ok) throw new Error("HTTP " + resp.status);

return await resp.json();
}

btnCity.addEventListener("click", async function(){
const city = (cityEl.value || "").trim();
if (!city) return showCity("Digite uma cidade.");
showCity("Buscando...");
try {
localStorage.setItem("lastCity", city);

const geo = await geocodeCity(city);
const meteo = await fetchWeather(geo.lat, geo.lon);

showCity({
cidade: geo.name,
pais: geo.country,
temperatura: meteo.current?.temperature_2m,
vento: meteo.current?.wind_speed_10m,
unidades: meteo.current_units
});
} catch (err) {
showCity("Erro: " + err.message);
}
});

// Preencher automaticamente ao abrir
const last = localStorage.getItem("lastCity");
if (last) cityEl.value = last;
