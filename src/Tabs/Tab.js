import React, {Component, PropTypes} from 'react';
import EnhancedButton from 'material-ui/internal/EnhancedButton';

function getStyles(props, context) {
  const {
    icon,
    isLargeView,
    isMultiLine,
    height,
    width,
  } = props;
  const {tabs} = context.muiTheme;

  return {
    root: {
      color: props.selected ? tabs.selectedTextColor : tabs.textColor,
      minWidth: isLargeView ? '160px' : '72px',
      maxWidth: '264px',
      width,
      padding: 0,
      border: 0,
      verticalAlign: 'top',
    },
    button: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      paddingLeft: isLargeView ? '24px' : '12px',
      paddingRight: isLargeView ? '24px' : '12px',
      height,
    },
    label: {
      textOverflow: 'ellipsis',
      textTransform: 'uppercase',
      whiteSpace: 'normal',
      fontWeight: 500,
      fontSize: (isMultiLine && !icon) ? '12px' : '14px',
      overflow: 'hidden',
      display: '-webkit-box',
      WebkitLineClamp: (isMultiLine && !icon) ? 2 : 1,
      WebkitBoxOrient: 'vertical',
    },
  };
}

class Tab extends Component {
  static muiName = 'Tab';

  static propTypes = {
    /**
     * Override the inline-styles of the button element.
     */
    buttonStyle: PropTypes.object,
    /**
     * The css class name of the root element.
     */
    className: PropTypes.string,
    /**
     * @ignore
     */
    height: PropTypes.string,
    /**
     * Sets the icon of the tab, you can pass `FontIcon` or `SvgIcon` elements.
     */
    icon: PropTypes.node,
    /**
     * @ignore
     */
    index: PropTypes.any,
    /**
     * @ignore
     */
    isLargeView: PropTypes.bool,
    /**
     * Indicates that the tab should render with the mutliple lines of text styling.
     */
    isMultiLine: PropTypes.bool,
    /**
     * Sets the text value of the tab item to the string specified.
     */
    label: PropTypes.node,
    /**
     * Fired when the active tab changes by touch or tap.
     * Use this event to specify any functionality when an active tab changes.
     * For example - we are using this to route to home when the third tab becomes active.
     * This function will always recieve the active tab as it\'s first argument.
     */
    onActive: PropTypes.func,
    /**
     * @ignore
     * This property is overriden by the Tabs component.
     */
    onTouchTap: PropTypes.func,
    /**
     * @ignore
     * Defines if the current tab is selected or not.
     * The Tabs component is responsible for setting this property.
     */
    selected: PropTypes.bool,
    /**
     * Override the inline-styles of the root element.
     */
    style: PropTypes.object,
    /**
     * If value prop passed to Tabs component, this value prop is also required.
     * It assigns a value to the tab so that it can be selected by the Tabs.
     */
    value: PropTypes.any,
    /**
     * @ignore
     * This property is overriden by the Tabs component.
     */
    width: PropTypes.string,
  };

  static defaultProps = {
    isLargeView: false,
    isMultiLine: false,
  }

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  getLeft() {
    return this.buttonComponent.button.getBoundingClientRect().left;
  }

  getWidth() {
    return this.buttonComponent.button.getBoundingClientRect().width;
  }

  handleTouchTap = (event) => {
    if (this.props.onTouchTap) {
      this.onTouchTapTarget = event.currentTarget;
      this.props.onTouchTap(this.props.value, event, this);
    }
  };

  render() {
    const {
      icon,
      index, // eslint-disable-line no-unused-vars
      onActive, // eslint-disable-line no-unused-vars
      onTouchTap, // eslint-disable-line no-unused-vars
      selected, // eslint-disable-line no-unused-vars
      label,
      buttonStyle,
      isLargeView, // eslint-disable-line no-unused-vars
      isMultiLine, // eslint-disable-line no-unused-vars
      style,
      value, // eslint-disable-line no-unused-vars
      height, // eslint-disable-line no-unused-vars
      width, // eslint-disable-line no-unused-vars
      ...other
    } = this.props;

    const styles = getStyles(this.props, this.context);

    let iconElement;
    if (icon && React.isValidElement(icon)) {
      const iconProps = {
        style: {
          fontSize: 24,
          color: styles.root.color,
          paddingBottom: label ? '10px' : '0px',
          flexShrink: 0,
        },
      };
      // If it's svg icon set color via props
      if (icon.type.muiName !== 'FontIcon') {
        iconProps.color = styles.root.color;
      }
      iconElement = React.cloneElement(icon, iconProps);
    }

    const rippleOpacity = 0.3;
    const rippleColor = this.context.muiTheme.tabs.selectedTextColor;

    return (
      <EnhancedButton
        {...other}
        style={Object.assign(styles.root, style)}
        focusRippleColor={rippleColor}
        touchRippleColor={rippleColor}
        focusRippleOpacity={rippleOpacity}
        touchRippleOpacity={rippleOpacity}
        onTouchTap={this.handleTouchTap}
        ref={(buttonComponent) => this.buttonComponent = buttonComponent}
      >
        <div style={Object.assign(styles.button, buttonStyle)} >
          {iconElement}
          {label ? <span style={styles.label}>{label}</span> : null }
        </div>
      </EnhancedButton>
    );
  }
}

export default Tab;
