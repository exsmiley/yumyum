const lib = require('lib')({token: process.env.STDLIB_TOKEN});

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
* Duck Duck Goose :O
* @param {integer} team the binary team you're on
* @returns {string}
*/
module.exports = (team, context, callback) => {
  let num = randInt(0, 3);

  if(num != 0) {
    lib[`${context.service.identifier}.services.scores`](true, {'name': 'duck', 'team': team}, undefined, function (err, result) {
      return callback(null, `is a duck!`);
    });
  } else {
    lib[`${context.service.identifier}.services.scores`](true, {'name': 'duck', 'team': team, 'diff': -5}, undefined, function (err, result) {
      return callback(null, `is a goose!`);
    });
  }
};
