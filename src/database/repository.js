const fs = require('fs/promises');

const userState = { usersTemp: [] }
async function ReadFile() {
  userState.usersTemp = JSON.parse(await fs.readFile(__dirname+'/users.json'))
}

ReadFile();

function writeFile(data) {
  fs.writeFile(__dirname+'/users.json', JSON.stringify(data));
}

module.exports = { writeFile, userState };