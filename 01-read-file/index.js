const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, 'text.txt');
const encoding = 'utf-8';
const input = fs.createReadStream(source, encoding);
const dataArr = [];

input.on('data', (error, data) => {
  try {
    if (error) {
      throw error;
    } else {
      dataArr.push(data);
    }
  } catch {
    console.log(error);
  }
});

input.on('end', () => {
  console.log(dataArr.join(''));
});
