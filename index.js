const express = require('express');
const cors = require('cors');
const app = express();
const jwt = require("jsonwebtoken")
const port = process.env.PORT || 5000;
require('dotenv').config()

// middle were

app.use(cors())
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lopynog.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();


    const menuCollection = client.db('bistroDB').collection('menu')
   const reviewCollection = client.db("bistroDB").collection("review")
   const cartCollection = client.db("bistroDB" ) .collection("carts")
   const userCollection = client.db("bistroDB" ) .collection("users")



    // user related api 
 app.get("/users" , async(req, res) =>{
  const result = await userCollection.find().toArray()
  res.send(result)
 })

app.delete("/users/:id" , async(req, res)=>{
  const id = req.params.id;
  console.log(id);
  const query = {_id: new ObjectId(id)}
  const result = await userCollection.deleteOne(query)
  res.send(result);
})


   app.post("/users" , async (req, res) =>{
    const user = req.body;
    // insertemail if user doesnt exists
    // you can do this many ways (1.email unique , 2..upsert 3. simple checking)
    const query = {email:user.email}
    const existingUser = await userCollection.findOne(query)
    if(existingUser){
      return res.send({message: "user alredy exists" ,insertId:null})
    }

    const result =await userCollection.insertOne(user)
    res.send(result)
   })
   // make a admin 
 app.patch("/users/admin/:id" ,async(req, res) =>{

  const id = req.params.id;
  console.log(id)
  const filter = {_id: new ObjectId(id)}
  const updateDoc = {
    $set:{
      role: "admin"
    }
  }
const result = await userCollection.updateOne(filter,updateDoc);
 res.send(result)
 })

// menu related api 

    app.get("/menu" , async(req, res) => {
        const result =await menuCollection.find().toArray();
        res.send(result)
    })
    app.get('/review' , async(req, res ) =>{
      const result = await reviewCollection.find().toArray()
      res.send(result)
    }) 
// carts collection

// cart colection data load
  
app.get("/carts", async (req, res) =>{
  const email = req.query.email;
  const query ={email:email}
  const result = await cartCollection.find(query).toArray()
  res.send(result) 
})

 app.post("/carts" ,async(req, res) =>{
  const cartItem = req.body;
  console.log(cartItem)
  const result = await cartCollection.insertOne(cartItem)
  res.send(result)
 })
// cart deleted

app.delete("/carts/:id" , async(req, res) =>{
   const id = req.params.id;
   const query ={_id : new ObjectId(id)}
   const result  = await cartCollection.deleteOne(query)
   res.send(result)
} )
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/' , async(req, res) =>{
    res.send('bistro boss server is running')
})
app.listen(port , () => {
    console.log( `signel crud  sevber is running port ${port}` )
})