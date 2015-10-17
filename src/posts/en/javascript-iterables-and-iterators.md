<!--
layout: post
title: JavaScript iterables and iterators
date: 2015-09-15T04:06:02.428Z
comments: true
published: true
keywords: iterables, iterators, ES2015
description: Understanding JavaScript ES2015 Iterables and Iterators
categories: iterables, iterators, ES2015, articles
authorName: Fabrício S. Matté
authorLink: https://twitter.com/Ult_Combo
authorDescription: ECMAScript enthusiast, open source addict and Web Platform lover.
authorPicture: https://pbs.twimg.com/profile_images/490627147963187200/2BiH3pv4.png
-->
ECMAScript 2015 (ES6) introduces two new distinct, yet closely related, concepts: **iterables** and **iterators**.<br>
Now you will truly learn how important these concepts are and how to make good use of them.
<!--more-->

## Iterables

Iterable objects are objects that implement the [Iterable interface](http://www.ecma-international.org/ecma-262/6.0/index.html#sec-iterable-interface). That is, iterable objects expose a default iteration method, allowing them to define or customize their iteration behavior.

Let's see some examples:

```javascript
let iterable = [1, 2, 3];
for (let item of iterable) {
	console.log(item); // 1, 2, 3
}

let iterable2 = new Set([4, 5, 6]);
for (let item of iterable2) {
	console.log(item); // 4, 5, 6
}

let iterable3 = '789';
for (let item of iterable3) {
	console.log(item); // '7', '8', '9'
}
```

The [for-of](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Statements/for...of) statement accepts any iterable object, thus providing an uniform iteration syntax to completely distinct data structures by making use of the Iterable interface they implement.

### So what exactly is this Iterable interface you speak of?

Any object that contains a `[Symbol.iterator]` method is an iterable object.<br>
In case you are unfamiliar with [symbols](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Symbol), they are objects that can be used as property keys.<br>
`Symbol.iterator` is a [*well-known*](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Symbol#Well-known_symbols) (baked in the language) Symbol, whose primary usage is defining and consuming iterable objects.

In the previous examples, we were implicitly making use of the `[Symbol.iterator]` method inherited from the given objects' prototypes. Several built-ins such as [Array](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array), [Set](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Set), [String](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String) and [Map](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Map) define a default iteration behavior, while others such as [Object](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object) do not.

As previously mentioned, the Iterable interface allows defining and customizing objects' iteration order. For a quick example, we can borrow arrays' default iteration behavior (`Array.prototype[Symbol.iterator]`) to make array-like objects iterable:

```javascript
let iterable = {
	0: 'a',
	1: 'b',
	2: 'c',
	length: 3,
	[Symbol.iterator]: Array.prototype[Symbol.iterator]
};
for (let item of iterable) {
	console.log(item); // 'a', 'b', 'c'
}
```

Now you may be wondering: **"How do I implement custom iteration behavior?"**<br>
As you already know, adding a `[Symbol.iterator]` method to a given object makes it iterable, but here is the catch: the `[Symbol.iterator]` method must return an *iterator object*, which is actually responsible for the iteration logic. We will cover this in the next section.

Before we move on to iterators, let's recap what the Iterable interface is about:

- It signals that a given object is iterable to consumers (iterable object: "Hey! I have a `[Symbol.iterator]` method.");
- It provides a standardized way to iterate any iterable object (iterable object: "Call my `[Symbol.iterator]` method if you want an iterator that implements my default iteration logic").

The points above may seem slightly redundant if you are familiar with interfaces (Java, C#), but it is worth being clear as this is a new addition to the JavaScript language.

Note that several built-in functions and language constructs that expect a sequence of values accept iterable objects. For instance, `Promise.all()` accepts any iterable object as argument, not just plain arrays. The same holds true for destructuring assignments (`[a, b] = iterable`) and `yield* iterable`.

## Iterators

Iterator objects are objects that implement the [Iterator interface](http://www.ecma-international.org/ecma-262/6.0/index.html#sec-iterator-interface). That is, iterator objects must have a `next` method that returns a result object in the `{ value: Any, done: Boolean }` format. The first call to the `next` method returns the result of the first iteration (e.g. the item at 0th index in an array). The `done` property signals when the iterator has been exhausted and no more values are available.

Here is some code to illustrate iterators:

```javascript
let iterable = ['a', 'b', 'c'];

// Explicit "low-level" iterator consumption:
let iterator = iterable[Symbol.iterator]();
iterator.next(); // { value: 'a', done: false }
iterator.next(); // { value: 'b', done: false }
iterator.next(); // { value: 'c', done: false }
iterator.next(); // { value: undefined, done: true }

// for-of abstracts away iterator instantiation and consumption:
for (let item of iterable) {
	console.log(item); // 'a', 'b', 'c'
}

// A crude illustration of for-of's inner workings:
for (let _iterator = iterable[Symbol.iterator](), _result, item; _result = _iterator.next(), item = _result.value, !_result.done;) {
	console.log(item); // 'a', 'b', 'c'
}
```

Now that we have understanding of iterables and iterators, we can create our own iterable objects and customize their default iteration behavior. Let's implement the iteration behavior for an array-like object from the ground up:

```javascript
let iterable = {
	0: 'a',
	1: 'b',
	2: 'c',
	length: 3,
	[Symbol.iterator]() {
		let index = 0;
		return {
			next: () => {
				let value = this[index];
				let done = index >= this.length;
				index++;
				return { value, done };
			}
		};
	}
};
for (let item of iterable) {
	console.log(item); // 'a', 'b', 'c'
}
```

I know, at first this may look very complex and messy, but don't panic. Let's walk through it.

We start by creating a plain object using the object literal syntax. It contains a `[Symbol.iterator]` method, defined using a combination of the [computed properties](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#Computed_property_names) and [shorthand methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Method_definitions) ES2015 object literal extensions. This object has a `[Symbol.iterator]` method, thus it is considered an iterable object.

The `[Symbol.iterator]` method implements the default iteration logic for the object, that is, it returns an iterator object and holds the state of the given iterator. The object returned by the `[Symbol.iterator]` method contains a `next` method, therefore it is considered an iterator object.

The iterator's `next` method is implemented using an [arrow function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions), so the `this` inside of it references the same object as the `this` used for the `[Symbol.iterator]` method invocation (i.e. the iterable data source).

The return value of the iterator's `next` method contains the `value` of the iteration and whether the iterator is `done` (exhausted). The example above defines those using the [shorthand properties](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#Property_definitions) syntax, by the way.

From here, you should be able to figure out how everything ties together. The `for-of` will call the `[Symbol.iterator]` method on the iterable passed in and iterate over the returned iterator, by calling its `next` method on every iteration and passing the result's `value` property to the loop body until the `next` method's result's `done` property is `true`.

### Is all this complexity necessary?

In short, yes. I'll address the most common doubts and misconceptions in QA format below.

#### Q. Why is `[Symbol.iterator]` a method that returns an iterator? Couldn't it be an iterator?

It is a method that returns an iterator because you may want to iterate over the same data source multiple times, even concurrently:

```javascript
let iterable = [1, 2, 3, 4];
let iterator1 = iterable[Symbol.iterator]();
let iterator2 = iterable[Symbol.iterator]();

iterator1.next(); // { value: 1, done: false }

iterator2.next(); // { value: 1, done: false }
iterator2.next(); // { value: 2, done: false }
iterator2.next(); // { value: 3, done: false }

iterator1.next(); // { value: 2, done: false }
```

This is a very contrived example, but in practice it is not uncommon to iterate over the same data source concurrently, applying asynchronous processing to each value between iterations. [Koa](http://koajs.com/) and [co](https://github.com/tj/co) are good examples of this, although they use generators which return iterators by being called directly (instead of having a `[Symbol.iterator]` method).

#### Q. Why iterators' `next` method returns a data structure? Couldn't it return just the value?

In the initial iterators design, the `next` method indeed did only return the value. But then, how would you know when the iterator has been exhausted? It was nothing pretty: the `next` method would have to throw an error to signal completion. That means all calls to `next` would have to be wrapped in a `try/catch` block, which was plainly terrible.

In order to avoid littering iterator consumption code with `try/catch` everywhere, as well as to avoid a bizarre iterator completion signaling mechanism, we settled with the `next` method returning an object with `value` and `done` properties.

#### Q. Why does it seem that the last iterator result value is ignored?

When the `next` method's result has the `done` property set to `true`, it means the iterator has been exhausted and can not provide an iteration value. An iterator implementation may set a `value` property alongside `done: true` in the iterator result object, but this `value` then has special meaning: it is treated as a *completion* value, not an iteration value, and as such is ignored by built-ins that consume iterables such as `for-of`, `Array.from`, destructuring and `yield*`.

Iterators spawned from generators are a clear example of this. The generator's return value is set as the completion `value` of the iterator result alongside `done: true`. This completion value is ignored by iterable-consuming built-ins, which only iterate over iteration values (provided via `yield` inside generators).

#### Q. Can an iterator implementation's `next` method take arguments?

Yes, it can! A prime example of this is passing values to inside generators, but we can make use of this in a vanilla iterator implementation as well:

```javascript
let echoIterator = {
	next(value) {
		return { value, done: false };
	}
};

echoIterator.next(42); // { value: 42, done: false }
```

As you can see, there's nothing really special about iterators. But be aware that, so far, there is no way to pass arguments to the `next` method of an iterator implicitly spawned by iterable-consuming built-ins. That is, `for-of`, `Array.from` and such do not provide a way to pass arguments to the `next` method.

#### Q. Are infinite iterators valid?

Yes, you can manually advance them by explicitly calling their `next` method when appropriate. However, you will get an infinite loop if you try to exhaust them, obviously.

### Optional iterator methods

Iterators may also implement optional `return` and `throw` methods, which are designed for more advanced use cases.

The `return` method can be used to dispose of resources that the iterator may be holding when closed early. For instance, if the body of the `for-of` reaches a `break` or `return` statement or throws an uncaught error, the `for-of` would implicitly call the iterator's `return` method (if it has such method).<br>
Note that my crude `for-of` reimplementation earlier in this post is incomplete and only illustrates the basic iteration functionality, you can see the [complexity of a precise for-of reimplementation on Babel](http://babeljs.io/repl/#?experimental=false&evaluate=true&loose=false&spec=false&playground=true&code=let%20iterable%20%3D%20%5B'a'%2C%20'b'%2C%20'c'%5D%3B%0D%0Afor%20%28let%20item%20of%20iterable%29%20%7B%0D%0A%09console.log%28item%29%3B%20%2F%2F%20'a'%2C%20'b'%2C%20'c'%0D%0A%7D%0D%0A&runtime=true).

The `throw` method can be used to notify the iterator of an error condition.

## Iterable iterators

Let's do a quick recap:

- The Iterable interface requires the implementation of a `[Symbol.iterator]` method;
- The Iterator interface requires the implementation of a `next` method.

You may have noticed that nothing prevents an object from implementing both Iterable and Iterator interfaces. That's what I call Iterable iterators (you may prefer Iterable Iterator objects, but I find that too verbose).

In fact, most iterators implement the Iterable interface. That is, most of them have a `[Symbol.iterator]` method, but note that iterators' `[Symbol.iterator]` method usually returns the iterator itself instead of a new iterator:

```javascript
let iterable = [1, 2];
let iterator = iterable[Symbol.iterator]();
iterator[Symbol.iterator]() === iterator; // true
```

It is trivial to make an Iterable iterator:

```javascript
let iterableIterator = {
	next() {/*...*/},
	[Symbol.iterator]() {
		return this;
	}
};
```

And now you may ask, **"How is this useful?"**

Well, first consider that **a single data source may have multiple iteration behaviors.**<br>
Then, consider that iterables can only expose a single default iteration behavior.<br>
Finally, remember that `for-of` and other iterable consumers take an iterable object and implicitly call its default iteration behavior (the `[Symbol.iterator]` method) to get an iterator.

Telling an iterable consumer (e.g. `for-of`) to use a non-default iterator (an iterator other than the one returned by the `[Symbol.iterator]` method) for a given data source seems like a complex problem at first, right? Well, if you do the math correctly, Iterable iterators are the solution.

By adding a `[Symbol.iterator]` method to an iterator that simply returns the iterator itself, you are able to pass the iterator directly to an iterable consumer. When the consumer calls the `[Symbol.iterator]` method, the iterator itself will be returned and the consumer will iterate over it. Simpler than it seems, right?

```javascript
let arr = ['a', 'b'];
let keysIterator = arr.keys(); // an alternative iterator for the data source
keysIterator[Symbol.iterator]() === keysIterator; // `keysIterator` is an Iterable iterator

// The for-of will implicitly call `keysIterator[Symbol.iterator]()` and get back the `keysIterator`,
// and then iterate over it.
for (let key of keysIterator) {
	console.log(key); // 0, 1 (the array indexes)
}

// Another example using the entries iterator, which returns `[key, value]` iteration values.
// We can destructure the entries iterator's iteration values for commodity.
for (let [key, value] of arr.entries()) {
	console.log(`${key}: ${value}`); // '0: a', '1: b'
}
```

## Trivia

- You've seen the `Array.prototype.keys` and `Array.prototype.entries` methods which return iterators, so you may wondering whether there is an `Array.prototype.values` method. The ECMAScript 2015 spec. does define an `Array.prototype.values` method, but browsers are wary of shipping it to the open Web due to potential breakage ([[1]](https://code.google.com/p/chromium/issues/detail?id=409858), [[2]](https://bugzilla.mozilla.org/show_bug.cgi?id=875433#c8)). Either way, `Array.prototype.values` would simply be a reference to `Array.prototype[Symbol.iterator]`, both would point to the same method so `Array.prototype.values` is not very important at all.

- It is possible to pass a partially consumed Iterable iterator to an iterable consumer to have it finish exhausting it:
```javascript
let iterator = [1, 2, 3, 4][Symbol.iterator]();
iterator.next();
iterator.next();
for (let item of iterator) {
	console.log(item); // 3, 4
}
```
This happens because the Iterable iterator's `[Symbol.iterator]` method returns itself instead of a new iterator, as previously mentioned.

## Rounding it up

Woah! You've managed to make it this far, congratulations! Now, hopefully you have a better understanding of iterables and iterators.

Let's do a quick recap:

- The Iterable interface provides a standardized way to iterate any iterable object (a `[Symbol.iterator]` method that returns an iterator);
- The Iterator interface allows objects to implement custom iteration logic (a `next` method that returns a `{ value, done }` object, and optional `return` and `throw` methods);
- Any object can implement the Iterable and/or Iterator interfaces;
- Iterators often implement the Iterable interface, which enables them to be fed to iterable consumers;
- The iterator completion `value` (when `done: true`) is usually ignored by iterable consumers;
- Several built-ins that you usually feed arrays to actually accept any iterable object (`for-of`, `Array.from`, `yield*`, `[a, b, ...rest] = iterable`);
- If you maintain an API that accepts arrays as argument, please consider supporting iterables: it is as simple as calling `Array.from(arg)` to turn any iterable argument into a true array.

So, I guess that's finally it. We reached the end of the line. You may be wondering what you will do with your life now, but I'm not sure whether I can answer this question. Perhaps you want to read about [Generators](http://www.ecma-international.org/ecma-262/6.0/index.html#sec-generatorfunction-objects) now? :)

And as always, if you can improve this article, please visit the [JS Rocks repository](https://github.com/JSRocksHQ/jsrockshq.github.io) and do so. I'll be glad to discuss and review improvements!

## Reference

- [ECMAScript® 2015 Language Specification - Ecma International](http://www.ecma-international.org/ecma-262/6.0/index.html)
- [for...of - MDN](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Statements/for...of)
- [Iteration protocols - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols)
- [for-of reimplementation - Babel](http://babeljs.io/repl/#?experimental=false&evaluate=true&loose=false&spec=false&playground=true&code=let%20iterable%20%3D%20%5B'a'%2C%20'b'%2C%20'c'%5D%3B%0D%0Afor%20%28let%20item%20of%20iterable%29%20%7B%0D%0A%09console.log%28item%29%3B%20%2F%2F%20'a'%2C%20'b'%2C%20'c'%0D%0A%7D%0D%0A&runtime=true)
- [Symbol - MDN](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
- [Object initializer - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer)
- [Method definitions - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Method_definitions)
- [Arrow functions - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
