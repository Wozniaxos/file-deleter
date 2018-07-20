const fs = require('fs');

const walkPath = './';
const txtFiles = [];
const jpgFiles = [];
const filesToDelete = [];

const putFileToProperExtension = (file) => {
  if (file.split('.').pop() === 'txt') {
    txtFiles.push(file);
  }
  if (file.split('.').pop() === 'jpg') {
    jpgFiles.push(file);
  }
};

const addFilesToDelete = () => {
  const newtxtvals = txtFiles.map(file => file.split('.')[1]);
  const newjpgvals = jpgFiles.map(file => file.split('.')[1]);
  newtxtvals.forEach((txtFile) => {
    if (!newjpgvals.includes(txtFile)) {
      filesToDelete.push(txtFile);
    }
  });
};

const walk = (dir, done) => {
  fs.readdir(dir, (error, list) => {
    if (error) {
      return done(error);
    }

    let i = 0;

    (function next () {
      let file = list[i++];

      if (!file) {
          return done(null);
      }

      file = dir + '/' + file;

      fs.stat(file, function (error, stat) {

          if (stat && stat.isDirectory()) {
              walk(file, function (error) {
                  next();
              });
          } else {
              putFileToProperExtension(file);
              next();
          }
      });
  })();
  });
};

walk(walkPath, function(error) {
    if (error) {
        throw error;
    } else {
      addFilesToDelete();
      filesToDelete.forEach((file) => {
        removeFile(file);
      })
    }
});

var removeFile = function(fileName) {
  var filepath = walkPath + '/' +fileName + '.txt';
  fs.unlink(filepath, (err) => {
    if (err) throw err;
    console.log(filepath + 'was deleted');
  });
}
