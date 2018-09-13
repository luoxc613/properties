'use strict';

const express = require('express');
const app = new express();
const path = require('path');

app.use(express.static(path.resolve(__dirname, 'public')));

// Dev middleware:

const webpack = require('webpack');
const config = require('./webpack.dev.config.js');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

config.output.path = path.resolve(__dirname, './dist');
config.output.filename = 'bundle.js';

const compiler = webpack(config);
app.use(webpackDevMiddleware(compiler, { publicPath: config.output.publicPath }));
app.use(webpackHotMiddleware(compiler));

app.get('/property_lists/new', (req, res) => res.sendfile('public/index.html'));
app.get('/property_lists/:id/edit', (req, res) => res.sendfile('public/index.html'));

const port = 8081 || process.env.port;
app.listen(port, () => console.log(`Listening on ${port}`));
