const express = require('express');
const session = require('express-session');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const app = express();
const port = 3000;

//session
app.use(session({
  secret: 'secret-$)$-iw',
  resave: true,
  saveUninitialized: true
}));

//  body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'proctoring_db'
});
connection.connect(err => {
    if (err) {
      console.error('Error connecting to MySQL: ' + err.stack);
      return;
    }
    console.log('Connected to MySQL as id ' + connection.threadId);
  })

  // Middleware to check if the user is authenticated

  const upload = multer({ dest: 'uploads/' });
const isAuthenticated = (req, res, next) => {
  if (req.session.authenticated) {
    return next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    // Perform authentication (replace with your own logic)
    connection.query(`select * from users where email='${username}' and password='${password}'`,
    function (error, results, fields) {
        if (error) throw error;
        if(results.length>0){
            req.session.authenticated = results;
            console.log(results)
            res.json({ message: 'Successfully logged in.' });
        }else {
            res.status(401).json({ message: 'Password or username not valid' });
          }
     
    })
}else {
    res.status(400).json({ message: 'Password or username missing' });
  }

});

// Logout endpoint
app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session: ' + err.stack);
      res.status(500).json({ message: 'Internal Server Error' });
    } else {
      res.json({ message: 'Logout successful' });
    }
  });
});

// users for user verification
app.post('/api/users/verification', upload.single('image'), async (req, res) => {
  const userImagePath = req.file.path;
  const referenceImagePath = 'path/to/reference/image.jpg';
});



// users registration
app.post('/api/users/register', isAuthenticated, (req, res) => {
  params= req.body
  // insert registration data to users table
  connection.query("INSERT INTO users SET ? ",params, (err, results) => {
    if (err) {
      console.error('Error executing query: ' + err.stack);
      res.status(500).json({ message: 'Internal Server Error' });
    } else {
      res.json({ message: 'Registration Sucessful' });
    }
  });
});

//  view registered users
app.get('/api/users', isAuthenticated, (req, res) => {
  // Retrieve data from the database
  connection.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('Error executing query: ' + err.stack);
      res.status(500).json({ message: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});

//update users
app.put('/api/users/:id', isAuthenticated, (req, res) => {
  const { id } = req.params;
  const  data  = req.body;
  console.log(req.body)
  // Update data in the database
  connection.query('UPDATE users SET ? WHERE id = ?', [data, id], (err, results) => {
    if (err) {
      console.error('Error executing query: ' + err.stack);
      res.status(500).json({ message: 'Internal Server Error' });
    } else {
      res.json({ message: 'Data updated successfully' });
    }
  });
});

// Delete user
app.delete('/api/users/:id', isAuthenticated, (req, res) => {
  const questionId = req.params.id;
  connection.query("DELETE FROM users WHERE id = ?", questionId, (err, results) => {
    if (err) {
      console.error('Error executing query: ' + err.stack);
      res.status(500).json({ message: 'Internal Server Error' });
    } else {
      res.json({ message: 'Question deleted successfully' });
    }
  });
})

// create exam question
app.post('/api/exam', isAuthenticated, (req, res) => {
  params= req.body
  // insert registration data to users table
  connection.query("INSERT INTO exam_question SET ? ",params, (err, results) => {
    if (err) {
      console.error('Error executing query: ' + err.stack);
      res.status(500).json({ message: 'Internal Server Error' });
    } else {
      res.json({ message: 'Registration Sucessful' });
    } 
  });
});

//  view exam question
app.get('/api/exam', isAuthenticated, (req, res) => {
  connection.query('SELECT * FROM exam_question', (err, results) => {
    if (err) {
      console.error('Error executing query: ' + err.stack);
      res.status(500).json({ message: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});
// udate exam
app.put('/api/exams/:id', isAuthenticated, (req, res) => {
  const { id } = req.params;
  const  data  = req.body;
  console.log(req.body)
  // Update data in the database
  connection.query('UPDATE exam_question SET ? WHERE id = ?', [data, id], (err, results) => {
    if (err) {
      console.error('Error executing query: ' + err.stack);
      res.status(500).json({ message: 'Internal Server Error' });
    } else {
      res.json({ message: 'Data updated successfully' });
    }
  });
});


// Delete exam
app.delete('/api/exam/:id', isAuthenticated, (req, res) => {
  const questionId = req.params.id;
  connection.query("DELETE FROM exam_question WHERE id = ?", questionId, (err, results) => {
    if (err) {
      console.error('Error executing query: ' + err.stack);
      res.status(500).json({ message: 'Internal Server Error' });
    } else {
      res.json({ message: 'Question deleted successfully' });
    }
  });
})

app.listen(3000,()=>
console.log('dd')
)