'use strict';

var gulp = require('gulp'),
  runSequence = require('run-sequence'),
  del = require('del'),
  concat = require('gulp-concat'),
  rename = require('gulp-rename'),
  sass = require('gulp-ruby-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  babel = require('gulp-babel'),
  eslint = require('gulp-eslint')

var path = require('path'),
  ROOT = path.resolve(__dirname)

/**
 * -------------------- Clean task --------------------
 */
gulp.task('clean', function(cb) {
  return del(['dist'], cb)
})

gulp.task('clean:docs', function(cb) {
  return del(['docs/dist'], cb)
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
    .pipe(autoprefixer({
      browsers: ['ie >= 8', 'Firefox >= 10', 'Chrome >= 20', 'Opera >= 10', 'Safari >= 5']
    }))
    .pipe(gulp.dest('dist/css/'))
})

/**
 * -------------------- Lint task --------------------
 */
gulp.task('lint', function() {
  return gulp.src('src/scripts/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
})

/**
 * -------------------- Script task --------------------
 */
gulp.task('script', ['lint'], function() {
  return gulp.src([
      'src/scripts/heightfix.js',
      'src/scripts/util.js',
      'src/scripts/modal-adapter.js',
      'src/scripts/accordion.js'
    ])
    .pipe(babel({ modules: 'ignore' }))
    .pipe(concat('jarvis.js'))
    .pipe(gulp.dest('dist/js'))
})

/**
 * -------------------- Vendor task --------------------
 */
gulp.task('vendor:font', function() {
  return gulp.src([
      'node_modules/font-awesome/fonts/**'
    ])
    .pipe(gulp.dest('dist/fonts'))
})

gulp.task('vendor:css', function() {
  return gulp.src([
      'node_modules/font-awesome/css/font-awesome.css',
      'node_modules/select2/dist/css/select2.css'
    ])
    .pipe(gulp.dest('dist/css'))
})

gulp.task('vendor:js', function() {
  return gulp.src([
      'node_modules/select2/dist/js/select2.js'
    ])
    .pipe(gulp.dest('dist/js'))
})

gulp.task('vendor', ['vendor:font', 'vendor:css', 'vendor:js'])

/**
 * -------------------- Bootstrap task --------------------
 */
gulp.task('bootstrap:font', function() {
  return gulp.src('node_modules/bootstrap/dist/fonts/**')
           .pipe(gulp.dest('dist/fonts'))
})

gulp.task('bootstrap:css', function() {
  return gulp.src('node_modules/bootstrap/dist/css/bootstrap.css')
           .pipe(gulp.dest('dist/css'))
})

gulp.task('bootstrap:js', function() {
  return gulp.src('node_modules/bootstrap/dist/js/bootstrap.js')
           .pipe(gulp.dest('dist/js'))
})

gulp.task('bootstrap', ['bootstrap:font', 'bootstrap:css', 'bootstrap:js'])

/**
 * -------------------- Docs task --------------------
 */
gulp.task('docs', ['clean:docs'], function() {
  return gulp.src('dist/**').pipe(gulp.dest('docs/dist'))
})

/**
 * -------------------- Watch task --------------------
 */
gulp.task('watch', function() {
  gulp.watch('src/scss/**/*.scss', ['sass'])
  gulp.watch('src/scripts/*.js', ['script'])
  gulp.watch('src/images/*', ['image'])
})

/**
 * -------------------- Build task --------------------
 */
gulp.task('build', function(cb) {
  runSequence('clean',
    ['bootstrap', 'vendor', 'image', 'sass', 'script'], cb)
})

/**
 * -------------------- Dev task --------------------
 */
gulp.task('dev', ['build'], function(cb) {
  runSequence('docs', 'watch', cb)
})

/**
 * -------------------- Default task --------------------
 */
gulp.task('default', ['build'])




