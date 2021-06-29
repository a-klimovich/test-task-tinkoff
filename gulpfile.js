const { src, dest, parallel, watch, series } = require('gulp');
const scss = require('gulp-sass');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const connect = require('gulp-connect');
const fileinclude = require('gulp-file-include');
const gulp = require('gulp');

const srcDirectory = 'src/';
const buildDirectory = 'build/';

const files = {
  html: srcDirectory + 'html/**/*.html',
  scss: srcDirectory + 'scss/**/*.scss',
  js: srcDirectory + 'js/**/*.js',
}

gulp.task('fileinclude', function() {
  gulp.src(['index.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('./'));
});

/** HTML */
function html() {
  return src(files.html)
    .pipe( fileinclude({
      prefix: '@@',
      basepath: srcDirectory + 'html-components'
    }) )
    .pipe( dest(buildDirectory) )
}
/** -//- */

/** Styles */
function styles() {
  return src(files.scss)
    .pipe( scss() )
    .pipe( postcss([ autoprefixer(), cssnano() ]) )
    .pipe( concat('styles.css') )
    .pipe( dest(buildDirectory + 'css/') )
}

/** Scripts */
function scripts() {
  return src(files.js)
    .pipe( concat('scripts.js') )
    .pipe( dest(buildDirectory + 'js/') )
}

/** Assets */
function images() {
  return src(srcDirectory + 'img/**/*')
    .pipe( imagemin() )
    .pipe( dest(buildDirectory + 'img/') )
}

function assets() {
  return src(srcDirectory + 'assets/**/*')
    .pipe( dest(buildDirectory + 'assets/') )
}

function fonts() {
  return src(srcDirectory + 'fonts/**/*')
    .pipe( dest(buildDirectory + 'fonts/') )
}

function php() {
  return src(srcDirectory + '*.php')
    .pipe( dest(buildDirectory + '/') )
}

function htaccess() {
  return src(srcDirectory + '.htaccess')
    .pipe( dest(buildDirectory + '/') )
}
/** -//- */

function watchTask(){
  watch(files.scss, styles);
  watch(files.js, scripts);
  watch(files.html, html);
}

function connectTask() {
  connect.server({
    root: buildDirectory,
    host: 'localhost',
    port: '3000',
    livereload: true
  })
}

const build = parallel(html, styles, scripts, images, assets, fonts, php, htaccess)

exports.build = build;

exports.default = series(
  build,
  parallel(watchTask, connectTask),
);