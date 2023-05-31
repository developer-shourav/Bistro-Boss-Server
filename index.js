const express = require('express');
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 7000 ;




// Middleware

app.use(cors())
app.use(express.json())



    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.evuna6q.mongodb.net/?retryWrites=true&w=majority`;

    // Create a MongoClient with a MongoClientOptions object to set the Stable API version
    const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
    });


   

    async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
       /*  await client.connect(); */

        const menuCollection = client.db("bistroDB").collection("menu");
        const reviewCollection = client.db("bistroDB").collection("reviews");
        const cartCollection = client.db("bistroDB").collection("carts");

        
        app.get('/menu', async(req, res) => {
           
            const result = await menuCollection.find().toArray() ;
            res.send(result)
        })

        app.get('/reviews', async(req, res) => {
           
            const result = await reviewCollection.find().toArray() ;
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        /* await client.close(); */
    }
    }
    run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Welcome to Bistro Boss')
})





app.listen(port, () => {
    console.log(`Our Bistro Boss is Running on the PORT ${port}`);
})



/**
 * --------------------------------------------------
 *            API NAMING CONVENTION
 * --------------------------------------------------
 * users: userCollection
 * 
 * app.get('/users')
 * app.get('/users/:id')
 * app.post('/users')
 * app.patch('/users/:id')
 * app.put('/users/:id')
 * app.delete('/users/:id')
 * 
 * 
 * */