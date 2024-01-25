const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors'); // Import the cors middleware

const app = express();
const port = 8000 || process.env.PORT;

const uri = "mongodb+srv://dbadmin:eacX83zqM6w9fhTN@cluster0.vdcw4ws.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors()); // Use the cors middleware
app.use(express.json());

async function run() {
  try {
    const database = client.db('shoes_management');
    const products=database.collection('shoes')
    const users=database.collection('users')

    // Get all products
    app.get('/products', async (req, res) => {
        const allProducts = await products.find().toArray();
        res.json(allProducts);
    });

    // Get a specific product by ID
    app.get('/product/:id', async (req, res) => {
        const productId = req.params.id;
        const product = await products.findOne({ _id: new ObjectId(productId) });

        if (!product) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }

        res.json(product);
    });

    // Create a new product
    app.post('/product', async (req, res) => {
        const newProduct = req.body;
        const result = await products.insertOne(newProduct);
        res.json({ message: 'Product created successfully', productId: result.insertedId });
    });

    // Delete a product by ID
    app.delete('/product/:id', async (req, res) => {
        const productId = req.params.id;
        const result = await products.deleteOne({ _id: new ObjectId(productId) });

        if (result.deletedCount === 0) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }

        res.json({ message: 'Product deleted successfully' });
    });

    // Create a new user
    app.post('/user', async (req, res) => {
        const newUser = req.body;
        const result = await users.insertOne(newUser);
        res.json({ message: 'User created successfully', userId: result.insertedId });
    });

    // Get all users
    app.get('/users', async (req, res) => {
        const allUsers = await users.find().toArray();
        res.json(allUsers);
    });


    
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Welcome to shoe management portal')
})

app.listen(port, () => {
  console.log(`Shoe management ${port}`)
})