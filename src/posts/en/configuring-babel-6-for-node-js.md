<!--
layout: post
title: Configuring Babel 6 for Node.js
date: 2016-01-04T02:39:18.811Z
comments: true
published: true
keywords: JavaScript, Node.js, ES2015, Babel, transpiler
description: Tutorial on configuring Babel for Node.js to get up and running quickly
categories: ES2015, Babel, node.js
authorName: Hannan Ali
authorLink: https://abdulhannanali.github.io
authorPicture: //s.gravatar.com/avatar/89e5f7614cb88cd573359a953a09aa6e?s=80
-->
Hi! If you are like me, you are tired of writing the same old ES5 JS code in your Node.js applications.

If yes, you can use the newer features of JavaScript ES2015 and ES2016 standards in your Node.js applications today. ES2015 and ES2016 make the JavaScript development a cool breeze but hey, not every ES2015 feature is supported in our beloved [Node.js](https://nodejs.org).

This is where [Babel](https://babeljs.io) comes to the rescue. Babel is a transpiler for JavaScript that transpiles your ES2015 and ES2016 code into ES5 and even ES3 code. In simple words, it converts your code into JavaScript that Node.js can run and make you really happy.
<!--more-->

**Small note:** Node.js already supports several ES2015 features, so if you don't want to transpile ES2015 code you may run Node.js with the `--harmony` flag to enable a few more (staged) features. In order to access more harmony flags for experimental features run this command: `node --v8-options | grep harmony`. However, note that not all features are supported even in the latest Node.js (version 5 at the time of writing), and the flagged features are often unstable or incomplete. So keep reading to make use of more ES2015 and **ES2016** features, without requiring flags.

### Some assumptions made
There are some assumptions I am making about you! YES YOU!
- You know your way around [Node.js](https://nodejs.org).
- You can install packages using [npm](https://www.npmjs.com/).
- You have Node.js and npm already installed.
- You are okay with using some CLI occasionally.
- It's good to know some ES2015 beforehand, but not required.

### Following along the code
Type of person who follows code instead of just reading? Code is available here in [this repo](https://github.com/abdulhannanali/babel-configuration-tutorial).

### Installing and getting started with Babel
There are many ways you can set up Babel. Here we will be discussing enough to get up and running using babel-cli.

Let's create a simple `index.js` in a `code` **directory** which will contain the following ES2015 code:
```javascript
function* jsRocksIsAwesome() {
  yield "JS Rocks is Awesome";
  yield "JS Rocks says JavaScript Rocks";
  return "because JavaScript really rocks";
}

var jsRocks = jsRocksIsAwesome();

console.log(jsRocks.next());
console.log(jsRocks.next());
console.log(jsRocks.next());
```

We'll install the **babel-cli** package with the next command. This will install the latest stable version of **babel-cli** for the current project and list it as one of the `devDependencies` in `package.json` too:

```
npm install --save-dev babel-cli
```

Now if you run:
```
babel code/index.js -d build/
```

You will see the same code that you wrote appear in `build/index.js`. This is where Babel's **plugins** and **presets** come.

#### Plugins and Presets

Babel doesn't do much on its own, but with **plugins** and **presets** it can do a lot. We want all the ES2016 and ES2015 goodness in our code.

In order to do that we'll install two presets as part of our `devDependencies`:
- [es2015](https://babeljs.io/docs/plugins/preset-es2015/)
- [stage-0](https://babeljs.io/docs/plugins/preset-stage-0/)

Run the following command to install these presets:
```
npm install --save-dev babel-preset-es2015 babel-preset-stage-0
```
Babel has a wide range of plugins that you can [access here](https://babeljs.io/docs/plugins/).

Now you need to include these presets in the command you issue:
```
babel --presets es2015,stage-0 code/index.js -o build/app.js
```

You will see normal ES5 code generated in `app.js`, this is called **Transpiled code** (a term used widely in the JS world). You can run this code using the command below.
```
node build/app.js
```

### Setting up a proper build environment using Babel
This is all good magic, but what about doing some proper development using Node.js?

#### babel configuration file .babelrc
`.babelrc` is a very neat way to separate all your Babel stuff in one JSON file. It's also pretty easy to get started. This is our `.babelrc` file for this tutorial:
```javascript
{
  "plugins": ["es2015", "stage-0"]
}
```

You can configure other [`.babelrc` options](http://babeljs.io/docs/usage/options/) and make it as robust as you want it to be.

This is pretty much it of Babel configuration for this tutorial. Now whenever we want to add or remove plugins, instead of changing the command we will change the plugins array in this file. Easy! Isn't it?

Now if you run:
```
babel -w code/ -d build/
```
It will read the **presets** to use from `.babelrc` compile the code in `code/` directory and generate the compiled JavaScript files in the `build/` folder, but hey! The command isn't over yet. Note the `-w` flag: it stands for **watch** and will recompile the code as you make changes in your `code` directory. COOL! Now this is some magic I am talking about.

#### Using source maps in your file
If you are thinking that's all cool and fun but what about some actual code debugging. You don't have to be worried. Source maps are just for this purpose. Source maps tell Node.js that this code is transpiled and point to errors in the actual **source file** instead of the **transpiled file**!

This `code/error.js` file here throws an error after the second `yield` in the generator but the transpiled code looks quite different.
```javascript
function* errorFulGenerator() {
  yield "yo";
  throw new Error("source maps are awesome");
  return "";
}

var errorGen = errorFulGenerator();
errorGen.next();
errorGen.next();
```

We use this command to generate **source maps** along with the **transpiled** code. *Note the `--source-maps` flag*:
```
babel code/ -d build/ --source-maps
```

Now when we encounter the error we get useful debugging such as this:
```
errorGen.next()
         ^

Error: source maps are awesome
    at errorFulGenerator (/home/programreneur/Programming/githubRepos/babeljs-short-tutorial/code/error.js:3:9)
    at next (native)
    at Object.<anonymous> (/home/programreneur/Programming/githubRepos/babeljs-short-tutorial/code/error.js:10:10)
    at Module._compile (module.js:425:26)
    at Object.Module._extensions..js (module.js:432:10)
    at Module.load (module.js:356:32)
    at Function.Module._load (module.js:313:12)
    at Function.Module.runMain (module.js:457:10)
    at startup (node.js:138:18)
    at node.js:974:3
```
So this is how you'll use source maps.

#### Setting up npm command
In order to simplify the build process even more, you can update your `package.json` file to include a build script for Babel. In the `package.json`'s `scripts` object you can add a build script such as the one below:
```javascript
"scripts": {
  "build": "babel -w code/ -d build -s"
}
```
Now, we can run:
```
npm run build
```
And get all the ES2015/ES2016 goodness instantly today. :)

#### Learn more about Babel
This is a basic tutorial on Babel but the Babel world just starts here. It's surrounded by a wonderful community and is used by big names in IT world. Babel has support for all the major build tools too such as [Grunt](https://www.npmjs.com/package/grunt-babel) and [gulp](https://npmjs.org/package/gulp-babel/). You can check them all out in the [Babel Website](https://babeljs.io/docs/setup/).

These are some of the resources that can even up your game further in the Babel world:
- [Learn ES2015 and Babel using this detailed tutorial](http://ccoenraets.github.io/es6-tutorial/index.html)
- [Read the Babel docs on setting up Babel (They're helpful)](https://babeljs.io/docs/setup/)

##### Source code and Contributions and Thank yous
Source code for this tutorial is available in this [repo](https://github.com/abdulhannanali/babel-configuration-tutorial).

If you find some typo or would like to make some update. Please do so using the power of issues and PR in our [Github Repo](https://github.com/abdulhannanali/babel-configuration-tutorial).

I would also like to thank [Fabrício Matté](http://ultcombo.js.org/) for approving this article to be posted on [JS Rocks](https://github.com/JSRocksHQ/jsrockshq.github.io/) and the corrections he made.
