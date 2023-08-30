const mongodb = require('mongodb')
const dbName = 'food-app'
const dbUrl = `mongodb+srv://Rajivee:Rajivee21@cluster0.bcx9c.mongodb.net/${dbName}?retryWrites=true&w=majority`


module.exports = {mongodb,dbName,dbUrl}