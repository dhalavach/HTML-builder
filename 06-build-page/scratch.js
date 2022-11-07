let promise = new Promise(function (resolve, reject) {
  resolve('resolved!');

  reject(new Error('test error!'));

})

let headerPromise = new Promise(function (resolve, reject) {
  resolve(fs.readFile(path.join(__dirname, 'components', 'header.html')), (error) => {
    if (error) {
      console.log(error);
    }
  });

  reject(new Error('oops!'));
})