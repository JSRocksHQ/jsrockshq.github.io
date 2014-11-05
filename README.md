![es6rocks](https://raw.githubusercontent.com/es6rocks/es6rocks.github.io/master/images/es6rocks.png)

# How to contribute
[ES6Rocks.com](http://es6rocks.com/) is a collaborative website about the ECMAScript language sixth version, a.k.a ES6.  
Anyone can contribute by writing an article, making a layout change, suggest new sections, reporting issues, etc.  
Contributing to ES6Rocks is super easy, choose the type of contribution you want.  

## Writing an article
ES6Rocks website is built with [Harmonic](https://github.com/es6rocks/harmonic/), our static site generator.
- First thing you need to do is to install Harmonic.
```javascript
npm install harmonic -gche
```
You'll need node 0.11.* and npm already installed.  
Check out the main [Harmonic documentation](https://github.com/es6rocks/harmonic/) if you're in trouble.  

- Fork and clone the es6rocks.github.io repository
```shell
git clone git@github.com:[USER]/es6rocks.github.io.git
```

- Checkout to the `src` branch
```shell
git checkout src
```

- Create a new post
```shell
harmonic new_post "My awesome post"
```
This command will create a new markdown file in `/src/posts/[LANG]`.  

- Test
Run Harmonic to check if your post is ready:
```shell
harmonic run
```
This command will build and run the ES6Rocks website in the default port 9356.

- Commit your changes
```shell
git add .
git commit -m "my awesome article"
```

- push and open a pull-request for the src branch
```shell
git push origin src
```
Go to your forked repository's page on Github.com and create a pull-request.

## Issues
You can help us by finding a bug on the website, a typo in an article or even a wrong sentence.  
File an [issue](https://github.com/es6rocks/es6rocks.github.io/issues) about it, and we'll solve ASAP.
