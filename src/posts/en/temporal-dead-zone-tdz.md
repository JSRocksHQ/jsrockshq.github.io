<!--
layout: post
title: Temporal Dead Zone (TDZ)
date: 2015-01-29T01:18:37.630Z
comments: true
published: true
keywords: scope, tdz, es6
description: Get a deeper understanding of scopes and future-proof your code!
categories: scope, articles
authorName: Fabrício S. Matté
authorLink: https://twitter.com/UltCombo
authorDescription: ECMAScript enthusiast, open source addict and Web Platform lover.
authorPicture: https://pbs.twimg.com/profile_images/490627147963187200/2BiH3pv4.png
-->
The Temporal Dead Zone refers to a new set of ECMAScript semantics regarding scope, introduced in ES2015 (aka ES6).<!--more-->

Although the name may sound a bit intimidating, the concept is not hard to grasp, actually. But first, let's take one step back and look at how scoping works in ES5:

```javascript
var x = 'outer scope';
(function() {
    console.log(x);
    var x = 'inner scope';
}());
```

Upon executing the code above, can you tell what the `console.log(x)` prints? If you guessed `undefined`, then keep reading. Otherwise, please take the time to read about declarations hoisting ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var#var_hoisting), [Adequately Good](http://www.adequatelygood.com/JavaScript-Scoping-and-Hoisting.html)) and [variable shadowing](http://en.wikipedia.org/wiki/Variable_shadowing), as these concepts are key to fully understanding TDZ.

---

# Enter the Temporal Dead Zone

Alright, now let's take a small step forward and begin with an extremely simple and contrived TDZ scoping example:

```javascript
console.log(x); // throws a ReferenceError
let x = 'hey';
```

As you can see, one of the main differences between the old `var` and the new `let`/`const` declarations (besides their [scope](/2014/08/what-you-need-to-know-about-block-scope-let/)) is that the latter are constrained by the Temporal Dead Zone semantics, meaning they will throw a `ReferenceError` when accessed (read/write) before they are initialized, instead of returning `undefined` as a `var`-declared variable would. This makes the code more predictable and easier to spot potential bugs. Simple, isn't it?

# Well, TDZ is not quite so simple

Taking a second look at the previous example, one could deduce that `let`/`const` declarations simply do not hoist, and that would explain the `ReferenceError`, right? **Nope**, that's an incorrect over-simplification *(and beware of uninformed resources claiming that!)*.

Let's go back to the very first example in this article, replacing `var` with `let` and see what happens:

```javascript
let x = 'outer scope';
(function() {
    console.log(x);
    let x = 'inner scope';
}());
```

Can you guess what `console.log(x)` will print now? Well, actually, the answer is nothing -- the code above will throw a `ReferenceError` due to the TDZ semantics. That is because **`let`/`const` declarations do hoist**, but **they throw errors when accessed before being initialized** (instead of returning `undefined` as `var` would). And yes, I had already written the very same statement a couple of paragraphs above, but this is actually the main point of TDZ and it is worth repeating as much as necessary (in fact, go ahead and do some memory training -- repeat the bold parts in this paragraph until it digs deep into your brain `;)`). Of course, this is still a bit of an over-simplification, I've put a lot of effort in balancing accuracy with simplicity to make an easy to remember and understand overview. Now onto the details...

# The gory details

A true enthusiast wouldn't be satisfied with two bold half-assed statements, am I right? Let's dig a bit deeper into the TDZ scope then.

The ECMAScript 2015 spec. clearly explains the hoisting and TDZ semantics in a [non-normative note](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-let-and-const-declarations):

> #### 13.2.1 Let and Const Declarations
> NOTE `let` and `const` declarations define variables that are scoped to [the running execution context](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-execution-contexts)’s [LexicalEnvironment](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-execution-contexts). The variables are created when their containing [Lexical Environment](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-lexical-environments) is instantiated but may not be accessed in any way until the variable’s *LexicalBinding* is evaluated. A variable defined by a *LexicalBinding* with an *Initializer* is assigned the value of its *Initializer*’s *AssignmentExpression* when the *LexicalBinding* is evaluated, not when the variable is created. If a *LexicalBinding* in a `let` declaration does not have an *Initializer* the variable is assigned the value `undefined` when the *LexicalBinding* is evaluated.

// TODO desiccate the quote above

# TDZ is everywhere!

# TDZ is everywhere... Except in transpilers and engines

# References
