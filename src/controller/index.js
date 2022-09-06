const { writeFile, userState} = require('../database/repository.js');

function getUsers(req, res) {
  const usersTemp = userState.usersTemp;
  const activeUsers = usersTemp.filter(x => x.deleted === false);
  res.status(200).json(activeUsers);
}

function getUserById(req, res) {
  const usersTemp = userState.usersTemp;
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ erro: "Invalid ID." });
    return;
  }

  const user = usersTemp.find(x => x.id === id && x.deleted === false);

  if (!user) {
    res.status(404).json({ erro: "User not found." });
    return;
  }

  res.status(200).json(user);
}

async function checkUser(user) {
  const usersTemp = userState.usersTemp;
  if (!user.nome)  return "Field 'nome' is mandatory.";
  if (!user.email) return "Field 'email' is mandatory.";

  if (typeof user.nome !== "string")  return "Field 'nome' is invalid.";
  if (typeof user.email !== "string") return "Field 'email' is invalid.";

  if (!user.nome.includes(" ")) return "Field 'nome' is incomplete.";
  if (!user.email.includes("@")) return "Field 'email' is incomplete.";

  const userExists = usersTemp.find(x => x.nome === user.nome && x.email === user.email && x.deleted === false);
  if (userExists) return "This user is already in the database";
}

async function createUser(req, res) {
  const usersTemp = userState.usersTemp;
  let newUser = req.body;

  const error = await checkUser(newUser);
  if (error) {
    res.status(400).json({ error });
    return;
  }

  newUser = {
    id: usersTemp.length + 1,
    nome: newUser.nome,
    email: newUser.email,
    deleted: false
  }
  usersTemp.push(newUser);
  await writeFile(usersTemp);

  res.status(201).send();
}

async function updateUser(req, res) {
  const usersTemp = userState.usersTemp;
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ erro: "Invalid ID." });
    return;
  }

  const user = usersTemp.find(x => x.id === id && x.deleted === false);
  if (!user) {
    res.status(404).json({ erro: "User not found." });
    return;
  }
  
  const error = await checkUser({
    nome: req.body.nome ?? user.nome,
    email: req.body.email ?? user.email,
  });
  if (error) {
    res.status(400).json({ error });
    return;
  }

  if (req.body.nome !== undefined)  user.nome = req.body.nome;
  if (req.body.email !== undefined) user.email = req.body.email;
  await writeFile(usersTemp); 

  res.status(200).json(user);
}

async function deleteUser(req, res) {
  const usersTemp = userState.usersTemp;
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ erro: "Invalid ID." });
    return;
  }

  const user = usersTemp.find(x => x.id === id && x.deleted === false);
  if (!user) {
    res.status(404).json({ erro: "User not found." });
    return;
  }

  user.deleted = true;
  await writeFile(usersTemp);
  res.status(200).json(user);
}

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser };