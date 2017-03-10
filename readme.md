While you can write a lovebot player by providing an implementation in whatever REST methodology you choose, starting with the lovebotplayer package means you only have to write a single strategy function.  In addition, some computational functions are provided in the package for you, and some basic examples to follow.

# Installation
```shell
npm install lovebotplayer --save
```

# Usage

```javascript
let lovebotPlayer = require("lovebotplayer");

// strategyDirectory and port are also supported parameters (assumed to be ./strategy and 8080 if not provided)
lovebotPlayer.start({ enableLogging: true });
```

In your strategy directory implement a function that takes in parameters and returns a move, as in the examples.