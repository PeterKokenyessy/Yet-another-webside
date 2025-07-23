import express from 'express';
import path from 'path';
import { writeFile, readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { log } from 'console';

// https://api.giphy.com/v1/gifs/search?api_key=JTQ5tRcYUqk9fTAmpaiMe85s9UTGPlJy&q=funny+cat&limit=5
// JTQ5tRcYUqk9fTAmpaiMe85s9UTGPlJy

const PORT = 6969;
const __dirname = path.dirname(fileURLToPath(import.meta.url));


const dataFile = path.join(__dirname, '../data/products.json');

const app = express();

app.use(express.json());


app.use('/editPage', express.static(path.join(__dirname, '../public/editPage')));
app.use('/clientPage', express.static(path.join(__dirname, '../public/clientPage')));


app.get('/api/gifs', async (req, res) => {
    try {
        const fileContent = await readFile(dataFile, 'utf-8');
        const gifs = JSON.parse(fileContent);
        res.status(200).json(gifs);


    } catch (err) {
        console.error("Error reading file", err)
        res.status(500).json({ error: "Failed to read gifs data" })
    }
});


app.get('/api/fromTo/:from/:to', async (req, res) => {
    try {
        const from = req.params.from;
        const to = req.params.to;
        let result = []

        const fileContent = await readFile(dataFile, "utf-8");
        const gifts = JSON.parse(fileContent);


        for (let i = from; i <= to; i++) {
            result.push(gifts[i]);
        }


        res.status(200).json(result)
    } catch (err) {
        console.error("error read file", err)
        res.status(500).json({ error: "Failed to read gifs data" })
    }
})

app.get('/api/id/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const fileContent = await readFile(dataFile, "utf-8");
        const gifs = JSON.parse(fileContent);

        const result = gifs.find(e => e.id == id);
        if (result) {
            res.status(200).json(result);
        } else{
            res.status(500).json('file dont file');
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
})

app.post('/api/gifs', async (req, res) => {
    try {
        const gifs = req.body
        await writeFile(dataFile, JSON.stringify(gifs, null, 2), 'utf-8');
        res.status(200).json({ message: 'Success.' });
    }
    catch (err) {
        console.error("Saving error", err)
        res.status(500).json({ error: 'Can not saved the file' });
    }
});
app.get('/api/details', async (req, res) => {
    try {
        const fileContent = await readFile(path.join(__dirname, '../data/api.json'), 'utf-8');
        const apiData = JSON.parse(fileContent);
        res.status(200).json(apiData);
    } catch (err) {
        console.error("Error reading API data", err);
        res.status(500).json({ error: 'Failed to read API data.' });
    }
});
app.post('/api/details', async (req, res) => {
    try {
        const { gifApiTopic, apiAllGifsDatas, maxLimit } = req.body;
        const newData = {
            gifApiTopic,
            apiAllGifsDatas,
            maxLimit
        };

        await writeFile(path.join(__dirname, '../data/api.json'), JSON.stringify([newData], null, 2), 'utf-8');
        res.status(200).json({ message: 'API data saved successfully.' });
    } catch (err) {
        console.error("Error saving API data", err);
        res.status(500).json({ error: 'Failed to save API data.' });
    }
});


app.post('/api/gifs/add', async (req, res) => {
    try {
        const newProduct = req.body;

        const fileContent = await readFile(dataFile, 'utf-8');
        const currentProducts = JSON.parse(fileContent);

        currentProducts.push(newProduct);

        await writeFile(dataFile, JSON.stringify(currentProducts, null, 2), 'utf-8');
        res.status(200).json({ message: "product added" });
    } catch (err) {
        console.error("Error appending", err);
        res.status(500).json({ error: "failed to append" })
    }
});


app.post('/api/gifs/remove', async (req, res) => {
    try {
        const { url } = req.body;

        const fileContent = await readFile(dataFile, 'utf-8');
        let products = JSON.parse(fileContent);

        const filtered = products.filter(p => p.url !== url);

        await writeFile(dataFile, JSON.stringify(filtered, null, 2), 'utf-8');
        res.status(200).json({ message: "Product removed" });
    } catch (err) {
        console.error("Error removing product:", err);
        res.status(500).json({ error: "Failed to remove product" });
    }
});




app.listen(PORT, function () {
    console.log(`http://localhost:${PORT}/editPage`);
    console.log(`http://localhost:${PORT}/clientPage`);
});

