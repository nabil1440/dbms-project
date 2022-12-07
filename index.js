const express = require('express');
const app = express();
const cors = require('cors');

// CORS middleware
app.use(cors());
// Body parser for parsing JSON
app.use(express.json());
// Body parser for URL encoded query strings
app.use(express.urlencoded({ extended: false }));

const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nabil'
});

function runQuery(query) {
  console.log(`Executing: ${query}`);
  return query;
}

app.get('/leaderboard', async (req, res) => {
  connection.query(
    runQuery(
      'SELECT players.id as id, players.name as name, goal_scored as goals, teams.name as team FROM teams RIGHT JOIN players ON teams.id=players.team_id ORDER BY goal_scored DESC;'
    ),
    async (err, results, fields) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ msg: err?.message });
      }

      // Proceed if everything else is fine
      return res.status(200).json(results);
    }
  );
});

app.get('/teams', async (req, res) => {
  connection.query(
    runQuery('SELECT * FROM teams;'),
    async (err, results, fields) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ msg: err?.message });
      }

      // Proceed if everything else is fine
      return res.status(200).json(results);
    }
  );
});

app.get('/teams/:id', async (req, res) => {
  const { id } = req.params;

  connection.query(
    runQuery(`SELECT * FROM teams WHERE id=${id} LIMIT 1;`),
    async (err, results, fields) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ msg: err?.message });
      }

      // Proceed if everything else is fine
      return res.status(200).json(results);
    }
  );
});

app.post('/teams', async (req, res) => {
  const { name } = req.body;

  const query = `INSERT INTO teams (name) VALUES('${name}');`;
  connection.query(runQuery(query), async (err, results, fields) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ msg: err?.message });
    }

    // Proceed if everything else is fine
    return res.status(200).json({ msg: 'Success!' });
  });
});

app.patch('/teams/:id', async (req, res) => {
  const { name } = req.body,
    { id } = req.params;

  connection.query(
    runQuery(`UPDATE teams SET name='${name}' WHERE id=${id}`),
    async (err, results, fields) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ msg: err?.message });
      }

      // Proceed if everything else is fine
      return res.status(200).json({ msg: 'Success' });
    }
  );
});

app.delete('/teams/:id', async (req, res) => {
  const { id } = req.params;

  connection.query(
    runQuery(`DELETE FROM teams WHERE id=${id};`),
    async (err, results, fields) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ msg: err?.message });
      }

      // Proceed if everything else is fine
      return res.status(200).json({ msg: 'Success!' });
    }
  );
});

app.get('/players', async (req, res) => {
  connection.query(
    runQuery(
      'SELECT players.id as id, players.name as name, goal_scored as goals, teams.name as team FROM players LEFT JOIN teams ON players.team_id=teams.id;'
    ),
    async (err, results, fields) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ msg: err?.message });
      }

      // Proceed if everything else is fine
      return res.status(200).json(results);
    }
  );
});

app.get('/players/:id', async (req, res) => {
  const { id } = req.params;

  connection.query(
    runQuery(
      `SELECT players.id as id, players.name as name, goal_scored as goals, teams.name as team FROM players LEFT JOIN teams ON players.team_id=teams.id HAVING id=${id} LIMIT 1;`
    ),
    async (err, results, fields) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ msg: err?.message });
      }

      // Proceed if everything else is fine
      return res.status(200).json(results);
    }
  );
});

app.post('/players', async (req, res) => {
  const { team_id, name, goal_scored } = req.body;

  connection.query(
    runQuery(
      `INSERT INTO players (name, goal_scored, team_id) VALUES ('${name}', ${goal_scored}, ${team_id});`
    ),
    async (err, results, fields) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ msg: err?.message });
      }

      // Proceed if everything else is fine
      return res.status(200).json({ msg: 'Success!' });
    }
  );
});

app.patch('/players/:id', async (req, res) => {
  const { id } = req.params,
    { team_id, name, goal_scored } = req.body;

  connection.query(
    runQuery(
      `UPDATE players SET name='${name}', goal_scored=${goal_scored}, team_id=${team_id} WHERE id=${id};`
    ),
    async (err, results, fields) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ msg: err?.message });
      }

      // Proceed if everything else is fine
      return res.status(200).json({ msg: 'Success!' });
    }
  );
});

app.delete('/players/:id', async (req, res) => {
  const { id } = req.params;

  connection.query(
    runQuery(`DELETE FROM players WHERE id=${id};`),
    async (err, results, fields) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ msg: err?.message });
      }

      // Proceed if everything else is fine
      return res.status(200).json({ msg: 'Success' });
    }
  );
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  connection.query(
    runQuery('SELECT 1+1 as solution;'),
    async (err, results, fields) => {
      if (err) console.log(err);

      console.log(results[0].solution);
    }
  );
});

connection.connect();
