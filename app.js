const express = require('express'),
        mongoose=require('mongoose');

const app = express();

let port = process.env.port || 3000;
mongoose.connect('mongodb://localhost/demo_auth');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/secret', (req, res) => {
    res.render('secret');
});

app.listen(port, process.env.IP, () => {
    console.log(`App listen to the port ${port} at IP: ${process.env.IP}`);
})

