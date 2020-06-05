module.exports = app => {
  app.kongAuthServer = app.config.kongAuth.server;
};
