const database = require("./database");

const getMovies = (req, res) => {
  let sql = "select * from movies";
  const sqlValues = [];

  if(req.query.color != null){
    sql += " where color = ?";
    sqlValues.push(req.query.color);
    if(req.query.max_duration != null){
      sql += " and duration <= ?";
      sqlValues.push(req.query.max_duration);
    }
  }
  else if(req.query.max_duration != null){
    sql += " where duration <= ?";
    sqlValues.push(req.query.max_duration);
  }
  database
    .query(sql, sqlValues)
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


const postMovie = (req, res) => {
  const { title, director, year, color, duration } = req.body;
  database
    .query(
      "INSERT INTO movies (title, director, year, color, duration) VALUEs (?,?,?,?,?)",
      [title, director, year, color, duration]
    )
    .then(([result]) => {
      res.location(`/api/movies/${result.instertId}`).sendStatus(201);
    })
    .catch(() => {
      res.status(500).send("Error saving the movie");
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


const deleteMovie = (req, res) => {
  const id = parseInt(req.params.id);
  database.query("delete from movies where id = ?", [id])
  .then(([movie])=>{
    if(movie.affectedRows === 0){
      res.status(404).send("Not Found");
    } else {
      res.sendStatus(204);
    }
  })
  .catch((err)=>{
    console.log(err);
    res.status(500).send("Error deleting the movie");
  });
}


module.exports = {
  getMovies,
  getMovieById,
  postMovie,
  putMovie,
  deleteMovie,
};
