![es6rocks](https://raw.githubusercontent.com/es6rocks/es6rocks.github.io/master/images/es6rocks.png)

# How to contribute
[ES6Rocks.com](http://es6rocks.com/) is a collaborative website about the ECMAScript language's sixth edition, a.k.a. ES6.  
Anyone can contribute by writing an article, making a layout change, suggesting new sections, reporting issues, etc.  
Contributing to ES6Rocks is super easy, choose the type of contribution you want.  

## Writing an article
ES6Rocks website is built with [Harmonic](https://github.com/es6rocks/harmonic/), our static site generator.
- First thing you need to do is to install Harmonic.
```javascript
npm install harmonic -g
```
You'll need Node.js >= 0.11.13 and npm already installed.  
Check out the main [Harmonic documentation](https://github.com/es6rocks/harmonic/) if you're in trouble.  

- Fork and clone the es6rocks.github.io repository
```shell
# replace YOUR_USERNAME with your GitHub username below
git clone https://github.com/YOUR_USERNAME/es6rocks.github.io.git
cd es6rocks.github.io
git remote add upstream https://github.com/es6rocks/es6rocks.github.io.git
```

- Create a new branch using `upstream/src` as base and checkout to it
```shell
git fetch upstream
git checkout -b my-awesome-post upstream/src
```

- Create a new post
```shell
harmonic new_post "My awesome post"
```
This command will create a new markdown file in `/src/posts/[LANG]`.  

- Run Harmonic to check if your post is ready
```shell
harmonic run
```
This command will build and run the ES6Rocks website in the default port 9356.

- Commit your changes
```shell
git add .
git commit -m "my awesome article"
```

- Push your new branch to your forked repository
```shell
git push origin HEAD
```
Go to your forked repository's page on Github.com and create a pull request for the `src` branch.

## Issues
You can help ES6Rocks by finding a bug in the website, a typo in an article or even an incorrect sentence.  
File an [issue](https://github.com/es6rocks/es6rocks.github.io/issues), and we will solve it ASAP.
