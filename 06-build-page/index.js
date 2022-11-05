const fs = require('fs');
const path = require('path');

const destination = path.join(__dirname, 'project-dist');
const writeStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));


function buildPage() {
  makeDir();
  bundleStyles();
  copyAssets();
}

function makeDir() {
  fs.mkdir(destination, { recursive: true }, (err) => {
    if (err) console.error(err);
  });
}

// fs.access(destination, (error) => {
//   error ? makeDir() : fs.rm(destination, { recursive: true, force: true }, () => {
//     makeDir();
//   });
// });

function bundleStyles() {
  fs.readdir(
    path.join(__dirname, 'styles'), { withFileTypes: true }, (error, files) => {
      if (error) {
        console.log(error);
      } else {
        files.forEach((file) => {
          if (path.extname(path.join(__dirname, 'styles', file.name)) === '.css') {
            let readStream = fs.createReadStream(path.join(__dirname, 'styles', file.name));
            readStream.pipe(writeStream);
          }
        });
      }
    }
  );
}

function copyAssets() {
  let assetsOutputFolder = path.join(destination, 'assets');

  fs.access(assetsOutputFolder, (error) => {
    error
      ? copy()
      : fs.rm(assetsOutputFolder, { recursive: true, force: true }, () => {
        copy();
      });
  });

  function copy() {
    fs.mkdir(assetsOutputFolder, { recursive: true }, (err) => {
      if (err) console.error(err);
    });
    fs.readdir(
      path.join(__dirname, 'assets'),
      { withFileTypes: true, recursive: true },
      (error, files) => {
        if (error) {
          console.log(error);
        } else {
          files.forEach((file) => {
            if (file.isFile()) {
              fs.createReadStream(
                path.join(__dirname, 'assets', file.name)
              ).pipe(fs.createWriteStream(path.join(assetsOutputFolder, file.name)));
            }
          });
        }
      }
    );
  }

}




buildPage();


