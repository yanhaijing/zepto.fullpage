var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var pump = require('pump');
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');


gulp.task('js', function () {
  pump([
    gulp.src([
      './src/zepto.fullpage.js',
    ]),
    uglify(),
    rename('zepto.fullpage.min.js'),
    gulp.dest('src'),
  ]);
});


gulp.task('css', function () {
  var processors = [
    autoprefixer({ browsers: ['iOS >= 8', 'Android >= 4'] }),
    cssnano(),
  ];

  pump([
    gulp.src('./src/zepto.fullpage.css'),
    postcss(processors),
    rename('zepto.fullpage.min.css'),
    gulp.dest('src'),
  ]);
});


gulp.task('default', ['js', 'css']);
