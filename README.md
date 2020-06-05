# @kne/egg-kong-auth

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/@kne/egg-kong-auth.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@kne/egg-kong-auth
[travis-image]: https://img.shields.io/travis/eggjs/@kne/egg-kong-auth.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/@kne/egg-kong-auth
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/@kne/egg-kong-auth.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/@kne/egg-kong-auth?branch=master
[david-image]: https://img.shields.io/david/eggjs/@kne/egg-kong-auth.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/@kne/egg-kong-auth
[snyk-image]: https://snyk.io/test/npm/@kne/egg-kong-auth/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/@kne/egg-kong-auth
[download-image]: https://img.shields.io/npm/dm/@kne/egg-kong-auth.svg?style=flat-square
[download-url]: https://npmjs.org/package/@kne/egg-kong-auth

<!--
Description here.
-->

## Install

```bash
$ npm i @kne/egg-kong-auth --save
```

## Usage

```js
// {app_root}/config/plugin.js
exports.kongAuth = {
  enable: true,
  package: '@kne/egg-kong-auth',
};
```

## Configuration

```js
// {app_root}/config/config.default.js
exports.kongAuth = {
};
```

see [config/config.default.js](config/config.default.js) for more detail.

## Example

<!-- example here -->

## Questions & Suggestions

Please open an issue [here](https://github.com/eggjs/egg/issues).

## License

[MIT](LICENSE)
