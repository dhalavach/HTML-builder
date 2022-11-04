const fs = require('fs');
const path = require('path');

function listNames() {
  fs.readdir(
    path.join(__dirname, 'secret-folder'),
    { withFileTypes: true },
    (error, files) => {
      if (error) {
        console.log(error);
      } else {
        files.forEach((file) => {
          if (file.isFile()) {
            fs.stat(
              path.join(__dirname, 'secret-folder', file.name),
              (error, fileStats) => {
                if (error) console.log(error);
                console.log(
                  path.parse(file.name).name +
                    ' - ' +
                    path.extname(
                      path.join(__dirname, 'secret-folder', file.name)
                    ) +
                    ' - ' +
                    fileStats.size / 1000 +
                    ' Kb'
                );
              }
            );
          }
        });
      }
    }
  );
}

listNames();
