//use path module
const path = require('path');
//use express module
const express = require('express');
//use hbs view engine
const hbs = require('hbs');
//use bodyParser middleware
const bodyParser = require('body-parser');
//use mysql database
const mysql = require('mysql');
const app = express();

//Create Connection
const conn = mysql.createConnection({
   host: 'db4free.net', // O host do banco. Ex: localhost
    user: 'horta11', // Um usuário do banco. Ex: user 
    password: 'abacaxi11', // A senha do usuário. Ex: user123
    database: 'horta11', // A base de dados a qual a aplicação irá se conectar, deve ser 
    multipleStatements: true
});

//connect to database
conn.connect((err) =>{
  if(err) throw err;
  console.log('Mysql Connected...');
});

//set views file
app.set('views',path.join(__dirname,'views'));
//set view engine
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//set folder public as static folder for static file
app.use('/assets',express.static(__dirname + '/public'));

//route for homepage
app.get('/',(req, res) => {
  let sql = "select * from vwInformacaoPlantio;select * from vwDetalhesPlantio";
 // let sql2 = "select * from vwDetalhesPlantio;";

  let query = conn.query(sql,[2, 1], (err,results,fields) => {
    if(err) throw err;
   
   // console.log(results[0]);
  //  console.log(results[1]);
      res.render('plantio_view',{resultado: results[0], info:results[1]});

  });
});


app.get('/semente',(req, res) => {
  let sql = "SELECT tipo_solo.descricao as solo, tipo_semente.descricao as tipo_semente, semente.* FROM semente join tipo_solo on tipo_solo.id = semente.tipo_solo_id join tipo_semente on tipo_semente.id = semente.tipo_semente_id ";
  
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.render('semente.hbs',{
      results: results
    });
  });
});

//route for insert data
app.post('/save',(req, res) => {
  let data = {product_name: req.body.product_name, product_price: req.body.product_price};
  let sql = "INSERT INTO product SET ?";
  let query = conn.query(sql, data,(err, results) => {
    if(err) throw err;
    res.redirect('/');
  });
});

//route for update data
app.post('/update',(req, res) => {
  let sql = "UPDATE product SET product_name='"+req.body.product_name+"', product_price='"+req.body.product_price+"' WHERE product_id="+req.body.id;
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.redirect('/');
  });
});

//route for delete data
app.post('/delete',(req, res) => {
  let sql = "DELETE FROM product WHERE product_id="+req.body.product_id+"";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
      res.redirect('/');
  });
});
 // set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

//server listening
app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});