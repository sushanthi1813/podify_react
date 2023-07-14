const express = require('express');
const app = express();
const port = 3001;
const cors = require('cors')
const bodyParser = require('body-parser')
const sql = require('mysql')

const db = sql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'podify',
})


  db.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return;
    }
    console.log('Connected to the database');
  });
  
  app.use(cors());
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  
  app.get('/', (req, res) => {
    res.send('Hello World!');
  });
  
  app.get('/api/get/', (req, res) => {
    const { ids } = req.query;
    console.log(req.query)
    console.log(ids)
    if (ids) {
  
      const idArray = ids.split(',').map(Number);
      const sqlSelect = 'SELECT * FROM podcasts WHERE id IN (?);';
      db.query(sqlSelect, [idArray], (err, result) => {
        if (err) {
          console.error('Error executing SELECT query:', err);
          res.status(500).send({ error: 'Internal server error' });
          return;
        }
        console.log(result);
        res.send(result);
      });
  
    } else {
      const sqlSelect = 'SELECT * FROM podcasts;';
      db.query(sqlSelect, (err, result) => {
        if (err) {
          console.error('Error executing SELECT query:', err);
          res.status(500).send({ error: 'Internal server error' });
          return;
        }
        res.send(result);
      });
    }
  });
  
  app.get('/api/podcasts/last10', (req, res) => {
    const sqlSelect = 'SELECT * FROM podcasts ORDER BY id DESC LIMIT 10;';
    db.query(sqlSelect, (err, result) => {
      if (err) {
        console.error('Error executing SELECT query:', err);
        res.status(500).send({ error: 'Internal server error' });
        return;
      }
      console.log(result.length)
      res.send(result);
    });
  });
  
  app.put('/api/update-like/:id', (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;
    
      let sqlUpdate = null;
      if(reason === "like"){
        sqlUpdate = 'UPDATE podcasts SET likes = likes + 1 WHERE id = ?';
      }
      else{
        sqlUpdate = 'UPDATE podcasts SET likes = likes - 1 WHERE id = ?';
      }
  
    db.query(sqlUpdate, [id], (err, result) => {
      if (err) {
        res.status(500).send({ error: 'Internal server error' });
        return;
      }
  
      res.send({ message: 'Like count updated' });
    });
  });
  
  app.get('/api/top-liked', (req, res) => {
    console.log("Top hits data is being requested")
    const sqlSelect = 'SELECT * FROM podcasts WHERE likes > 0 ORDER BY likes DESC LIMIT 10;';
    db.query(sqlSelect, (err, result) => {
      if (err) {
        console.error('Error executing SELECT query:', err);
        res.status(500).send({ error: 'Internal server error' });
        return;
      }
      console.log("top hits: " + result);
      res.send(result);
    });
  });
  
  
  
  app.get('/api/get', (req, res) => {
    const podcastIds = req.query.ids; // Assuming the IDs are passed as query parameters, e.g., /api/get?ids=1,2,3
    const idsArray = podcastIds.split(','); // Split the comma-separated IDs into an array
  
    // Generate the placeholders for the SQL query based on the number of IDs
    const placeholders = idsArray.map(() => '?').join(',');
  
    const sqlSelect = `SELECT * FROM podcasts WHERE id IN (${placeholders});`;
  
    db.query(sqlSelect, idsArray, (err, result) => {
      if (err) {
        console.error('Error executing SELECT query:', err);
        res.status(500).send({ error: 'Internal server error' });
        return;
      }
  
      res.send(result);
    });
  });
  
  app.post('/api/insert/', (req, res) => {
    const embedLink = req.body.embedLink;
    const title = req.body.title;
    const description = req.body.description;
    const artist = req.body.artist;
    const genre = req.body.genre;
    const coverImage = req.body.coverImage;
  
    const sqlInsert =
      'INSERT INTO podcasts (`embedLink`, `title`, `description`, `artistName`, `genre`, `coverImage`,`likes`) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(
      sqlInsert,
      [embedLink, title, description, artist, genre, coverImage,0],
      (err, result) => {
        if (err) {
          console.error('Error executing INSERT query:', err);
          res.status(500).send({ error: 'Internal server error' });
          return;
        }
        res.status(200).send({ message: 'Success' });
      }
    );
  });
  
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });