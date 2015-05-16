<!--
layout: post
title: Usando módulos de ES6 en el navegador con gulp
date: 2014-12-02T17:14:37.232Z
comments: true
published: true
keywords: JavaScript, ES6, modules, Traceur, gulp
description: Cómo usar módulos de ES6 en el navegador con Traceur y gulp
categories: modules, tutorial
authorName: Juan Cabrera
authorLink: http://juan.me
authorPicture: http://juan.me/images/reacticabrera.jpg
-->
<!--more-->
Hay una gran cantidad de información sobre [gulp](http://gulpjs.com/), no mucha sobre ES6 y unos pocos artículos sobre cómo usar módulos de ES6 correctamente, en el navegador.

En mi último proyecto, estuve usando [gulp](http://gulpjs.com/) + ES6 y tuve que estar un tiempo investigando cómo hacer para que funcionaran bien los módulos de ES6. 

A continuación, quiero contarles cómo lo logré sin usar [Browserify](http://browserify.org/) ni [AMD](http://requirejs.org/).


Mi primer intento, fue usar [`gulp-es6-transpiler`](https://www.npmjs.org/package/gulp-es6-transpiler) (que básicamente es un wrapper de [`es6-transpiler`](https://www.npmjs.org/package/es6-transpiler)), pero no tiene soporte para módulos de ES6.


Luego, estuve probando [`gulp-es6-module-jstransform`](https://www.npmjs.org/package/gulp-es6-module-jstransform), pero solamente transpila a CommonJS, lo que significa que tendríamos que usar [Browserify](http://browserify.org/) para usarlos en el navegador.


Por último, probé [Traceur](https://github.com/google/traceur-compiler) (de Google) que tiene dos opciones para utilizar módulos en el navegador. Por un lado, `AMD` (pero tendríamos que usar [RequireJS](http://requirejs.org/) o algo similar); y por otro `inline`. La opción `inline`, basicamente, genera un archivo con todos los módulos transpilados (que es lo más parecido a como funcionan los módulos de ES6).


El problema, es que la opción `inline` funciona perfectamente si usamos la línea de comando. Pero, si queremos utilizar una API de Traceur para Node (por ejemplo [`gulp-traceur`](https://www.npmjs.org/package/gulp-traceur)) nos muestra un error.


**[Actualización]** He publicado este issue en [Github](https://github.com/google/traceur-compiler/issues/1282) y finalmente lo solucionaron. Pero nos dimos cuenta que el código generado utilizando la API para Node, es diferente al código que genera la línea de comando.


Es por este motivo, que finalmente decidimos crear un plugin para [gulp](http://gulpjs.com/) que nos permitiera utilizar la línea de comando de Traceur en Node (Gracias Edward!).


[Aquí está el plugin](https://www.npmjs.org/package/gulp-traceur-cmdline) y a continuación, cómo lo pueden usar:

**Instalación**

Primero, tenés que tener instalado Traceur globalmente:
```bash
npm install traceur --global
```

Luego, tenés que instalar `gulp-traceur-cmdline` en tu proyecto:
```bash
npm install gulp-traceur-cmdline --save-dev
```

**Uso**
```javascript
var gulpTraceurCmdline = require('gulp-traceur-cmdline');

gulp.task('gulpTraceurCmdline',function() {
  gulp.src("./source/styleguide/js/main.js")
    .pipe(gulpTraceurCmdline('/usr/local/bin/traceur', {
      modules : 'inline',
      out     : './dist/styleguide/js/main.js',
      debug   : false
    }))
}); 
```

**Links**

Github: https://github.com/juancabrera/gulp-traceur-cmdline  
NPM: https://www.npmjs.org/package/gulp-traceur-cmdline


**Sin gulp**

También podés correr Traceur directamente, sin utitlizar gulp, de la siguiente manera:
```bash
traceur --modules inline --out mainTranspiled.js main.js
```
—

Este artículo fue publicado originalmente en [mi blog](http://code.juan.me/using-es6-modules-in-the-browser/).