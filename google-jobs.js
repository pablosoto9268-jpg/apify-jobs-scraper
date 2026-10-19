const fs = require('fs');

const API_KEY = process.env.SERPAPI_KEY;
const queries = ["Supply Chain Manager", "Gerente de Operaciones Logísticas", "Gerente de CEDIS", "Gerente de Transporte", "KAM Logística"];
const location = "Estado de Mexico, Mexico";

async function fetchJobs() {
    let allJobs = [];
    for (const q of queries) {
        const url = `https://serpapi.com/search.json?engine=google_jobs&q=${encodeURIComponent(q)}&location=${encodeURIComponent(location)}&hl=es&api_key=${API_KEY}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.jobs_results) {
                const mappedJobs = data.jobs_results.map(job => ({
                    position: job.title,
                    company: job.company_name,
                    location: job.location,
                    url: job.share_link || (job.apply_options && job.apply_options[0] ? job.apply_options[0].link : '#'),
                    source: "Google Jobs"
                }));
                allJobs = allJobs.concat(mappedJobs);
            }
        } catch (error) {
            console.error("Error consultando:", q, error);
        }
    }
    
    // Se guarda en un archivo completamente independiente
    fs.writeFileSync('vacantes_google.json', JSON.stringify(allJobs, null, 2));
    console.log("Extracción finalizada. Archivo vacantes_google.json creado con éxito.");
}

fetchJobs();
