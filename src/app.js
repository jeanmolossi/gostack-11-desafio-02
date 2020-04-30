const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const newRepo = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

  repositories.push(newRepo);

  return response.json(newRepo);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const findRepo = repositories.findIndex( singleRepo => singleRepo.id === id );
  if( findRepo < 0 ){
    return response.status(400).json({error: 'Repository identified not found!'});
  }
  const { title, url, techs } = request.body;

  repositories[findRepo] = {
    id,
    title,
    url,
    techs,
    likes: repositories[findRepo].likes
  }

  return response.json(repositories[findRepo]);
  
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const findRepo = repositories.findIndex( singleRepo => singleRepo.id === id );
  if( findRepo < 0 ){
    return response.status(400).json({error: 'Repository identified not found!'});
  }
  repositories.splice(findRepo, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;

  const findRepo = repositories.findIndex( singleRepo => singleRepo.id === id );
  if( findRepo < 0 ){
    return response.status(400).json({error: 'Repository identified not found!'});
  }

  const repoSelected = repositories[findRepo];

  repositories[findRepo] = {
    ...repoSelected,
    likes: repoSelected.likes + 1
  }

  return response.json(repositories[findRepo]);

});

module.exports = app;
