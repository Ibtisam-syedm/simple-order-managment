require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT;
const bodyParser = require("body-parser");
const categoryRoutes = require('./routes/category');
const itemRoutes = require('./routes/item');
const orderRoutes = require('./routes/order')
const kitchenqueueRoutes = require('./routes/kitchenqueues')
const connectToDatabase = require('./utils/db');

uri = ""
if (process.env.NODE_ENV === 'production') {
  
} else if (process.env.NODE_ENV === 'development') {
  if (process.env.DATABASE_ENV === 'local-database-testing') {
    uri = process.env.DB_URL_LOCAL;
  } else if (process.env.DATABASE_ENV === 'atlas-database-testing') {
    uri = process.env.DB_URL_ATLAS;
  }
}

// Connect to the database
connectToDatabase(uri);

app.use(bodyParser.json());
app.use('/api/categories', categoryRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/orders',orderRoutes);
app.use('/api/kitchenqueues',kitchenqueueRoutes);
// Define routes and middleware here



// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
