import 'babel-polyfill'; /* 在应用中其它任何代码执行前调用一次 */

import React from 'react';
import { render } from 'react-dom';
import Router from './router.js';

import enhanceArray from './utils/enhanceArray.js';

enhanceArray();

render((
    <Router></Router>
    ), document.getElementById('appContainer')
);
