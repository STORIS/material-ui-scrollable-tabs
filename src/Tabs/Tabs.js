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
     * @ignore
     * passed by withWidth decorator
     */
    width: PropTypes.number.isRequired,
  };

  static defaultProps = {
    initialSelectedIndex: 0,
    tabType: 'fixed',
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  state = {
    offsetY: 0,
    selectedIndex: 0,
    showLeftScroll: false,
    showRightScroll: false,
  };

  componentWillMount() {
    const {
      initialSelectedIndex,
    } = this.props;
    if (initialSelectedIndex) {
      this.updateSelectedIndexState(initialSelectedIndex);
    }
  }

  componentDidMount() {
    /**
     * The size and position of the indicator is tied to the size and position of the selected tab. The
     * selected tab's size and position cannot be determined until it has been rendered.  Therefore, after
     * mounting the tabs container (and therefore mounting the selected tab) we will force an update of
     * the tabs container to cause another render of the indicator with the appropriate size and width.
     */
    this.forceUpdate();
    /**
     * Now that the tab strip has been fully rendered, determine if the scroll buttons should be shown.
     */
    this.setScrollButtonState();
    /**
     * Now that everything is sized correctly, make sure the selected tab is scrolled into view
     */
    this.scrollSelectedIntoView(this.state.selectedIndex);
  }

  componentWillReceiveProps({initialSelectedIndex}) {
    if (initialSelectedIndex !== this.props.initialSelectedIndex) {
      this.updateSelectedIndexState(initialSelectedIndex);
    }
  }

  componentDidUpdate(prevProps) {
    /**
     * If the withWidth decorator changes the viewport size then it's likely the selected tab changed size as well.
     * This means the indicator will not be the appropriate size any longer.  Force another update to ensure the
     * indicator renders at the proper size.
     */
    if (this.props.width !== prevProps.width) {
      this.forceUpdate();
    }
  }

  tabComponentList = [];

  handleLeftScrollTouchTap = () => {
    this.moveTabsScroll(-this.tabItemContainerNode.clientWidth);
  }

  handleRightScrollTouchTap = () => {
    this.moveTabsScroll(this.tabItemContainerNode.clientWidth);
  }

  handleContainerScroll = () => {
    this.setScrollButtonState();
  }

  handleWindowResize = () => {
    this.setScrollButtonState();
  }

  handleScrollbarSizeChange = ({scrollbarHeight}) => {
    this.setState({
      offsetY: -scrollbarHeight,
    });
  }

  handleTabTouchTap = (tab) => {
    const {
      index,
      onActive,
    } = tab.props;

    if (onActive) {
      onActive(tab);
    }

    this.scrollSelectedIntoView(index);

    if (index !== this.state.selectedIndex) {
      this.setState({
        selectedIndex: index,
      });
    }
  };

  getSelected(tab, index) {
    return this.state.selectedIndex === index;
  }

  getContainerMeasurements = () => {
    if (this.tabItemContainerNode instanceof Element) {
      const boundingClientRect = this.tabItemContainerNode.getBoundingClientRect();
      return {
        top: boundingClientRect.top,
        bottom: boundingClientRect.bottom,
        left: boundingClientRect.left,
        right: boundingClientRect.right,
        height: boundingClientRect.height,
        width: boundingClientRect.width,
        scrollLeft: this.tabItemContainerNode.scrollLeft,
        scrollWidth: this.tabItemContainerNode.scrollWidth,
        clientWidth: this.tabItemContainerNode.clientWidth,
      };
    } else return {};
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

  moveTabsScroll = (delta) => {
    const container = this.getContainerMeasurements();

    const nextScrollLeft = container.scrollLeft + delta;
    scroll.left(this.tabItemContainerNode, nextScrollLeft);
    this.setScrollButtonState();
  }

  scrollSelectedIntoView = (index) => {
    if (this.props.tabType !== 'fixed') {
      const tab = this.tabComponentList[index];
      const selectedButton = tab.getMeasurements();

      const container = this.getContainerMeasurements();

      if (selectedButton.left < container.left) {
        // left side of button is out of view
        const nextScrollLeft = container.scrollLeft + (selectedButton.left - container.left);
        scroll.left(this.tabItemContainerNode, nextScrollLeft);
      } else if (selectedButton.right > container.right) {
        // right side of button is out of view
        const nextScrollLeft = container.scrollLeft + (selectedButton.right - container.right);
        scroll.left(this.tabItemContainerNode, nextScrollLeft);
      }
    }
  }

  setScrollButtonState = () => {
    const container = this.getContainerMeasurements();

    const showLeftScroll = container.scrollLeft > 0;
    const showRightScroll = (container.scrollWidth > (container.clientWidth + container.scrollLeft));

    if (showLeftScroll !== this.state.showLeftScroll || showRightScroll !== this.state.showRightScroll) {
      this.setState({
        showLeftScroll,
        showRightScroll,
      });
    }
  }

  updateSelectedIndexState = (index) => {
    this.setState({
      selectedIndex: index < this.getTabCount() ? index : 0,
    });
  }

  render() {
    const {
      contentContainerClassName,
      contentContainerStyle,
      initialSelectedIndex, // eslint-disable-line no-unused-vars
      inkBarStyle,
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
    const tabContent = [];
    const fixedWidth = 100 / this.getTabCount();

    const tabHeight = this.getTabs().some((tab) => (tab.props.label && tab.props.icon)) ? '72px' : '48px';

    const tabs = this.getTabs().map((tab, index) => {
      warning(tab.type && tab.type.muiName === 'Tab',
        `Material-UI: Tabs only accepts Tab Components as children.
        Found ${tab.type.muiName || tab.type} as child number ${index + 1} of Tabs`);

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
        ref: (tabComponent) => {
          this.tabComponentList[index] = tabComponent;
        },
      });
    });

    const inkBarContainerWidth = tabItemContainerStyle ?
      tabItemContainerStyle.width : '100%';

    let inkBarLeft = 0;
    let inkBarWidth = 0;
    if (this.state.selectedIndex !== -1) {
      const tab = this.tabComponentList[this.state.selectedIndex];

      if (tab instanceof Component) {
        const tabMeasurements = tab.getMeasurements();
        const container = this.getContainerMeasurements();
        inkBarLeft = tabMeasurements.left + container.scrollLeft - container.left;
        inkBarWidth = tabMeasurements.width;
      }
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
            onResize={this.handleWindowResize}
          /> :
          null
        }
        {this.tabItemContainerNode &&
          <EventListener
            target={this.tabItemContainerNode}
            onScroll={this.handleContainerScroll}
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
