'use strict';

var gulp = require('gulp'),
  plugins = require('gulp-load-plugins')(),
  del = require('del')

var path = require('path'),
  ROOT = path.resolve(__dirname)

gulp.task('dev', function() {
  plugins.connect.server({
    root: ROOT,
    port: 8888,
    livereload: true  
  })  
})
