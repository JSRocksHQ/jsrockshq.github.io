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

As you can see, one of the main differences between the old `var` and the new `let`/`const` declarations (besides their [scope](/2014/08/what-you-need-to-know-about-block-scope-let/)) is that the latter are constrained by the Temporal Dead Zone semantics, meaning they will throw a `ReferenceError` when accessed (read/write) before being initialized, instead of returning `undefined` as a `var`-declared variable would. This makes the code more predictable and easier to spot potential bugs. Simple, isn't it?

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

Curious, are we? Let's travel a bit deeper into the TDZ then.

The ECMAScript 2015 spec. clearly explains the `let`/`const` declarations hoisting and TDZ semantics in a [non-normative note](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-let-and-const-declarations):

> #### 13.2.1 Let and Const Declarations
> NOTE `let` and `const` declarations define variables that are scoped to [the running execution context](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-execution-contexts)’s [LexicalEnvironment](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-execution-contexts). The variables are created when their containing [Lexical Environment](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-lexical-environments) is instantiated but may not be accessed in any way until the variable’s *LexicalBinding* is evaluated. A variable defined by a *LexicalBinding* with an *Initializer* is assigned the value of its *Initializer*’s *AssignmentExpression* when the *LexicalBinding* is evaluated, not when the variable is created. If a *LexicalBinding* in a `let` declaration does not have an *Initializer* the variable is assigned the value `undefined` when the *LexicalBinding* is evaluated.

Just in case your ECMAScript-fu is not sharp enough, I'll ~~dumb down~~ translate the relevant spec. parts to English:

> The variables are created when their containing [Lexical Environment](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-lexical-environments) is instantiated [...]

This means whenever control flow enters a new scope (e.g. module, function or block scope), all the `let`/`const` bindings belonging to the given scope are instatiated before any code inside of the given scope is executed -- in other words, `let`/`const` declarations hoist!

> [...] but may not be accessed in any way until the variable’s *LexicalBinding* is evaluated.

This is the TDZ. A given `let`/`const`-declared binding can't be acessed in any way (read/write) until control flow has evaluated the declaration statement -- that does not refer to the hoisting, but rather to where the declaration actually is in the code. It is easier to explain with examples:

```javascript
// Acessing `x` here before control flow evaluates the `let x` statement
// would throw a ReferenceError due to TDZ.
// console.log(x);

let x = 42;
// From here on, accessing `x` is perfectly fine!
console.log(x);
```

> If a *LexicalBinding* in a `let` declaration does not have an *Initializer* the variable is assigned the value `undefined` when the *LexicalBinding* is evaluated.

This simply means that:

```javascript
let x;
```

Is equivalent to:

```javascript
let x = undefined;
```

Likewise, trying to access `x` in any way before control flow evaluates the initializer (or the "implicit" `= undefined` initializer) will result in a `ReferenceError`, while accessing it after the control flow has evaluated the declaration will work fine -- reading the `x` variable after the `let x` declaration in both samples above would return `undefined`.

Hopefully you should have a good idea of the TDZ semantics by now, so let's try out some slightly more advanced examples to exercise.

Consider this code:

```javascript
let x = x;
```

Does the code execute? What is the value of `x` after the code executes?

First off, remember that a `let`/`const` variable only counts as initialized after its initializer has been fully evaluated -- that is, after the assignment's right-hand side expression has been evaluated and its resulting value has been assigned to the declared variable.

In this case, the right-hand side expression tries to read the `x` variable, but `x`'s initializer has not been fully evaluated yet -- in fact we are evaluating it at that point -- so `x` still counts as uninitialized at that point and thus trying to read it throws a TDZ `ReferenceError`.

Alright, so here is another slightly advanced TDZ example -- [courtesy](https://github.com/google/traceur-compiler/issues/1382#issuecomment-57182072) of TC39er and Traceur maintainer Erik Arvindson:

```javascript
let a = f();
const b = 2;
function f() { return b; }
```

In the first line, the `f()` call makes control flow jump to and execute the `f` function, which in turn tries to read the `b` variable which, at this point in the runtime, is still unitialized (in TDZ) and thus throws a `ReferenceError`. As you can see, TDZ semantics apply when trying to access variables from parent scopes as well.

# TDZ is everywhere!

So far I've only shown examples with `let`/`const` declarations, but the TDZ semantics actually apply to a wide area of the ES2015 spec. For instance, default parameters also have TDZ semantics:

```javascript
// Works fine.
(function(a, b = a) {
	a === 1;
	b === 1;
}(1, undefined));

// Default parameters are evaluated from left to right,
// so `b` is in the TDZ when `a`'s initializer tries to read it.
(function(a = b, b) {}(undefined, 1)); // ReferenceError

// `a` is still in the TDZ when its own initializer tries to read `a`.
// See the "gory details" section above for more details.
(function(a = a) {}()); // ReferenceError
```

One may wonder, then, what happens in this case:

```javascript
let b = 1;
(function(a = b, b) {
	console.log(a, b);
}(undefined, 2));
```

The example above may look a bit confusing, but it is actually a TDZ violation too -- that is because [default parameters are evaluated in an intermediate scope](https://github.com/google/traceur-compiler/issues/1376) which exists between the parent and inner scope of the given function. The `a` and `b` parameters are bindings of this (intermediate) scope and are initialized from left to right, hence when `a`'s initializer tries to read `b`, the `b` identifier resolves to the `b` binding in the current scope (the intermediate scope) which is unitialized at that point and thus throws a ReferenceError due to the TDZ semantics.

As another example, subclasses (created with `class x extends y {}`)'s constructors that try to access `this` before calling the `super` constructor will throw a TDZ `ReferenceError`. Reference: [ES6 super construct proposal](https://github.com/tc39/ecma262/blob/master/workingdocs/ES6-super-construct%3Dproposal.md). *(note, though, that this proposal is only two weeks old as of the time of this writing, so it may be changed or discarded altogether from the final ES2015 spec.)*

# TDZ is everywhere... Except in transpilers and engines

# TODO

future `var`, ECMAScript modes, refactoring hazards

# References
