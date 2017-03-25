import React, {
  Component,
  cloneElement,
  Children,
  isValidElement,
  PropTypes,
} from 'react';
import EventListener from 'react-event-listener';
import warning from 'warning';
import scroll from 'scroll';
import ScrollbarSize from 'react-scrollbar-size';
import withWidth, {LARGE} from 'material-ui/utils/withWidth';
import TabTemplate from './TabTemplate';
import InkBar from './InkBar';
import ScrollButton from './ScrollButton';

const getStyles = (props, context, state) => {
  const {tabType} = props;
  const {tabs} = context.muiTheme;
  const {offsetY} = state;

  return {
    root: {
      overflow: 'hidden',
      backgroundColor: tabs.backgroundColor,
    },
    tabItemContainer: {
      flex: '1 1 auto',
      width: (tabType === 'fixed') ? '100%' : 'auto',
      whiteSpace: 'nowrap',
      display: 'inline-block',
      overflowX: (tabType === 'fixed') ? 'hidden' : 'scroll',
      marginBottom: offsetY,
    },
  };
};

class Tabs extends Component {
  static propTypes = {
    /**
     * Should be used to pass `Tab` components.
     */
    children: PropTypes.node,
    /**
     * The css class name of the root element.
     */
    className: PropTypes.string,
    /**
     * The css class name of the content's container.
     */
    contentContainerClassName: PropTypes.string,
    /**
     * Override the inline-styles of the content's container.
     */
    contentContainerStyle: PropTypes.object,
    /**
     * Specify initial visible tab index.
     * If `initialSelectedIndex` is set but larger than the total amount of specified tabs,
     * `initialSelectedIndex` will revert back to default.
     * If `initialSelectedIndex` is set to any negative value, no tab will be selected intially.
     */
    initialSelectedIndex: PropTypes.number,
    /**
     * Override the inline-styles of the InkBar.
     */
    inkBarStyle: PropTypes.object,
    /**
     * Called when the selected value change.
     */
    onChange: PropTypes.func,
    /**
     * Override the inline-styles of the root element.
     */
    style: PropTypes.object,
    /**
     * Override the inline-styles of the tab-labels container.
     */
    tabItemContainerStyle: PropTypes.object,
    /**
     * Override the default tab template used to wrap the content of each tab element.
     */
    tabTemplate: PropTypes.func,
    /**
     * Override the inline-styles of the tab template.
     */
    tabTemplateStyle: PropTypes.object,
    /**
     * The type of tab component:
     *
     * `fixed` will fill the container and each tab will be the same size.
     *
     * `scrollable` will invoke scrolling properties and allow for horizontally scrolling (or swiping) the tab bar.
     *
     * `scrollable-buttons` adds clickable buttons to a scrollable tab bar.
     */
    tabType: PropTypes.oneOf(['fixed', 'scrollable', 'scrollable-buttons']),
    /**
     * Makes Tabs controllable and selects the tab whose value prop matches this prop.
     */
    value: PropTypes.any,
    /**
     * @ignore
     */
    width: PropTypes.number.isRequired,
  };

  static defaultProps = {
    initialSelectedIndex: 0,
    onChange: () => {},
    tabType: 'fixed',
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  state = {
    selectedTabLeft: 0,
    selectedTabWidth: 0,
    offsetY: 0,
    selectedIndex: 0,
  };

  componentDidMount() {
    const valueLink = this.getValueLink(this.props);
    const initialIndex = this.props.initialSelectedIndex;
    /**
     * setting inkbar position and width requires the DOM to have been rendered so
     * multiple renderings will be required when mounting
     */
    this.setState({ // eslint-disable-line react/no-did-mount-set-state
      selectedIndex: valueLink.value !== undefined ?
        this.getSelectedIndex(this.props) :
        initialIndex < this.getTabCount() ?
          initialIndex :
          0,
    });

    this.calculateShowScroll();
  }

  componentWillReceiveProps(newProps, nextContext) {
    const valueLink = this.getValueLink(newProps);
    const newState = {
      muiTheme: nextContext.muiTheme || this.context.muiTheme,
    };

    if (valueLink.value !== undefined) {
      newState.selectedIndex = this.getSelectedIndex(newProps);
    }

    this.setState(newState);
  }

  tabComponentList = [];

  calculateShowScroll = () => {
    const showLeftScroll = this.tabItemContainerNode.scrollLeft > 0;
    const showRightScroll = (
      this.tabItemContainerNode.scrollWidth >
      this.tabItemContainerNode.clientWidth + this.tabItemContainerNode.scrollLeft
    );

    if (showLeftScroll !== this.state.showLeftScroll || showRightScroll !== this.state.showRightScroll) {
      this.setState({
        showLeftScroll,
        showRightScroll,
      });
    }
  }

  getTabs(props = this.props) {
    const tabs = [];

    Children.forEach(props.children, (tab) => {
      if (isValidElement(tab)) {
        tabs.push(tab);
      }
    });

    return tabs;
  }

  getTabCount() {
    return this.getTabs().length;
  }

  // Do not use outside of this component, it will be removed once valueLink is deprecated
  getValueLink(props) {
    return props.valueLink || {
      value: props.value,
      requestChange: props.onChange,
    };
  }

  getSelectedIndex(props) {
    const valueLink = this.getValueLink(props);
    let selectedIndex = -1;

    this.getTabs(props).forEach((tab, index) => {
      if (valueLink.value === tab.props.value) {
        selectedIndex = index;
      }
    });

    return selectedIndex;
  }

  handleOnScroll = () => {
    this.calculateShowScroll();
  }

  handleLeftScrollTouchTap = () => {
    const scrollLeft = this.tabItemContainerNode.scrollLeft - this.tabItemContainerNode.clientWidth;
    scroll.left(this.tabItemContainerNode, scrollLeft);
    this.calculateShowScroll();
  }

  handleRightScrollTouchTap = () => {
    const scrollLeft = this.tabItemContainerNode.scrollLeft + this.tabItemContainerNode.clientWidth;
    scroll.left(this.tabItemContainerNode, scrollLeft);
    this.calculateShowScroll();
  }

  handleResize = () => {
    this.calculateShowScroll();
  }

  handleScrollbarSizeChange = ({scrollbarHeight}) => {
    this.setState({
      offsetY: -scrollbarHeight,
    });
  }

  handleTabTouchTap = (value, event, tab) => {
    const valueLink = this.getValueLink(this.props);
    const index = tab.props.index;

    if ((valueLink.value && valueLink.value !== value) ||
      this.state.selectedIndex !== index) {
      valueLink.requestChange(value, event, tab);
    }

    if (tab.props.onActive) {
      tab.props.onActive(tab);
    }

    this.scrollIntoView(index, tab);

    if (index !== this.state.selectedIndex) {
      this.setState({
        selectedIndex: index,
      });
    }
  };

  scrollIntoView = (index, tab) => {
    tab.setMeasurements(); // make sure they are up to date

    const tabItemContainerLeft = this.tabItemContainerNode.getBoundingClientRect().left;
    const tabItemContainerRight = this.tabItemContainerNode.getBoundingClientRect().right;
    const selectedButtonLeft = this.tabComponentList[index].measurements.tabLeft;
    const selectedButtonRight = selectedButtonLeft + this.tabComponentList[index].measurements.tabWidth;

    if (this.props.tabType !== 'fixed') {
      if (selectedButtonLeft < tabItemContainerLeft) {
        // left side of button is out of view
        const scrollLeft = this.tabItemContainerNode.scrollLeft + (selectedButtonLeft - tabItemContainerLeft);
        scroll.left(this.tabItemContainerNode, scrollLeft);
      } else if (selectedButtonRight > tabItemContainerRight) {
        // right side of button is out of view
        const scrollLeft = this.tabItemContainerNode.scrollLeft + (selectedButtonRight - tabItemContainerRight);
        scroll.left(this.tabItemContainerNode, scrollLeft);
      }
    }
  }

  getSelected(tab, index) {
    const valueLink = this.getValueLink(this.props);
    return valueLink.value ? valueLink.value === tab.props.value :
      this.state.selectedIndex === index;
  }

  setMeasurements = (measurements) => {
    if (measurements.tabWidth !== this.state.selectedTabWidth || measurements.tabLeft !== this.state.selectedTabLeft) {
      this.setState({
        selectedTabWidth: measurements.tabWidth,
        selectedTabLeft: measurements.tabLeft,
      });
    }
  };

  render() {
    const {
      contentContainerClassName,
      contentContainerStyle,
      initialSelectedIndex, // eslint-disable-line no-unused-vars
      inkBarStyle,
      onChange, // eslint-disable-line no-unused-vars
      style,
      tabItemContainerStyle,
      tabTemplate,
      tabTemplateStyle,
      tabType,
      width,
      ...other
    } = this.props;

    const {prepareStyles} = this.context.muiTheme;
    const styles = getStyles(this.props, this.context, this.state);
    const valueLink = this.getValueLink(this.props);
    const tabValue = valueLink.value;
    const tabContent = [];
    const fixedWidth = 100 / this.getTabCount();

    const tabHeight = this.getTabs().some((tab) => (tab.props.label && tab.props.icon)) ? '72px' : '48px';

    const tabs = this.getTabs().map((tab, index) => {
      warning(tab.type && tab.type.muiName === 'Tab',
        `Material-UI: Tabs only accepts Tab Components as children.
        Found ${tab.type.muiName || tab.type} as child number ${index + 1} of Tabs`);

      warning(!tabValue || tab.props.value !== undefined,
        `Material-UI: Tabs value prop has been passed, but Tab ${index}
        does not have a value prop. Needs value if Tabs is going
        to be a controlled component.`);

      tabContent.push(tab.props.children ?
        React.createElement(tabTemplate || TabTemplate, {
          key: index,
          selected: this.getSelected(tab, index),
          style: tabTemplateStyle,
        }, tab.props.children) : undefined);

      return cloneElement(tab, {
        key: index,
        index: index,
        selected: this.getSelected(tab, index),
        height: tab.props.height || tabHeight,
        width: (tabType === 'fixed') ? `${fixedWidth}%` : 'auto',
        onTouchTap: this.handleTabTouchTap,
        isLargeView: (width === LARGE),
        onSelectedLoad: this.setMeasurements,
        ref: (tabComponent) => {
          this.tabComponentList[index] = tabComponent;
        },
      });
    });

    const inkBarContainerWidth = tabItemContainerStyle ?
      tabItemContainerStyle.width : '100%';

    let inkBarLeft = 0;
    let inkBarWidth = 0;
    if (this.state.selectedIndex !== -1 && this.tabComponentList[this.state.selectedIndex] instanceof React.Component) {
      const containerXOffset = this.tabItemContainerNode ?
        this.tabItemContainerNode.scrollLeft - this.tabItemContainerNode.getBoundingClientRect().left : 0;
      inkBarLeft = this.state.selectedTabLeft + containerXOffset;
      inkBarWidth = this.state.selectedTabWidth;
    }

    const inkBar = (
      <div style={{width: inkBarContainerWidth}}>
        <InkBar
          left={`${inkBarLeft}px`}
          width={`${inkBarWidth}px`}
          style={inkBarStyle}
        />
      </div>
    );

    return (
      <div style={prepareStyles(Object.assign({}, style))} {...other}>
        {(tabType === 'scrollable-buttons') ?
          <EventListener
            target="window"
            onResize={this.handleResize}
          /> :
          null
        }
        {this.tabItemContainerNode &&
          <EventListener
            target={this.tabItemContainerNode}
            onScroll={this.handleOnScroll}
          />
        }
        {tabType !== 'fixed' ?
          <ScrollbarSize
            onLoad={this.handleScrollbarSizeChange}
            onChange={this.handleScrollbarSizeChange}
          /> :
          null
        }
        <div style={prepareStyles(Object.assign({}, styles.root))}>
          <div style={{display: 'flex'}}>
            {(tabType === 'scrollable-buttons') ?
              <ScrollButton
                direction={'left'}
                height={tabHeight}
                onTouchTap={this.handleLeftScrollTouchTap}
                visible={this.state.showLeftScroll}
              /> :
              null
            }
            <div
              style={prepareStyles(Object.assign(styles.tabItemContainer, tabItemContainerStyle))}
              ref={(node) => {
                this.tabItemContainerNode = node;
              }}
            >
              {tabs}
              {inkBar}
            </div>
            {(tabType === 'scrollable-buttons') ?
              <ScrollButton
                direction={'right'}
                height={tabHeight}
                onTouchTap={this.handleRightScrollTouchTap}
                visible={this.state.showRightScroll}
              /> :
              null
            }
          </div>
        </div>
        <div
          style={prepareStyles(Object.assign({}, contentContainerStyle))}
          className={contentContainerClassName}
        >
          {tabContent}
        </div>
      </div>
    );
  }
}

export default withWidth()(Tabs);
