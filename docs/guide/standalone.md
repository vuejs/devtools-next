# Standalone App

> In case you are using an unsupported browser, or if you have other specific needs (for example your application is in Electron), you can use the standalone application.

## Installation

### Install the package globally:

::: code-group

```sh [npm]
$ npm add -g @vue/devtools-next
```

```sh [pnpm]
$ pnpm add -g @vue/devtools-next
```

```sh [yarn]
$ yarn global add @vue/devtools-next
```

```sh [bun]
$ bun add -g @vue/devtools-next
```

:::

### Or locally as project dependency:

::: code-group

```sh [npm]
$ npm add -D @vue/devtools-next
```

```sh [pnpm]
$ pnpm add -D @vue/devtools-next
```

```sh [yarn]
$ yarn add -D @vue/devtools-next
```

```sh [bun]
$ bun add -D @vue/devtools-next
```

:::

## Usage

### Using global package

Once you installed the package globally, run:

```sh
vue-devtools-next
```

Then add this code to the `<head>` section of your application HTML file:

```html
<script src="http://localhost:8098"></script>
```

Or if you want to debug your device remotely:

```html
<script>
  window.__VUE_DEVTOOLS_HOST__ = '<your-local-ip>' // default: localhost
  window.__VUE_DEVTOOLS_PORT__ = '<devtools-port>' // default: 8098
</script>
<script src="http://<your-local-ip>:8098"></script>
```

:::tip
`<your-local-ip>` usually looks like this: `192.168.x.x`.
:::
:::warning Note
**Don't forget to remove it before deploying to production!**
:::

### Using dependency package

Once you installed the package as project dependency, run:

```sh
./node_modules/.bin/vue-devtools-next
```

:::tip
You can also use the global `vue-devtools-next` to start the app, but you might want to check if the local version matches the global one in this scenario to avoid any incompatibilities.
:::

Then import it directly in your app:

```ts
import { devtools } from '@vue/devtools-next'
```

:::tip Important
Make sure you import devtools before Vue, otherwise it might not work as expected.
:::

And connect to host:

```ts
if (process.env.NODE_ENV === 'development')
  devtools.connect(/* host, port */)
```

**host** - is an optional argument that tells your application where devtools middleware server is running, if you debug your app on your computer you don't have to set this (the default is `http://localhost`), but if you want to debug your app on mobile devices, you might want to pass your local IP (e.g. `http://192.168.1.12`).

**port** - is an optional argument that tells your application on what port devtools middleware server is running. If you use proxy server, you might want to set it to `null` so the port won't be added to connection URL.
