var gulp = require('gulp');
var concat = require('gulp-concat');
 
gulp.task('default', function() {
    let prefix = './src/scripts/'
    let suffix = '.js'
    let order = [ 'loader',
        /* scripts without LOADER */
        'util','translate','reporter','http_localhost','paint','map','luaparse','luamin','luaminy','luamax','minmax',

        /* scripts requiring LOADER */
        'giveaway','lua_emulator','stormworks_lua_api','storage','share','ui','ui_helpers','ui_builder','lua_console',
        'examples','editor','autocompletion','documentation','documentation_definition_client','documentation_definition_server',
        'yyy','engine','input','output','property','canvas'
        ]

    for(let i in order){
        order[i] = prefix + order[i] + suffix
    }



    return gulp.src(order)
        .pipe(concat('all.js', {newLine: '\n;\n'}))
        .pipe(gulp.dest('./scripts/'))
})

var sass = require('gulp-sass');
 
sass.compiler = require('node-sass');
 
gulp.task('sass', function () {
  return gulp.src('./src/sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./stylesheets/'));
});
 
gulp.task('sass:watch', function () {
  gulp.watch('./src/sass/*.scss', ['sass']);
});