<!--
layout: post
title: Using ES6 modules in the browser with Gulp
date: 2014-12-02T17:14:37.232Z
comments: true
published: true
keywords: JavaScript, ES6, modules, Traceur, Gulp
description: How to use ES6 modules in the browser using Traceur and Gulp
categories: modules, tutorial
authorName: Juan Cabrera
authorLink: http://juan.me
-->
There are a lot of information about Gulp, not so much for ES6 and just a very few articles about how to implement ES6 modules (for the browser) properly. 

On my last project I was using Gulp + ES6 and I had to spent some time figuring out how to get ES6 modules working properly. This is how I finally did it without using Browserify or any AMD loader.

My first attempt was to use [gulp-es6-transpiler](https://www.npmjs.org/package/gulp-es6-transpiler) (that basically is a wrapper for [es6-transpiler](https://www.npmjs.org/package/es6-transpiler)) but it doesn’t support modules, then I took a look to [gulp-es6-module-jstransform](https://www.npmjs.org/package/gulp-es6-module-jstransform) but it only transpile to CommonJS, meaning that we’ll need to use Browserify, then I tried [Traceur](https://github.com/google/traceur-compiler) (from Google) and it has two options for browser modules, one is ‘AMD’ (meaning that we’ll need to use RequireJS or similar) and ‘inline’ that basically what it does is generate one file with all the transpiled modules on it (which is the closet option to “native” ES6 modules).
The thing is that the ‘inline’ option works perfect if you are using the command line, but if you use the Traceur’s node API (like [gulp-traceur](https://www.npmjs.org/package/gulp-traceur)) it’ll throw an error. **[UPDATE]** I’ve put this issue on [their Github](https://github.com/google/traceur-compiler/issues/1282) and finally got fixed, but then we realized that the transpile from the node API wasn’t generating the same output as the command line, so we finally decided to build a small Gulp plugin wrapper for the command line Traceur (Thanks Edward!)

[Here is the plugin](https://www.npmjs.org/package/gulp-traceur-cmdline) and this is how you can use it:

**Install**

Make sure you have installed Traceur globally:
```
npm install traceur --global
```
Install gulp-traceur-cmdline to your project:
```
npm install gulp-traceur-cmdline --save-dev
```
**Usage**
```
var gulpTraceurCmdline = require('gulp-traceur-cmdline');

gulp.task('gulpTraceurCmdline',function() {
  gulp.src("./source/styleguide/js/main.js")
    .pipe(gulpTraceurCmdline('/usr/local/bin/traceur', {
      modules : 'inline',
      out     : './dist/styleguide/js/main.js',
      debug   : false
    }))
}); 
```
**Links**


Github: https://github.com/juancabrera/gulp-traceur-cmdline

NPM: https://www.npmjs.org/package/gulp-traceur-cmdline

**Without Gulp**

You can also run directly Traceur to get your ES6 modules without using this Gulp wrapper, here is a basic example:
```
traceur --modules inline --out mainTranspiled.js main.js
```
—

This post was originally posted on [my blog](http://code.juan.me/using-es6-modules-in-the-browser/).