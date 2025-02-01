const express = require('express');
const app = express();
const path = require('path');
const indexRoute = require('./routes/indexRoute');


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use('/', indexRoute);


app.listen(8080, () => {
    console.log(`App is running on port ${8080}`);
});