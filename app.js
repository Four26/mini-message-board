require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const indexRoute = require('./routes/indexRoute');

const port = process.env.PORT || 8080;


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use('/', indexRoute);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong.' })
})


app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});