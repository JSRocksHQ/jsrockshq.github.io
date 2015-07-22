/* exported Harmonic */
/* global __HARMONIC */

// Note: `__HARMONIC` is not an actual identifer,
// it is the prefix of `harmonic build`'s substitution patterns.
// The substitution patterns look like a property access so that
// we can just whitelist `__HARMONIC` as a global identifier
// instead of having to whitelist every single substitution.

// TODO ESLint's `exported` directive seems to not be working correctly
// with the current version.
// We should probably `export` Harmonic using ES2015 module syntax and
// trash the `exported` directive.
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Harmonic = (function () {
    // eslint-disable-line no-unused-vars

    function Harmonic(name) {
        _classCallCheck(this, Harmonic);

        this.name = name;
    }

    _createClass(Harmonic, [{
        key: "getConfig",
        value: function getConfig() {
            return {"index_posts":8,"name":"JS Rocks","title":"JS Rocks","domain":"http://jsrocks.org","subtitle":"Powered by Harmonic","author":"JS Rocks","description":"A collaborative website about the latest JavaScript features and tools.","bio":"Thats me","theme":"harmonic-theme-jsrocks","preprocessor":false,"posts_permalink":":language/:year/:month/:title","pages_permalink":"pages/:title","header_tokens":["<!--","-->"],"i18n":{"default":"en","languages":["en","pt-br","cn"]}};
        }
    }, {
        key: "getPosts",
        value: function getPosts() {
            return {"en":[{"layout":"post","title":"how I'm using es6 modules in production","date":"2015-05-08T04:51:30.117Z","comments":"true","published":"true","keywords":"modules","description":"Post about how I'm using es6 modules in production","categories":["modules"],"authorName":"Jaydson Gomes","authorLink":"http://twitter.com/jaydson","authorDescription":"JavaScript enthusiast - FrontEnd Engineer at Terra Networks - BrazilJS and RSJS curator","authorPicture":"https://pbs.twimg.com/profile_images/453720347620032512/UM2nE21c_400x400.jpeg","content":"<p>I&#39;ve been using <a href=\"/categories/modules/\">ES6 modules</a> for a while in my daily work and I want to share with you guys how I&#39;m doing it.<br>First of all, <a href=\"https://babeljs.io/\">Babel</a> is the consolidated tool for transpilation. It&#39;s a very active project, and it covers almost all of modern JavaScript features.<br>Babel works great for modules too, so you&#39;ll just need to decide the flavour, I mean AMD, Common, UMD and even customized modules.  </p>\n","file":"src/posts/how-i-m-using-es6-modules-in-production.md","filename":"how-i-m-using-es6-modules-in-production","link":"2015/05/how-i-m-using-es6-modules-in-production","lang":"en","default_lang":false},{"layout":"post","title":"Temporal Dead Zone (TDZ) demystified","date":"2015-01-31T18:19:51.753Z","comments":"true","published":"true","keywords":"scope, tdz, es6","description":"Get a deeper understanding of scopes and future-proof your code!","categories":["scope"," articles"],"authorName":"Fabrício S. Matté","authorLink":"https://twitter.com/Ult_Combo","authorDescription":"ECMAScript enthusiast, open source addict and Web Platform lover.","authorPicture":"https://pbs.twimg.com/profile_images/490627147963187200/2BiH3pv4.png","content":"","file":"src/posts/temporal-dead-zone-tdz-demystified.md","filename":"temporal-dead-zone-tdz-demystified","link":"2015/01/temporal-dead-zone-tdz-demystified","lang":"en","default_lang":false},{"layout":"post","title":"Using ES6 modules in the browser with gulp","date":"2014-12-02T17:14:37.232Z","comments":"true","published":"true","keywords":"JavaScript, ES6, modules, Traceur, gulp","description":"How to use ES6 modules in the browser using Traceur and gulp","categories":["modules"," tutorial"],"authorName":"Juan Cabrera","authorLink":"http://juan.me","authorPicture":"http://juan.me/images/reacticabrera.jpg","content":"","file":"src/posts/using-es6-modules-in-the-browser-with-gulp.md","filename":"using-es6-modules-in-the-browser-with-gulp","link":"2014/12/using-es6-modules-in-the-browser-with-gulp","lang":"en","default_lang":false},{"layout":"post","title":"ES6 modules today with 6to5","date":"2014-10-28T12:49:54.528Z","comments":"true","published":"true","keywords":"ES6, modules, 6to5","description":"A tutorial about using ES6 modules today with 6to5","categories":["Modules"," Tutorial"],"authorName":"Jaydson Gomes","authorLink":"http://twitter.com/jaydson","authorDescription":"JavaScript enthusiast - FrontEnd Engineer at Terra Networks - BrazilJS and RSJS curator","authorPicture":"https://pbs.twimg.com/profile_images/453720347620032512/UM2nE21c_400x400.jpeg","content":"<p>I&#39;ve posted the image below on <a href=\"https://twitter.com/jaydson/status/526882798263881730\">Twitter</a> showing how happy I was.</p>\n","file":"src/posts/es6-modules-today-with-6to5.md","filename":"es6-modules-today-with-6to5","link":"2014/10/es6-modules-today-with-6to5","lang":"en","default_lang":false},{"layout":"post","title":"JavaScript ♥  Unicode","date":"2014-10-13T19:22:32.267Z","comments":"true","published":"true","keywords":"ES6, Unicode","description":"Mathias Bynens talking about Unicode in JavaScript","categories":["Unicode"," Videos"],"authorName":"Jaydson Gomes","authorLink":"http://twitter.com/jaydson","authorDescription":"JavaScript enthusiast - FrontEnd Engineer at Terra Networks - BrazilJS and RSJS curator","authorPicture":"https://pbs.twimg.com/profile_images/453720347620032512/UM2nE21c_400x400.jpeg","content":"<p>Mathias Bynens gave an awesome talk in the last <a href=\"http://2014.jsconf.eu\">JSConfEU</a> edition.</p>\n","file":"src/posts/javascript-unicode.md","filename":"javascript-unicode","link":"2014/10/javascript-unicode","lang":"en","default_lang":false},{"layout":"post","title":"Arrow Functions and their scope","date":"2014-10-01T04:01:41.369Z","comments":"true","published":"true","keywords":"arrow functions, es6, scope","description":"Read about arrow functions in ES6, and their scopes.","categories":["scope"," articles"," basics"],"authorName":"Felipe N. Moura","authorLink":"http://twitter.com/felipenmoura","authorDescription":"FrontEnd Engineer at Terra Networks - BrazilJS and RSJS curator","authorPicture":"/avatars/felipenmoura.png","content":"<p>Among so many great new features in ES6, Arrow Functions (or Fat Arrow Functions) is one that deserves attention!</p>\n","file":"src/posts/arrow-functions-and-their-scope.md","filename":"arrow-functions-and-their-scope","link":"2014/10/arrow-functions-and-their-scope","lang":"en","default_lang":false},{"layout":"post","title":"What's next for JavaScript","date":"2014-08-29T03:04:03.666Z","comments":"true","published":"true","keywords":"talks","description":"A talk by Dr. Axel Rauschmayer about what's next for JavaScript","categories":["talks"," videos"],"authorName":"Jaydson Gomes","authorLink":"http://twitter.com/jaydson","authorDescription":"JavaScript enthusiast - FrontEnd Engineer at Terra Networks - BrazilJS and RSJS curator","authorPicture":"https://pbs.twimg.com/profile_images/453720347620032512/UM2nE21c_400x400.jpeg","content":"<p>If you&#39;re interested in ES6 you must follow <a href=\"https://twitter.com/rauschma\">Dr. Axel Rauschmayer</a>.</p>\n","file":"src/posts/what-is-next-for-javascript.md","filename":"what-is-next-for-javascript","link":"2014/08/what-is-next-for-javascript","lang":"en","default_lang":false},{"layout":"post","title":"What you need to know about block scope - let","date":"2014-08-28T01:58:23.465Z","comments":"true","published":"true","keywords":"","description":"An introduction to block scope on ES6","categories":["scope"," articles"," basics"],"authorName":"Jaydson Gomes","authorLink":"http://twitter.com/jaydson","authorDescription":"JavaScript enthusiast - FrontEnd Engineer at Terra Networks - BrazilJS and RSJS curator","authorPicture":"https://pbs.twimg.com/profile_images/453720347620032512/UM2nE21c_400x400.jpeg","content":"","file":"src/posts/what-you-need-to-know-about-block-scope-let.md","filename":"what-you-need-to-know-about-block-scope-let","link":"2014/08/what-you-need-to-know-about-block-scope-let","lang":"en","default_lang":false},{"layout":"post","title":"A new syntax for modules in ES6","date":"2014-07-11T07:18:47.847Z","comments":"true","published":"true","keywords":"JavaScript, ES6, modules","description":"Post about module syntax","categories":["modules"],"authorName":"Jean Carlo Emer","authorLink":"http://twitter.com/jcemer","authorDescription":"Internet craftsman, computer scientist and speaker. I am a full-stack web developer for some time and only write code that solves real problems.","authorPicture":"https://avatars2.githubusercontent.com/u/353504?s=460","content":"<p>TC39 - ECMAScript group is finishing the sixth version of the ECMAScript specification. The <a href=\"http://www.2ality.com/2014/06/es6-schedule.html\">group schedule</a> points to next June as the release date.</p>\n","file":"src/posts/a-new-syntax-for-modules-in-es6.md","filename":"a-new-syntax-for-modules-in-es6","link":"2014/07/a-new-syntax-for-modules-in-es6","lang":"en","default_lang":false},{"layout":"post","title":"ES6 interview with David Herman","date":"2014-07-04T01:08:30.242Z","comments":"true","published":"true","keywords":"ES6","description":"Interview with David Herman about ES6","categories":["ES6"," Interview"],"authorName":"Jaydson Gomes","authorLink":"http://twitter.com/jaydson","authorDescription":"JavaScript enthusiast - FrontEnd Engineer at Terra Networks - BrazilJS and RSJS curator","authorPicture":"https://pbs.twimg.com/profile_images/453720347620032512/UM2nE21c_400x400.jpeg","content":"<p>We did a nice interview with <a href=\"https://twitter.com/littlecalculist\">David Herman</a> about his thoughts about ES6.</p>\n","file":"src/posts/es6-interview-with-david-herman.md","filename":"es6-interview-with-david-herman","link":"2014/07/es6-interview-with-david-herman","lang":"en","default_lang":false},{"layout":"post","title":"Practical Workflows for ES6 Modules, Fluent 2014","date":"2014-05-27T07:18:47.847Z","comments":"true","published":"true","keywords":"JavaScript, ES6, modules","description":"Post about modules","categories":["modules"," talks"],"authorName":"Jaydson Gomes","authorLink":"http://twitter.com/jaydson","authorDescription":"JavaScript enthusiast - FrontEnd Engineer at Terra Networks - BrazilJS and RSJS curator","authorPicture":"https://pbs.twimg.com/profile_images/453720347620032512/UM2nE21c_400x400.jpeg","content":"","file":"src/posts/practical-workflows-es6-modules.md","filename":"practical-workflows-es6-modules","link":"2014/05/practical-workflows-es6-modules","lang":"en","default_lang":false},{"layout":"post","title":"ECMAScript 6 - A Better JS for the Ambient Computing Era","date":"2014-05-27T06:18:47.847Z","comments":"true","published":"true","keywords":"JavaScript, ES6, talks","description":"talk about es6","categories":["talks"," videos"],"authorName":"Jaydson Gomes","authorLink":"http://twitter.com/jaydson","authorDescription":"JavaScript enthusiast - FrontEnd Engineer at Terra Networks - BrazilJS and RSJS curator","authorPicture":"https://pbs.twimg.com/profile_images/453720347620032512/UM2nE21c_400x400.jpeg","content":"","file":"src/posts/ecmascript-6-a-better-javascript-for-the-ambient-computing-era.md","filename":"ecmascript-6-a-better-javascript-for-the-ambient-computing-era","link":"2014/05/ecmascript-6-a-better-javascript-for-the-ambient-computing-era","lang":"en","default_lang":false},{"layout":"post","title":"ES6 - The future is here","date":"2014-05-27T05:18:47.847Z","comments":"true","published":"true","keywords":"JavaScript, ES6, talks","description":"talk about es6","categories":["talks"],"authorName":"Jaydson Gomes","authorLink":"http://twitter.com/jaydson","authorDescription":"JavaScript enthusiast - FrontEnd Engineer at Terra Networks - BrazilJS and RSJS curator","authorPicture":"https://pbs.twimg.com/profile_images/453720347620032512/UM2nE21c_400x400.jpeg","content":"<p>A talk by <a href=\"https://twitter.com/sebarmeli\">Sebastiano Armeli</a> showing some of the ES6 features like scoping, generators, collections, modules and proxies.</p>\n","file":"src/posts/ecmascript-6-the-future-is-here.md","filename":"ecmascript-6-the-future-is-here","link":"2014/05/ecmascript-6-the-future-is-here","lang":"en","default_lang":false},{"layout":"post","title":"Hello World","date":"2014-05-17T08:18:47.847Z","comments":"true","published":"true","keywords":"JavaScript, ES6","description":"Hello world post","categories":["JavaScript"," ES6"],"authorName":"Jaydson Gomes","authorLink":"http://twitter.com/jaydson","authorDescription":"JavaScript enthusiast - FrontEnd Engineer at Terra Networks - BrazilJS and RSJS curator","authorPicture":"https://pbs.twimg.com/profile_images/453720347620032512/UM2nE21c_400x400.jpeg","content":"<p>Hello everybody, welcome to ES6Rocks!<br>The mission here is to discuss about <a href=\"http://wiki.ecmascript.org/doku.php?id=harmony:specification_drafts\">JavaScript&#39;s next version</a> , aka Harmony or ES.next.</p>\n","file":"src/posts/hello-world.md","filename":"hello-world","link":"2014/05/hello-world","lang":"en","default_lang":false}],"pt-br":[{"layout":"post","title":"Como estou usando módulos es6 em produção","date":"2015-05-08T04:51:30.117Z","comments":"true","published":"true","keywords":"modules","description":"Post sobre como estpu usando módulos es6 em produção","categories":["modules"],"authorName":"Jaydson Gomes","authorLink":"http://twitter.com/jaydson","authorDescription":"JavaScript enthusiast - FrontEnd Engineer at Terra Networks - BrazilJS and RSJS curator","authorPicture":"https://pbs.twimg.com/profile_images/453720347620032512/UM2nE21c_400x400.jpeg","content":"<p>Estou usando <a href=\"/categories/modules/\">módulos ES6</a> já faz um tempo no meu trabalho diário e eu gostaria de compartilhar com vocês como estou fazendo isso.<br>Em primeiro lugar, o <a href=\"https://babeljs.io/\">Babel</a> é a ferramenta consolidada para fazer transpile. É um projeto bem ativo e cobre praticamente todas as novas features do JavaScript moderno.<br>O Babel funciona muito bem para módulos também, então basta que você decida o sabor, quero dizer, AMD, Common, UMD e até mesmo módulos customizados.  </p>\n","file":"src/posts/how-i-m-using-es6-modules-in-production.md","filename":"how-i-m-using-es6-modules-in-production","link":"pt-br/2015/05/how-i-m-using-es6-modules-in-production","lang":"pt-br","default_lang":true},{"layout":"post","title":"ES6: Brincando com o novo JS","date":"2014-11-13T23:30:23.830Z","comments":"true","published":"true","keywords":"ES6, 6to5, Javascript","description":"Como estudar e aprender ES6 criando experimentos e testes","categories":["Articles"],"authorName":"Pedro Nauck","authorLink":"http://twitter.com/pedronauck","authorPicture":"https://avatars0.githubusercontent.com/u/2029172?v=3&s=160","content":"<p>Acredito que boa parte dos desenvolvedores que tem convívio com JavaScript, já estão ouvindo falar da <a href=\"http://tc39wiki.calculist.org/es6/\">nova versão do JavaScript</a>, conhecida também como ECMAScript 6 ou apenas ES6.</p>\n","file":"src/posts/es6-playing-with-the-new-javascript.md","filename":"es6-playing-with-the-new-javascript","link":"pt-br/2014/11/es6-playing-with-the-new-javascript","lang":"pt-br","default_lang":true},{"layout":"post","title":"Módulos ES6 hoje com o 6to5","date":"2014-10-28T12:49:54.528Z","comments":"true","published":"true","keywords":"ES6, modules, 6to5","description":"Um tutorial sobre o uso de módulos ES6 hoje com o 6to5","categories":["Modules"," Tutorial"],"authorName":"Jaydson Gomes","authorLink":"http://twitter.com/jaydson","authorDescription":"JavaScript enthusiast - FrontEnd Engineer at Terra Networks - BrazilJS and RSJS curator","authorPicture":"https://pbs.twimg.com/profile_images/453720347620032512/UM2nE21c_400x400.jpeg","content":"<p>Eu postei a imagem abaixo no <a href=\"https://twitter.com/jaydson/status/526882798263881730\">Twitter</a>, mostrando o quanto feliz eu estava.</p>\n","file":"src/posts/es6-modules-today-with-6to5.md","filename":"es6-modules-today-with-6to5","link":"pt-br/2014/10/es6-modules-today-with-6to5","lang":"pt-br","default_lang":true},{"layout":"post","title":"JavaScript ♥  Unicode","date":"2014-10-13T19:22:32.267Z","comments":"true","published":"true","keywords":"ES6, Unicode","description":"Mathias Bynens talking about Unicode in JavaScript","categories":["Unicode"," Videos"],"authorName":"Jaydson Gomes","authorLink":"http://twitter.com/jaydson","authorDescription":"JavaScript enthusiast - FrontEnd Engineer at Terra Networks - BrazilJS and RSJS curator","authorPicture":"https://pbs.twimg.com/profile_images/453720347620032512/UM2nE21c_400x400.jpeg","content":"<p>O Mathias Bynens deu uma palestra incrível na última edição da <a href=\"http://2014.jsconf.eu\">JSConfEU</a>.</p>\n","file":"src/posts/javascript-unicode.md","filename":"javascript-unicode","link":"pt-br/2014/10/javascript-unicode","lang":"pt-br","default_lang":true},{"layout":"post","title":"Arrow Functions and their scope","date":"2014-10-01T04:01:41.369Z","comments":"true","published":"true","keywords":"arrow functions, es6, escope","description":"Read about arrow functions in ES6, and their scopes.","categories":["scope"," articles"," basics"],"authorName":"Felipe N. Moura","authorLink":"http://twitter.com/felipenmoura","authorDescription":"FrontEnd Engineer at Terra Networks - BrazilJS and RSJS curator","authorPicture":"/avatars/felipenmoura.png","content":"<p>Entre as tantas novas features presentes no ES6, Arrow Functions (ou Fat Arrow Functions), é uma que merece boa atenção!</p>\n","file":"src/posts/arrow-functions-and-their-scope.md","filename":"arrow-functions-and-their-scope","link":"pt-br/2014/10/arrow-functions-and-their-scope","lang":"pt-br","default_lang":true},{"layout":"post","title":"O que podemos esperar do novo JavaScript","date":"2014-08-29T03:04:03.666Z","comments":"true","published":"true","keywords":"talks","description":"Slides da palestra do Dr. Axel Rauschmayer sobre o que podemos esperar da nova versão do JavaScript","categories":["talks"," videos"],"authorName":"Jaydson Gomes","authorLink":"http://twitter.com/jaydson","authorDescription":"JavaScript enthusiast - FrontEnd Engineer at Terra Networks - BrazilJS and RSJS curator","authorPicture":"https://pbs.twimg.com/profile_images/453720347620032512/UM2nE21c_400x400.jpeg","content":"<p>Se você está interessado em ES6, você deve seguir o <a href=\"https://twitter.com/rauschma\">Dr. Axel Rauschmayer</a>.</p>\n","file":"src/posts/what-is-next-for-javascript.md","filename":"what-is-next-for-javascript","link":"pt-br/2014/08/what-is-next-for-javascript","lang":"pt-br","default_lang":true},{"layout":"post","title":"O que você precisa saber sobre block scope - let","date":"2014-08-28T01:58:23.465Z","comments":"true","published":"true","keywords":"","description":"Uma introdução a block scope na ES6","categories":["scope"," articles"," basics"],"authorName":"Jaydson Gomes","authorLink":"http://twitter.com/jaydson","authorDescription":"JavaScript enthusiast - FrontEnd Engineer at Terra Networks - BrazilJS and RSJS curator","authorPicture":"https://pbs.twimg.com/profile_images/453720347620032512/UM2nE21c_400x400.jpeg","content":"","file":"src/posts/what-you-need-to-know-about-block-scope-let.md","filename":"what-you-need-to-know-about-block-scope-let","link":"pt-br/2014/08/what-you-need-to-know-about-block-scope-let","lang":"pt-br","default_lang":true},{"layout":"post","title":"Uma nova sintaxe para módulos na ES6","date":"2014-07-11T07:18:47.847Z","comments":"true","published":"true","keywords":"JavaScript, ES6, modules","description":"Post about module syntax","categories":["modules"],"authorName":"Jean Carlo Emer","authorLink":"http://twitter.com/jcemer","authorDescription":"Internet craftsman, computer scientist and speaker. I am a full-stack web developer for some time and only write code that solves real problems.","authorPicture":"https://avatars2.githubusercontent.com/u/353504?s=460","content":"<p>O grupo TC39 - ECMAScript já está finalizando a sexta versão da especificação do ECMAScript </p>\n","file":"src/posts/a-new-syntax-for-modules-in-es6.md","filename":"a-new-syntax-for-modules-in-es6","link":"pt-br/2014/07/a-new-syntax-for-modules-in-es6","lang":"pt-br","default_lang":true},{"layout":"post","title":"Entrevista sobre ES6 com o David Herman","date":"2014-07-04T01:08:30.242Z","comments":"true","published":"true","keywords":"ES6","description":"Entrevista feita com David Herman sobre ES6","categories":["ES6"," Interview"],"authorName":"Jaydson Gomes","authorLink":"http://twitter.com/jaydson","authorDescription":"JavaScript enthusiast - FrontEnd Engineer at Terra Networks - BrazilJS and RSJS curator","authorPicture":"https://pbs.twimg.com/profile_images/453720347620032512/UM2nE21c_400x400.jpeg","content":"<p>Fizemos uma entrevista bem legal com o <a href=\"https://twitter.com/littlecalculist\">David Herman</a> sobre ES6.</p>\n","file":"src/posts/es6-interview-with-david-herman.md","filename":"es6-interview-with-david-herman","link":"pt-br/2014/07/es6-interview-with-david-herman","lang":"pt-br","default_lang":true},{"layout":"post","title":"Workflows para os módulos da ES6, Fluent 2014","date":"2014-05-27T07:18:47.847Z","comments":"true","published":"true","keywords":"JavaScript, ES6, modules","description":"Post sobre módulos","categories":["modules"," talks"],"authorName":"Jaydson Gomes","authorLink":"http://twitter.com/jaydson","authorDescription":"JavaScript enthusiast - FrontEnd Engineer at Terra Networks - BrazilJS and RSJS curator","authorPicture":"https://pbs.twimg.com/profile_images/453720347620032512/UM2nE21c_400x400.jpeg","content":"","file":"src/posts/practical-workflows-es6-modules.md","filename":"practical-workflows-es6-modules","link":"pt-br/2014/05/practical-workflows-es6-modules","lang":"pt-br","default_lang":true},{"layout":"post","title":"ECMAScript 6 - Um melhor JavaScript para a Ambient Computing Era","date":"2014-05-27T06:18:47.847Z","comments":"true","published":"true","keywords":"JavaScript, ES6, talks","description":"talk about es6","categories":["talks"," videos"],"authorName":"Jaydson Gomes","authorLink":"http://twitter.com/jaydson","authorDescription":"JavaScript enthusiast - FrontEnd Engineer at Terra Networks - BrazilJS and RSJS curator","authorPicture":"https://pbs.twimg.com/profile_images/453720347620032512/UM2nE21c_400x400.jpeg","content":"","file":"src/posts/ecmascript-6-a-better-javascript-for-the-ambient-computing-era.md","filename":"ecmascript-6-a-better-javascript-for-the-ambient-computing-era","link":"pt-br/2014/05/ecmascript-6-a-better-javascript-for-the-ambient-computing-era","lang":"pt-br","default_lang":true},{"layout":"post","title":"ECMAScript 6 - O futuro está aqui","date":"2014-05-27T05:18:47.847Z","comments":"true","published":"true","keywords":"JavaScript, ES6, talks","description":"talk about es6","categories":["talks"],"authorName":"Jaydson Gomes","authorLink":"http://twitter.com/jaydson","authorDescription":"JavaScript enthusiast - FrontEnd Engineer at Terra Networks - BrazilJS and RSJS curator","authorPicture":"https://pbs.twimg.com/profile_images/453720347620032512/UM2nE21c_400x400.jpeg","content":"<p>Uma palestra do <a href=\"https://twitter.com/sebarmeli\">Sebastiano Armeli</a> mostrando algumas features da ES6 como scoping, generators, collections, modules and proxies.</p>\n","file":"src/posts/ecmascript-6-the-future-is-here.md","filename":"ecmascript-6-the-future-is-here","link":"pt-br/2014/05/ecmascript-6-the-future-is-here","lang":"pt-br","default_lang":true},{"layout":"post","title":"Hello World","date":"2014-05-17T08:18:47.847Z","comments":"true","published":"true","keywords":"JavaScript, ES6","description":"Hello world post","categories":["JavaScript"," ES6"],"authorName":"Jaydson Gomes","authorLink":"http://twitter.com/jaydson","authorDescription":"JavaScript enthusiast - FrontEnd Engineer at Terra Networks - BrazilJS and RSJS curator","authorPicture":"https://pbs.twimg.com/profile_images/453720347620032512/UM2nE21c_400x400.jpeg","content":"<p>Olá pessoal, bem-vindos ao ES6Rocks!\nNossa missão aqui é discutir sobre a <a href=\"http://wiki.ecmascript.org/doku.php?id=harmony:specification_drafts\">a nova versão do JavaScript</a>, mais conhecida como Harmony ou ES.next.</p>\n","file":"src/posts/hello-world.md","filename":"hello-world","link":"pt-br/2014/05/hello-world","lang":"pt-br","default_lang":true}],"cn":[{"layout":"post","title":"我是怎么在项目中使用ES6 模块化的","date":"2015-05-08T04:51:30.117Z","comments":"true","published":"true","keywords":"ES6 module","description":"如何让ES6 module 和 AMD module一起工作","categories":[""],"authorName":"Jaydson Gomes","authorLink":"http://twitter.com/jaydson","content":"<p>我使用 <a href=\"/categories/modules/\">ES6 modules</a>工作已经有一段时间了，今天我就向大家分享下我是怎么使用ES6 moudule的。</p>\n","file":"src/posts/how-i-m-using-es6-modules-in-production.md","filename":"how-i-m-using-es6-modules-in-production","link":"cn/2015/05/how-i-m-using-es6-modules-in-production","lang":"cn","default_lang":true},{"layout":"post","title":"使用6to5，让今天就来写ES6的模块化开发!","date":"2014-11-05T15:19:50.612Z","comments":"true","published":"true","keywords":"ES6, modules, 6to5","description":"使用基于Node.js的6to5，让支持ES5的环境也能使用ES6的模块化","categories":["Modules"," Tutorial"],"authorName":"Jaydson Gomes","authorLink":"http://twitter.com/jaydson","content":"<p>我之前在Twitter上发过一个照片，表达出我有多快乐，这像是一个时光机让我们可以穿梭到未来-ES6的时代！下面让我来展示如何使用6to5让今天就可以练手ES6的模块化。</p>\n","file":"src/posts/es6-modules-today-with-6to5.md","filename":"es6-modules-today-with-6to5","link":"cn/2014/11/es6-modules-today-with-6to5","lang":"cn","default_lang":true},{"layout":"post","title":"JavaScript ♥ 统一编码","date":"2014-10-13T19:22:32.267Z","comments":"true","published":"true","keywords":"ES6, Unicode","description":"Mathias Bynens 关于JavaScript编码的一些谈论","categories":["Unicode"," Videos"],"content":"<p>Mathias Bynens给出了一个非常棒的话题在上一次jsConfEu版本上.\n他提出了javascript的统一编码，如果你在字符上花了很多功夫，那你一定要 看一下这个话题.\n实际上，即使你没在字符串和javascript花了很多时间，这些由Mathias提出的编码技巧也是很有用的。</p>\n","file":"src/posts/javascript-unicode.md","filename":"javascript-unicode","link":"cn/2014/10/javascript-unicode","lang":"cn","default_lang":true},{"layout":"post","title":"ES6箭头函数和它的作用域","date":"2014-10-01T04:01:41.369Z","comments":"true","published":"true","keywords":"arrow functions, es6, escope","description":"关于ES6里箭头函数及其作用域的使用","categories":["作于域"," 文章"," 基本原理"],"authorName":"Felipe N. Moura","authorLink":"http://twitter.com/felipenmoura","authorDescription":"FrontEnd Engineer at Terra Networks - BrazilJS and RSJS curator","authorPicture":"/avatars/felipenmoura.png","translator":"liyaoning","content":"<p>在ES6很多很棒的新特性中, 箭头函数 (或者大箭头函数)就是其中值得关注的一个! 它不仅仅是很棒很酷, 它很好的利用了作用域, 快捷方便的在现在使用以前我们用的技术, 减少了很多代码......但是如果你不了解箭头函数原理的话可能就有点难以理解. 所以,让我们来看下箭头函数, 就是现在!</p>\n","file":"src/posts/arrow-functions-and-their-scope.md","filename":"arrow-functions-and-their-scope","link":"cn/2014/10/arrow-functions-and-their-scope","lang":"cn","default_lang":true},{"layout":"post","title":"你需要知道的块级作用域 - let","date":"2014-08-28T01:58:23.465Z","comments":"true","published":"true","keywords":"","description":"JavaScript 未来声明变量的方式","categories":["scope"," articles"," basics"],"authorName":"Jaydson","authorLink":"http://twitter.com/jaydson","authorDescription":"JavaScript enthusiast - FrontEnd Engineer at Terra Networks - BrazilJS and RSJS curator","authorPicture":"https://pbs.twimg.com/profile_images/453720347620032512/UM2nE21c_400x400.jpeg","content":"<ul>\n<li>译<a href=\"https://github.com/hacke2\">@hacke2</a></li>\n</ul>\n<p>变量声明在任何语言中都是非常基础的东西，理解变量在作用域下如何工作是非常重要的事情。</p>\n<p>在大多数语言中，如<code>Python</code>，他有两个作用域:局部 和 全局。如下，变量定义在代码开头部分则为全局变量，在函数里面声明变量则为局部变量。</p>\n","file":"src/posts/what-you-need-to-know-about-block-scope-let.md","filename":"what-you-need-to-know-about-block-scope-let","link":"cn/2014/08/what-you-need-to-know-about-block-scope-let","lang":"cn","default_lang":true}]};
        }
    }, {
        key: "getPages",
        value: function getPages() {
            return {};
        }
    }]);

    return Harmonic;
})();