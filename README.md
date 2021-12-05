# packHtml

## Usage

`packHtml` turns:

```javascript
// modules/main.js
import { sayHi } from './a.js';
sayHi('Bob');
```

```javascript
// modules/a.js
export const sayHi = name => {
    console.log(`Hi ${name}`);
}
```

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.css">
</head>
<body>
    <script type="module" src="modules/main.js"></script>
</body>
</html>
```

Into:

```html
<!DOCTYPE html><html lang="en"><head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>@charset "UTF-8";
/*!
 * Bootstrap v5.1.3 (https://getbootstrap.com/)
 * Copyright 2011-2021 The Bootstrap Authors
 * Copyright 2011-2021 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 */:root{--bs-blue:#0d6efd;} /*...*/</style>
</head>
<body>
    <script>const sayHi=o=>{console.log(`Hi ${o}`)};sayHi("Bob");</script>
</body></html>
```

### CLI

```bash
packhtml path/to/index.html > out.html
```

### Node.js API

```javascript
await packHtml({
    htmlFile: 'path/to/index.html'
});
```



