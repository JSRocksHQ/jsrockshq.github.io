<!--
layout: post
title: Como estou usando módulos es6 em produção
date: 2015-05-08T04:51:30.117Z
comments: true
published: true
keywords: modules
description: Post sobre como estpu usando módulos es6 em produção
categories: modules
authorName: Jaydson Gomes
authorLink: http://twitter.com/jaydson
authorDescription: JavaScript enthusiast - FrontEnd Engineer at Terra Networks - BrazilJS and RSJS curator
authorPicture: https://pbs.twimg.com/profile_images/453720347620032512/UM2nE21c_400x400.jpeg
-->
Estou usando [módulos ES6](/categories/modules/) já faz um tempo no meu trabalho diário e eu gostaria de compartilhar com vocês como estou fazendo isso.  
Em primeiro lugar, o [Babel](https://babeljs.io/) é a ferramenta consolidada para fazer transpile. É um projeto bem ativo e cobre praticamente todas as novas features do JavaScript moderno.  
O Babel funciona muito bem para módulos também, então basta que você decida o sabor, quero dizer, AMD, Common, UMD e até mesmo módulos customizados.  
<!--more-->
Na empresa onde trabalho estamos construindo aplicações usando um framework desenvolvido em casa (ainda não é open-source) que é baseado em módulos AMD.  
Acreditem quando eu digo, módulos AMD continuam sendo uma das melhores soluções para grandes aplicações. Não podemos simplesmente concatenar tudo em um arquivo. Não é assim que as coisas funcionam.  
Atualmente temos soluções como o [Webpack](http://webpack.github.io/), mas nós já temos uma grande base instalada, então não é tão simples fazer uma migração, além do que nossa solução caseira para entrega de módulos (ainda não é open-source) está funcionando muito bem.  

## Estratégia de micro-módulos
Esta estratégia está funcionando muito bem para mim.  
Como disse antes, nosso módulo final precisa ser um módulo AMD, mas as vezes o próprio módulo AMD precisa de módulos, e eu estou chamando estes módulos de micro-módulos.  
Estes micro-módulos que estou usando não necessariamente precisam ser compartilhados entre aplicações, mas estão me ajudando bastante com a organização de código.  
Aqui está um pedaço de código que temos em produção:  
```javascript
import config from './config';
import { globalpkg } from './config';
import factory from './factory';

zaz.use((pkg) => {

    "use strict";

    config.dynamic.globalpkg = pkg;

    pkg.require(['modFactory'], (modFactory) => {
        modFactory.create(pkg.utils.deepMerge(config._static, factory));
    });

});
```
Estamos importando alguns módulos no topo do arquivo e então usando-os em nosso módulo AMD.  
Estes módulos ES6 não são úteis para nenhuma outra aplicação, mas o código final fica muito mais legível usando micro-módulos.  

O módulo `config` que estamos importando é mais ou menos assim:  
```javascript
const githubURL = "OUR GITHUB URL HERE";
const staticServer = "http://s1.trrsf.com";
const testsPath = `zaz-${type}-${name}/tests/index.htm?zaz[env]=tests`;
const name = "stalker";
const type = "mod";
const version = "0.0.1";
const state = "ok";
const description = "JavaScript API to deal with user data";
let globalpkg = null;

// default export 
const config = {
	_static: {
		name,
	    version,
	    state,
	    description,
	    docs: `${githubURL}/pages/terra/zaz-${type}-${name}`,
	    source: `${githubURL}/Terra/zaz-${type}-${name}`,
	    tests: `${staticServer}/fe/${testsPath}`,
	    dependencies: ['mod.wilson']
	}
};

export default config;
```

Veja a árvore para este módulo AMD:  
```
src/
├── _js
│   ├── config.js
│   ├── environment.js
│   ├── factory.js
│   ├── helpers.js
│   ├── methods.js
│   └── mod-stalker.js
```
O que fiz foi apenas dividir a lógica dentro do meu módulo AMD em pequenos módulos ES6.  
O processo de build é bem simples: O Babel transpila o código para ES5 usando módulos CommonJS para micro-módulos e então o [Browserify](http://browserify.org/) monta tudo.  
Boom! O código final continua sendo um módulo AMD, mas o meu código-fonte está usando CommonJS para micro-módulos.    

## Pŕoximos passos
Sourcemaps não estão funcionando muito bem com este processo pois estou usando o Browserify para fazer o bundle.  
Porém, deve ser fácil de implementar o suporte a sourcemaps para micro-módulos.  
Estamos começando a reescrever o nosso framework usando features de ES6 e claro, vamos usar módulos.  
Talvez seja necessário construir um módulo customizado para a nossa estrutura atual, mas não acho que isso seja uma boa abordagem.  
Possivelmente teremos que reescrever a lógica do sistema de módulos que temos.  

## Conclusão
A especificação para módulos já está fechada, e em minha opinião está bem madura e eficiente.  
Porém, ainda não temos uma API no browser para tratar do carregamento destes módulos, então uma solução como AMD ou CommonJS ainda se faz necessária.  
Já podemos nos beneficiar da sintaxe ES6 para módulos agora mesmo, tornando o nosso código mais legível e mais conciso.  
As ferramentas existentes como Babel e Browserify nos proporcionam um desenvolvimento indolor, e em um futuro próximo poderemos simplesmente desativá-las, pois teremos suporte total.  
