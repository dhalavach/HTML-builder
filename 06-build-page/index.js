const fs = require('fs');
const path = require('path');
const { Transform, pipeline } = require('stream');

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


async function buildHtml() {

  function readHeader() {
    return new Promise(function (resolve, reject) {
      fs.readFile(path.join(__dirname, 'components', 'header.html'), { encoding: 'utf-8' }, function (err, data) {
        if (err) {
          console.log('Error reading file: ' + err)
          reject(err);
        }
        else {
          setTimeout(function () {
            resolve(data);
          }, 0)
        }
      });
    })
  }

  const header = await readHeader();
  // const articles = await readArticles();


  const rs = fs.createReadStream(path.join(__dirname, 'template.html'));
  const ws = fs.createWriteStream(path.join(destination, 'index.html'));



  const articles = fs.readFileSync(path.join(__dirname, 'components', 'articles.html'), (err) => {
    if (err) console.log(err);
  });

  const footer = fs.readFileSync(path.join(__dirname, 'components', 'footer.html'), (err) => {
    if (err) console.log(err);
  });

  const transform = new Transform({
    transform(chunk, enc, cb) {

      this.push(chunk.toString()
        .replace(/{{header}}/, `${header}`)
        .replace(/{{articles}}/, `${articles}`)
        .replace(/{{footer}}/, `${footer}`));
      cb();

    }
  })

  pipeline(
    rs,
    transform,
    ws,

    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('piping...')
      }
    }
  );
}


buildPage();


