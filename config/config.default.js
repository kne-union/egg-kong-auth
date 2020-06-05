'use strict';

/**
 * egg-kong-auth default config
 * @member Config#kongAuth
 * @property {String} SOME_KEY - some description
 */
exports.kongAuth = {
  apiKey: '',
  clientId: '',
  clientSecret: '',
  PROVISION_KEY: '',
  KONG_ADMIN: '',
  KONG_API: '',
  redirect_uri: '',
  server: {
    loginUrl: '',
    path: '/open-api/oauth2/token',
    hostname: 'account'
  },
};
