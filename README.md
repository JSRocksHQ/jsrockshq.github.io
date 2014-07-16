![es6rocks](https://raw.githubusercontent.com/es6rocks/es6rocks.github.io/master/images/es6rocks.png)

# How to contribute
Contribute to ES6Rocks is easy, choose what type of contribution you want.

## Writing an article
ES6Rocks website is built with [Harmonic](https://github.com/es6rocks/harmonic/), our static site generator.
- First thing you need to do is install harmonic.
```javascript
npm install harmonic -g
```
You'll need node 0.11.* an npm already installed.
Check it out the main [Harmonic](https://github.com/es6rocks/harmonic/) documentation if you're trouble.

- Fork and clone es6rocks.github.io
```shell
git clone git@github.com:[USER]/es6rocks.github.io.git
```

- Checkout to the _src_ branch
```shell
git checkout src
```

- Create a new post
```shell
harmonic new_post "My awesome post"
```
This command will create a new markdown file in /src/posts.

- Test
Run Harmonic to check if your post is ok:
```shell
harmonic run
```
This command will build and run ES6Rocks website in the defalut port 9356.

- Copy the public folfer to the master branch
The result of Harmonic run is the /public folder.
All you'll need to do is copy the public folder to the master branch.
```shell
cp public/ -r /tmp/esrocks-website
```
- Commit your changes and checkout to the master branch
```shell
git add .
git commit -m "posts about promises"
git checkout master
```
- On the master branch, put all the content from your public folder previously copied
```shell
cp /tmp/esrocks-website/* -r ./
```
- Commit, push and open a pull-request for both master and src branches
```shell
git add .
git commit -m "posts about promises"
git push origin master

git checkout src
git push origin src
```
Go to Github.com on your fork page, and create a pull-request.

