<!--
layout: post
title: ES6 modules today with 6to5
date: 2014-10-28T12:49:54.528Z
comments: true
published: true
keywords: ES6, modules, 6to5
description: A tutorial about using ES6 modules today with 6to5
categories: Modules, Tutorial
authorName: Jaydson Gomes
authorLink: http://twitter.com/jaydson
-->
<!--more-->
I've posted the image below on [Twitter](https://twitter.com/jaydson/status/526882798263881730) showing how happy I was.  
It's great what [transpilers](http://en.wikipedia.org/wiki/Source-to-source_compiler) can do. In JavaScript's World it's like a time machine we can forward to the near future of awesomeness ES6 will bring.  
In this tutorial we'll show how to start writing [ES6 modules](http://jsmodules.io/) today, using the awesome [6to5](https://github.com/sebmck/6to5).  

![modules today with 6to5](/img/modules-today-6to5.png)

# First step
If you are not familiar with ES6 modules, please check [JSModules.io](http://jsmodules.io/) for an brief introduction.  
Also, I recommend you to read [@jcemer](http://twitter.com/jcemer)'s article [A new syntax for modules in ES6](http://es6rocks.com/2014/07/a-new-syntax-for-modules-in-es6/), here in [ES6Rocks](http://es6rocks.com), that covers a lot of more cool stuff around modules in JavaScript.  
For this tutorial we'll use the 6to5 transpiler.  
Basically, _"6to5 turns ES6 code into vanilla ES5, so you can use ES6 features today"_.  
_6to5_ has some advantages over other transpilers, here are the main features:  
__Readable__: formatting is retained if possible so your generated code is as similar as possible.  
__Extensible__: with a large range of plugins and browser support.  
__Lossless__: source map support so you can debug your compiled code with ease.  
__Compact__: maps directly to the equivalent ES5 with no runtime.  

# Writing modules
Let's start writing modules!  
Our application will do nothing but logs, but the main idea here is make you understand how modules works and how to implement ES6 modules right now in your applications.  
Our basic app structure:  
```
├── Gruntfile.js
├── package.json
└── src
    ├── app.js
    ├── modules
    │   ├── bar.js
    │   ├── baz.js
    │   └── foo.js
    └── sample
        └── index.html
```
`app.js` is the main file, and inside the `modules` directory we'll store all our modules.  
Take a look at app.js:  
```javascript
import foo from "./modules/foo";
import bar from "./modules/bar";

console.log('From module foo >>> ', foo);
console.log('From module bar >>> ', bar);
```
It's pretty simple. The code above does exactly what it looks like.  
We're importing module `foo` and module `bar`, and then logging the content of each one.  
To be more clear, let's look at each module:  
```javascript
// foo
let foo = 'foo';

export default foo;
```
```javascript
// bar
let bar = 'bar';

export default bar;
```
In both modules we're just exporting the strings `'foo'` and `'bar'`.  
When we import the module, our variable has the data we exported.  
Then, `foo` in `import foo from "foo"` has the data `'foo'` we exported in `export default foo`.  
You can also export objects, classes, functions, etc.  
Now, you can start to hack this simple example and write your own modules.  

#Build
As you may know, [ES6 modules are not supported yet](http://kangax.github.io/compat-table/es6/) by any browser nor Node.js.  
The only way to write ES6 modules today is using a transpiler.  
As I mentioned before, I'm using 6to5, that does exactly what we want.  
The task runner we chose was [Grunt](http://gruntjs.com/), and we'll use [@sindresorhus](https://twitter.com/sindresorhus)'s [grunt-6to5](https://github.com/sindresorhus/grunt-6to5).  

```shell
npm install grunt-cli -g
npm install grunt --save-dev
npm install grunt-6to5 --save-dev
```

Our Gruntfile will look like this:  
```javascript
grunt.initConfig({
	'6to5': {
		options: {
			modules: 'common'
		},

		build: {
			files: [{
				expand: true,
				cwd: 'src/',
				src: ['**/*.js'],
				dest: 'dist/',
			}],
		}
	}
});
```
A pretty simple configuration and we're almost there.  
The 6to5 task just runs 6to5 against the `src` dir and transpiles the code to the `dist` directory.  
Note the `modules: 'common'` option. This tells 6to5 to transpile our modules to ES5 [CommonJS](http://wiki.commonjs.org/wiki/CommonJS) modules style.  
6to5 also supports [AMD](http://requirejs.org/docs/whyamd.html) which is great, because we can integrate ES6 modules to our current environment, independent of our legacy/current modules style choice.  

To test it in the browser, I made a copy task that just copies the `sample/index.html` file to our `dist` directory.  
The HTML file looks like this:  
```markup
<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>ES6 modules 6to5</title>
</head>
<body>
	<script src="//[cdnjs URL]/require.min.js"></script>
	<script>
		require(['app.js']);
	</script>
</body>
</html>
```
Look at the code above, we put RequireJS as our AMD library and then just require the app.  
For this test to work, you'll need to set the option `modules: amd`.  

# Running
Now we have everything set, you can just run `grunt`.  
If you missed something, you can clone the repo [es6-modules-today-with-6to5](https://github.com/es6rocks/es6-modules-today-with-6to5), and run `npm install`.  

Remember, the Grunt task will generate a `dist` folder with the transpiled code.  
So, if you choose to transpile ES6 modules to CommonJS, you can test the app with node:  
```shell
node dist/app.js
```
![Running with node](/img/running-node.png)

If you choose AMD, just serve the `dist` folder, and access the page `index.html`.  
![AMD ES6](/img/amd-es6.png)

# Conclusion
With this simple tutorial you can see how easy it is to setup an ES6 environment to work with modules.  
6to5 is an excelent painless tool you can use today to transpile future ES6 code to current ES5 code.  
Go ahead and fork the repo [es6-modules-today-with-6to5](https://github.com/es6rocks/es6-modules-today-with-6to5), submit issues, questions or pull-requests.  
Comments are welcome :)  
