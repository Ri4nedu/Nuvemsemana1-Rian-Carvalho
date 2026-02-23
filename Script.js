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
