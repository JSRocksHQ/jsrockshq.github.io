<!--
layout: post
title: Módulos ES6 hoje com o 6to5
date: 2014-10-28T12:49:54.528Z
comments: true
published: true
keywords: ES6, modules, 6to5
description: Um tutorial sobre o uso de módulos ES6 hoje com o 6to5
categories: Modules, Tutorial
authorName: Jaydson Gomes
authorLink: http://twitter.com/jaydson
authorDescription: JavaScript enthusiast - FrontEnd Engineer at Terra Networks - BrazilJS and RSJS curator
authorPicture: https://pbs.twimg.com/profile_images/453720347620032512/UM2nE21c_400x400.jpeg
-->
Eu postei a imagem abaixo no [Twitter](https://twitter.com/jaydson/status/526882798263881730), mostrando o quanto feliz eu estava.<!--more-->  
É muito legal o que os [transpilers](http://en.wikipedia.org/wiki/Source-to-source_compiler) podem fazer. No mundo do JavaScript é como uma máquina do tempo, onde podemos avançar para um futuro próximo de coisas muito legais que a ES6 irá nos trazer.  
Nesse tutorial nós vamos mostrar como começar a escrever [ES6 modules](http://jsmodules.io/) hoje, usando o excelente [6to5](https://github.com/sebmck/6to5);  

![modules today with 6to5](/img/modules-today-6to5.png)

# Primeiro passo
Se você não esta familiarizado com módulos ES6, por favor dê uma olhada no [JSModules.io](http://jsmodules.io/) para ter uma breve introdução.  
Eu também recomendo a leitura do artigo [Uma nova sintaxe para módulos na ES6](http://es6rocks.com/pt-br/2014/07/a-new-syntax-for-modules-in-es6/) do [@jcemer](http://twitter.com/jcemer), aqui mesmo no [ES6Rocks](http://es6rocks.com), que cobre um monte de coisas mais legais sobre módulos no JavaScript.  
Para esse tutorial nós vamos utilizar o 6to5 como transpiler.  
Basicamente, o 6to5 converte código ES6 em vanilla ES5, fazendo com que você possa usar features de ES6 hoje mesmo.  
O _6to5_  possui algumas vantagens sobre outros transpilers, aqui estão algumas das principais features:  
__Readable__: se possível, a formatação é mantida para que o seu código gerado seja o mais semelhante possível.  
__Extensible__: uma grande variedade de plugins e suporte a Browsers.  
__Lossless__: source map para que você possa depurar o código compilado com facilidade.  
__Compact__: mapeia diretamente para equivalente código ES5, sem qualquer necessidade de um runtime.  

# Escrevendo módulos
Vamos começar a escrever módulos!  
Nossa aplicação não vai fazer nada além de logs, mas a ideia principal aqui é fazer você entender como os módulos funcionam e como implementar módulos ES6 agora em suas aplicações.  
Nossa app possui essa estrutura básica:  
```
├── Gruntfile.js
├── package.json
└── src
    ├── app.js
    ├── modules
    │   ├── bar.js
    │   ├── baz.js
    │   └── foo.js
    └── sample
        └── index.html
```
`app.js` é o arquivo principal, e dentro do diretório `modules` nós vamos armazenar os nossos módulos.  
Dê uma olhada no app.js:  
```javascript
import foo from "./modules/foo";
import bar from "./modules/bar";

console.log('From module foo >>> ', foo);
console.log('From module bar >>> ', bar);
```
É bem simples. O código acima faz exatamente o que parece.  
Nós estamos importando o módulo `foo` e o módulo `bar`, e então estamos logando o conteúdo de cada um.  
Para ser mais claro, vamos olhar cada módulo:  
```javascript
// foo
let foo = 'foo';

export default foo;
```
```javascript
// bar
let bar = 'bar';

export default bar;
```
Em ambos os módulos, nós estamos apenas exportando as strings 'foo' e 'bar'.  
Quando importamos o módulo, nossa variável passa a ter o valor que exportamos.  
Então `foo` em `import foo from "foo"` possui o valor `"foo"` que exportamos em `export default foo`.  
Você também pode exportar objetos, classes, funções, etc.  
Agora, você pode começar a hackear este simples exemplo e escrever seus próprios módulos.  

# Build
Como você deve saber, [módulos ES6 ainda não são suportados](http://kangax.github.io/compat-table/es6/) por nenhum browser e nem no node.  
A única maneira de escrever módulos ES6 hoje é usando um transpiler.  
Como mencionei antes, estamos usando o 6to5, que faz exatamente o que queremos.  
O task runner escolhido foi o [Grunt](http://gruntjs.com/), e vamos utilizar o [grunt-6to5](https://github.com/sindresorhus/grunt-6to5), projeto do [@sindresorhus](https://twitter.com/sindresorhus).  

```shell
npm install grunt-cli -g
npm install grunt --save-dev
npm install grunt-6to5 --save-dev
```

O nosso Gruntfile vai parecer com algo assim:  
```javascript
grunt.initConfig({
	'6to5': {
		options: {
			modules: 'common'
		},

		build: {
			files: [{
				expand: true,
				cwd: 'src/',
				src: ['**/*.js'],
				dest: 'dist/',
			}],
		}
	}
});
```

Uma configuração bem simples e estamos quase lá.  
A task 6to5 roda o 6to5 no diretório `src` e faz o transpile do código para o diretório `dist`.  
Note a opção `modules: 'common'`. Essa opção diz para o 6to5 fazer o transpile dos módulos para ES5, usando o estilo de módulos [CommonJS](http://wiki.commonjs.org/wiki/CommonJS).  
O 6to5 também suporta [AMD](http://requirejs.org/docs/whyamd.html), o que é muito legal, porque podemos integrar os módulos ES6 no nosso ambiente atual, independente do nosso estilo de módulos legado/atual escolhido.  

Para testar no browser, eu fiz uma copy task que apenas copia o arquivo `sample/index.html` para o diretório `dist`.  
O arquivo HTML:  
```markup
<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>ES6 modules 6to5</title>
</head>
<body>
	<script src="//[cdnjs URL]/require.min.js"></script>
	<script>
		require(['app.js']);
	</script>
</body>
</html>
```
Olhe para o código acima, nós colocamos o RequireJS como a nossa biblioteca AMD e depois basta fazer um require da nossa app.  
Para esse teste funcionar, você irá precisar alterar a opção `modules: amd`.  

# Running
Agora que estamos com tudo pronto, você pode apenas rodar o `grunt`.  
Se você perdeu algo até aqui, você pode clonar esse repositório [es6-modules-today-with-6to5](https://github.com/es6rocks/es6-modules-today-with-6to5) e rodar `npm install`.  
Lembre-se, a task do Grunt vai gerar o diretório `dist` com o código transpilado.  
Se você escolher usar CommonJS, você pode testar a app com o node:  
```shell
node dist/app.js
```
![Running with node](/img/running-node.png)

Se você optou por usar AMD, apenas sirva o diretório `dist`, e acesse a página `index.html`.  
![AMD ES6](/img/amd-es6.png)

# Conclusão
Com este simples tutorial você pode ver como é fácil configurar um ambiente ES6 para trabalhar com módulos.  
O 6to5 é uma excelente ferramente que você pode uasr hoje para transpilar código ES6 para ES5.  
Forke o repositório [es6-modules-today-with-6to5](https://github.com/es6rocks/es6-modules-today-with-6to5) e submeta issues, perguntas ou pull-requests.  
Comentário são bem-vindos :)
