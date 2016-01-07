<!--
layout: post
title: Configurando Babel 6 para Node.js
date: 2016-01-04T02:39:18.811Z
comments: true
published: true
keywords: JavaScript, Node.js, ES2015, Babel, transpiler
description: Tutorial de configuração do Babel para Node.js para desenvolver rapidamente
categories: ES2015, Babel, node.js
authorName: Hannan Ali
authorLink: https://abdulhannanali.github.io
authorPicture: //s.gravatar.com/avatar/89e5f7614cb88cd573359a953a09aa6e?s=80
-->
Olá! Se você é como eu, você está cansado de escrever o mesmo velho código JS ES5 em suas aplicações Node.js.

Se sim, você pode usar as novas funcionalidades do JavaScript ES2015 e ES2016 em suas aplicações Node.js hoje. ES2015 e ES2016 tornam o desenvolvimento JavaScript uma brisa, mas nem todos os recursos do ES2015 são suportados em nosso amado [Node.js](https://nodejs.org).

Aqui é o onde o [Babel](https://babeljs.io) chega para o resgate. Babel é um transpiler para JavaScript que transpila seus códigos ES2015 e ES2016 para códigos ES5 e até mesmo ES3. Em palavras simples, ele converte seus códigos em um JavaScript que o Node.js pode executar e faz você muito feliz.
<!--more-->

**Nota:** Node.js já suporta várias funcionalidades do ES2015, então se você não quiser transpilar o código ES2015, você pode executar o Node.js com a flag `--harmony` para habilitar mais algumas funcionalidades (em fase de teste). Para obter mais flags do conjunto de funcionalidades experimentais `--harmony`, execute o comando: `node --v8-options | grep harmony`. Contudo, note que nem todas as funcionalidades são suportadas mesmo nas últimas versões do Node.js (versão 5 no momento da escrita), e as funcionalidades que necessitam de flags estão frequentemente instáveis ou incompletas. Então continue lendo para fazer uso de mais funcionalidades do ES2015 e **ES2016**, sem a necessidade de flags.

### Algumas premissas feitas
Existem algumas premissas que estou fazendo sobre você! SIM VOCÊ!
- Você já possui alguma experiência com [Node.js](https://nodejs.org).
- Você pode instalar pacotes usando o [npm](https://www.npmjs.com/).
- Você já tem Node.js e npm instalados.
- Você está confortável com o uso de CLI ocasionalmente.
- É bom saber algo sobre ES2015, mas não é obrigatório.

### Seguindo ao longo do código
É do tipo de pessoa que segue o código em vez de apenas ler? O código está disponível nesse [repositório](https://github.com/abdulhannanali/babel-configuration-tutorial).

### Instalando e começando com Babel
Há muitas maneiras de configurar o Babel. Aqui vamos discutir o suficiente para começar a usar o babel-cli.

Vamos criar um simples `index.js` em um **diretório** `code` que conterá o seguinte código ES2015:
```javascript
function* jsRocksIsAwesome() {
  yield "JS Rocks is Awesome";
  yield "JS Rocks says JavaScript Rocks";
  return "because JavaScript really rocks";
}

var jsRocks = jsRocksIsAwesome();

console.log(jsRocks.next());
console.log(jsRocks.next());
console.log(jsRocks.next());
```

Vamos instalar o pacote **babel-cli** com o próximo comando. Isto irá instalar a última versão estável do **babel-cli** para o projeto atual e listá-lo como uma das `devDependencies` no `package.json`:
```
npm install --save-dev babel-cli
```

Agora se você executar:
```
babel code/index.js -d build/
```

Você verá o mesmo código que você escreveu aparecer em `build/index.js`. É aqui que entra os **plugins** e **presets** do Babel. 

#### Plugins e Presets

Babel não faz muito por conta própria, mas com **plugins** e **presets** é possível fazer muito. Nós queremos todas as vantagens do ES2016 e ES2015 em nosso código.

Para fazer isso, vamos instalar dois *presets* como parte de nossas `devDependencies`:
- [es2015](https://babeljs.io/docs/plugins/preset-es2015/)
- [stage-0](https://babeljs.io/docs/plugins/preset-stage-0/)

Execute o comando a seguir para instalar estes *presets*:
```
npm install --save-dev babel-preset-es2015 babel-preset-stage-0
```
Babel possui uma vasta gama de plugins que você pode [encontrar aqui](https://babeljs.io/docs/plugins/).

Agora você precisa incluir estes *presets* no comando que você executará:
```
babel --presets es2015,stage-0 code/index.js -o build/app.js
```

Você verá o código ES5 normal gerado no arquivo `app.js`, isso é chamado de **código transpilado** (um termo largamente usado no mundo JS). Você pode rodar esse código usando o comando abaixo.
```
node build/app.js
```

### Configurando um ambiente de build adequado usando Babel
Isso é tudo muito mágico, mas e que tal fazer um desenvolvimento sério usando Node.js? 

#### Arquivo de configuração do Babel .babelrc
`.babelrc` é uma maneira muito elegante de separar todas suas configurações do Babel em um arquivo JSON. É também muito fácil de começar. Esse é o nosso arquivo `.babelrc` para esse tutorial:
```javascript
{
  "plugins": ["es2015", "stage-0"]
}
```

Você pode configurar mais opções do [`.babelrc`](http://babeljs.io/docs/usage/options/) e torná-lo tão robusto quanto você desejar.

É basicamente isto de configuração do Babel que usaremos para este tutorial. Agora sempre que quisermos adicionar ou remover plugins, ao invés de alterarmos o comando, vamos alterar o array de plugins nesse arquivo. Fácil. Não é?

Agora se você executar:
```
babel -w code/ -d build/
```
Ele irá ler os **presets** do `.babelrc` para compilar o código no diretório `code/` e gerar os arquivos JavaScript compilados no diretório `build/`, mas olhe! O comando ainda não acabou. Note a flag `-w`: é para **observar** e recompilar o código conforme você fizer mudanças em seu diretório `code`. LEGAL! É dessa magia que estou falando.

#### Usando source maps em seu arquivo
Você pode estar pensando que é tudo legal e diverdito, mas que tal debuggar algum código de verdade. Você não deve se preocupar. Source maps são exatamente para esse propósito. Source maps dizem ao Node.js que este código é transpilado e aponta para os erros no **arquivo de origem** ao invés do **arquivo transpilado**!

O arquivo `code/error.js` dispara um erro após o segundo `yield` no gerador, mas o código transpilado parece bem diferente.
```javascript
function* errorFulGenerator() {
  yield "yo";
  throw new Error("source maps are awesome");
  return "";
}

var errorGen = errorFulGenerator();
errorGen.next();
errorGen.next();
```

Nós usamos esse comando para gerar **source maps** junto com o código **transpiled**. *Note a flag `--source-maps`*:
```
babel code/ -d build/ --source-maps
```

Agora quando encontrarmos o erro, nós obteremos informações úteis para debugar, como estas:
```
errorGen.next()
         ^

Error: source maps are awesome
    at errorFulGenerator (/home/programreneur/Programming/githubRepos/babeljs-short-tutorial/code/error.js:3:9)
    at next (native)
    at Object.<anonymous> (/home/programreneur/Programming/githubRepos/babeljs-short-tutorial/code/error.js:10:10)
    at Module._compile (module.js:425:26)
    at Object.Module._extensions..js (module.js:432:10)
    at Module.load (module.js:356:32)
    at Function.Module._load (module.js:313:12)
    at Function.Module.runMain (module.js:457:10)
    at startup (node.js:138:18)
    at node.js:974:3
```
Então é assim que você vai usar source maps.

#### Configurando o comando npm
A fim de simplificar o processo de build ainda mais, você pode editar o seu arquivo `package.json` e incluir um script de build para o Babel. No objeto `scripts` do arquivo `package.json` você pode adicionar o código tal como segue abaixo:
```javascript
"scripts": {
  "build": "babel -w code/ -d build -s"
}
```
Agora, podemos executar:
```
npm run build
```
E obtenha todas as vantagens do ES2015/ES2016 hoje. :)

#### Aprenda mais sobre Babel
Esse é um tutorial básico do Babel, mas o mundo do Babel apenas começa aqui. É cercado por uma comunidade maravilhosa e é usado por grandes nomes no mundo da TI. Babel tem suporte para todas as principais ferramentas de compilação como [Grunt](https://www.npmjs.com/package/grunt-babel) e [gulp](https://npmjs.org/package/gulp-babel/). Você pode checar tudo isso no [site do Babel](https://babeljs.io/docs/setup/).

Estes são alguns dos recursos que podem ajudar a aprimorar os teus conhecimentos no mundo do Babel:
- [Learn ES2015 and Babel using this detailed tutorial](http://ccoenraets.github.io/es6-tutorial/index.html)
- [Read the Babel docs on setting up Babel (They're helpful)](https://babeljs.io/docs/setup/)

##### Código-fonte, contribuições e agradecimentos
O código-fonte desse tutorial está disponível nesse [repositório](https://github.com/abdulhannanali/babel-configuration-tutorial).

Se você encontrou algum erro de digitação ou gostaria de fazer alguma atualização. Por favor, faça isso usando o poder das issues e PR em nosso [repositório no GitHub](https://github.com/abdulhannanali/babel-configuration-tutorial).

Eu gostaria também de agradecer o [Fabrício Matté](http://ultcombo.js.org/) por aprovar esse artigo no [JS Rocks](https://github.com/JSRocksHQ/jsrockshq.github.io/) e pelas correções que ele fez.
