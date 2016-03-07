'use strict';

var gulp = require('gulp'),
  del = require('del'),
  connect = require('gulp-connect'),
  concat = require('gulp-concat'),
  rename = require('gulp-rename'),
  sass = require('gulp-ruby-sass'),
  babel = require('gulp-babel')

var path = require('path'),
  ROOT = path.resolve(__dirname)

/**
 * -------------------- Connect task --------------------
 */
gulp.task('connect', function() {
  connect.server({
    root: ROOT,
    port: 8888,
    livereload: true
  })
})

/**
 * -------------------- Image task --------------------
 */
gulp.task('image', function() {
  return gulp.src('src/images/*')
    .pipe(gulp.dest('dist/images'))
})

/**
 * -------------------- Scss task --------------------
 */
gulp.task('sass', function() {
  return sass('src/scss/jarvis.scss', {
      style: 'expanded'
    })
    .on('error', sass.logError)
    .pipe(gulp.dest('dist/css/'))
})

/**
 * -------------------- Script task --------------------
 */
gulp.task('script', function() {
  return gulp.src(['src/scripts/util.js', 'src/scripts/!(util)*.js'])
    .pipe(babel())
    .pipe(concat('jarvis.js'))
    .pipe(gulp.dest('dist/js/'))
})

/**
 * -------------------- Watch task --------------------
 */
gulp.task('watch', function() {
  gulp.watch('src/scss/*.scss', ['sass'])
  gulp.watch('src/scripts/*.js', ['script'])
  gulp.watch('src/images/*', ['image'])
})

/**
 * -------------------- Dev task --------------------
 */
gulp.task('dev', ['connect', 'watch'])