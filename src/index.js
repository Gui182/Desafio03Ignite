const express = require("express");

const { v4: uuid, validate } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function checkUuidIsValid(request, response, next) {
  const { id } = request.params
  const validateUuid = validate(id)

  if (!validateUuid) {
    return response.status(404).json({ error: "Invalid Uuid" })
  }

  request.id = id

  next()
}

function checkRepositorieExists(request, response, next) {
  const { id } = request

  const repositoryIndex = repositories.find(repository => repository.id === id);

  if (!repositoryIndex) {
    return response.status(404).json({ error: "Mensagem do erro" });
  }

  request.repositorie = repositoryIndex

  next()
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title: title,
    url: url,
    techs: techs,
    likes: 0
  };

  repositories.push(repository)

  return response.status(201).json(repository);
});

app.put("/repositories/:id", checkUuidIsValid, checkRepositorieExists, (request, response) => {

  const updatedRepository = request.body;

  const { repositorie } = request

  const repositoryIndex = repositories.indexOf(repositorie)

  const likesNoalter = repositories[repositoryIndex].likes

  const repository = { ...repositorie, ...updatedRepository };

  repositories[repositoryIndex] = repository

  repositories[repositoryIndex].likes = likesNoalter

  return response.json(repository);

});

app.delete("/repositories/:id", checkUuidIsValid, checkRepositorieExists, (request, response) => {

  const { repositorie } = request

  const repositoryIndex = repositories.indexOf(repositorie)

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", checkUuidIsValid, checkRepositorieExists, (request, response) => {

  const { repositorie } = request

  const likes = ++repositorie.likes;

  return response.json({ likes: likes });
});

module.exports = app;
