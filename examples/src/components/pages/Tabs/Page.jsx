import React, {Component, PropTypes} from 'react';
import withWidth, {MEDIUM, LARGE} from 'material-ui/utils/withWidth';

import CodeExample from '../../CodeExample';

import scrollingSimpleCode from '!raw-loader!./ScrollingSimple';
import ScrollingSimple from './ScrollingSimple';
import scrollingSimpleDesktopCode from '!raw-loader!./ScrollingSimpleDesktop';
import ScrollingSimpleDesktop from './ScrollingSimpleDesktop';
import longLabelsCode from '!raw-loader!./LongLabels';
import LongLabels from './LongLabels';
import multiLineLabelsCode from '!raw-loader!./MultiLineLabels';
import MultiLineLabels from './MultiLineLabels';

const descriptions = {
  simple: 'A simple example of scrolling behavior without desktop scroll buttons. ' +
  'If a tab isn\'t fully in view, clicking it will smoothly slide it into view. ' +
  'Since the labels are short, the tabs will shrink to the mimimum size of 72px.',
  simpleDesktop: 'A simple example of scrolling behavior with desktop scroll buttons. ' +
  'Desktop scroll buttons can be clicked to cause the tab strip to scroll left and right. ' +
  'and scrolling will be animated smoothly. ' +
  'Left and right scroll buttons will only appear if scrolling that direction is available.',
  longLabels: 'When a tab has a long label, the tab will grow to accomodate it, up to the max of 264px. ' +
  'On webkit based browsers, the text will clamp at the end of the first line with an ellipsis. ' +
  'However, on non-webkit based browsers, the text will wrap until it fills the button\'s height. ' +
  'This wrapping behavior is against material design standards and you should not use labels which wrap.',
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
        <CodeExample
          title="Simple Scrolling (with desktop buttons)"
          description={descriptions.simpleDesktop}
          code={scrollingSimpleDesktopCode}
        >
          <div style={styles.sizeLimiter}>
            <ScrollingSimpleDesktop />
          </div>
        </CodeExample>
        <CodeExample
          title="Long Tab Labels"
          description={descriptions.longLabels}
          code={longLabelsCode}
        >
          <div style={styles.sizeLimiter}>
            <LongLabels />
          </div>
        </CodeExample>
        <CodeExample
          title="Multi Line Labels"
          description={descriptions.multiLineLabels}
          code={multiLineLabelsCode}
        >
          <div style={styles.sizeLimiter}>
            <MultiLineLabels />
          </div>
        </CodeExample>
      </div>
    );
  }
}

export default withWidth()(TabPage);
