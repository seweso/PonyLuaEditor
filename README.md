## Code Editor

https://ace.c9.io/

With modified syntax highlighter.

The autocompletition is not used, instead i use custom code for that

## Lua VM
https://fengari.io/

## Favicon
Generated with https://realfavicongenerator.net/


## Build Tools

### Gulp

install gulp
```
npm install --global gulp-cli
```

setup gulp in project
```
npm install --save-dev gulp
```


create `gulpfile.js`

```javascript
function defaultTask(cb){
    
    cb()
}

exports.default = defaultTask
```

run gulp
```
gulp
```




### Gulp-Concat
```
npm install --save-dev gulp-concat
```

Source javascript files are inside src/scripts
All of them are concatenated and written into scripts/all.js
Any libraries should be placed directly into scripts/lib/
You must register any new script inside gulpfile.js


### Gulp-Sass
```
npm install node-sass gulp-sass --save-dev
```