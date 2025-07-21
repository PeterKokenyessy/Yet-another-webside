import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const PORT  = 6969;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(express.json());


app.use('/editPage', express.static(path.join(__dirname, '../public/editPage')));
app.use('/clientPage', express.static(path.join(__dirname, '../public/clientPage')));

app.listen(PORT, function() {
    console.log(`http://localhost:${PORT}/editPage`);
    console.log(`http://localhost:${PORT}/clientPage`);
});