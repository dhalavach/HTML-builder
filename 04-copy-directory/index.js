const fs = require('fs');
const path = require('path');

function copyDir() {
  let destination = path.join(__dirname, 'files-copy');

  fs.access(destination, (error) => {
    error
      ? copy()
      : fs.rm(destination, { recursive: true, force: true }, () => {
          copy();
        });
  });

  function copy() {
    fs.mkdir(destination, { recursive: true }, (err) => {
      if (err) console.error(err);
    });
    fs.readdir(
      path.join(__dirname, 'files'),
      { withFileTypes: true },
      (error, files) => {
        if (error) {
          console.log(error);
        } else {
          files.forEach((file) => {
            if (file.isFile()) {
              fs.createReadStream(
                path.join(__dirname, 'files', file.name)
              ).pipe(fs.createWriteStream(path.join(destination, file.name)));
            }
          });
        }
      }
    );
  }
}

copyDir();
