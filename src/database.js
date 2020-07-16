const mongoose = require('mongoose');
const URI = 'mongodb://localhost/mern-crud-test';

mongoose.connect(URI)
  .then(db => console.log('Base de datos conectada'))
  .catch(error => console.error(error));

module.exports = mongoose;
