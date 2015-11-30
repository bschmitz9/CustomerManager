var express = require('express'),
    app = express(),
    path = require('path'),
    bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './public')));

require('./config/mongoose.js');
require('./config/routes.js')(app);


//environment specific variables, get the PORT (environment variable) from the server or 
//the default in development - 3000
//when deploying for production in node you could set up the PORT variable to 80 or any number
var port = process.env.PORT || 3000;

app.listen(port, function (){
    console.log('listening on 3000');
});

