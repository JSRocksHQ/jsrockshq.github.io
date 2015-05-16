<!--
layout: post
title: Lo que necesitás saber sobre block scope - let
date: 2014-08-28T01:58:23.465Z
comments: true
published: true
keywords:
description: Una introducción a block scope en ES6
categories: scope, articles, basics
authorName: Jaydson Gomes
authorLink: http://twitter.com/jaydson
authorDescription: JavaScript enthusiast - FrontEnd Engineer at Terra Networks - BrazilJS and RSJS curator
authorPicture: https://pbs.twimg.com/profile_images/453720347620032512/UM2nE21c_400x400.jpeg
-->
<!--more-->
La declaración de variables es algo bastante básico en cualquier lenguaje de programación.  
Independientemente del lenguaje de programación, entender cómo funciona el ámbito (scope) de las variables es fundamental para escribir cualquier tipo de programa.


Por ejemplo, en Python, como en la mayoría de los lenguajes, hay dos scopes: Local y Global. Las variables definidas al principio del archivo, sin indentación, son variables globales. En cambio, las variables declaradas dentro del cuerpo de una función son consideradas locales al scope.  


Hasta acá, todo es bastante parecido. En JavaScript, el comportamiento es muy similar.  

Veamos un ejemplo en ambos lenguajes:  

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

En la mayoría de los lenguajes basados en C (JavaScript, PHP), las variables son creadas en el lugar donde fueron declaradas.  
Sin embargo, en JavaScript es diferente y puede llegar a ser complicado.

En JavaScript, cuando se declara una variable en el cuerpo de una función (sin usar la palabra `var`), la variable se "mueve hacia arriba" o se declara en el scope global. Este comportamiento se conoce como [_hoisting_](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var#var_hoisting).  

A diferencia de Python y otro lenguajes, en JavaScript, una variable declarada en un bucle `for` pierde su valor.  

Veamos el siguiente ejemplo:  
```javascript
// JavaScript
for (var i = 0; i <= 2; i += 1) {
	console.log(i); // current i
}
console.log(i); // last i
```

En este caso, incluso fuera del bucle `for`, la variable `i` sigue existiendo y mantiene el útlimo valor que le fue asignado.
Este es un problema muy común donde un programa puede romperse facilmente por no prestar atención. 

Otro factor importante en JavaScript, es que el omitir `var` para declarar una variable hace que se asigne al scope global, y esto puede causar muchos problemas.


## let
`let` llega en ES6 para reemplazar a `var`. Si, la idea es que se deje de usar `var` en un futuro lejano, ya que hoy es imposible sin romper todo internet. `let` funciona como esperamos, crea la variable en el lugar donde fue declarada.  

Por ejemplo:  
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

Como se puden imaginar, `let` soluciona el problema con la variable en el bucle `for`.  

Veamos el siguente ejemplo:  
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

## Soporte
Puedes empezar a usar `let` hoy mismo*. Actualmente, `let` está siendo soportado en las últimas versiones de los navegadores modernos (incluso IE11) y en [Traceur](https://github.com/google/traceur-compiler).


Te recomiendo que revises la tabla de compatibilidad de ES6 que armó [@Kangax](https://twitter.com/kangax) > [http://kangax.github.io/compat-table/es6/](http://kangax.github.io/compat-table/es6/).  

Puedes probarlo en el devtools de Firefox:

![let en firefox nightly](/img/let.gif)  

* __NOTA__: Como bien lo indicó Michał Gołębiowski en los comentarios, las implementaciones de los navegadores nos son totalmente compatibles con la especificación, por lo tanto pueden llegar a haber algunos bugs.  
Para aplicaciones reales en producción, vas a necesitar un transpiler (por lo menos, hasta mediados del 2015).  

## Conclusión
- Declarar variables en JavaScript puede causar dolores de cabeza para aquellos que recién empiezan con el lenguaje.  
- Usar `let`, para declarar las variables, es mucho más intuitivo y consistente con los lenguajes basados en C.  
- Se debe dejar de usar `var` y, en el futuro, solamente vamos a usar `let`.  
- No ocurre `hoisting` para las variables declaradas con `let`.

