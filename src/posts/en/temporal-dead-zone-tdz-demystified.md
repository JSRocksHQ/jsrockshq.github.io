<!--
layout: post
title: Temporal Dead Zone (TDZ) demystified
date: 2015-01-31T18:19:51.753Z
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
<!--more-->
The Temporal Dead Zone refers to a new set of ECMAScript semantics regarding scope, introduced in ES2015 (aka ES6).

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

Can you guess what `console.log(x)` will print now? Well, actually, the answer is nothing -- the code above will throw a `ReferenceError` due to the TDZ semantics. That is because **`let`/`const` declarations do hoist**, but **they throw errors when accessed before being initialized** (instead of returning `undefined` as `var` would). I know the previous statement has already been expressed in this article, but this is actually the main point of TDZ and it is worth repeating as much as necessary (in fact, go ahead and do some memory training -- repeat the bold parts in this paragraph until it digs deep into your brain `;)`).

Of course, this is still a bit of an over-simplification, I've put a lot of effort in balancing accuracy with simplicity to make an easy to remember and understand overview. Now onto the details...

# The gory details

Curious, are we? Let's travel a bit deeper into the TDZ then.

The ECMAScript 2015 spec. clearly explains the `let`/`const` declarations hoisting and TDZ semantics in a [non-normative note](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-let-and-const-declarations):

> #### 13.2.1 Let and Const Declarations
> NOTE `let` and `const` declarations define variables that are scoped to [the running execution context](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-execution-contexts)’s [LexicalEnvironment](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-execution-contexts). The variables are created when their containing [Lexical Environment](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-lexical-environments) is instantiated but may not be accessed in any way until the variable’s *LexicalBinding* is evaluated. A variable defined by a *LexicalBinding* with an *Initializer* is assigned the value of its *Initializer*’s *AssignmentExpression* when the *LexicalBinding* is evaluated, not when the variable is created. If a *LexicalBinding* in a `let` declaration does not have an *Initializer* the variable is assigned the value `undefined` when the *LexicalBinding* is evaluated.

Just in case your ECMAScript-fu is not sharp enough, I'll translate the relevant spec. parts to English:

> The variables are created when their containing [Lexical Environment](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-lexical-environments) is instantiated [...]

This means whenever control flow enters a new scope (e.g. module, function or block scope), all the `let`/`const` bindings belonging to the given scope are instatiated before any code inside of the given scope is executed -- in other words, `let`/`const` declarations hoist!

> [...] but may not be accessed in any way until the variable’s *LexicalBinding* is evaluated.

This is the TDZ. A given `let`/`const`-declared binding can't be acessed in any way (read/write) until control flow has evaluated the declaration statement -- that does not refer to the hoisting, but rather to where the declaration actually is in the code. It is easier to explain with examples:

```javascript
// Accessing `x` here before control flow evaluates the `let x` statement
// would throw a ReferenceError due to TDZ.
// console.log(x);

let x = 42;
// From here on, accessing `x` is perfectly fine!
console.log(x);
```

And the last part:

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

Does the code execute without errors? What is the value of `x` after the code executes?

First off, remember that a `let`/`const` variable only counts as initialized after its initializer has been fully evaluated -- that is, after the assignment's right-hand side expression has been evaluated and its resulting value has been assigned to the declared variable.

In this case, the right-hand side expression tries to read the `x` variable, but `x`'s initializer has not been fully evaluated yet -- in fact we are evaluating it at that point -- so `x` still counts as uninitialized at that point and thus trying to read it throws a TDZ `ReferenceError`.

Alright, so here is another slightly advanced TDZ example -- [courtesy](https://github.com/google/traceur-compiler/issues/1382#issuecomment-57182072) of TC39 member and Traceur maintainer Erik Arvindson:

```javascript
let a = f();
const b = 2;
function f() { return b; }
```

In the first line, the `f()` call makes control flow jump to and execute the `f` function, which in turn tries to read the `b` constant which, at this point in the runtime, is still uninitialized (in TDZ) and thus throws a `ReferenceError`. As you can see, TDZ semantics apply when trying to access variables from parent scopes as well.

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

The example above may look a bit confusing, but it is actually a TDZ violation too -- that is because [default parameters are evaluated in an intermediate scope](https://github.com/google/traceur-compiler/issues/1376) which exists between the parent and inner scope of the given function. The `a` and `b` parameters are bindings of this (intermediate) scope and are initialized from left to right, hence when `a`'s initializer tries to read `b`, the `b` identifier resolves to the `b` binding in the current scope (the intermediate scope) which is uninitialized at that point and thus throws a `ReferenceError` due to the TDZ semantics.

As another example, subclasses (created with `class x extends y {}`)'s constructors that try to access `this` before calling the `super` constructor will throw a TDZ `ReferenceError`. That is because as long as a subclass's constructor has not yet called `super()` its `this` binding is considered uninitialized. Likewise, if a subclass constructor execution reaches the end of the constructor code without calling `super()`, the constructor would (like any other constructor) implicitly try to `return this;`, which would then throw a TDZ `ReferenceError` as `this` is still uninitialized. Reference: [ES6 super construct proposal](https://github.com/tc39/ecma262/blob/master/workingdocs/ES6-super-construct%3Dproposal.md). *(note, though, that this proposal is only two weeks old at the time of writing, so it may be changed or discarded altogether from the final ES2015 spec.)*

# TDZ is everywhere... Except in transpilers and engines

Currently, transpilers such as 6to5 and Traceur do not enforce TDZ semantics whatsoever -- there are open issues in [Traceur](https://github.com/google/traceur-compiler/issues/1382) and [6to5](https://github.com/6to5/6to5/issues/563), and just to be pendantic, 6to5 attempted to ship a quick and dirty TDZ static checking feature but had to retract it immediately afterwards due to [various bugs in the algorithm](https://github.com/6to5/6to5/issues/527). There are quite a few reasons transpilers didn't give much priority to TDZ enforcing yet:

- **Performance:** identifiers that are covered by the TDZ semantics must have every read/write access operation wrapped by a runtime check in order to fully cover the TDZ semantics (see the nested scope example in the "gory details" section above). This issue can be worked around by having optional TDZ checking transformers that are only enabled in a development environment -- this should work fine as long as your code doesn't expect TDZ `ReferenceError`s being thrown in order to work properly (which should be a rare enough use case).

- **Cost/benefit:** Implementing proper TDZ checking takes some time and effort that could be spent writing transformers for new features or improving existing ones.

- **It is impossible to catch all possible user errors**: most transpilers' goal is to transpile *valid* ES.next to valid ES.current, so they expect you to know what you're doing. It would take a nearly infinite amount of time to try to catch all kinds of errors, gibberish and marginal error edge cases that an user can input into a transpiler.

And as of the time of writing, no browser JavaScript engine has full `let` declaration spec. compliancy ([reference](http://kangax.github.io/compat-table/es6/#let)). Firefox Nightly (version 38.0a1 (2015-01-30) at the time of writing) ships with a nice, clean and objective TDZ error message though:

```javascript
{ x; let x; }
// ReferenceError: can't access lexical declaration `x' before initialization
```

This means you must be extra careful when making use of transpilers, as you may be writing code that seems okay right now but that may break any time you update the transpiler to a version which enforces proper TDZ semantics, or when you try to run the code without a transpiling step in an ES2015+ TDZ-compliant environment.

# And what about `var`?

`var`-declared variables will still behave as they currently do in ES5 -- the ECMAScript spec. must always evolve in backwards-compatible ways in order for browser vendors to adopt the new spec. without breaking the web. Theoretically, it could be possible to apply TDZ semantics to `var` by introducing a new "execution mode" (similar to `'use strict'`), however that is very unlikely to happen seeing as:

- The majority of TC39 opposes adding more execution modes/pragmas/flags.
- Even if such new execution mode were to be implemented, enforcing TDZ semantics on `var`-declared variables would introduce an unnecessary entry barrier and refactoring hazards to those who want to port their existing code to the hypothetical new execution mode.

# Closing words

The Temporal Dead Zone semantics can be very useful by providing error feedback to the developer instead of yielding unexpected results (as ES5 code may currently do) in cases where your code may accidentally access uninitialized bindings. Just be aware of these semantics when using a transpiler that does not enforce TDZ, as you may be writing broken code without knowing it.

Or, just in case you're really afraid of TDZ -- which you shouldn't be, seeing as most of the time the errors will be clear and easy to fix once transpilers/engines implement the TDZ semantics --, you may as well keep using `var` for the time being which does not have TDZ semantics. `;)`

# Further reading

- [Temporal Dead Zone explanations](https://gist.github.com/rwaldron/f0807a758aa03bcdd58a) by TC39 members Rick Waldron and Allen Wirfs-Brock.
- [let - JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) at Mozilla Developer Network.
- [Block-Scoped Declarations - You Don't Know JS: ES6 & Beyond](https://github.com/getify/You-Dont-Know-JS/blob/master/es6%20&%20beyond/ch2.md#block-scoped-declarations) by Kyle Simpson.
- [ES6 Notes: Default values of parameters](http://dmitrysoshnikov.com/ecmascript/es6-notes-default-values-of-parameters/) by Dmitry Soshnikov.
