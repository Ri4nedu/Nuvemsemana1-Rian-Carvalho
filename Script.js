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
out.textContent = typeof obj === "string"
? obj
: JSON.stringify(obj, null, 2);
}

async function httpGetWeather() {

show("Buscando cidade (GET)...");

try {

const url = "https://geocoding-api.open-meteo.com/v1/search?name=Toledo&count=1&language=pt&format=json";

const resp = await fetch(url);

if (!resp.ok) throw new Error("HTTP " + resp.status);

const data = await resp.json();

show({
fonte: "geocoding-api.open-meteo.com",
cidade: data.results?.[0]?.name,
pais: data.results?.[0]?.country,
latitude: data.results?.[0]?.latitude,
longitude: data.results?.[0]?.longitude,
bruto: data
});

} catch (err) {

show("Erro no GET: " + err.message);

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
cityOut.textContent = typeof obj === "string"
? obj
: JSON.stringify(obj, null, 2);
}

async function geocodeCity(name) {

const url = "https://geocoding-api.open-meteo.com/v1/search?name=" +
encodeURIComponent(name) +
"&count=1&language=pt&format=json";

const resp = await fetch(url);

if (!resp.ok) throw new Error("HTTP " + resp.status);

const data = await resp.json();

const first = data.results && data.results[0];

if (!first) throw new Error("Cidade não encontrada");

return {
name: first.name,
lat: first.latitude,
lon: first.longitude,
country: first.country
};

}

btnCity.addEventListener("click", async function(){

const city = (cityEl.value || "").trim();

if (!city) return showCity("Digite uma cidade.");

showCity("Buscando...");

try {

localStorage.setItem("lastCity", city);

const geo = await geocodeCity(city);

showCity({
cidade: geo.name,
pais: geo.country,
latitude: geo.lat,
longitude: geo.lon
});

} catch (err) {

showCity("Erro: " + err.message);

}

});

// Preencher automaticamente ao abrir

const last = localStorage.getItem("lastCity");

if (last) cityEl.value = last;
