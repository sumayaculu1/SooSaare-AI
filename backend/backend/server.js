const api = require("../../frontend/lib/server.cjs");

const PORT = Number(process.env.PORT) || 5000;

if (require.main === module) {
  api.createApp().listen(PORT, () => {
    console.log(`SooSaare AI API listening on http://localhost:${PORT}`);
  });
}

module.exports = api;
