const MongoClient = require('mongodb').MongoClient;
const config = require('../config');

let client = null;

async function connect(){
    if(!client){
        try {
            let connection = await MongoClient.connect(config.dbUrl);
            client = connection.db("sustainability");;
            return client;
        } catch (error) {
            throw new Error(error);
        }
    } else {
        return client;
    }
}

let operators = {
    getData: async function(query, collection){
      try {
        let db = await connect();
        let table = db.collection(collection)
        let results = await table.find(query).toArray();
        return results;
      } catch (error) {
        throw new Error(error);
      }
    },
    updateValue: async (collection, query, newValues) => {
       try {
        let db = await connect();
        let table = db.collection(collection);
        let operator = await table.updateOne(query, {
            $set: newValues
        });
        // console.log('Update Success');
       } catch (error) {
           throw new Error(error);
       }
    },
    getCursor: async function(collection){
        let db = await connect();
        let table = db.collection(collection)
        return table;
    }
}

module.exports = operators;