<!--
layout: post
title: O que você precisa saber sobre block scope - let
date: 2014-08-28T01:58:23.465Z
comments: true
published: true
keywords:
description: Uma introdução a block scope na ES6
categories: scope, articles, basics
authorName: Jaydson
authorLink: http://twitter.com/jaydson
authorDescription: JavaScript enthusiast - FrontEnd Engineer at Terra Networks - BrazilJS and RSJS curator
authorPicture: https://pbs.twimg.com/profile_images/453720347620032512/UM2nE21c_400x400.jpeg
-->
Declaração de variáveis em qualquer linguagem de programação é algo básico.  
Independente da linguagem, entender o funcionamento do escopo de variáveis é imprescindível para escrever qualquer programa.  
Em Python, por exemplo, assim como na maioria das linguagens, existem 2 escopos: Local e Global.  
Variáveis definidas na raíz do arquivo, sem identação são variáveis de escopo Global.  
Variáveis que são declaradas dentro do corpo de uma função são consideradas de escopo local.  
Até aqui, tudo é muito parecido. No JavaScript o comportamente é bem semelhante.  
Vejamos um exemplo nas 2 linguagens:  
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
Na maioria das linguagens baseadas em C (JavaScript, PHP), as variáveis são criadas no local onde foram declaradas.  
Entretanto, no JavaScript isso é diferente, e pode se tornar complicado.  
Ao declarar uma variável no corpo de uma função, a mesma é movida para o topo ou para o escopo global. Esse comportamento é chamado de [_hoisting_](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var#var_hoisting).  
Diferentemente de Python e outras linguagens, no JavaScript, uma variável declarada em um for loop acaba vazando o seu valor.  
Veja no exemplo abaixo:  
```javascript
// JavaScript
for (var i = 0; i <= 2; i += 1) {
	console.log(i); // current i
}
console.log(i); // last i
```
Neste caso, mesmo fora do bloco do for loop, a variável i ainda existe e com o último valor recebido no laço.  
Este é um problema bem comum onde um programa pode ser facilmente quebrado por falta de atenção.  

Outro fator importante no JavaScript é que a omissão de _var_ para declarar uma variável faz com que a mesma seja alocada no escopo global, e isso pode causar inúmeros problemas.  

## Declaração let
O _let_ chega na ES6 como um substituto do _var_. Sim, a ideia é que var seja descontinuado em um futuro distante, pois hoje seria impossível não suporta-lo sem quebrar 100% da internet.  
O _let_ funciona como o esperado, definindo a variável no local onde ela foi declarada.  
Exemplo:  
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
Como você já deve imaginar, com _let_ é possível resolver o problema com a variável no for loop.  
Veja:  
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

## Suporte atual
Você pode usar _let_ hoje*  
Olhe a excelente tabela ES6 feita pelo Kangax > [http://kangax.github.io/compat-table/es6/#](http://kangax.github.io/compat-table/es6/#).  
_let_ é atualmente suporttado pelos browsers modernos(até no IE11) em suas últimas versões e no [Traceur](https://github.com/google/traceur-compiler).  
Você pode brincar com ES6 _let_ no Firefox devtools:  

![let on firefox nightly](/img/let.gif)  

* __NOTA__: Como bem apontado pelo Michał Gołębiowski nos comentários (do post em inglês http://es6rocks.com/2014/08/what-you-need-to-know-about-block-scope-let/#comment-1576757325), as implementações atuais dos browsers não estão totalmente de acordo com a especificação, então é possível encontrar alguns bugs.  
Para aplicações do mundo real, você precisará utilizar um transpiler(pelo menos por enquanto, até o meio de 2015).  

## Conclusão
Apesar de simples, declarar variáveis no JavaScript pode causar dor de cabeça em iniciantes na linguagem.  
Com o _let_, declarar variáveis fica muito mais intuítivo e coerente com uma linguagem baseada em C.  
O uso do _var_ deve ser descontinuado, e apenas o _let_ deve existir no futuro.  
Não existe o comportamento de _hoisting_ para variáveis declaradas com _let_.  

## Outras referências  
[https://people.mozilla.org/~jorendorff/es6-draft.html#sec-let-and-const-declarations](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-let-and-const-declarations)  
[https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let)  
[http://odetocode.com/blogs/scott/archive/2014/07/31/the-features-of-es6-part-1-let.aspx](http://odetocode.com/blogs/scott/archive/2014/07/31/the-features-of-es6-part-1-let.aspx)  