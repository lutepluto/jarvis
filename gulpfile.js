'use strict';

var gulp = require('gulp'),
  del = require('del'),
  connect = require('gulp-connect'),
  sass = require('gulp-ruby-sass')

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
 * -------------------- Watch task --------------------
 */
gulp.task('watch', function() {
  gulp.watch('src/scss/*.scss', ['sass'])
  gulp.watch('src/images/*', ['image'])
})

/**
 * -------------------- Dev task --------------------
 */
gulp.task('dev', ['connect', 'watch'])