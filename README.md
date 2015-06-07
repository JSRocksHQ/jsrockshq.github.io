![JS Rocks](images/jsrocks-header-gh.png)

# How to contribute
[JSRocks.org](http://jsrocks.org/) is a collaborative website about the latest JavaScript features and tools.  
Anyone can contribute by writing an article, making a layout change, suggesting new sections, reporting issues, etc.  
Contributing to JS Rocks is super easy, choose the type of contribution you want.  

## Writing an article
The JS Rocks website is built with [Harmonic](https://github.com/JSRocksHQ/harmonic/), our static site generator.
- First thing you need to do is to install Harmonic.
```javascript
npm install harmonic -g
```
You'll need Node.js >= 0.10 (or io.js) and npm already installed.  
Check out the main [Harmonic documentation](https://github.com/JSRocksHQ/harmonic/) if you're in trouble.  

- Fork and clone the jsrockshq.github.io repository
```shell
# replace YOUR_USERNAME with your GitHub username below
git clone https://github.com/YOUR_USERNAME/jsrockshq.github.io.git
cd jsrockshq.github.io
git remote add upstream https://github.com/JSRocksHQ/jsrockshq.github.io.git
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
This command will build and run the JS Rocks website in the default port 9356.

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
You can help JS Rocks by finding a bug in the website, a typo in an article or even an incorrect sentence.  
File an [issue](https://github.com/JSRocksHQ/jsrockshq.github.io/issues), and we will solve it ASAP.
