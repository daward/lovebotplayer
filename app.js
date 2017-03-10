let express = require('express');
let bodyParser = require('body-parser');
let _ = require('lodash');

module.exports = {
  start: (port, logRequests, strategies) => {

    let app = express();

    app.use(bodyParser.json());

    if (logRequests) {
      app.use((req, res, next) => {
        console.log(`API for '${req.body.player.number}' received call: ${JSON.stringify(req.body.player).substring(0, 60)} ...`);
        next();
      });
    }

    app.post('/api/strategies/:id', (req, res) => {
      let strategy = strategies[parseInt(req.params.id)];
      Promise.resolve(strategy(req.body.player, req.body.opponents))
        .then(result => res.json(result));
    });

    app.listen(port, () => {
      console.log('Player api listening on port: ' + port);
    });
  }
};