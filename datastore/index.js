const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((error, id) =>{
    var filePath = path.join(exports.dataDir, `${id}.txt`);
    fs.writeFile(filePath, text, (error) => {
      if (error) {
        callback(error);
      } else {
        callback(null, { id, text });
      }
    });

  });
};

exports.readAll = (callback) => {

  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('error reading');
    }
    var data = _.map(files, (file) => {
      var id = path.basename(file, '.txt');
      return { id: id, text: id };
    });
    // console.log(files);
    // var results = [];
    // files.forEach((file) => {
    //   // var id = path.basename(file).slice(0, 5);
    //   console.log('individual file: ', file.slice(0, 5));
    //   results.push({ id: file.slice(0, 5), text: file.slice(0, 5)});
    // });
    // console.log(results)
    // return results;
    // });

    callback(null, data);
  });
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
