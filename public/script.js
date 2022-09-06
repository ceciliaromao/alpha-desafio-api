const nome = document.querySelector("#nome");
const email = document.querySelector("#email");
let table = document.querySelector("#user-table");
let saveBtn = document.querySelector("#save-btn");
let newRecord = true;
let userIdUpdate;

async function listUsers() {
  const allUsers = await fetch('http://localhost:8000/users', { method: 'GET' });
  const data = await allUsers.json();

  table.innerHTML = `
    <tr>
      <th>#ID</th>
      <th>NOME</th>
      <th>E-MAIL</th>
      <th>EDITAR</th>
      <th>EXCLUIR</th>
    </tr>
  `;
  
  if (data.length > 0) document.querySelector('.users-list').hidden = false
  if (!data.length) document.querySelector('.users-list').hidden = true

  for (let el of data) {
    table.innerHTML += `
      <tr>
        <td>${el.id}</td>
        <td id="nome-${el.id}">${el.nome}</td>
        <td id="email-${el.id}">${el.email}</td>
        <td><img src="./assets/editar.svg" alt="edit icon" onclick="editUser(${el.id})"></td>
        <td><img src="./assets/excluir.svg" alt="delete icon" onclick="deleteUser(${el.id})"></td>
      </tr>
    `
  }
}

async function createUser() {
  const newUser = await fetch('http://localhost:8000/user', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nome: `${nome.value}`,
      email: `${email.value}`
    })
  })
  .then(newUser => newUser.json())
  .then(listUsers())
  .catch(err => {
    console.log("deu erro", err);
    return undefined;
  });
  
  nome.value = '';
  email.value = '';
}

function editUser(id) {
  newRecord = false;
  nome.value = document.querySelector(`#nome-${id}`).textContent;
  email.value = document.querySelector(`#email-${id}`).textContent;
  saveBtn.innerHTML = "Atualizar";
  userIdUpdate = id;
}

async function updateUser() {
  const updatedUser = await fetch(`http://localhost:8000/user/${userIdUpdate}`, {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nome: `${nome.value}`,
      email: `${email.value}`
    })
  })
  .then(updatedUser => updatedUser.json())
  .then(listUsers())
  .catch(err => {
    console.log("deu erro", err);
    return undefined;
  });
  
  newRecord = true;
  nome.value = '';
  email.value = '';
  saveBtn.innerHTML = "Cadastrar";
}

saveBtn.addEventListener('click', (e) => {
  newRecord ? createUser() : updateUser();
  e.preventDefault();
});

async function deleteUser(id) {
  const deletedUser = await fetch(`http://localhost:8000/user/${id}`, { method: 'DELETE' })
  .then(deletedUser => deletedUser.json())
  .then(listUsers())
  .catch(err => {
    console.log("deu erro", err);
    return undefined;
  });
}

listUsers();