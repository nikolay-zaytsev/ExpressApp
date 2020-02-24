// imports
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('quotes.db');

//mounts BodyParser as middleware - every request passes through it
app.use(bodyParser.urlencoded({ extended: true }));


// var quotes = [
//   {
//       id: 1,
//       quote: "The best is yet to come",
//       author: "Unknown",
//       year: 2000
//   },
//   {
//       id: 2,
//       quote: "This is a quote",
//       author: "First Last",
//       year: 1930
//   },
//   {
//       id: 3,
//       quote: "This is another quote",
//       author: "First2 Last2",
//       year: 1910
//   }
// ];

// ROUTES

app.get('/', function(request, response) {
    response.send("Get request received at '/' ");
});

app.get('/quotes', function(req, res){
  //console.log("Get a list of all quotes as json");
    if(req.query.year){
    //res.send("Return a list of quotes from the year: " + req.query.year);
        db.all('SELECT * FROM quotes WHERE year = ?', [req.query.year], function(err, rows){
            if(err){
                res.send(err.message);
            }
            else{
                console.log("Return a list of quotes from the year: " + req.query.year);
                res.json(rows);
            }
        });
    }
    else{
    //res.json(quotes);
        db.all('SELECT * FROM quotes', function processRows(err, rows){
            if(err){
                res.send(err.message);
            }
            else{
                for( var i = 0; i < rows.length; i++){
                    console.log(rows[i].quote);
                }
                res.json(rows);
            }
        });
    }
});

app.get('/quotes/:id', function(req, res){
    console.log("return quote with the ID: " + req.params.id);
    db.get('SELECT * FROM quotes WHERE rowid = ?', [req.params.id], function(err, row){
        if(err){
            console.log(err.message);
        }
        else{
            res.json(row);
        }
    });
});

app.post('/quotes', function(req, res){
    console.log("Insert a new quote: " + req.body.quote);
    db.run('INSERT INTO quotes VALUES (?, ?, ?)', [req.body.quote, req.body.author, req.body.year],
function(err){
        if(err){
            console.log(err.message);
        }
        else{
            res.send('Inserted quote with id: ' + this.lastID);
        }
    });
});

var port = 3000;
app.listen(port, function(){
    console.log('Express app listening on port ' + port);
});



