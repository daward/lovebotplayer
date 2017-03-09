let express = require('express');
let bodyParser = require('body-parser');
let _ = require('lodash');
let random = require('../strategy/random');
let goodguess = require('../strategy/goodguess');

module.exports = {
  start: (logRequests) => {
    let strategy = goodguess;

    let app = express();

    app.use(bodyParser.json());

    if (logRequests) {
      app.use((req, res, next) => {
        console.log(`API for '${req.body.player.number}' received call: ${JSON.stringify(req.body.player).substring(0, 60)} ...`);
        next();
      });
    }

    app.post('/api/takeTurn', (req, res) => {
      strategy(req.body.player, req.body.opponents)
        .then(result => res.json(result));
    });

    let port = 8080;
    app.listen(port, () => {
      console.log('Player api listening on port: ' + port)
    });
  }
};