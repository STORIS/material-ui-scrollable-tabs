import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TabPage from './components/pages/Tabs/Page';

const app = (
  <MuiThemeProvider>
    <TabPage />
  </MuiThemeProvider>
);

export default app;
