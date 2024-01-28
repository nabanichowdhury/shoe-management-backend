const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors'); // Import the cors middleware

const app = express();
const jwt = require('jsonwebtoken')
const jwtKey = "welcome"
const port = 8000 || process.env.PORT;

const uri = "mongodb+srv://dbadmin:eacX83zqM6w9fhTN@cluster0.vdcw4ws.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

app.use(cors()); // Use the cors middleware
app.use(express.json());
function verifyJWT(req, res, next) {

  const authHeader = req.headers.authorization;
  
 
  if (!authHeader) {
      return res.status(401).send('unauthorized access');
  }

  const token = authHeader.split(' ')[1].replace(/^"(.*)"$/, '$1');;
  // const token=authHeader

  

  jwt.verify(token, jwtKey, function (err, decoded) {
      if (err) {
          return res.status(403).send({ message: 'forbidden access' })
      }
      req.decoded = decoded;
      next();
  })

}

async function run() {
  try {
    const database = client.db('shoes_management');
    const products = database.collection('shoes')
    const users = database.collection('users')
    const sales = database.collection('sales')


    app.get('/sales/:id',verifyJWT,async(req,res)=>{
      const sellerId=req.params.id
      const allSales=await sales.find().toArray();
      const sell = allSales.filter(sell=>sell.sellerId==sellerId)
      

      if (!sell) {
        res.status(404).json({success:false, message: 'Buyer not found' });
        return;
      }

      res.json(sell);

    })

    app.post('/sales',verifyJWT,async(req,res)=>{
      const data=req.body;
      
      const result = await sales.insertOne(data);
      res.json({status:"success", message: 'Sale successfully', productId: result.insertedId });
    })


    // Get all products
    app.get('/products',verifyJWT, async (req, res) => {
      const allProducts = await products.find().toArray();
      res.json(allProducts);
    });


    // Get a specific product by ID
    app.get('/product/user/:id',verifyJWT, async (req, res) => {
      const userId = req.params.id;
      const allProducts=await products.find().toArray();
      const product = allProducts.filter(prod=>prod.sellerInfo.sellerId==userId)
      

      if (!product) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }

      res.json(product);
    });

    // Create a new product
    app.post('/product',verifyJWT, async (req, res) => {
      const newProduct = req.body;
      const result = await products.insertOne(newProduct);
      res.json({status:"success", message: 'Product created successfully', productId: result.insertedId });
    });

    // Delete a product by ID
    app.delete('/product/:id',verifyJWT, async (req, res) => {
      const productId = req.params.id;
      const result = await products.deleteOne({ _id: new ObjectId(productId) });

      if (result.deletedCount === 0) {
        res.status(404).json({success:false, message: 'Product not found' });
        return;
      }

      res.json({success:true, message: 'Product deleted successfully' });
    });
    app.delete('/products',verifyJWT, async (req, res) => {
      const  productIds  = req.body;
      console.log("from delete ",productIds)
    
      try {
        // Convert array of string IDs to array of ObjectId
        const objectIdArray = productIds.map(id => new ObjectId(id));
        console.log(objectIdArray)
    
        // Use the deleteMany method with the $in operator and additional condition for seller ID
        const result = await products.deleteMany({
          _id: { $in: objectIdArray },   
        });
    
        // Check if any products were deleted
        if (result.deletedCount === 0) {
          return res.status(404).json({ message: 'No products found based on the given seller ID and product IDs' });
        }
    
        res.json({ message: 'Products deleted successfully' });
      } catch (error) {
        console.error('Error deleting products:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    });
    app.post('/updateProduct/:id', verifyJWT, async (req, res) => {
      const updatedProduct = req.body;
      const id=req.params.id
      console.log(updatedProduct)
      
     
    
      try {
        // Validate that updatedProduct is an object with at least an _id and fields to update
        if (!updatedProduct  || Object.keys(updatedProduct).length < 1) {
          return res.status(400).json({success:false, message: 'Invalid request body' });
        }
    
        const result = await products.updateOne(
          { _id: new ObjectId(id) },
          { $set: { ...updatedProduct } }
        );
    
        // Check if the product was updated
        if (result.modifiedCount === 0) {
          return res.status(404).json({success:false, message: 'Product not found' });
        }
    
        res.json({success:true, message: 'Product updated successfully' });
      } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ success:false,message: 'Internal Server Error' });
      }
      
    });

    // Create a new user
    app.post('/user', async (req, res) => {
      const user = req.body;
      const result = await users.insertOne(user);


      const token = jwt.sign({ email: user.email, password: user.password }, jwtKey, { expiresIn: '1h' });
      res.json({ result, token });

    });
    // Login route
    app.post('/user/login', async (req, res) => {
      const { email, password } = req.body;
      const allUsers = await users.find({}).toArray();
      const user = allUsers.find(u => u.email === email && u.password === password);
      if (user) {
        const token = jwt.sign({ email: user.email, password: user.password }, jwtKey, { expiresIn: '1h' });
        res.json({ user, token });  
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    });
    

    // Get all users
    app.get('/users', async (req, res) => {
      const allUsers = await users.find().toArray();
      res.json(allUsers);
    });
    //Get user by id
    app.get('/user/:id',async(req,res)=>{
      const id=req.params.id
      const user = await users.findOne({ _id: new ObjectId(id) });
      if (user) {
        console.log('User found:', user);
        res.json(user);
      } else {
        console.log('User not found');
        res.status(404).json({ error: 'User not found' });
      }
  
    })



  } finally {

  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Welcome to shoe management portal')
})

app.listen(port, () => {
  console.log(`Shoe management ${port}`)
})