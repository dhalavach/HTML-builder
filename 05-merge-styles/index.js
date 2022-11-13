const fs = require('fs');
const path = require('path');
const { readdir } = require('fs/promises');

const writeStream = fs.createWriteStream(
  path.join(__dirname, 'project-dist', 'bundle.css')
);

async function mergeStyles(file) {
  const readStream = fs.createReadStream(
    path.join(__dirname, 'styles', file.name)
  );
  readStream.pipe(writeStream).on('error', () => {
    console.log(error); //handle error
  });
}

async function getStyles() {
  const files = await readdir(path.join(__dirname, 'styles'), {
    withFileTypes: true,
  });

  await Promise.all(
    files.map(async (file) => {
      if (path.extname(path.join(__dirname, 'styles', file.name)) === '.css') {
        await mergeStyles(file);
      }
    })
  );
}

getStyles();
