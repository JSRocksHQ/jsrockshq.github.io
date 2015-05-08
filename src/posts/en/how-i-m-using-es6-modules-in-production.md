<!--
layout: post
title: how i'm using es6 modules in production
date: 2015-05-08T04:51:30.117Z
comments: true
published: true
keywords: modules
description: Post about how i'm using es6 modules in production
categories: modules
-->
I've been using [ES6 modules](/categories/modules/) for awhile in my daily work and i want to share with you guys how i'm doing it.  
First of all, [Babel](https://babeljs.io/) is the consolidated tool for transpilation. It's a very active project, and it covers almost all of modern JavaScript features.  
Babel works great for modules too, so you'll just need to decide the flavour, i mean AMD, Common, UMD and even customized modules.  

In my company we're building applications using a home-made Framework (not open-source yet) based on AMD modules.  
We have A LOT of AMD modules.  
Believe me, for big applications AMD still one of the best solutions. We can't simply bundle everything in a single file. That's not how things works.  
Nowadays we have solutions like [Webpack](http://webpack.github.io/), but we already have a huge installed base applications, so it's not so easy to migrate, and our home-made solution for delivering modules (not open-source yet) is working just fine.  

## Micro-modules strategy
This strategy is working quite well for me.  
As i said before, our final module must be a AMD module, but sometimes the AMD module itself need modules, and i'm calling them micro-modules.  
This micro-modules i'm using not necessarily need to be shared across applications, but they help me a lot with code organization.  
