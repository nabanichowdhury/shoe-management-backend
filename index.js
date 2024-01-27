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
    // const allProducts=
    //    [
    //     {
    //       "name": "Running Shoes",
    //       "productQuantity": 50,
    //       "productPrice": 89.99,
    //       "brand": "Nike",
    //       "size": "10",
    //       "color": "Blue",
    //       "releaseDate": "2022-01-01",
    //       "model": "Air Max",
    //       "sellerInfo": {
    //         "sellerName": "Seller1",
    //         "sellerId": "65b3ff6c7f0cecf5cb0e0662"
    //       },
    //       "sellingDetails": {
    //         "sold": false,
    //         "buyerId": null
    //       }
    //     },
    //     {
    //       "name": "Casual Sneakers",
    //       "productQuantity": 30,
    //       "productPrice": 49.99,
    //       "brand": "Adidas",
    //       "size": "9",
    //       "color": "White",
    //       "releaseDate": "2022-02-15",
    //       "model": "Superstar",
    //       "sellerInfo": {
    //         "sellerName": "Seller2",
    //         "sellerId": "65b3ea84cb6fb0e625ecbcb2"
    //       },
    //       "sellingDetails": {
    //         "sold": true,
    //         "buyerId": "buyer789"
    //       }
    //     },
    //     {
    //       "name": "Basketball Shoes",
    //       "productQuantity": 20,
    //       "productPrice": 119.99,
    //       "brand": "Jordan",
    //       "size": "11",
    //       "color": "Red",
    //       "releaseDate": "2022-03-10",
    //       "model": "Air Jordan",
    //       "sellerInfo": {
    //         "sellerName": "Seller1",
    //         "sellerId": "65b3ff6c7f0cecf5cb0e0662"
    //       },
    //       "sellingDetails": {
    //         "sold": true,
    //         "buyerId": "buyer456"
    //       }
    //     },
    //     {
    //       "name": "Running Shoes 2",
    //       "productQuantity": 40,
    //       "productPrice": 79.99,
    //       "brand": "Reebok",
    //       "size": "9.5",
    //       "color": "Black",
    //       "releaseDate": "2022-04-05",
    //       "model": "Floatride Run",
    //       "sellerInfo": {
    //         "sellerName": "Seller3",
    //         "sellerId": "seller3_id"
    //       },
    //       "sellingDetails": {
    //         "sold": false,
    //         "buyerId": null
    //       }
    //     },
    //     {
    //       "name": "High-Top Sneakers",
    //       "productQuantity": 25,
    //       "productPrice": 59.99,
    //       "brand": "Converse",
    //       "size": "8",
    //       "color": "Green",
    //       "releaseDate": "2022-05-20",
    //       "model": "Chuck Taylor",
    //       "sellerInfo": {
    //         "sellerName": "Seller1",
    //         "sellerId": "65b3ff6c7f0cecf5cb0e0662"
    //       },
    //       "sellingDetails": {
    //         "sold": false,
    //         "buyerId": null
    //       }
    //     },
    //     {
    //       "name": "Trail Running Shoes",
    //       "productQuantity": 35,
    //       "productPrice": 99.99,
    //       "brand": "Salomon",
    //       "size": "10.5",
    //       "color": "Grey",
    //       "releaseDate": "2022-06-15",
    //       "model": "Speedcross",
    //       "sellerInfo": {
    //         "sellerName": "Seller2",
    //         "sellerId": "65b3ea84cb6fb0e625ecbcb2"
    //       },
    //       "sellingDetails": {
    //         "sold": true,
    //         "buyerId": "buyer123"
    //       }
    //     },
    //     {
    //       "name": "Skate Shoes",
    //       "productQuantity": 15,
    //       "productPrice": 69.99,
    //       "brand": "Vans",
    //       "size": "8.5",
    //       "color": "Checkerboard",
    //       "releaseDate": "2022-07-01",
    //       "model": "Old Skool",
    //       "sellerInfo": {
    //         "sellerName": "Seller3",
    //         "sellerId": "seller3_id"
    //       },
    //       "sellingDetails": {
    //         "sold": true,
    //         "buyerId": "buyer789"
    //       }
    //     },
    //     {
    //       "name": "Soccer Cleats",
    //       "productQuantity": 20,
    //       "productPrice": 129.99,
    //       "brand": "Adidas",
    //       "size": "11",
    //       "color": "Black/White",
    //       "releaseDate": "2022-08-10",
    //       "model": "Predator",
    //       "sellerInfo": {
    //         "sellerName": "Seller1",
    //         "sellerId": "65b3ff6c7f0cecf5cb0e0662"
    //       },
    //       "sellingDetails": {
    //         "sold": false,
    //         "buyerId": null
    //       }
    //     },
    //     {
    //       "name": "Fashion Sandals",
    //       "productQuantity": 18,
    //       "productPrice": 39.99,
    //       "brand": "Birkenstock",
    //       "size": "7",
    //       "color": "Brown",
    //       "releaseDate": "2022-09-05",
    //       "model": "Arizona",
    //       "sellerInfo": {
    //         "sellerName": "Seller2",
    //         "sellerId": "65b3ea84cb6fb0e625ecbcb2"
    //       },
    //       "sellingDetails": {
    //         "sold": false,
    //         "buyerId": null
    //       }
    //     },
    //     {
    //       "name": "Hiking Boots",
    //       "productQuantity": 22,
    //       "productPrice": 109.99,
    //       "brand": "Merrell",
    //       "size": "9.5",
    //       "color": "Dark Brown",
    //       "releaseDate": "2022-10-20",
    //       "model": "Moab 2",
    //       "sellerInfo": {
    //         "sellerName": "Seller3",
    //         "sellerId": "seller3_id"
    //       },
    //       "sellingDetails": {
    //         "sold": true,
    //         "buyerId": "buyer456"
    //       }
    //     }
    //   ]
    
    // const result=await products.insertMany(allProducts);
    
    
   
    
    


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
      res.json({ message: 'Product created successfully', productId: result.insertedId });
    });

    // Delete a product by ID
    app.delete('/product/:id',verifyJWT, async (req, res) => {
      const productId = req.params.id;
      const result = await products.deleteOne({ _id: new ObjectId(productId) });

      if (result.deletedCount === 0) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }

      res.json({ message: 'Product deleted successfully' });
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
      console.log(id);
      console.log(updatedProduct)
     
    
      try {
        // Validate that updatedProduct is an object with at least an _id and fields to update
        if (!updatedProduct  || Object.keys(updatedProduct).length < 2) {
          return res.status(400).json({ message: 'Invalid request body' });
        }
    
        const result = await products.updateOne(
          { _id: new ObjectId(id) },
          { $set: { ...updatedProduct } }
        );
    
        // Check if the product was updated
        if (result.modifiedCount === 0) {
          return res.status(404).json({ message: 'Product not found' });
        }
    
        res.json({ message: 'Product updated successfully' });
      } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Internal Server Error' });
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