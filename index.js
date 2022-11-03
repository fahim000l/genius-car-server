const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('hello from genius-car-server');
});

console.log(process.env.DB_USER);
console.log(process.env.DB_PASSWORD);




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tzinyke.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const servicesesCollection = client.db('genius-car-db').collection('services');
        const ordersCollection = client.db('genius-car-db').collection('orders');

        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = servicesesCollection.find(query);
            const result = await cursor.toArray();
            console.log(result);
            res.send(result);
        });

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesesCollection.findOne(query);
            console.log(service);
            res.send(service);
        });

        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            console.log(result);
            res.send(result);
        });

        app.get('/orders', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = { "customerInfo.email": req.query.email }
            }
            const cursor = ordersCollection.find(query);
            const result = await cursor.toArray();
            console.log(result);
            res.send(result);
        });

        app.get('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const order = await ordersCollection.findOne(query);
            console.log(order);
            res.send(order);
        });

        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            console.log(result);
            res.send(result);
        })

        app.patch('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const status = req.body.status;
            const query = { _id: ObjectId(id) };
            const updatedDoc = {
                $set: {
                    status: status
                }
            }

            const result = await ordersCollection.updateOne(query, updatedDoc);
            res.send(result);
        })

    }
    finally {

    }
};

run().catch(error => console.log(error));


app.listen(port, () => {
    console.log('genius-car-server is running on port :', port);
});