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
import TabTemplate from './TabTemplate';
import InkBar from './InkBar';
import ScrollButton from './ScrollButton';

import getScrollbarHeight from '../utils/scrollbarHeight';

const getStyles = (props, context, state) => {
  const {tabType} = props;
  const {tabs} = context.muiTheme;
  const {offsetY} = state;

  return {
    root: {
      overflow: 'hidden',
      backgroundColor: tabs.backgroundColor,
    },
    scrollButtonIcon: {
      color: tabs.textColor,
      fontSize: 24,
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
     * Is the tab rendered on a large display?
     */
    isLargeView: PropTypes.bool,
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
     * What type of tab component is this?
     */
    tabType: PropTypes.oneOf(['fixed', 'scrollable', 'scrollable-buttons']),
    /**
     * Makes Tabs controllable and selects the tab whose value prop matches this prop.
     */
    value: PropTypes.any,
  };

  static defaultProps = {
    initialSelectedIndex: 0,
    onChange: () => {},
    isLargeView: false,
    tabType: 'fixed',
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  state = {
    offsetY: 0,
    selectedIndex: 0,
  };

  componentWillMount() {
    this.setState({
      offsetY: this.getOffsetY(),
    });
  }

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

  getOffsetY() {
    return ((this.props.tabType === 'fixed') ? '0px' : -getScrollbarHeight());
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
    this.setState({
      offsetY: this.getOffsetY(),
    });

    this.calculateShowScroll();
  }

  handleTabTouchTap = (value, event, tab) => {
    const valueLink = this.getValueLink(this.props);
    const index = tab.props.index;

    if ((valueLink.value && valueLink.value !== value) ||
      this.state.selectedIndex !== index) {
      valueLink.requestChange(value, event, tab);
    }

    this.setState({
      selectedIndex: index,
    });

    if (tab.props.onActive) {
      tab.props.onActive(tab);
    }

    const tabItemContainerLeft = this.tabItemContainerNode.getBoundingClientRect().left;
    const tabItemContainerRight = this.tabItemContainerNode.getBoundingClientRect().right;
    const selectedButtonLeft = this.tabComponentList[index].getLeft();
    const selectedButtonRight = selectedButtonLeft + this.tabComponentList[index].getWidth();

    if (selectedButtonLeft < tabItemContainerLeft) {
      // left side of button is out of view
      const scrollLeft = this.tabItemContainerNode.scrollLeft + (selectedButtonLeft - tabItemContainerLeft);
      scroll.left(this.tabItemContainerNode, scrollLeft);
    } else if (selectedButtonRight > tabItemContainerRight) {
      // right side of button is out of view
      const scrollLeft = this.tabItemContainerNode.scrollLeft + (selectedButtonRight - tabItemContainerRight);
      scroll.left(this.tabItemContainerNode, scrollLeft);
    }
  };

  getSelected(tab, index) {
    const valueLink = this.getValueLink(this.props);
    return valueLink.value ? valueLink.value === tab.props.value :
      this.state.selectedIndex === index;
  }

  render() {
    const {
      contentContainerClassName,
      contentContainerStyle,
      initialSelectedIndex, // eslint-disable-line no-unused-vars
      inkBarStyle,
      isLargeView,
      onChange, // eslint-disable-line no-unused-vars
      style,
      tabItemContainerStyle,
      tabTemplate,
      tabTemplateStyle,
      tabType,
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
        isLargeView,
        ref: (tabComponent) => this.tabComponentList[index] = tabComponent,
      });
    });

    const inkBarContainerWidth = tabItemContainerStyle ?
      tabItemContainerStyle.width : '100%';

    let inkBarLeft = 0;
    let inkBarWidth = 0;
    if (this.state.selectedIndex !== -1 && this.tabComponentList[this.state.selectedIndex] instanceof React.Component) {
      const containerXOffset = this.tabItemContainerNode ?
        this.tabItemContainerNode.scrollLeft - this.tabItemContainerNode.getBoundingClientRect().left : 0;
      inkBarLeft = this.tabComponentList[this.state.selectedIndex].getLeft() + containerXOffset;
      inkBarWidth = this.tabComponentList[this.state.selectedIndex].getWidth();
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
      <div style={prepareStyles(Object.assign({}, styles.root, style))} {...other}>
        <EventListener
          target="window"
          onResize={this.handleResize}
        />
        {this.tabItemContainerNode &&
          <EventListener
            target={this.tabItemContainerNode}
            onScroll={this.handleOnScroll}
          />
        }
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
            ref={(node) => this.tabItemContainerNode = node}
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

export default Tabs;
