const fs = require('fs');
const path = require('path');

function copyDir() {
  fs.mkdir(path.join(__dirname, 'files-copy'), (err) => {
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
            fs.createReadStream(path.join(__dirname, 'files', file.name)).pipe(
              fs.createWriteStream(
                path.join(__dirname, 'files-copy', file.name)
              )
            );
          }
        });
      }
    }
  );
}

copyDir();
