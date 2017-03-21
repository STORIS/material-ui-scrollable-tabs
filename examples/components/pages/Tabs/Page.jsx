import React, {Component} from 'react';

import CodeExample from '../../CodeExample';

import scrollingSimpleCode from '!raw-loader!./ScrollingSimple';
import ScrollingSimple from './ScrollingSimple';

const descriptions = {
  simple: 'A simple example of scrolling behavior',
};

class TabPage extends Component {
  render() {
    return (
      <div>
        <CodeExample
          title="Simple Scrolling"
          description={descriptions.simple}
          code={scrollingSimpleCode}
        >
          <ScrollingSimple />
        </CodeExample>
      </div>
    );
  }
}

export default TabPage;
