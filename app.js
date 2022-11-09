require("dotenv").config();
const express = require("express");
const { validateMovie, validateUser } = require("./validators.js");
const { hashPassword, verifyPassword, verifyToken } = require("./auth.js");
const app = express();
app.use(express.json());

const port = process.env.APP_PORT ?? 5000;
const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);

// const isItDwight = (req, res) => {
//   if (
//     req.body.email === "dwight@theoffice.com" &&
//     req.body.password === "123456"
//   ) {
//     res.send("Credentials are valid");
//   } else {
//     res.status(401).send("Unauthorized");
//   }
// };

// app.post("/api/login", isItDwight);

const movieHandlers = require("./movieHandlers");
const userHandlers = require("./userHandlers");

app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);
app.get("/api/users", userHandlers.getUsers);
app.get("/api/users/:id", userHandlers.getUserById);
app.post("/api/users", hashPassword, userHandlers.postUser);
app.post(
  "/api/login",
  userHandlers.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword
);

app.use(verifyToken);
app.post("/api/movies", movieHandlers.postMovie);
app.put("/api/movies/:id", movieHandlers.putMovie);
app.delete("/api/movies/:id", movieHandlers.deleteMovie);
app.put("/api/users/:id", userHandlers.putUser);
app.delete("/api/users/:id", userHandlers.deleteUser);

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
