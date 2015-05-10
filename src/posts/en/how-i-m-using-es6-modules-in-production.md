<!--
layout: post
title: how i'm using es6 modules in production
date: 2015-05-08T04:51:30.117Z
comments: true
published: true
keywords: modules
description: Post about how i'm using es6 modules in production
categories: modules
authorName: Jaydson Gomes
authorLink: http://twitter.com/jaydson
authorDescription: JavaScript enthusiast - FrontEnd Engineer at Terra Networks - BrazilJS and RSJS curator
authorPicture: https://pbs.twimg.com/profile_images/453720347620032512/UM2nE21c_400x400.jpeg
-->
I've been using [ES6 modules](/categories/modules/) for a while in my daily work and I want to share with you guys how i'm doing it.  
First of all, [Babel](https://babeljs.io/) is the consolidated tool for transpilation. It's a very active project, and it covers almost all of modern JavaScript features.  
Babel works great for modules too, so you'll just need to decide the flavour, I mean AMD, Common, UMD and even customized modules.  
<!--more-->

In my company we're building applications using a home-made Framework (not open-source yet) based on AMD modules.  
We have A LOT of legacy AMD modules.  
Believe me, for large applications AMD still one of the best solutions. We can't simply bundle everything in a single file. That's not how things work.  
Nowadays we have solutions like [Webpack](http://webpack.github.io/), but we already have a huge installed base applications, so it's not so easy to migrate, and our home-made solution for delivering modules (not open-source yet) is working just fine.  

## Micro-modules strategy
This strategy is working quite well for me.  
As I said before, our final module must be a AMD module, but sometimes the AMD module itself needs modules, and i'm calling them micro-modules.  
This micro-modules i'm using does not necessarily need to be shared across applications, but they help me a lot with code organization.  
Here's a piece of code we have in production:  
```javascript
import config from './config';
import { globalpkg } from './config';
import factory from './factory';

zaz.use((pkg) => {

    "use strict";

    config.dynamic.globalpkg = pkg;

    pkg.require(['modFactory'], (modFactory) => {
        modFactory.create(pkg.utils.deepMerge(config._static, factory));
    });

});
```
We're importing some modules above and using them in our AMD module.  
Those ES6 modules aren't useful for any other application, but the final code looks much more readable using micro-modules.  
The `config` we're importing above look like this:  
```javascript
const githubURL = "OUR GITHUB URL HERE";
const staticServer = "http://s1.trrsf.com";
const testsPath = `zaz-${type}-${name}/tests/index.htm?zaz[env]=tests`;
const name = "stalker";
const type = "mod";
const version = "0.0.1";
const state = "ok";
const description = "JavaScript API to deal with user data";
let globalpkg = null;

// default export 
const config = {
	_static: {
		name,
	    version,
	    state,
	    description,
	    docs: `${githubURL}/pages/terra/zaz-${type}-${name}`,
	    source: `${githubURL}/Terra/zaz-${type}-${name}`,
	    tests: `${staticServer}/fe/${testsPath}`,
	    dependencies: ['mod.wilson']
	}
};

export default config;
```

Look at the tree we have for this specific AMD module:  
```
src/
├── _js
│   ├── config.js
│   ├── environment.js
│   ├── factory.js
│   ├── helpers.js
│   ├── methods.js
│   └── mod-stalker.js
```
I've just split the logic inside my AMD module into tiny ES6 modules.  
The build process is very simple: Babel transpiles the code to ES5 using CommonJS modules for micro-modules and then [Browserify](http://browserify.org/) bundles everything.  
Boom! The final code remains a AMD module, but my source code is using CommonJS for micro-modules.  


## Next step
Sourcemaps doesn't work well with this workflow as i'm using Browserify to bundle.  
Perhaps it should be easy to implement.  
We're starting to rewrite our framework using some ES6 features and of course we'll use modules.  
It may be possible to build a custom module formatter for our current structure, but I think it wouldn't be a good approach.  
Maybe we'll need to rewrite the whole module system we already have.  

## Conclusion
The modules specification is already done, and in my opinion it's very mature and efficient.  
However, we didn't have a browser API yet for dealing with modules loading, so a solution like AMD or CommonJS remains necessary.  
We can have benefit of ES6 modules syntax right now, making our code more readable and concise.  
Existing tools such as Babel and Browserify give us a painless development, and in the near future we can simply deactivate them because we'll have full support.  
