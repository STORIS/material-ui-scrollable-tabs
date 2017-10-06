import PropTypes from 'prop-types';
import React, {Component} from 'react';
import withWidth, {MEDIUM, LARGE} from 'material-ui/utils/withWidth';

import CodeExample from '../../CodeExample';
import PropTypeDescription from '../../PropTypeDescription';

import scrollingSimpleCode from '!raw-loader!./ScrollingSimple';
import ScrollingSimple from './ScrollingSimple';
import scrollingSimpleDesktopCode from '!raw-loader!./ScrollingSimpleDesktop';
import ScrollingSimpleDesktop from './ScrollingSimpleDesktop';
import longLabelsCode from '!raw-loader!./LongLabels';
import LongLabels from './LongLabels';
import multiLineLabelsCode from '!raw-loader!./MultiLineLabels';
import MultiLineLabels from './MultiLineLabels';
import fixedSimpleCode from '!raw-loader!./FixedSimple';
import FixedSimple from './FixedSimple';
import fixedMaxSizeCode from '!raw-loader!./FixedMaxSize';
import FixedMaxSize from './FixedMaxSize';
import fixedMinSizeCode from '!raw-loader!./FixedMinSize';
import FixedMinSize from './FixedMinSize';

import tabsCode from '!raw-loader!material-ui-scrollable-tabs/Tabs/Tabs';
import tabCode from '!raw-loader!material-ui-scrollable-tabs/Tabs/Tab';

const descriptions = {
  scrollingSimple: 'A simple example of scrolling behavior without desktop scroll buttons. ' +
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
  multiLineLabels: 'Tabs with long labels can be allowed to wrap to a second line. This will shrink the ' +
  'font size.',
  fixedSimple: 'A simple example of fixed tabs (no scrolling).  Fixed tabs will be evenly sized based ' +
  'on the width of their container.  They will still shrink no smaller than the minimum tab size nor ' +
  'grow larger than the maximum tab size',
  fixedMaxSize: 'If fixed tabs hit their maximum size, they will be left-aligned within the container ' +
  'and the remainder of the container will not contain any tabs.',
  fixedMinSize: 'If fixed tabs shrink to their minimum size, they will overflow their container and the ' +
  'remaining tabs will be inaccessible.',
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
        <p>
          For additional information and examples, please visit the&nbsp;
          <a href="http://www.material-ui.com/#/components/tabs">Material-UI Tabs</a>&nbsp;documentation page.
        </p>
        <h2 style={styles.headline}>Tips for using examples:</h2>
        <p>
          Desktop Browsers: Use shift-mousewheel or click the mousewheel while hovering a tab strip to scroll the
          tabs horizontally.<br />
          Mobile Browsers: Use swipe gestures on a tab strip to scroll the tabs horizontally.
        </p>
        <CodeExample
          title="Simple Scrolling (no desktop buttons)"
          description={descriptions.scrollingSimple}
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
        <CodeExample
          title="Simple Fixed"
          description={descriptions.fixedSimple}
          code={fixedSimpleCode}
        >
          <div style={styles.sizeLimiter}>
            <FixedSimple />
          </div>
        </CodeExample>
        <CodeExample
          title="Fixed Maximum Size"
          description={descriptions.fixedMaxSize}
          code={fixedMaxSizeCode}
        >
          <div style={styles.sizeLimiter}>
            <FixedMaxSize />
          </div>
        </CodeExample>
        <CodeExample
          title="Fixed Minimum Size"
          description={descriptions.fixedMinSize}
          code={fixedMinSizeCode}
        >
          <div style={styles.sizeLimiter}>
            <FixedMinSize />
          </div>
        </CodeExample>
        <PropTypeDescription code={tabsCode} header="### Tabs Properties" />
        <PropTypeDescription code={tabCode} header="### Tab Properties" />
      </div>
    );
  }
}

export default withWidth()(TabPage);
