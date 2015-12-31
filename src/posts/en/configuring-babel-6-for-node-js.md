<!--
layout: post
title: Configuring Babel 6 for Node.js
date: 2015-12-31T01:23:42.811Z
comments: true
published: true
keywords: JavaScript, Node.js, ES6, Babel, transpiler
description: Tutorial on configuring Babel for node.js to get up and running quickly
categories: ES6, Babel, node.js
authorName: Hannan Ali
authorLink: https://abdulhannanali.github.io
authorPicture: //s.gravatar.com/avatar/89e5f7614cb88cd573359a953a09aa6e?s=80
-->
Hi! If you are like me, you are tired of writing the same old ES5 JS Code in your node applications.

If yes, you can use the newer features of JavaScript ES6 and ES7 standards in your node applications today. ES6 and ES7 make the JavaScript development a cool breeze. But hey, not every ES6 feature is supported in our beloved [Node.js](https://nodejs.org).

This is where [Babel](https://babeljs.io) comes to the rescue. Babel is a transpiler for JavaScript which transpiles your ES6 and ES7 code into ES5 and even ES3 code. In simple words it converts it into JavaScript that node.js can run and make you really happy.
<!--more-->

**Little Notice:** If you just want ES6 features and don't want to Babelify stuff. You can use `--harmony` flag before running your node application. In order to access more harmony flags for staging and experimental features run this command `node --v8-options | grep harmony` . But there aren't even all the features present in Node. So you may continue if you can access ES6 but also need to access **ES7** features.

### Some assumptions made
There are some assumptions I am making about you! YES YOU!
- You know your way around [Node.JS](https://nodejs.org)
- You can install packages using [npmjs.com](http://npmjs.com)
- You've both of 'em Node.js and NPM already installed.
- You are okay with using some CLI sometimes.
- It's good to know some ES6 or ES7 beforehand but not required.


### Following along the code
Type of person who follows code instead of just reading? Code is available here in this [repo](https://github.com/abdulhannanali/babel-configuration-tutorial)

### Installing and getting started with Babel
There are many ways you can set up Babel. Here we will be discussing enough to get up and running using babel-cli.

Let's create a simple `index.js` in `code` **directory**  which will contain the following ES6 code
```js
function* jsRocksIsAwesome() {
  yield "JSRocks is Awesome";
  yield "JSRocks says JavaScript Rocks";
  return "because JavaScript really rocks";
}

var jsRocks = jsRocksIsAwesome();

console.log(jsRocks.next());
console.log(jsRocks.next());
console.log(jsRocks.next());

```


We'll install the **babel-cli** package by typing this command. This will install the latest stable version of **babel-cli** for the required project and list it as one of the `devDependencies` listing it in `package.json` too

```bash
npm install --save-dev babel-cli
```

Now if you run
```bash
babel code/index.js -d build/
```

#### Plugins and Presets

You will see the same code that you wrote appear in `build/index.js`. This is where Babel **plugins** and **presets** come. Babel doesn't do much on it's own, but, with **plugins** and **presets** it can do a lot. We want all the ES7 and ES6 goodness in our code.

In order to do that we'll install two presets as part of our devDependencies
- [es2015](https://babeljs.io/docs/plugins/preset-es2015/)
- [stage-0](https://babeljs.io/docs/plugins/preset-stage-0/)

Type the following command in order to install these presets.
```bash
npm install --save-dev babel-preset-es2015 babel-preset-stage-0
```
In order to access a wide range of Babel plug ins click [here](https://babeljs.io/docs/plugins/)

You need to include these presets in command you issue
```bash
babel --presets es2015,stage-0 code/index.js -o build/app.js
```

You will see normal es5 code generated in `app.js`, this is called **Transpiled code** (a term used widely in JS World). You can run this code using the command below.
```bash
node build/app.js
```

### Setting up a proper build environment using Babel
This is all good magic but what about doing some proper development using node.js.

#### babel configuration file .babelrc
`.babelrc` is a very neat way to separate all your Babel stuff in one JSON file. It's also pretty easy to get started. This is our .babelrc file for this tutorial. You can access other .babelrc options [here](http://babeljs.io/docs/usage/options/) and make it as robust as you want it to be
```json
{
  "plugins": ["es2015", "stage-0"]
}
```
This is pretty much it for this tutorial, this will help us with our rest of development. Now whenever we want to add or subtract plugins. Instead of changing the command we will change the plugins array in this file. Easy! Isn't it?

Now if you run
```bash
babel -w code/ -d build/
```
It will read the **presets** to use from `.babelrc` compile the code in `code/` directory and generate the compiled code javascript files in `build/` folder. But hey! The command didn't end. Notice the `-w` flag, **w** stands for **watch**, it will recompile the code as you make changes in your code directory. COOL! Now this is some magic I am talking about.

#### Using Source maps in your file
If you are thinking that's all cool and fun but what about syntax highlighting and real time code debugging. You don't have to be worried. Source maps are just for this purpose. Source maps tell node.js that this code is transpiled and let's you highlight **source** file instead of the **transpiled** file 😄. YAYY!

This file here `code/error.js` throws an error after the second yield in the generator but the transpiled code doesn't quite look like this.
```js
function* errorFulGenerator() {
  yield "yo";
  throw new Error("source maps are awesome");
  return "";
}

var errorGen = errorFulGenerator();
errorGen.next();
errorGen.next();
```

We use this command to generate **source maps** along with the **transpiled** code *notice the `--source-maps flag`*
```bash
babel code/ -d build/ --source-maps
```

Now when we encounter the error we get useful debugging such as this
```js
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
So this is how you'll use source maps

#### Setting up npm command
In order to simplify the build process even more. You can update your `package.json` file to include a build script for Babel. In `package.json` script object you can add a build script such as the one below
```json
"scripts": {
  "build": "babel -w code/ -d build -s"
}
```
Now, we can run
```bash
npm run build
```
and get all the ES6/ES7 goodness instantly today. :)


#### Learn more about Babel
This is a basic tutorial on Babel but the Babel world just starts here. It's surrounded by a wonderful community and is used by big names in IT world. Babel has support for all the major build tools too such as [Grunt](https://www.npmjs.com/package/grunt-babel) and [gulp](https://npmjs.org/package/gulp-babel/). You can check them all out here on [Babel Website](https://babeljs.io/docs/setup/)

These are some of the resources that can even up your game further in the Babel world
- [Learn ES6 and Babel using this detailed tutorial](http://ccoenraets.github.io/es6-tutorial/index.html)
- [Read the Babel docs on setting up Babel (They're helpful)](https://babeljs.io/docs/setup/)


##### Source code and Contributions and Thank yous
Source code for this tutorial is available in this [repo](https://github.com/abdulhannanali/babel-configuration-tutorial).

If you find some typo or would like to make some update. Please do so using the power of issues and PR in our [Github Repo](https://github.com/abdulhannanali/babel-configuration-tutorial).

I would also like to thank [Fabrício Matté](http://ultcombo.js.org/) for approving this article to be posted on JS Rocks and the corrections he made.
