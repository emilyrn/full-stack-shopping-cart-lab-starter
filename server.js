const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');

const app = express();
// Serve files from public folder. That's where all of our HTML, CSS and Angular JS are.
app.use(express.static('public'));
// This allows us to accept JSON bodies in POSTs and PUTs.
app.use(bodyParser.json());

// TODO Set up access to the database via a connection pool. You will then use
// the pool for the tasks below.
var pool = new pg.Pool({
    user: "postgres",
    password: "emilypassword",
    host: "localhost",
    port: 5432,
    database: "postgres",
    ssl: false
});

// GET /api/items - responds with an array of all items in the database.
// TODO Handle this URL with appropriate Database interaction.
app.get('/api/items', function(req, res){
    pool.query("SELECT * FROM shoppingcart").then(function(result) {
        res.send(result.rows);
    })
})

// POST /api/items - adds and item to the database. The items name and price
// are available as JSON from the request body.
// TODO Handle this URL with appropriate Database interaction.
app.post('/api/items', function(req,res) {
    var item = req.body;
    var sql = "INSERT INTO shoppingcart(product, price) " +
        "VALUES ($1::text, $2::int)";
    var values = [item.product, item.price];

    pool.query(sql, values).then(function() {
        res.status(201);
        res.send("INSERTED");
    });
});

// DELETE /api/items/{ID} - delete an item from the database. The item is
// selected via the {ID} part of the URL.
// TODO Handle this URL with appropriate Database interaction.
app.delete('/api/items/:id', function(req,res) {
    var id = req.params.id;
    var sql = "DELETE FROM shoppingcart WHERE id=$1::int;";
    var values = [id];


    pool.query(sql, values).then(function(){
        res.send("deleted.");
    }).catch(function(err) {
        console.log(err);
});
});

var port = process.env.PORT || 5000;
app.listen(port, function () {
  console.log('JSON Server is running on ' + port);
});
