const fs = require('fs');

const API_KEY = process.env.SERPAPI_KEY;
// Roles estratégicos basados en tu CV
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
    
    // Unir con los datos que Apify acaba de extraer
    let existingJobs = [];
    if (fs.existsSync('vacantes.json')) {
        existingJobs = JSON.parse(fs.readFileSync('vacantes.json', 'utf8'));
    }
    
    const combined = existingJobs.concat(allJobs);
    fs.writeFileSync('vacantes.json', JSON.stringify(combined, null, 2));
    console.log("Vacantes de Google Jobs agregadas con éxito.");
}

fetchJobs();
