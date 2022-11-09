const fs = require('fs');
const path = require('path');
const readline = require('node:readline');
const { stdout } = require('process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const exitCommand = 'exit';
const output = 'output.txt';

stdout.write("Enter text and press ENTER or type 'exit' to leave: ");

rl.on('line', (line) => {
  if (line.toString().toLowerCase().trim() === exitCommand) {
    rl.close();
    process.exit(0);
  } else {
    fs.writeFile(
      path.resolve(__dirname, output),
      line + '\n',
      { encoding: 'utf8', flag: 'a' },
      (err) => {
        if (err) console.log(err);
      }
    );
  }
});

rl.on('close', function () {
  stdout.write('\nBYE!');
  process.exit(0);
});
