const normalizeHeaderName = require('../../lib/normalizeHeaderName'),
  qs = require('qs'),
  get = require('lodash/get');

module.exports = {
  setServer(options) {
    this.app.kongAuthServer = Object.assign({}, this.app.kongAuthServer, options);
    return this.app.kongAuthServer;
  },
  async send(url, options) {
    options = Object.assign({}, options);
    normalizeHeaderName(options.headers, 'content-type');
    const {KONG_API} = this.app.config.kongAuth;
    if (!/^https?:\/\//.test(url)) {
      url = KONG_API + url;
    }

    if (typeof options.data === 'object') {
      const contentType = get(options, 'headers["content-type"]', '');
      if (contentType.indexOf('application/x-www-form-urlencoded') > -1) {
        options.data = qs.stringify(options.data);
      } else if (contentType.indexOf('application/json') > -1) {
        options.data = JSON.stringify(options.data);
      }
    }


    this.app.logger.info(JSON.stringify(Object.assign({}, options, {url})));
    const response = await this.curl(url, options);
    if (response.status !== 200) {
      throw new Error(response.data);
    }
    const contentType = get(response, '[\'headers\'][\'content-type\']', '');
    if (contentType.indexOf('json') > -1) {
      try {
        response.data = JSON.parse(response.data);
      } catch (e) {
      }
    }
    if (Buffer.isBuffer(response.data) && contentType.indexOf('text') > -1) {
      response.data = response.data.toString();
    }
    this.app.logger.info(JSON.stringify(response.data));
    return response;
  },
  async getUserToken(code) {
    const server = this.app.kongAuthServer;
    const {clientId, clientSecret, redirect_uri} = this.app.config.kongAuth;

    const url = server.path,
      options = {
        method: "POST",
        headers: {hostname: server.hostname},
        data: {
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirect_uri || this.origin,
          code,
          grant_type: 'authorization_code'
        }
      };

    const response = await this.send(url, options);

    this.session.userAccessToken = Object.assign({}, response.data, {
      time: Date.now()
    });

    return this.session.userAccessToken;
  },
  async getApiToken() {
    const server = this.app.kongAuthServer;
    const {clientId, clientSecret} = this.app.config.kongAuth;

    const url = server.path,
      options = {
        method: "POST",
        headers: {
          Authorization: `Basic ${(new Buffer(`${clientId}:${clientSecret}`)).toString('base64')}`,
          hostname: server.hostname
        },
        data: {
          grant_type: 'client_credentials'
        }
      };

    const response = await this.send(url, options);

    this.session.apiAccessToken = Object.assign({}, response.data, {
      time: Date.now()
    });

    return this.session.apiAccessToken;
  },
  async refreshToken(tokenName) {
    if (!this.session[tokenName]) {
      throw new Error('refresh_token is not exist');
    }
    const server = this.app.kongAuthServer;
    const {clientId, clientSecret} = this.app.config.kongAuth;

    const url = server.path,
      options = {
        method: "POST",
        headers: {hostname: server.hostname},
        data: {
          client_id: clientId,
          client_secret: clientSecret,
          refresh_token: this.session[tokenName].refresh_token,
          grant_type: 'refresh_token'
        }
      };

    const response = await this.send(url, options);

    this.session[tokenName] = Object.assign({}, response.data, {
      time: Date.now()
    });

    return this.session[tokenName];
  },
  async useUserToken() {
    if (!this.session.userAccessToken) {
      throw new Error('token is not exist');
    }

    if (Date.now() - this.session.userAccessToken.time > this.session.userAccessToken['expires_in']) {
      await this.refreshToken('userAccessToken');
    }

    return this.session.userAccessToken;
  },
  async useApiToken() {
    if (!this.session.apiAccessToken || Date.now() - this.session.apiAccessToken.time > this.session.apiAccessToken['expires_in']) {
      await this.getApiToken();
    }

    return this.session.apiAccessToken;
  },
  async openKeyApi(url, options) {
    const {apiKey} = this.app.config.kongAuth;
    const headers = Object.assign({}, options.headers, {
      'apiKey': apiKey
    });

    return await this.send(url, Object.assign({}, options, {
      headers
    }));
  },
  async openTokenApi(url, options) {
    const token = await this.useApiToken();

    const headers = Object.assign({}, options.headers, {
      'Authorization': `${token.token_type} ${token.access_token}`
    });

    return await this.send(url, Object.assign({}, options, {
      headers
    }));
  },
  async openUserApi(url, options) {
    const token = await this.useUserToken();
    const headers = Object.assign({}, options.headers, {
      'Authorization': `${token.token_type} ${token.access_token}`
    });

    return await this.send(url, Object.assign({}, options, {
      headers
    }));
  }
};