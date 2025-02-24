import axios from "axios";
import cron from "node-cron";

const fetchData = async () => {
    try {
        const response = await axios.get("https://backend.testeswaffle.org/webhooks/case/fetch", {
            params: { email: "luisfernandodasilvacorrea@yahoo.com.br" },
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        console.error("Erro ao buscar webhook:", error);
    }
};

// Chamar a cada 1 hora
//console.log("Webhook Service iniciado!");
//setInterval(fetchData, 60 * 60 * 1000);

// Executar a cada 1 hora (usando cron job)
cron.schedule("0 * * * *", () => {
    console.log("🔄 Executando webhook fetch...");
    fetchData();
});

console.log("⏳ Webhook Fetcher iniciado! Executará a cada 1 hora...");
