'use strict'

const mongoose = require('mongoose');
const app = require('./app');
const PORT = 9999;


// Connect database (MongoDB)
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/testdb", {useNewUrlParser: true})
.then(() => {
    console.log("It's connect my friends (8");
    
    // Create server
    app.listen(PORT, () => {
        console.log("Server launched");
    })
})
.catch(err => {
    console.log("Douh!");
    console.log(err);
});

