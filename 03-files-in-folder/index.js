const path = require('path');
const { readdir, stat } = require('fs/promises');

async function displayFilesInfo() {
  const folderPath = path.join(__dirname, 'secret-folder');
  const files = await readdir(folderPath, { withFileTypes: true });

  const fileInfo = await Promise.all(
    files.map(async (file) => {
      if (file.isFile()) {
        const filePath = path.join(folderPath, file.name);
        const fileExt = path.extname(file.name);
        const fileStats = await stat(filePath);
        const fileName = path.basename(filePath, fileExt);
        const fileSize = fileStats.size;
        const formattedExt = fileExt.slice(1);
        const formattedSize = (fileSize / 1024).toFixed(2) + 'Kb';

        return {
          fileName,
          extension: formattedExt,
          size: formattedSize,
        };
      } else {
        return null;
      }
    })
  );
  console.log(`Files in folder ${folderPath}`);
  console.table(fileInfo.filter(Boolean));
}

displayFilesInfo();
