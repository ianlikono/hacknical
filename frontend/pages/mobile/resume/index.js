/* eslint global-require: "off" */

import React from 'react';
import ReactDOM from 'react-dom';
import ResumeMobileShare from './container';

const renderApp = (domId, props = {}) => {
  const DOM = document.getElementById(domId);
  ReactDOM.render(
    <ResumeMobileShare {...props} />,
    DOM
  );
};

export default renderApp;
