const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const searchRoute=require('./routes/searchRoutes');


app.use(cors());

const port = 8800;
  const mongoDB='mongodb+srv://tejaramisetty:cmpe2022211@cluster0.sz9jt.mongodb.net/Historic_Events?retryWrites=true&w=majority';
  mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to the database');
    // Perform additional operations or start your server here
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
});


app.get('/', (req, res) => {
  res.send('Backend Server Running...!');
});

//Routes
//Search route
app.use(searchRoute);


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
