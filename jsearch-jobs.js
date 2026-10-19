const fs = require('fs');

// Ahora usarás la API Key de RapidAPI (JSearch)
const API_KEY = process.env.RAPIDAPI_KEY;

const queries = [
    "Supply Chain Manager", 
    "Gerente de Operaciones Logísticas", 
    "Gerente de CEDIS", 
    "Gerente de Transporte", 
    "KAM Logística"
];

// Ampliamos la búsqueda para incluir CDMX y Edomex
const location = "Mexico City, Mexico";
async function fetchJobs() {
    let allJobs = [];

    for (const q of queries) {
        // JSearch funciona mejor cuando unes el puesto y la ubicación en un solo texto
        const searchQuery = `${q} in ${location}`;
        const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(searchQuery)}&page=1&num_pages=1`;

        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': API_KEY,
                'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
            }
        };

        try {
            console.log(`Buscando: ${searchQuery}...`);
            const response = await fetch(url, options);
            const data = await response.json();

            // data.data es donde JSearch devuelve el arreglo de empleos
            if (data && data.data) {
                const mappedJobs = data.data.map(job => ({
                    position: job.job_title,
                    company: job.employer_name,
                    location: `${job.job_city || ''}, ${job.job_state || ''}`.trim(),
                    url: job.job_apply_link || job.job_google_link || '#',
                    source: job.job_publisher || "JSearch"
                }));
                allJobs = allJobs.concat(mappedJobs);
            }
        } catch (error) {
            console.error("Error consultando:", q, error);
        }
    }

    // Se guarda en un nuevo archivo
    fs.writeFileSync('vacantes_jsearch.json', JSON.stringify(allJobs, null, 2));
    console.log("Extracción finalizada. Archivo vacantes_jsearch.json creado con éxito.");
}

fetchJobs();
