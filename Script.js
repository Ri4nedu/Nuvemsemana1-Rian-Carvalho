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
