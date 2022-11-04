/* eslint-disable */

const fs = require("fs");
const path = require("path");
const readline = require("node:readline");
const { stdout } = require("process");

// //1
// const { stdin, stdout } = process;
// let exitCommand = "exit";
// const output = fs.createWriteStream(path.join(__dirname, "output.txt"));
// stdout.write("Hello! Please enter the text and press ENTER: ");

// stdin.on("data", (data) => {
//   if (data.toString().toLowerCase() === exitCommand) {
//     stdout.write("Exiting... Bye! ");
//     output.close();
//     process.exit();
//   } else {
//     output.write(data);
//   }
// });

// process.on("SIGINT", () => {
//   stdout.write("Ctrl-C exiting ... Bye!");
//   output.close();
//   process.exit();
// });

//2
const writeStream = fs.createWriteStream(path.join(__dirname, "output.txt"));
const rl = readline.createInterface(process.stdin, process.stdout);
const exitCommand = "exit";

stdout.write("Enter text and press ENTER or type 'exit' to leave: ");

rl.on("line", (line) => {
  if (line.toString().toLowerCase() === exitCommand) {
    writeStream.close();
    rl.close();
    process.exit(0);
  } else {
    writeStream.write(line + "\n");
  }
});

rl.on("close", function () {
  console.log("\nBYE!");
  process.exit(0);
});
