const express = require('express');
const app = express();
const helmet = require('helmet');
const morgan = require('morgan');
const serveStatic = require('serve-static');
const path = require('path');
var favicon = require('serve-favicon')
// Middle Wares

app.use(helmet());
app.use(morgan('tiny'));
app.use(express.json());
app.use(serveStatic(path.join(__dirname, 'public')));

app.use(favicon(__dirname + '/public/images/favicon.ico'))
// Setup Views

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


const PagesRouter = require('./routes/pages');
const ApiRouter = require('./routes/api');

app.use('/', PagesRouter);
app.use('/api', ApiRouter);

app.listen(3000, ()=> console.log('Listening on Port 3000'));


