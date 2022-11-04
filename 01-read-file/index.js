/* eslint-disable */
const fs = require('fs');
const path = require('path');

// fs.readFile(path.join(__dirname, "text.txt"), "utf-8", (error, data) => {
//   if (error) throw error;
//   console.log(data);
// });

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
