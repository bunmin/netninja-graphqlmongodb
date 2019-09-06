const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');

const app = express();

//connect to mlab database
// mongoose.connect('mongodb+srv://admin:admin@cluster0-veiz3.mongodb.net/test?retryWrites=true&w=majority',{ useNewUrlParser: true });
mongoose.connect('mongodb://localhost:27017/test',{ useNewUrlParser: true });
mongoose.connection.once('open', () => {
    console.log('connected to database');
});

app.use('/graphql',graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(4000, () => {
    console.log('now starting on the port 4000');
});