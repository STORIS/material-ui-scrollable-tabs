import React from 'react';
import {Tabs, Tab} from 'material-ui-scrollable-tabs/Tabs';

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
};

const FixedMaxSize = () => (
  <Tabs>
    <Tab
      label="Tab 1"
    >
      <div>
        <h2 style={styles.headline}>Tab One</h2>
        <p>This is the first tab.</p>
      </div>
    </Tab>
    <Tab
      label="Tab 2"
    >
      <div>
        <h2 style={styles.headline}>Tab Two</h2>
        <p>This is the second tab.</p>
      </div>
    </Tab>
  </Tabs>
);

export default FixedMaxSize;
