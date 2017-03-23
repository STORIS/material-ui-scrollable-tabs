import React from 'react';
import {render} from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import WebFont from 'webfontloader';

import normalize from 'normalize.css'; // eslint-disable-line no-unused-vars
import main from 'www/css/main.css'; // eslint-disable-line no-unused-vars

import app from './app';

const webfontCb = () => {
  if (process.env.NODE_ENV === 'development') {
		// attach react dev tools to window
    if (typeof window !== 'undefined') {
      window.React = React;
    }
  }

	// inject tap event, currently not provided by react, required by material-ui
  injectTapEventPlugin();

  render(
    app,
		document.querySelector('#main'),
	);
};

/**
 * material-ui-scrollable-tabs requires measurements of DOM elements in order to determine how
 * to properly render other DOM elements.  Since browsers may render DOM elements with the default
 * font prior to downloading web fonts, these measurements may end up initially incorrect until the
 * web font has been loaded.  Therefore, it is imperative that the web fonts (such as Roboto) are
 * loaded prior to the application rendering DOM elements.  This example uses webfontloader to ensure
 * that Roboto has been downloaded prior to the application running.
 */
const webFontConfig = {
  google: {
    families: ['Roboto:300,400,500'],
  },
  classes: false,
  timeout: 1000,
  active: webfontCb,
  inactive: webfontCb,
};

WebFont.load(webFontConfig);
