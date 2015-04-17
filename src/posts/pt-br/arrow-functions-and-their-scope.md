<!--
layout: post
title: Arrow Functions and their scope
date: 2014-10-01T04:01:41.369Z
comments: true
published: true
keywords: arrow functions, es6, escope
description: Read about arrow functions in ES6, and their scopes.
categories: scope, articles, basics
authorName: Felipe N. Moura
authorLink: http://twitter.com/felipenmoura
authorDescription: FrontEnd Engineer at Terra Networks - BrazilJS and RSJS curator
authorPicture: /avatars/felipenmoura.png
-->
Entre as tantas novas features presentes no ES6, Arrow Functions (ou Fat Arrow Functions), é uma que merece boa atenção!<!--more-->
É muito legal, ótima para trabalhar com escopos, serve como "atalho" para algumas tecnicas que utilizamos hoje, diminui o código...
Mas pode ser um pouco mais difícil de ler caso não esteja a par de como ela funciona.
Então, vamos mergulhar no assunto!

## Começando

Para estudar e tester por você mesmo, você pode simplesmente copiar alguns dos exemplos deste artigo, e colar no console de seu browser.
Até o momento, você pode usar o Firefox(22+) Developer Tools, que já oferece suporte a arrow functions.
No Google Chrome, você precisará habilita-lo:
- \- Habilite: Vá até "about:flags", e habilite a opção "Experimental JavaScript"
- \- Use sempre em uma função em strict mode, por tanto, para rodar no console do Google Chrome, use:

```javascript
(function(){
    "use strict";
    // use arrow functions aqui
}());
```

Com tempo, felizmente, mais browsers suportarão as features do ES6.
Agora que tudo está preparado, vamos começar!

## Um novo Token

Um novo Token foi adicionado ao ES6, e é chamado "fat arrow", representado por:
```javascript
=>
```

## A nova sintaxe

Com este novo token, entra uma nova sintaxe:

```javascript
param => expression
```

Sintaxe a qual podemos usar algumas variações, de acordo com o número de statements na expressão, e número de parâmetros passados para a função:

```javascript
// single param, single statement
param => expression;

// multiple params, single statement
(param [, param]) => expression;

// single param, multiple statements
param => {
    statements;
}

// multiple params, multiple statements
([param] [, param]) => {
    statements
}

// with no params, single statement
() => expression;

// with no params
() => {
    statements;
}

// one statement, returning an object
([param]) => ({ key: value });

```

## Como funciona

Se fossemos "traduzir" arrow functions para algo que já usamos hoje em dia, seria algo assim:

```javascript
// esta função
var func = function (param) {
    return param.split(" ");
}

// se tornaria:
var func= param => param.split(" ");

```

Isto quer dizer que esta sintaxe realmente retorna uma nova função, com os parâmetros e statements.
Ou seja, podemos chamar esta função do mesmo modo que já estamos acostumados:

```javascript
func("Felipe Moura"); // retorna ["Felipe", "Moura"]
```

## Immediately-invoked function expression (IIFE)

Sim, você pode invocar funções imediatamente, já que elas são na verdade, expressões.

```javascript
( x => x * 2 )( 3 ); // 6
```

Uma função será criada. Esta função recebe o parâmetro `x`, e retorna `x * 2`, então, é imediatamente executada passando o valor `3` como parâmetro.

Caso tenha mais statements ou parâmetros:

```javascript
( (x, y) => {
    x= x * 2;
    return x + y;
})( 3, "A" ); // "6A"

```

## Considerações Relevantes

Considerando:

```javascript
var func = x => {
    return x++;
};
```

Podemos apontar algumas considerações relevantes:

**- `arguments` funciona exatamente como esperado**
```javascript
console.log(arguments);
```

**- `typeof` e `instanceof` também**
```javascript
func instanceof Function; // true
typeof func; // function
func.constructor == Function; // true
```

**- Usando parênteses internos, como sugerido pelo jsLint, NÃO funciona**
```javascript
// funciona, como sugerido pelo JSLint
(function (x, y){
    x= x * 2;
    return x + y;
} (3, "B") );

// não funciona
( (x, y) => {
    x= x * 2;
    return x + y;
} ( 3, "A" ) );

// mas funcionaria, se a última linha fosse
// })(3, "A");
```

**- Apesar de ser uma função, não funciona como um Constructor**

```javascript
var instance= new func(); // TypeError: func is not a constructor
```

**- Não tem um prototype**

```javascript
func.prototype; // undefined
```

## Escopo

O `this` no escopo de arrow functions funciona de uma forma diferente.
No modo como estamos acostumados, `this` pode referenciar-se a: `window` (se for acessado globalmente), `undefined` (se acessado globalmente, em strict mode), uma _instância_ (se em um construtor), um _objeto_ (se for um método ou função dentro de um objeto ou instância) ou em um `.bind`/`.apply`. Pode ser também um `DOMElement`, por exemplo, quando usado em um addEventListener. <!-- TODO buscar melhor termo para "acessado globalmente" -->
Algumas vezes, isto incomoda bastante, ou pode até mesmo nos pegar de surpresa e causar algum problema!
Além disso, _this_ é referenciado como _"scope-by-flow"_ (fluxo-escopo). O que quero dizer com isto?

Vejamos primero, como `this` se comporta em diferentes situações:

Em um EventListener:
```javascript
document.body.addEventListener('click', function(evt){
    console.log(this); // o próprio HTMLBodyElement
});
```

Em instâncias:
```javascript
function Person () {
    let fullName = null;
    this.getName = function () {
        return fullName;
    };
    this.setName = function (name) {
        fullName = name;
        return this;
    };
}

let jon = new Person();
jon.setName("Jon Doe");
console.log(jon.getName()); // "Jon Doe"
```

Nesta situação em particular, uma vez que `Person.setName` é "chainable" (retornando a própria instância), poderíamos também usar assim:
```javascript
jon.setName("Jon Doe")
   .getName(); // "Jon Doe"
```

Em um objeto:
```javascript
let obj = {
    foo: "bar",
    getIt: function () {
        return this.foo;
    }
};

console.log( obj.getIt() ); // "bar"
```

Mas então, vem a situação que citei acima, do formato escopo/fluxo.
Se tanto o fluxo ou o escopo mudam, `this` muda com ele.

```javascript
function Student(data){

    this.name = data.name || "Jon Doe";
    this.age = data.age>=0 ? data.age : -1;

    this.getInfo = function () {
        return this.name + ", " + this.age;
    };

    this.sayHi = function () {
        window.setTimeout( function () {
            console.log( this );
        }, 100 );
    }

}

let mary = new Student({
    name: "Mary Lou",
    age: 13
});

console.log( mary.getInfo() ); // "Mary Lou, 13"
mary.sayHi();
// window

```

Uma vez que `setTimeout` muda o fluxo da execução, a referência ao `this` se torna a referência "global" (neste caso, `window`), ou `undefined` se em "strict mode".
Por causa disto, acabamos usando algumas técnicas como o uso de variáveis como "self", "that", ou alguma coisa assim, ou tendo que usar `.bind`.

Mas não se preocupe, arrow functions estão aqui para ajudar!
Com arrow functions, o escopo é mantido com ela, de onde ela foi chamada.

Vejamos o MESMO exemplo acima, mas usando arrow function, passada para a chamada do _setTimeout.
```javascript
function Student(data){

    this.name = data.name || "Jon Doe";
    this.age = data.age>=0 ? data.age : -1;

    this.getInfo = function () {
        return this.name + ", " + this.age;
    };

    this.sayHi = function () {
        window.setTimeout( ()=>{ // a única diferença está aqui
            console.log( this );
        }, 100 );
    }

}

let mary = new Student({
    name: "Mary Lou",
    age: 13
});

console.log( mary.getInfo() ); // "Mary Lou, 13"
mary.sayHi();
// Object { name: "Mary Lou", age: 13, ... }
```

## Abordagens úteis e interessantes

Já que é muito fácil criar arrow functions, e seus escopos funcionam como o mensionado, podemos usá-las de várias formas.

Por exemplo, podemos usa-las diretamente na chamada de um forEach, em uma Array:
```javascript
var arr= ['a', 'e', 'i', 'o', 'u'];
arr.forEach(vowel => {
console.log(vowel);
});
```

Ou em um `Array#map`:
```javascript
var arr= ['a', 'e', 'i', 'o', 'u'];
arr.map(vogal => {
    return vogal.toUpperCase();
});
// [ "A", "E", "I", "O", "U" ]
```

Ou em uma função recursiva:

```javascript
var fatorial = (n) => {
    if(n==0) {
        return 1;
    }
    return (n * fatorial (n-1) );
}

fatorial(6); // 720
```

Também, digamos, ordenando uma Array de trás para frente:
```javascript
let arr= ['a', 'e', 'i', 'o', 'u'];
arr.sort( (a, b)=> a < b? 1: -1 );
```

Ou em listeners:
```javascript
document.body.addEventListener('click', event=>console.log(event, this)); // EventObject, BodyElement
```

## Links úteis

Aqui, pegue alguns links úteis para dar uma olhada:
- \- [Arrow Functions na documentação da MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
- \- [TC39 Wiki sobre Arrow Function](http://tc39wiki.calculist.org/es6/arrow-functions/)
- \- [ESNext](https://github.com/esnext)
- \- [ES6 Tools](https://github.com/addyosmani/es6-tools)
- \- [Grunt ES6 Transpiler](https://www.npmjs.org/package/grunt-es6-transpiler)
- \- [ES6 Fiddle](http://www.es6fiddle.net/)
- \- [ES6 Compatibility Table](http://kangax.github.io/compat-table/es6/)

## Conclusão

Mesmo que Arrow Functions tornem seu código um pouco mais complicado de ler (mas que você acaba se acostumando rápido), é uma grande solução para referências ao `this` em escopos e fluxos diferentes, um modo rápido para colocar as coisas para funcionar, e em parceria com o keyword `let`, levará nosso JavaScript para um próximo nível!
Experimente você mesmo, crie alguns testes, rode em seus browsers e deixe alguma solução ou uso interessante que encontrou, nos comentários!
Espero que tenha apreciado este artigo tanto quanto apreciará utilizar arrow functions em um futuro muito próximo!
