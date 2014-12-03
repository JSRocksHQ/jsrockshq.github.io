<!--
layout: post
title: ES6: Brincando com o novo Javascript
date: 2014-11-13T23:30:23.830Z
comments: true
published: true
keywords: ES6, 6to5, Javascript
description: Como estudar e aprender ES6 criando experimentos e testes
categories: Articles
authorName: Pedro Nauck
authorLink: http://twitter.com/pedronauck
-->
<!--more-->
Acredito que boa parte dos desenvolvedores que tem convívio com JavaScript, já estão ouvindo falar da [nova versão do JavaScript](http://tc39wiki.calculist.org/es6/), conhecida também como ECMAScript 6 ou apenas ES6. Sei que alguns já ouviram falar, porém ainda não deram muita bola, e que outros nem sequer fazem idéia do que se trata. Se você se encaixa em ambos os casos, fique tranquilo, tudo isso ainda é relativemente novo. A notícia boa é que você tem tempo para estudar e aprender mais sobre o que está por vir.

> Amanhã, amanhã, não hoje! É o que todas as pessoas preguiçosas dizem.
- Provérbio Alemão

Mesmo sendo uma implementação nova, o ES6 já tem a maior parte sua estrutura pronta e, aos poucos, vão surgindo [diversas ferramentas](https://github.com/addyosmani/es6-tools) que podem lhe auxiliar a usá-la tanto no ambiente no browser, quanto no server. Usufruindo dos famosos [polyfills](https://github.com/addyosmani/es6-tools#polyfills), ou usando [transpilers](https://github.com/addyosmani/es6-tools#transpilers) para gerar códigos nativos a partir da nova especificação. Porém, sabemos que sempre há uma insegurança quanto a usar algo que não está 100% pronto em um ambiente de produção.

Mas já que ES6 veio para ficar e que muito em breve você terá que aprender - de um jeito ou de outro - por que não já ir estudando e testando na medida do possível. Assim você minimiza os riscos e já adianta conhecimento. Pois é, foi isso que pensei a um mês atrás quando comecei a estudar sobre o assunto e decidi brincar um pouco com a "nova linguagem". Começar a estudar esta nova versão do JavaScript está sendo realmente uma experiência muito incrível.

Neste post vou tentar contar um pouco do que aprendi, e espero de alguma forma, conseguir estimular você a fazer o mesmo.

## Algoritmos com ES6

Confesso que no início, passei algumas semanas apenas lendo e aplicando alguns conceitos, sem muito esforço. Porém, vi que precisava de um estudo um pouco mais aprofundado sobre o assunto. Pensei durante um bom tempo onde eu poderia aplicar meus estudos com ES6 para conseguir extrair o seu melhor, e tentar ver onde estava realmente suas diferenças.

Naquela época eu estava estudando sobre algoritmos com JavaScript e lendo o livro [Data Structures and Algorithms with JavaScript](http://shop.oreilly.com/product/0636920029557.do). Lendo alguns exemplos de código no livro, comecei a notar a quantidade de linhas escrita para fazer algo relativamente simples. Como bom [programador priguiçoso](http://blog.codinghorror.com/how-to-be-lazy-dumb-and-successful/) que sou, queria escrever menos linhas. Foi então que me surgiu a dúvida: *"Como ficaria este mesmo código implementado em ES6 com Fat Arrows?"* Isso me abriu a mente a implementar exemplos do livro usando a nova syntax. Fui um pouco mais a fundo e descobri um [repositório incrível](https://github.com/felipernb/algorithms.js/) do [Felipe Ribeiro](https://github.com/felipernb) que aplica uma série de algoritmos usando JavaScript. Então pensei: *"Porque não implementar estes algoritmos com ES6?!"*.

Foi então que surgiu a idéia de criar o [algorithms-with-es6](https://github.com/pedronauck/algorithms-with-es6).

## Arrow Functions e adeus bind()

Umas das primeiras features que me deparei e que me deixaram realmente empolgado com ES6 foram as `Arrow Functions`, ou também conhecidas como `Fat Arrows`. Feature largamente utilizada em CoffeScript.

**Aviso:** Vou passar *apenas alguns detalhes* sobre Arrows Functions, não vou explicar muito a fundo, até porque o [Felipe Moura](https://twitter.com/felipenmoura) já fez um [excelente post](http://es6rocks.com/pt-br/2014/10/arrow-functions-and-their-scope/) aqui no ES6 Rocks falando sobre isso.

Por JavaScript ter fortemente um [paradigma funcional](http://www.functionaljavascript.com/), ela é, e sempre será, uma linguagem regada a functions, callbacks e closures. E estes são conceitos realmente incríveis e poderosos. Porém podem facilmente se tornar um pouco verbosos e complicados. Veja um exemplo usando recursividade para criar um [algoritmo de Sequência de Fibonnaci](http://pt.wikipedia.org/wiki/Sequ%C3%AAncia_de_Fibonacci):

```javascript
  var fib = function(n) {
    if (n <= 1) {
      return n;
    }
    else {
      return fib(n - 1) + fib(n - 1);
    }
  };
```

Poderíamos melhorar um pouco essa função usando [Operadores Ternários](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator):

```javascript
  var fib = function(n) {
    return (n <= 1) ? n : (fib(n - 1) + fib(n - 2));
  };
```

Esta é uma função relativamente simples que conseguimos usar apenas 3 linhas para criá-la. Mas se analisarmos, existem alguns [tokens](http://ariya.ofilabs.com/2012/07/most-popular-javascript-tokens.html) dentro dessa função que sempre se repetem e que poderíamos não precisar escrevê-los, como é o caso do `function`, `return` e `{}`. Arrow Functions nos dão exatamente esta possibilidade. A mesma função acima ficaria assim:

```javascript
  var fib = (n) => (n <= 1) ? n : (fib(n - 1) + fib(n - 2));
```

O resultado final é o mesmo, com uma quantidade considerável de código a menos. Até esse ponto você poderia pensar que isto é apenas um *~syntax sugar~*, mas não é bem por aí.

Além de nos possibilitar escrever menos código, Arrows Functions também mudam a maneira com que lidamos com o escopo da função, fazendo com que o `this` quando chamado dentro de uma função, pertença ao escopo do local onde foi executado e não à função.

```javascript
  var school = {
    getAverages(students) {
      return students.map(student => this.calcAverage(student.grades));
    },
    calcAverage(grades) {
      return grades.reduce((sum, num) => sum + num) / grades.length;
    }
  };

  var students = [{
    name: 'John',
    grades: [70,80,90]
  }, {
    name: 'Peter',
    grades: [80,80,90]
  }];

  school.getAverages(students) // 80, 83.33
```

Como podem ver, `this.calcAverage()` esta sendo executado dentro da função `map()`, porém seu escopo permanece sendo o do método `getAverages` e não o da função `map` ao qual o método está sendo executado. Fazendo com que `this` neste caso se referencie a variável `school`. Veja como teríamos que fazer para o mesmo código funcionar na syntax atual de JavaScript:

```javascript
  var school = {
    getAverages: function(students) {
      return students.map(function(student) {
        return this.calcAverage(student.grades);
      }.bind(this));
    },
    calcAverage: function(grades) {
      return grades.reduce(function(sum, num) {
        return sum + num;
      }) / grades.length;
    }
  };
```

Teríamos alguns `returns` a mais, e teríamos que usufruir do `.bind(this)` para conseguir de alguma forma chamar o método `this.calcAverage()` dentro do escopo da função `map`.

Um pouco mais confuso e verboso, não?!

## Let e Block Scoping

Uma feature bem interessante, mas que pode acabar confundindo um pouco quem está começando a migrar da antiga para a nova versão do JavaScript, é em relação a declarar varíaveis usando `let`.

Basicamente, o `let` vem como um substituto para o `var` com a responsabilidade de corrigir problemas relacionados a escopo e hoisting. Como o [Jaydson](https://twitter.com/jaydson) falou [no seu post sobre `let`](http://es6rocks.com/pt-br/2014/08/what-you-need-to-know-about-block-scope-let/) - onde ele explica mais aprofundado os detalhes da nova maneira de declarar variáveis - a intenção é que futuramente o `var` seja descontinuado em função do `let`.

No início é inevitável que você estranhe declarar variáveis usando um novo tipo de declaração, já que estamos tão acostumados com o `var`, mas como tudo na vida, com o tempo as coisas vão ficando naturais.

Como mencionei acima, o `let` vem pra solucionar um problema de escopo, o que faz com que JavaScript passe a ter um comportamento que é o comportamento natural de muitas linguagens, onde os escopos são definidos a partir de qualquer bloco (instrução entre `{}`). No ES5 - e versões menores - as limitações de escopo se referem apenas ao escopo global e/ou escopo de função. Essa limitação da linguagem faz com que muitas vezes você acabe sobrescrevendo variáveis já declaradas anteriormente, caso você não saiba por que isso acontece, aconselho você a estudar sobre **Escopo e Hoisting em JavaScript**. Segue alguns posts que indicido sobre o assunto:

- [Hoisting e Escopo em Javascript](http://loopinfinito.com.br/2014/10/29/hoisting-e-escopo-em-javascript/)
- [Entendendo escopo e hoisting no JavaScript](http://www.hugobessa.com.br/posts/entendendo-escopo-e-hoisting-no-javascript/)
- [Hoisting no JavaScript](http://felipenmoura.org/articles/hoisting-no-javascript)
- [Elevação ou JavaScript Hoisting](http://tableless.com.br/elevacao-ou-javascript-hoisting/)

Problemas com escopo sempre foram um vilão pra quem lida com JavaScript. Não saber lidar com ele pode causar grandes confusões e sérios problemas em tempo de execução. Vou usar novamente o algoritmo de Fibonnaci para exemplificar, porém desta vez usando uma lógica diferente:

```javascript
  let fibonacci = (num) => {
    if (num <= 1) return num;
    let [previous, current, result] = [0, 1];

    for (let i = 1; i < num; i++) {
      let temp = previous + current;
      [previous, current] = [current, current = result = temp];
    }

    console.log(temp) // throw
    return result;
  };
```

Neste caso, estamos usufruindo do `let` para guardar um variável dentro do escopo do `for` e atribuímos ela outras duas variáveis que estão fora do escopo do loop. Como podem ver, se tentarmos acessar `temp` fora do loop, ela não estará declarada. Caso fizéssemos o mesmo com `var`, ela seria acessível fora do escopo do `for`.

**PS:** Este caso é apenas ilustrativo, pois não precisamos necessariamente de `temp`, mas é interessante para notar como podemos criar escopo sem ter que usar uma `function`.

## Destructuring Assignment

Como você pode ver no algoritmo escrito acima, algumas coisas também mudaram em relação à declaração de variáveis. É o caso onde declaramos as 3 primeiras variáveis `previous`, `current` e `result`.

```javascript
  let [previous, current, result] = [0, 1];
```

Isto só é possível, devido a nova feature do ES6 chamada Destructuring Assignment. Resumindo, ele é um *syntax sugar* - realmente eficiente e conciso - na hora de declarar as coisas, pois ele permite que você gere valores através de uma estrutura de dados simples. Para gerar o mesmo resultado acima, teríamos que ter um código como este:

```javascript
  var previous = 0;
  var current = 1,
  var result;
```

Mas não pára por aí. Outra possibilidade que temos usufruindo da nova feature é a declaração de variavéis a partir de metódos ou propriedades de um objeto:

```javascript
  let myObj = {
    foo: 'foo',
    bar: 'bar'
  };

  let { foo, bar } = myObj;
```

Isto seria o mesmo que isto:

```javascript
  var myObj = {
    foo: 'foo',
    bar: 'bar'
  };

  var foo = myObj.foo;
  var bar = myObj.bar;
```

Seguindo este tipo de declaração algumas coisas podem mudar. Por exemplo, caso você use bastante o padrão de módulos [CommonJS](http://pt.wikipedia.org/wiki/CommonJS), você deve estar familiarizado com isto:

```javascript
  var foo = function() {
    return 'foo';
  };

  var bar = function() {
    return 'bar';
  };

  module.exports = {
    foo: foo,
    bar: bar
  };
```

Com Destructuring Assignment e ES6 você faria assim:

```javascript
  let foo = () => 'foo';
  let bar = () => 'bar';

  module.exports = { foo, bar };
```

Podemos ainda, usar a nova feature para declarar parâmetros de uma função. Em uma função com muitos parâmetros isso pode fazer uma grande diferença, evitando que você use um único parâmetro para atribuir todas suas variáveis internas (prática bem comum hoje em dia):

```javascript
  var foo = function(opts) {
    var bar = opts.bar;
    var baz = opts.baz;

    return bar + baz;
  };

  foo({ bar: 'bar', baz: 'baz' });
```

Ao invés de termos uma variável `opts`, teríamos a seguinte declaração:

```javascript
  let foo = ({bar, baz}) => bar + baz;

  foo({ bar: 'bar', baz: 'baz' });
```

Você pode também renomear o parâmetro, passando o valor que deseja como sendo a `key` do objeto:

```javascript
  let foo = ({b1: bar, b2: baz}) => b1 + b2;
```

Ainda sobre funções, a nova feature do ES6 nos permite facilmente criar uma função que possa retornar múltiplos valores:

```javascript
  let foo = () => [1,2];
  let [x, y] = foo();

  console.log(x) // 1;
  console.log(y) // 2;
```

Bacana, não?!

Apesar desta não ser uma feature que influencie diretamente na estrutura da linguagem, ele pode ser muito útil no seu dia a dia, eliminando uma boa quantidade de código declarado no topo dos seus scripts e criando uma estrutura mais explícita para suas funções.

## Default Parameters

Outra coisa bem legal implementada na nova versão do JavaScript são os Default Parameters. Não preciso explicar muito do que se trata, pois o próprio nome já deixa claro seu significado. Basicamente, ele possibilita que você declare valores padrões para um parâmetro de uma função, caso o mesmo não seja passado:

```javascript
  let foo = (x, y = 1) => x + y;

  console.log(foo(2)); // 2 + 1 = 3;
  console.log(foo(2,2)); // 2 + 2 = 4;
```

Default parameters são algo amplamente implementado em uma série de linguagens, e em alguns algoritmos eles podem ser realmente úteis. É o caso de um algoritmo para deixar um Array `flattened`, onde usamos recursividade para definir o retorno da função, porém precisamos inicialmente declarar um Array vazio que será manipulado ao longo da execução. Vejamos como fica a função escrita na versão atual do JavaScript:

```javascript
  var flatten = function(arr, newArr) {
    newArr = newArr || [];

    arr.forEach(function(item) {
      (Array.isArray(item)) && (flatten(item, newArr));
      (!Array.isArray(item)) && (newArr.push(item));
    });

    return newArr;
  };

  console.log(flatten([0,1,[2,3,[4,5]]])) // [0,1,2,3,4,5];
```

Neste caso para conseguirmos aplicar a recursividade, precisamos redefinir o parâmetro `newArr` no topo da função a cada execução, caso o segundo parâmetro `newArr` não for passado, o mesmo será um Array vazio. Desta forma conseguimos simular um paramêtro padrão para nossa função.

Com a nova especificação, precisamos apenas definir o valor padrão do parâmetro ao declarar o mesmo na função:

```javascript
  let flatten = (arr, newArr = []) => {
    arr.forEach((item) => {
      (Array.isArray(item)) && (flatten(item, newArr));
      (!Array.isArray(item)) && (givenArr.push(item));
    });

    return givenArr;
  };

  console.log(flatten([0,1,[2,3,[4,5]]])) // [0,1,2,3,4,5];
```

O retorno de ambas as função serão iguais e dessa forma evitamos declarações desnecessárias no algoritmo.

Podemos também definir Default Parameters usufruindo de outros paramêtros anteriores ou até mesmo outros Default Parameters:

```javascript
  let greet = (name, prefix = 'hello', msg = `${prefix} ${name}`) => msg;
```

## Usando ES6 hoje!

Ok, você pode confessar que ficou bem tentado a poder usar essas features nos seus projetos, não ficou? Normal, eu também fiquei assim. E, felizmente, hoje já temos uma série de ferramentas que podem ajudar você a fazer isso. Porém, fica por sua conta e risco.

Vou mostrar para vocês rapidamente, quais foram as melhores alternativas que achei para poder configurar um ambiente onde eu pudesse rodar meus testes usando BDD e, claro, escritos também em ES6, e também ter uma compilação dos scripts, para ver como ficaria o código final transpilado.

### Ambiente de Testes

Decidi usar o [Jest](facebook.github.io/jest), que é uma biblioteca de testes criada pelo Facebook, pois ele é por padrão definido em cima de CommonJS e tem um maneira muito fácil de integrar um transpiler. O Jest provém uma [série de configurações](http://facebook.github.io/jest/docs/api.html#config-cachedirectory-string) que podem ser definidas a partir do seu `package.json`, e uma delas é uma propriedade chamada `scritpProcessor`, que será o caminho para um script que fará o parse do seu código de teste:

```javascript
  {
    "name": "algorithms-with-es6",
    ...
    "jest": {
      "scriptPreprocessor": "./utils/es6-transformer.js"
    },
    ...
  }
```

Neste caso para criar o script, usei um transpiler bem famoso chamado [6to5](https://github.com/sebmck/6to5), que atualmente considero ser [o mais completo](https://github.com/sebmck/6to5#comparison-to-other-transpilers) dentre os transpilers para ES6 (em termos de suporte à features). O código final é bem simples:

```javascript
  'use strict';

  module.exports = {
    process: function (src, path) {
      return require('6to5').transform(src).code;
    }
  };
```

O retorno do método `process` será um código já transformado pelo transpiler que o Jest poderá executar nativamente. Depois, é claro, você precisa adicionar o Jest como dependência do seu projeto:

```bash
  $ npm install --save-dev jest jest-cli
  $ npm install -g jest-cli
```

E para cada teste que você deseja criar, basta criar uma pasta `__tests__` no mesmo nível de diretório do seu arquivo. Ao executar `jest` você terá todos os seus testes rodando no seu terminal. Bem simples!

Caso você queira usar [Mocha](http://mochajs.org/) ou [Jasmine](http://jasmine.github.io/) para aplicar seus testes, fique a vontade, pois já existem ferramentas para isso também.

### Compilação para ES6

Como uso bastante o [gulp](http://gulpjs.com/) em meus projetos, decidi tentar achar alguma coisa para integrar ele no ambiente, e é claro que não demorei muito para conseguir isso. Felizmente, o [Sindre Sorhus](https://twitter.com/sindresorhus) ~novidade~, já havia criado um plugin para integrar o 6to5 com o gulp. A partir daí, mais fácil impossível. Veja o `gulpfile.js`:

```javascript
  var gulp = require('gulp');
  var to5 = require('gulp-6to5');

  gulp.task('build', function () {
    var paths = [
      'utils/*.js',
      'src/**/*.js',
      '!**/__tests__/*.js',
      '!utils/es6-transformer.js'
    ];

    gulp.src(paths)
      .pipe(to5())
      .pipe(gulp.dest('compiled'));
  });
```

Dessa forma eu consegui um ambiente bem simples e sem muitas dependências e acredito que esta seja uma estrutura que pode servir para muitos projetos.

E, se você usa o [Grunt](http://gruntjs.com/), novamente, fique a vontade, pois já existe um [plugin para o 6to5](https://github.com/sindresorhus/grunt-6to5) para Grunt, e adivinha? Feito pelo Sindre.

## Conclusão

Lembrando que estas são apenas algumas das features que estão por vir. Fora estas, o ES6 conta com uma [série de outras novas features](http://tc39wiki.calculist.org/es6/), sejam elas apenas *syntax sugars* para melhorar a forma com que escrevemos nosso código, ou mudanças significativas em termos de estrutura da linguagem. O importante, e o que me anima bastante, é ver que todas estas features estão tendo um foco muito grande na melhoria para o desenvolvedor em termos de coisas realmente úteis derivadas de casos reais, não são apenas meras atualizações.

O intuito deste post não foi mostrar todas estas novas features, mas de alguma forma, tentar influenciar você para que você consiga ver que mesmo brincando ou criando um projeto open source simples, você consegue adquirir um ótimo conhecimento, e que nunca é cedo demais para estudar alguma coisa, muito pelo contrário, tente sempre antecipar as coisas que podem acontecer, e principalmente, as que já estão acontecendo. Desta forma, você pode não só usufruir no futuro, mas também ajudar a construir no presente.

Mesmo estudando pouco tempo sobre a nova especificação da ECMAScript, já pude notar uma grande diferença em como irei escrever meus códigos em um futuro não muito distante, e confesso que estou bem empolgado para que chegue logo a época onde todas estas features sejam suportadas nativamente nos browsers. Sei que isto pode demorar um pouco *(a previsão é junho de 2015)*, mas pode ter certeza que onde eu puder aplicar ES6, eu irei.

Se você quiser conhecer um pouco sobre outra features, você pode dar uma olhada em [uma talk](http://bit.ly/es6-talk) que fiz falando um pouco sobre as features que achei mais legais na nova implementação:

<script async class="speakerdeck-embed" data-id="f8ad5c1045fa013234d07a3f7c519e69" data-ratio="1.33333333333333" src="//speakerdeck.com/assets/embed.js"></script>

Espero que tenham gostado, qualquer dúvida, comentário ou correção podem deixar abaixo nos comentários. Caso você queira acompanhar as discussões e propostas em relação a nova especificação, o [Forbes Lindesay](https://twitter.com/ForbesLindesay) criou um [site bem bacana](https://esdiscuss.org/) para isso, com as notas oficiais das reuniões do [TC39](http://tc39wiki.calculist.org/) e tópicos a respeito do que está rolando.

Convido você também a forkar o [algorithms-with-es6](https://github.com/pedronauck/algorithms-with-es6) e brincar um pouco com o projeto, será um prazer receber um pull request seu.

May the force be with you!

## Referências

- [Arrow Functions and their scope](http://es6rocks.com/2014/10/arrow-functions-and-their-scope/)
- [What you need to know about block scope - let](http://es6rocks.com/2014/08/what-you-need-to-know-about-block-scope-let/)
- [Destructuring assignment](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
- [Destructuring Assignment in ECMAScript 6](http://fitzgeraldnick.com/weblog/50/)
- [Fun With JavaScript Destructuring Assignment](http://ericleads.com/2013/04/fun-with-javascript-destructuring-assignment/)
- [Default parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters)