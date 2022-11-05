const fs = require('fs');
const path = require('path');

const writeStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));

function getStyles() {
  fs.readdir(
    path.join(__dirname, 'styles'), { withFileTypes: true }, (error, files) => {
      if (error) {
        console.log(error);
      } else {
        files.forEach((file) => {
          if (path.extname(path.join(__dirname, 'secret-folder', file.name)) === '.css') {
            let readStream = fs.createReadStream(path.join(__dirname, 'styles', file.name));
            readStream.pipe(writeStream);
          }
        });
      }
    }
  );
}

getStyles();