//fetch the data from the api
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import App from './src/components/App';

const serverRender = () => {
  return new Promise((resolve) => {
    resolve({
      initialMarkup: ReactDOMServer.renderToString(<App />),
    });
  });
};

export default serverRender;