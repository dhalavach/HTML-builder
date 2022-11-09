const fs = require('fs');
const path = require('path');

const input = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');
const { stdout } = process;
input.on('data', (error, data) => {
  try {
    if (error) {
      throw error;
    } else {
      stdout.write(data);
    }
  } catch {
    console.log(error);
  }
});
