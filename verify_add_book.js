
const fetch = require('node-fetch'); // Assuming node-fetch is available or using native fetch in newer Node

// Polyfill for fetch if running in an environment without it (Node < 18)
// However, the user is likely on a recent Node version. We'll try native fetch first.

const NGROK_URL = 'https://literally-working-foxhound.ngrok-free.app';
const GOOGLE_API_KEY = 'AIzaSyBZXxg8OihgyQUCyI23K_za3U5_eBjnlx0'; // Taken from biblioteca.js

async function testAddBookFlow() {
    console.log(">>> 1. Testing Online Search (Google Books API)...");
    const query = 'Harry Potter';
    const searchUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}&langRestrict=pt`;

    try {
        const searchRes = await fetch(searchUrl);
        const searchData = await searchRes.json();

        if (searchData.items && searchData.items.length > 0) {
            const book = searchData.items[0];
            const info = book.volumeInfo;

            console.log(`Found Book: ${info.title} by ${info.authors ? info.authors.join(', ') : 'Unknown'}`);

            // Prepare data for adding the book
            const identifier = info.industryIdentifiers ? info.industryIdentifiers[0].identifier : 'UNKNOWN';
            let slugID = 'a' + identifier;
            if (identifier.includes(':')) {
                slugID = 'a' + identifier.split(':')[1];
            }

            const newBook = {
                nomeLivro: info.title || 'Sem título',
                autor: info.authors ? info.authors[0] : 'Sem autor',
                slugID: slugID,
                sinopse: info.description || 'Sem sinopse',
                descricao: info.categories ? info.categories[0] : 'Sem categoria',
                capa: info.imageLinks ? info.imageLinks.thumbnail : ''
            };

            console.log("\n>>> 2. Testing Add Book to Backend (via Ngrok)...");
            console.log("Payload:", JSON.stringify(newBook, null, 2));

            const addRes = await fetch(`${NGROK_URL}/adicionarLivro`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newBook)
            });

            const addData = await addRes.json();
            console.log("Response from server:", addData);

        } else {
            console.error("No books found for query:", query);
        }

    } catch (error) {
        console.error("Error during test:", error);
    }
}

testAddBookFlow();
