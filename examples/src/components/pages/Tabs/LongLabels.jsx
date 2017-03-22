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

const LongLabels = () => (
  <Tabs tabType={'scrollable-buttons'}>
    <Tab
      label="Tab 1 - This has a long label"
    >
      <div>
        <h2 style={styles.headline}>Tab One</h2>
        <p>
          This tab has a long label but it fits within the maximum size for a tab.
          This is a valid use of a longer tab label.
        </p>
      </div>
    </Tab>
    <Tab
      label="Tab 2 - This also has a very long label"
    >
      <div>
        <h2 style={styles.headline}>Tab Two</h2>
        <p>
          This tab has a very long label and will clamp with an ellipsis on webkit browsers and wrap to a second line
          on non-webkit browsers.  The webkit clamping is added as a convenience and is not really standard nor is
          allowing the text to wrap to the next line. You should be using a multi-line label in this scenario
          (see that example later).
        </p>
      </div>
    </Tab>
    {/* eslint-disable max-len  */}
    <Tab
      label="Tab 3 - This label is so long that non-webkit browsers won't really handle it gracefully. You shouldn't try to make your application do this because it's against material design standards!"
    >
      {/* eslint-enable */}
      <div>
        <h2 style={styles.headline}>Tab Three</h2>
        <p>
          This tab has such a long label that on non-webkit browsers it will fill the button and there won't
          be enough space to fit the entire label.  You shouldn't ever create labels this long as it violates
          material design standards (and probably isn't a good idea anyway!)
        </p>
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

export default LongLabels;
