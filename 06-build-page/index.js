const fs = require('fs');
const path = require('path');
const { Transform, pipeline } = require('stream');

const destination = path.join(__dirname, 'project-dist');
const assetsOutputFolder = path.join(destination, 'assets');
const writeStream = fs.createWriteStream(path.join(destination, 'style.css'));

buildPage();

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

function bundleStyles() {
  fs.readdir(
    path.join(__dirname, 'styles'),
    { withFileTypes: true },
    (error, files) => {
      if (error) {
        console.log(error);
      } else {
        files.forEach((file) => {
          if (
            path.extname(path.join(__dirname, 'styles', file.name)) === '.css'
          ) {
            let readStream = fs.createReadStream(
              path.join(__dirname, 'styles', file.name)
            );
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
          copyRecursively(
            path.join(__dirname, 'assets'),
            assetsOutputFolder,
            (error) => {
              if (error) console.log(error);
            }
          );
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
              fs.mkdir(curDest, { recursive: true }, (err) => {
                if (err) console.log(err);
              });
              copy(curSrc, curDest);
            }
          }
        });
      });
    });
  };

  fs.access(dest, (err) => {
    if (err) {
      fs.mkdir(dest, { recursive: true }, (err) => {
        if (err) console.log(err);
      });
    }
    copy(src, dest);
  });
}

async function buildHtml() {
  function readComponent(component) {
    return new Promise(function (resolve, reject) {
      fs.readFile(
        path.join(__dirname, 'components', `${component}`),
        { encoding: 'utf-8' },
        function (err, data) {
          if (err) {
            console.log('Error reading file: ' + err);
            reject(err);
          } else {
            resolve(data);
          }
        }
      );
    });
  }

  function getComponentNames() {
    return new Promise(function (resolve, reject) {
      fs.readdir(
        path.join(__dirname, 'components'),
        { withFileTypes: true },
        (error, files) => {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            let result = [];
            files.forEach((file) => {
              if (file.isFile()) {
                result.push(file.name);
              }
            });
            resolve(result);
          }
        }
      );
    });
  }

  let components = await getComponentNames();
  // console.log(components)

  async function resolveComponents(components) {
    let result = new Map();
    for (let i = 0; i < components.length; i++) {
      let e = await readComponent(components[i]);
      result.set(components[i], e);
    }
    return new Promise(function (resolve) {
      resolve(result);
    });
  }

  let resolvedComponents = await resolveComponents(components);
  // console.log(resolvedComponents);

  function replaceTagsWithComponents(chunk) {
    let res = chunk;
    let i = 0;

    while (i < components.length) {
      let tag = new RegExp('{{' + components[i].slice(0, -5) + '}}');
      res = res.toString().replace(tag, resolvedComponents.get(components[i]));
      i++;
    }

    return res;
  }

  const rs = fs.createReadStream(path.join(__dirname, 'template.html'));
  const ws = fs.createWriteStream(path.join(destination, 'index.html'));
  // console.log(resolvedComponents.get(components[0]))

  const transform = new Transform({
    transform(chunk, enc, cb) {
      this.push(replaceTagsWithComponents(chunk));
      cb();
    },
  });

  pipeline(
    rs,
    transform,
    ws,

    (err) => {
      if (err) {
        console.log(err);
      }
    }
  );
}
