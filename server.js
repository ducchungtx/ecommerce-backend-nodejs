const app = require('./src/app');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Webservice ecommerce start with port: ${PORT}`);
});

// Ctrl + C
process.on('SIGINT', () => {
  server.close(() => console.log(`Exit Server`));
  // notify something example server crash
});
