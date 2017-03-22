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

const ScrollingSimpleDesktop = () => (
  <Tabs tabType={'scrollable-buttons'}>
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
    <Tab
      label="Tab 3"
    >
      <div>
        <h2 style={styles.headline}>Tab Three</h2>
        <p>This is the third tab.</p>
      </div>
    </Tab>
    <Tab
      label="Tab 4"
    >
      <div>
        <h2 style={styles.headline}>Tab Four</h2>
        <p>This is the fourth tab.</p>
      </div>
    </Tab>
    <Tab
      label="Tab 5"
    >
      <div>
        <h2 style={styles.headline}>Tab Five</h2>
        <p>This is the fifth tab.</p>
      </div>
    </Tab>
    <Tab
      label="Tab 6"
    >
      <div>
        <h2 style={styles.headline}>Tab Six</h2>
        <p>This is the sicth tab.</p>
      </div>
    </Tab>
    <Tab
      label="Tab 7"
    >
      <div>
        <h2 style={styles.headline}>Tab Seven</h2>
        <p>This is the seventh tab.</p>
      </div>
    </Tab>
    <Tab
      label="Tab 8"
    >
      <div>
        <h2 style={styles.headline}>Tab Eight</h2>
        <p>This is the eigth tab.</p>
      </div>
    </Tab>
    <Tab
      label="Tab 9"
    >
      <div>
        <h2 style={styles.headline}>Tab Nine</h2>
        <p>This is the ninth tab.</p>
      </div>
    </Tab>
    <Tab
      label="Tab 10"
    >
      <div>
        <h2 style={styles.headline}>Tab Ten</h2>
        <p>This is the tenth tab.</p>
      </div>
    </Tab>
  </Tabs>
);

export default ScrollingSimpleDesktop;
