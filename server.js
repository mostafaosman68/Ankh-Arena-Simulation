import express, { json } from 'express';
import { createConnection } from 'mysql';
import cors from 'cors';

const app = express();
const PORT = 5000;


app.use(cors({
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json()); 


// MySQL Connection
const db = createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password_here',
    database: 'aal', 
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1);
    }
    console.log('Connected to MySQL database');
});

app.get('/players', async (req, res) => {
    const teamId = req.query.teamId;
    if (!teamId) return res.status(400).json({ message: "Team ID is required" });

    const players = await db.query(`SELECT * FROM player WHERE Team_ID = ?`, [teamId]);
    res.json(players);
});


app.get('/simulate', (req, res) => {
    // Query to fetch all teams
    const fetchTeamsQuery = `SELECT Team_ID, Name FROM team`;
    db.query(fetchTeamsQuery, (err, teams) => {
      if (err) return res.status(500).send(err);
  
      const simulations = teams.map((team) => {
        const played = 30; 
        const won = Math.floor(Math.random() * played);
        const drawn = Math.floor(Math.random() * (played - won));
        const lost = played - won - drawn;
        const points = won * 3 + drawn; // Win = 3 points, Draw = 1 point
  
        return {
          Team_ID: team.Team_ID,
          Name: team.Name,
          Played: played,
          Won: won,
          Drawn: drawn,
          Lost: lost,
          Points: points,
        };
      });
  
      // Update simulation table
      const updateSimulationQuery = `
        INSERT INTO simulations (Team_ID, Team, Played, Won, Drawn, Lost, Points)
        VALUES ?
        ON DUPLICATE KEY UPDATE
          Played = VALUES(Played),
          Won = VALUES(Won),
          Drawn = VALUES(Drawn),
          Lost = VALUES(Lost),
          Points = VALUES(Points)
      `;
      const values = simulations.map((sim) => [
        sim.Team_ID,
        sim.Name,
        sim.Played,
        sim.Won,
        sim.Drawn,
        sim.Lost,
        sim.Points,
      ]);
  
      db.query(updateSimulationQuery, [values], (err) => {
        if (err) return res.status(500).send(err);
        res.status(200).json(simulations); // Send updated data to the client
      });
    });
  })

// API Endpoint
app.get('/api/getUserInfo', (req, res) => {
    const { email } = req.body;
  
    console.log("API called with email:", email);
  
    if (!email) {
      console.log("Email is missing in the request.");
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }
  
    const sql = 'SELECT nameusr FROM newuser WHERE email = ?';
  
    db.query(sql, [email], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ success: false, message: 'Database error' });
      }
  
      console.log("Database query results:", results);
  
      if (results.length > 0) {
        console.log("User found:", results[0].nameusr);
        return res.json({ success: true, nameusr: results[0].nameusr });
      } else {
        console.log("No user found for the given email.");
        return res.json({ success: false, message: 'User not found.' });
        }
    });
  });
  




// API Route for Login
app.post('/api/Login', (req, res) => {
    const { email1, password1 } = req.body;

    console.log("Received Data:", req.body); 

    if (!email1 || !password1) {
        return res.status(400).json({ success: false, message: 'email and password are required' });
    }

    const query = 'SELECT * FROM newuser WHERE email = ? AND password = ?';
    db.query(query, [email1, password1], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        if (results.length > 0) {
            res.status(200).json({ success: true, message: 'Login successful!' });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    });
});


// API Route for Signup
app.post('/api/Signup', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const checkQuery = 'SELECT * FROM newuser WHERE email = ?';
    db.query(checkQuery, [email], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        if (results.length > 0) {
            return res.status(409).json({ success: false, message: 'Email already exists' });
        }

        const insertQuery = 'INSERT INTO newuser (nameusr, email, password) VALUES (?, ?, ?)';
        db.query(insertQuery, [name, email, password], (err) => {
            if (err) {
                console.error('Error inserting user into database:', err);
                return res.status(500).json({ success: false, message: 'Database error' });
            }

            res.status(201).json({ success: true, message: 'Signup successful!' });
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
