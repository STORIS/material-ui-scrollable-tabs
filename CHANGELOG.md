## HEAD

## 2.0.0

This will be the last release of this library.  **USE AT YOUR OWN RISK**.  We highly suggest that you migrate
to the v1 branch of material-ui to take advantage of the features provided by this library natively within
that package.

⚠️ **This is a breaking change**. If you still use an older version of material-ui, you should stay at v1.0.0 of this component.

###### _Oct 6, 2017_

###### Component Fixes / Enhancements
- Update to material-ui 0.19.x
- - Support onClick rather than onTouchTap
- Use standalone prop-types library
- Make material-ui a peerDependency rather than a dependency
- Support React ^15.4.0 or ^16.0.0 via peerDependency

## 1.0.0

###### _Apr 12, 2017_

###### Component Fixes / Enhancements

- The scrollable behavior provided by this package has now been merged into Material-UI's [@next](https://github.com/callemall/material-ui/tree/next) branch.  As a result, it is highly unlikely that there will be any additional features added to this package.
- The isLargeView prop has been deprecated in favor of automatic viewport detection and sizing.
- valueLink has been deprecated.
- Desktop scroll buttons should now be the same color as the highlighted text.
- The scrollbar size measurement utility has been abstracted into a separate npm package: [react-scrollbar-size](https://www.npmjs.com/package/react-scrollbar-size).
- It should now be possible to import modules from the main `index.js` rather than having to import from the `Tabs` subfolder.
- All code has been significantly refactored to make it cleaner and easier to read.

## 0.2.0

###### _Mar 23, 2017_

###### Component Fixes / Enhancements

- Corrected `fixed` width tabs so that no scrolling behavior occurs. Previously, selecting a partially out of view tab would scroll that tab into view. @shawnmcknight

###### Examples

- Created `/examples` directory with a webpack-dev-server based site that will show interactive examples and code for various tab permutations. Docs for use are [here](https://github.com/STORIS/material-ui-scrollable-tabs/blob/master/examples/README.md). @shawnmcknight
