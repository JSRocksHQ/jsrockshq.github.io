<!--
layout: post
title: What you need to know about block scope - let
date: 2014-08-28T01:58:23.465Z
comments: true
published: true
keywords:
description: An introduction to block scope on ES6
categories: scope, articles, basics
authorName: Jaydson
authorLink: http://twitter.com/jaydson
authorDescription: JavaScript enthusiast - FrontEnd Engineer at Terra Networks - BrazilJS and RSJS curator
authorPicture: https://pbs.twimg.com/profile_images/453720347620032512/UM2nE21c_400x400.jpeg
-->
<!--more-->
Variables declaration in any programming language are something pretty basic.  
Regardless the language, understanding how variable scope works is essential to write any kind of program.  
In Python, for example, as well as in most languages​​, there are two scopes: Local and Global.  
Variables defined at the top of the file, without identation, are global scope variables.  
Variables declared inside the function body are considered as local scope.  
So far, everything is very similar. In JavaScript, the behavior is quite similar.  
Let's see one example in both languages:  
```python
# Python
x = 1 # global scope
y = 3

def sum(a, b):
	s = a + b # local scope
	return s
```

```javascript
// JavaScript
var x = 1;  // global scope
var y = 3;

function sum(a, b) {
	var s = a + b;  // local scope
	return s;
}
```

In most C-based languages(JavaScript, PHP), variables are created at the spot where they were declared.  
However, in JavaScrpt this is different, and can become complicated.  
When you declare a variable in the body of a function, it is moved to the top or to the global scope. This behavior is called [_hoisting_](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var#var_hoisting).  
Unlike Python and other languages, in JavaScript, a variable declared in a for loop leaks its value.  
See the example below:  
```javascript
// JavaScript
for (var i = 0; i <= 2; i += 1) {
	console.log(i); // current i
}
console.log(i); // last i
```

In this case, even outside of the for loop block, the variable i is still there, with the last value stored.  
This is a pretty common issue where a program can be easily broken by lack of attention.  
Another important factor in JavaScript is that the omission of _var_ to declare a variable causes it to be allocated in the global scope, and this can cause many problems.  

## let declaration
The _let_ arrives in ES6 as a substitute for _var_. Yes, the idea is that var will be discontinued in a distant future,  because today it would be impossible completely stop supporting it without breaking the whole internet.  
The _let_ works as expected, setting the variable in the place where it was declared.  
Example:  
```javascript
let foo = true;
if  (foo) {
	let bar = 'baz';
	console.log(bar); // outputs 'baz'
}

try {
	console.log(bar);
} catch (e) {
	console.log("bar doesn't exist");
}
```
As you might imagine, _let_ solves the problem with the variable in the for loop.  
See:  
```javascript
// JavaScript
for (let i = 0; i <= 2; i += 1) {
	console.log(i); // current i
}
try {
	console.log(i);
} catch (e) {
	console.log("i doesn't exist");
}
```

## Support today
You can use _let_ today*  
Check out the awesome Kangax ES6 table > [http://kangax.github.io/compat-table/es6/#](http://kangax.github.io/compat-table/es6/#).  
_let_ is currently supported by the modern browsers (even IE11) in theirs last versions and [Traceur](https://github.com/google/traceur-compiler) as well.  
You can try ES6 _let_ on Firefox devtools:  

![let on firefox nightly](/img/let.gif)  

* __NOTE__: As well pointed by Michał Gołębiowski on the comments below, browsers implementations are not fully according with the spec, so you may find some bugs.  
For real world applications, you'll need to use a traspiler (at least, for a while until mid 2015).  

## Conclusion
Although simple, declaring variables in JavaScript can cause headache for beginners in the language.  
With _let_, to declare variables is much more intuitive and consistent with a C-based language.  
The use of _var_ should be discontinued, and only the _let_ must exist in the future.  
There's no _hoisting_ behavior for variables declared with _let_.  

