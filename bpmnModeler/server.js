var express = require('express');

// создаём Express-приложение
var app = express();

// устанавливаем движок EJS для представления
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/routes'));

app.get('/', function(req, res) {
  res.render('index');
  
});
// запускаем сервер на порту 8080
app.listen(8080);

// отправл€ем сообщение
console.log('Server has started');
