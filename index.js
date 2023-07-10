const server = require('./api/server.js');

const { PORT } = require('./config');

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});