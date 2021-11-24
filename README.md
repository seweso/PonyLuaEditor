##
Always update the LATEST_CHANGES.txt since that is used for Open Graph

## Code Editor

https://ace.c9.io/

With modified syntax highlighter.

The autocompletition is not used, instead i use custom code for that

## Lua VM
https://fengari.io/

## Favicon
Generated with https://realfavicongenerator.net/


## Build Tools

### git hooks for versioning

after you cloned this repository, run
```sh setup_git_hooks.sh```

This will enable the git hooks, so it sets the content of version.js to the current commit hash.

You can always enfore it by doing a checkout on the current select branch (e.g. `git checkout master`)


### Gulp
REQUIRES Node.js Version 12

install gulp build tools
```
npm install --global gulp-cli
```

setup gulp in project
```
npm install
```

run gulp
```
gulp scripts
```
To generate scripts out of the `src` folder

```
gulp sass
```
To generate stylesheets out of the `src` folder

```
gulp watch
```
To watch filechanges. Both (scripts and sass) will be generated everytime a file changes and right after you started `gulp watch`




### Gulp - Scripts

Source javascript files are inside src/scripts
All of them are concatenated and written into scripts/all.js
Any libraries should be placed directly into scripts/lib/
You must register any new script inside gulpfile.js


### Gulp - Sass
Source stylesheets are inside src/sass
All of them are written in the sass language
