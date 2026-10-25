const { createServer } = require('./app');
const PORT = process.env.PORT || 3000;
createServer().listen(PORT, () => console.log(`Running at http://localhost:${PORT}`));
