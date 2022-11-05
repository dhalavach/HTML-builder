const fs = require('fs');
const path = require('path');

const destination = path.join(__dirname, 'project-dist');
const assetsOutputFolder = path.join(destination, 'assets');
const writeStream = fs.createWriteStream(path.join(destination, 'style.css'));


function buildPage() {
  makeDir();
  bundleStyles();
  copyAssets();
  buildHtml();
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

          //TODO replace fs.cp with another method to copy folder
          // fs.cp(path.join(__dirname, 'assets'), assetsOutputFolder, { recursive: true }, error => {
          //   if (error) console.log(error)
          // })

          copyRecursively(path.join(__dirname, 'assets'), assetsOutputFolder, error => {
            if (error) console.log(error);
          })

        }
      }
    );
  }
}


function copyRecursively(src, dest, callback) {
  const copy = (copySrc, copyDest) => {
    fs.readdir(copySrc, (err, list) => {
      if (err) {
        callback(err);
        return;
      }
      list.forEach((item) => {
        const ss = path.resolve(copySrc, item);
        fs.stat(ss, (err, stat) => {
          if (err) {
            callback(err);
          } else {
            const curSrc = path.resolve(copySrc, item);
            const curDest = path.resolve(copyDest, item);

            if (stat.isFile()) {
              fs.createReadStream(curSrc).pipe(fs.createWriteStream(curDest));
            } else if (stat.isDirectory()) {
              fs.mkdirSync(curDest, { recursive: true });
              copy(curSrc, curDest);
            }
          }
        });
      });
    });
  };

  fs.access(dest, (err) => {
    if (err) {
      fs.mkdirSync(dest, { recursive: true });
    }
    copy(src, dest);
  });
};


function buildHtml() {
  let ws = fs.createWriteStream(path.join(destination, 'index.html'));
  let rs = fs.createReadStream(path.join(__dirname, 'template.html'));
  rs.pipe(ws);


}


buildPage();


