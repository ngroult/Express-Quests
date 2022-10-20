const database = require("./database");

const getMovies = (req, res) => {
  database
    .query("select * from movies")
    .then(([movies]) => {
      res.json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database.");
    });
};

const getMovieById = (req, res) => {
  const id = parseInt(req.params.id);
  database
    .query("select * from movies where id = ?", [id])
    .then(([movies]) => {
      if (movies[0] != null) {
        res.json(movies[0]);
      } else {
        res.status(404).send("Not Found");
      }
    })
    .catch(() => {
      res.status(500).send("Error retrieving data from database.");
    });
};

const getUsers = (req, res) => {
  database
    .query("select * from users")
    .then(([users]) => {
      res.json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database.");
    });
};

const getUserById = (req, res) => {
  const id = parseInt(req.params.id);
  database
    .query("select * from users where id = ?", [id])
    .then(([users]) => {
      if (users[0] != null) {
        res.json(users[0]);
      } else {
        res.status(404).send("Not Found");
      }
    })
    .catch(() => {
      res.status(500).send("Error retrieving data from database.");
    });
};

const postMovie = (req, res) => {
  const { title, director, year, color, duration } = req.body;
  // console.log(req.body);
  database
    .query(
      "INSERT INTO movies (title, director, year, color, duration) VALUEs (?,?,?,?,?)",
      [title, director, year, color, duration]
    )
    .then(([result]) => {
      // console.log(result.insertId);
      res.location(`/api/movies/${result.instertId}`).sendStatus(201);
    })
    .catch(() => {
      res.status(500).send("Error saving the movie");
    });
};

const postUser = (req, res) => {
  const { firstname, lastname, email, city, language } = req.body;
  database
    .query(
      "INSERT INTO users (firstname, lastname, email, city, language) VALUES (?,?,?,?,?)",
      [firstname, lastname, email, city, language]
    )
    .then(([result]) => {
      res.location(`/api/users/${result.insertId}`).sendStatus(201);
    })
    .catch(() => {
      res.status(500).send("Error saving the user");
    });
};

const putMovie = (req, res) => {
  const id = parseInt(req.params.id);
  const { title, director, year, color, duration } = req.body;
  database
    .query(
      "UPDATE movies set title = ?, director = ?, year = ?, color = ?, duration = ? where id = ?",
      [title, director, year, color, duration, id]
    )
    .then(([movie]) => {
      if (movie.affectedRows === 0) {
        res.status(404).send("Not Found");
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error updating the movie");
    });
};

const putUser = (req, res) => {
  const id = parseInt(req.params.id);
  const { firstname, lastname, email, city, language } = req.body;

  database
    .query(
      "update users set firstname = ?, lastname = ?, email = ?, city = ?, language = ? where id = ?",
      [firstname, lastname, email, city, language, id]
    )
    .then(([user]) => {
      if (user.affectedRows === 0) {
        res.status(404).send("Not Found");
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error updating the user");
    });
};

module.exports = {
  getMovies,
  getMovieById,
  getUsers,
  getUserById,
  postMovie,
  postUser,
  putMovie,
  putUser,
};
