import React, {Component, PropTypes} from 'react';
import withWidth, {MEDIUM, LARGE} from 'material-ui/utils/withWidth';

import CodeExample from '../../CodeExample';

import scrollingSimpleCode from '!raw-loader!./ScrollingSimple';
import ScrollingSimple from './ScrollingSimple';

const descriptions = {
  simple: 'A simple example of scrolling behavior',
};

class TabPage extends Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
  }

  getStyles = () => {
    const styles = {
      sizeLimiter: {
        width: '100%',
        margin: '0 auto',
        border: '1px solid black',
        padding: '1rem',
        boxSizing: 'border-box',
      },
      sizeLimiterMedium: {
        width: '671px',
      },
    };

    if (this.props.width === MEDIUM || this.props.width === LARGE) {
      styles.sizeLimiter = {...styles.sizeLimiter, ...styles.sizeLimiterMedium};
    }

    return styles;
  }

  render() {
    const styles = this.getStyles();

    return (
      <div style={{margin: '24px'}}>
        <CodeExample
          title="Simple Scrolling"
          description={descriptions.simple}
          code={scrollingSimpleCode}
        >
          <div style={styles.sizeLimiter}>
            <ScrollingSimple />
          </div>
        </CodeExample>
      </div>
    );
  }
}

export default withWidth()(TabPage);
