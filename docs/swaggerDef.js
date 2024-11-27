
const { version } = require('../package.json');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'Old Empolyee Api Documentation',
    version,
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT}`,
    },
  ],
};

module.exports = swaggerDef;
