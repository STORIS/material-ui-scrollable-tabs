# **DEPRECATION NOTICE**

⚠️ **This package is NO LONGER SUPPORTED**.  All features of this package were fully ported to the v1 branch of material-ui on 2017-04-11.  You are welcome to continue using this package, but no changes will be made and no support will be offered.  You are strongly advised to upgrade to the v1 branch of material-ui if you wish to utilize the features provided by this package. As always, you may fork this repository and modify it to suit your personal needs, but pull requests will not be accepted.

# Material-UI-Scrollable-Tabs

Material-UI-Scrollable-Tabs is an extension of the Tabs component offered by [Material-UI](http://www.material-ui.com/).
It offers several additional features beyond those in the native Tabs component offered by Material-UI.

This package is not intended to be used as a standalone module and requires Material-UI to function.  It is our hope that the
features offered by this package will eventually be available from within Material-UI without the need for this extension.
In the meantime, this package will be offered so others can take advantage of these additional features.

## Additional Features

* Better adherence to [Material Design](https://material.io/guidelines/components/tabs.html#tabs-specs) tab specifications.
* Horizontally Scrollable Tabs Container
  * Scroll Methods
    * Swipe
    * Button press
    * Shift-mousewheel and other browser mechanisms for horizontally scrolling
  * Animated transitions and smooth scrolling
  * Scroll selected tab fully into view
* Multi-line wrapping labels
  * Automatically clamped with ellipses on webkit browsers
* Dynamically sized tabs (within material design guidelines)
* Large view support

## Installation
Material-UI-Scrollable-Tabs is available as an [npm package](https://www.npmjs.com/package/material-ui-scrollable-tabs):

```sh
$ npm install --save material-ui-scrollable-tabs
```

## Documentation
Material-UI-Scrollable Tabs offers the same base functionality as the [Tabs](http://www.material-ui.com/#/components/tabs) component of Material-UI as well as some additional features documented below.  See the documentation of Material-UI for information regarding the base functionality.

Live samples and documentation are available by following the instructions located [here](https://github.com/STORIS/material-ui-scrollable-tabs/blob/master/examples/README.md).

To use this extension, simply import from the appropriate module folder:
```js
import { Tabs, Tab } from 'material-ui-scrollable-tabs/Tabs';
```
To use the scrollable tabs module at the same time as the standard Material-UI tabs module, import as an alias:
```js
import { Tabs as ScrollTabs, Tab as ScrollTab } from 'material-ui-scrollable-tabs/Tabs';
```

In addition to those documented by Material-UI, this package offers the following additional props:

### Tabs Properties
| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| tabType | enum:<br />`fixed`<br />`scrollable`<br />`scrollable-buttons` | `fixed` | See descriptions of enumerations below. |

#### TabTypes
##### Fixed
Fixed tabs will behave very similarly to the native Material-UI Tabs implementation.  The tabs container will fill its parent container and each tab
will be evenly sized within that container.  The main difference in this implementation is with adherence to material design's tab sizing standards.  Tabs
will not shrink to a smaller size or grow to a larger size than material design's standards call for.  Therefore, tabs may not fill their entire container
(if constrained by the maximum width) and they might overflow their container (if constrained by the minimum width).  If tabs overflow their container then
the overflowed tabs will be clipped.

##### Scrollable
Scrollable tabs provide the ability to have a horizontally scrolling tab container.  Each tab will be sized to its content within the size limitations of
material design's tab standards.  If the tabs overflow their container, the user will be able to access those not presently visible via a horizontal
scroll mechanism (e.g touch swipe, shift-mousewheel, etc.)

##### Scrollable-Buttons
This behavior is an extension of the scrollable behavior.  In addition to the features of the scrollable tab type, left and right buttons to scroll the
tab container in that direction are provided.  This would be primarily for desktop environments where touch swipes are unavailable.

### Tab Properties
| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| isMultiLine | bool | false | If true, label will alter its style and attempt to wrap to multiple lines.  On webkit* enabled browsers, the text will only wrap to two lines and clamp with an ellipse.

<sub>\* For non-webkit enabled browsers, text will wrap until it fills the height of the tab.  Material design standards do not allow for more than 2 lines of
text wrapping (and no wrapping at all with icons) so you should probably change your application if this is happening.</sub>

## Roadmap

The future plans and high priority features and enhancements can be found
in the [ROADMAP.md](https://github.com/STORIS/material-ui-scrollable-tabs/blob/master/ROADMAP.md) file.

## Contribute

At this time, we are not actively seeking contributors.  We suggest you make contributions to
[Material-UI](https://github.com/callemall/material-ui) instead.  If you encounter issues, please feel free to
[log](https://github.com/STORIS/material-ui-scrollable-tabs/issues/new) it.

## Thanks

Thank you to [Call-Em-All](https://www.call-em-all.com/) and the other contributors of Material-UI for their
work on an excellent set of UI components.

## License
This project is licensed under the terms of the
[MIT license](https://github.com/STORIS/material-ui-scrollable-tabs/blob/master/LICENSE).
