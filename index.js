const express = require('express');
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config();
const jwt = require('jsonwebtoken');
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

        const usersCollection = client.db("bistroDB").collection("users");
        const menuCollection = client.db("bistroDB").collection("menu");
        const reviewCollection = client.db("bistroDB").collection("reviews");
        const cartCollection = client.db("bistroDB").collection("carts");


        app.post('/jwt', (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'});

            res.send({token})
        })


        /* -----------Users Related API------------ */

        app.get( '/users', async(req, res) => {
            const result = await usersCollection.find().toArray();
            res.send(result)
        });


        app.patch('/users/admin/:id', async(req, res) => {
           const iD = req.params.id;
           const filter = {_id : new ObjectId(iD)};
           const updateDoc = {
            $set: {
                role:'admin'
            },
           };

           const result = await usersCollection.updateOne(filter, updateDoc);
           res.send(result);
        })


        app.post('/users', async(req, res)  => {
          
            const user = req.body;
            const query = {email : user.email};
            const existingUser = await usersCollection.findOne(query);
            if(existingUser){
                res.send({message:'User Already exist.'})
            }
            else{
                const result = await usersCollection.insertOne(user);
                res.send(result)
            }
        });


        /* -----------Menu Related API------------ */
        app.get('/menu', async(req, res) => {
           
            const result = await menuCollection.find().toArray() ;
            res.send(result)
        });

        /* -----------Reviews Related API------------ */
        app.get('/reviews', async(req, res) => {
           
            const result = await reviewCollection.find().toArray() ;
            res.send(result)
        });

        /* -----------Shopping Cart  Related API------------ */
        app.get('/carts', async(req, res) => {
            const email = req.query.email ;
            if(!email){
                res.send([])
            }
            else{

                const query = {email: email};
                const result = await cartCollection.find(query).toArray();
                res.send(result)
            }
        });

        app.post('/carts', async(req, res) => {
            const item = req.body;
            const result = await cartCollection.insertOne(item);
            res.send(result)
        });

        app.delete('/carts/:id', async(req, res) => {
            const iD = req.params.id;
            const query = {_id : new ObjectId(iD)};
            const result = await cartCollection.deleteOne(query);
            res.send(result)
        });


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