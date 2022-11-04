const fs = require('fs');
const path = require('path');

fs.readdir(
  path.join(__dirname, 'secret-folder'),
  { withFileTypes: true },
  (err, files) => {
    if (err) {
      console.log(err);
    } else {
      files.forEach((file) => {
        if (file.isFile()) {
          console.log(file.name);

          fs.stat(
            path.join(__dirname, 'secret-folder', file.name),
            (error, fileStats) => {
              if (error) console.log(error);
              console.log(fileStats.size / 1000 + ' Kb');
            }
          );
        }
      });
    }
  }
);
