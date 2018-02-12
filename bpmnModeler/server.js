var express = require('express');

// ������� Express-����������
var app = express();

// ������������� ������ EJS ��� �������������
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/routes'));

app.get('/', function(req, res) {
  res.render('index');
  
});
// ��������� ������ �� ����� 8080
app.listen(8080);

// ���������� ���������
console.log('Server has started');
