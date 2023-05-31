const express = require('express');
const bcrypt = require('bcrypt');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = 8080;

app.use(express.json());

// Connection URL for MongoDB
const url = 'mongodb://localhost:27017';
const dbName = 'userdb';

// Helper function to hash passwords
const hashPassword = async (password) => {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
};

// POST endpoint for user signup
app.post('/signup', async (req, res) => {
  const { userId, password } = req.body;

  try {
    // Connect to MongoDB
    const client = await MongoClient.connect(url);
    const db = client.db(dbName);

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Insert the user into the database
    await db.collection('users').insertOne({
      userId: userId,
      password: hashedPassword,
    });

    client.close();

    res.send('User signed up successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

// POST endpoint for user login
app.post('/login', async (req, res) => {
  const { userId, password } = req.body;

  try {
    // Connect to MongoDB
    const client = await MongoClient.connect(url);
    const db = client.db(dbName);

    // Find the user in the database
    const user = await db.collection('users').findOne({ userId: userId });

    // Compare the password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      res.send('User logged in successfully!');
    } else {
      res.status(401).send('Invalid username or password');
    }

    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
