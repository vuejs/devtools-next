# Features

Discover all the features of the Vue DevTools.

You can open or close Vue DevTools with `Shift+Alt+D` or `Shift+Option+D` shortcut.

## Overview

Shows a quick overview of your app, including the Vue version, pages and components.

![overview](/features/overview.svg)

## Pages

Pages tab shows your current routes with some useful information, and provides a quick way to navigate between pages. You can also use the textbox to see how each route is matched.

![pages](/features/pages.svg)

## Components

Components tab shows your components information, including the node tree, state and so on. And provides some interactive features, e.g. edit state, scroll to component, etc.

![components](/features/components.svg)

## Assets

Assets tab shows your files from the project directory, you can see the information of selected file with some helpful actions.

![assets](/features/assets.svg)

## Timeline

Timeline tab allows you to travel through previous versions of your states or events.

![timeline](/features/timeline.svg)

## Router

Router tab is a feature integrated with [vue-router](https://github.com/vuejs/router), allowing you to view the routes list and its details.

![router](/features/router.svg)

## Pinia

Pinia tab is a feature integrated with [pinia](https://github.com/vuejs/pinia), allowing you to view the store list and its details, and edit the state.

![pinia](/features/pinia.svg)

## Graph

Graph tab shows the relationship between modules.

![graph](/features/graph.svg)

## Settings

Settings tab provides some options to customize the DevTools. Here you can manage the Tab bar, enable or disable some features, and hide Vue Devtools.

![settings](/features/settings.svg)

## Inspect

Inspect expose the [vite-plugin-inspect](https://github.com/antfu/vite-plugin-inspect) integration, allowing you to inspect transformation steps of Vite.

![inspect](/features/inspect.svg)

## Inspector

Inspector expose the [vite-plugin-vue-inspector](https://github.com/webfansplz/vite-plugin-vue-inspector) integration, you can inspect your app's DOM tree and see which component is rendering it. Finding the place to make changes are much easier. You can active it with `Ctrl+Shift` or `Cmd+Shift` shortcut. When activated, you can use `Esc` shortcut to exit. You can customize shortcut by [`Options.componentInspector.toggleComboKey`](/guide/vite-plugin#options)

![inspector](/features/inspector.svg)

## Separate Window

Vue DevTools is able to run as a separate window, it's so helpful when you want to debug your app in a small screen.

![separate-window](/features/separate-window.png)

## Command Palette

Command Palette is a quick way to access some useful features of the DevTools such as easy navigation, run commands and Vue Documentations. You can open it with `Ctrl+K` or `Cmd+K` shortcut.

![command-palette](/features/command-palette.png)

## Multiple Apps Support

If your app uses multiple Vue instances, you can switch between them in the top left corner of the DevTools.

![multiple-apps](/features/multi-app.png)

## Split Screen

Split Screen is a useful feature to use multiple tabs at the same time. You can open it from Command Palette or by clicking the `Vue Icon` in the top left corner of the DevTools and activate it from there.

![split-screen](/features/split-screen.png)
