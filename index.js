import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import {} from './api/api.js';


const app = express();
const PORT = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/loginPage/');

});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;


});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});