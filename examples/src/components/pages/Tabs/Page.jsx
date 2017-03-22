import React, {Component, PropTypes} from 'react';
import withWidth, {MEDIUM, LARGE} from 'material-ui/utils/withWidth';

import CodeExample from '../../CodeExample';

import scrollingSimpleCode from '!raw-loader!./ScrollingSimple';
import ScrollingSimple from './ScrollingSimple';

const descriptions = {
  simple: 'A simple example of scrolling behavior without desktop scroll buttons. ' +
  'Since the labels are short, the tabs will shrink to the mimimum size of 72px.',
};

class TabPage extends Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
  }

  getStyles = () => {
    const styles = {
      root: {
        margin: '1rem',
      },
      headline: {
        fontSize: 24,
        marginBottom: 12,
        fontWeight: 400,
      },
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
      <div style={styles.root}>
        <h2 style={styles.headline}>Tips for using examples:</h2>
        <p>
          Desktop Browsers: Use shift-mousewheel while hovering a tab strip to scroll the tabs horizontally.<br />
          Mobile Browsers: Use swipe gestures on a tab strip to scroll the tabs horizontally.
        </p>
        <CodeExample
          title="Simple Scrolling (no desktop buttons)"
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
