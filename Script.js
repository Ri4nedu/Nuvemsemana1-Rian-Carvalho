    
            document.addEventListener("DOMContentLoaded", () => {
            
           
                const statusEl = document.getElementById("status");
                const clockEl = document.getElementById("clock");
            
                const btnGet = document.getElementById("btnGet");
                const btnPost = document.getElementById("btnPost");
                const out = document.getElementById("out");
            
                const cityEl = document.getElementById("city");
                const btnCity = document.getElementById("btnCity");
                const cityOut = document.getElementById("cityOut");
            
            
                function updateClock() {
                    const now = new Date();
                    clockEl.textContent = now.toLocaleTimeString("pt-BR");
                }
            
                setInterval(updateClock, 1000);
                updateClock();
            
                statusEl.textContent = "Site carregado com sucesso. (Sem Node, sem instalação.)";
            
            
            
                async function fetchJSON(url, options = {}) {
            
                    const resp = await fetch(url, options);
            
                    if (!resp.ok) {
                        throw new Error("HTTP " + resp.status);
                    }
            
                    return resp.json();
                }
            
            
                function show(target, data) {
            
                    target.textContent =
                        typeof data === "string"
                            ? data
                            : JSON.stringify(data, null, 2);
            
                }
            
                async function httpGetWeather() {
            
                    show(out, "Buscando cidade (GET)...");
            
                    try {
            
                        const url =
                            "https://geocoding-api.open-meteo.com/v1/search?name=Toledo&count=1&language=pt&format=json";
            
                        const data = await fetchJSON(url);
            
                        const city = data.results?.[0];
            
                        show(out, {
                            fonte: "geocoding-api.open-meteo.com",
                            cidade: city?.name,
                            pais: city?.country,
                            latitude: city?.latitude,
                            longitude: city?.longitude,
                            bruto: data
                        });
            
                    } catch (err) {
            
                        show(out, "Erro no GET: " + err.message);
            
                    }
            
                }
                async function httpPostSimulado() {
            
                    show(out, "Enviando dados (POST simulado)...");
            
                    try {
            
                        const data = await fetchJSON(
                            "https://jsonplaceholder.typicode.com/posts",
                            {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
            
                                body: JSON.stringify({
                                    turma: "Serviços em Nuvem",
                                    atividade: "Semana 2",
                                    timestamp: new Date().toISOString()
                                })
                            }
                        );
            
                        show(out, {
                            fonte: "jsonplaceholder.typicode.com",
                            resposta: data
                        });
            
                    } catch (err) {
            
                        show(out, "Erro no POST: " + err.message);
            
                    }
            
                }
            
                async function geocodeCity(name) {
            
                    const url =
                        "https://geocoding-api.open-meteo.com/v1/search?name=" +
                        encodeURIComponent(name) +
                        "&count=1&language=pt&format=json";
            
                    const data = await fetchJSON(url);
            
                    const first = data.results?.[0];
            
                    if (!first) {
                        throw new Error("Cidade não encontrada");
                    }
            
                    return {
                        name: first.name,
                        lat: first.latitude,
                        lon: first.longitude,
                        country: first.country
                    };
            
                }
            
                async function handleCitySearch() {
            
                    const city = (cityEl.value || "").trim();
            
                    if (!city) {
                        return show(cityOut, "Digite uma cidade.");
                    }
            
                    show(cityOut, "Buscando...");
            
                    try {
            
                        localStorage.setItem("lastCity", city);
            
                        const geo = await geocodeCity(city);
            
                        show(cityOut, {
                            cidade: geo.name,
                            pais: geo.country,
                            latitude: geo.lat,
                            longitude: geo.lon
                        });
            
                    } catch (err) {
            
                        show(cityOut, "Erro: " + err.message);
            
                    }
            
                }
            
                btnGet.addEventListener("click", httpGetWeather);
                btnPost.addEventListener("click", httpPostSimulado);
                btnCity.addEventListener("click", handleCitySearch);
            
                const lastCity = localStorage.getItem("lastCity");
            
                if (lastCity) {
                    cityEl.value = lastCity;
                }
            
            });
