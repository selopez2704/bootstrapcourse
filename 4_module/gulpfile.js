'use strict'

const { dest } = require('vinyl-fs');
const { Collapse } = require('bootstrap');

var gulp = require('gulp'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync'),
  del = require('del'),
  imagemin = require('gulp-imagemin'),
  uglify = require ('uglify'),
  usemin = require('gulp-usemin'),
  rev = require('gulp-rev'),
  cleanCss = require('gulp-clean-css'),
  flatmap = require('gulp-flatmap'),
  htmlmin = require('gulp-htmlmin');
  
  gulp.task('sass', function(){
    gulp.src('./css/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('./css'));
  });

  // gulp --tasks  <<<-- PARA ENUMERAR LAS TAREAS DISPONIBLES
  //gulp build BORRA CARPETA dist Y CREA UNA NUEVA CARPETA dist CON TODOS LOS ARCHIVOS

  gulp.task('sass:watch', function(){
    gulp.watch('./css/*.scss', ['sass']);
  });

  gulp.task('browser-sync', function(){
    var files = ['./*.html', './css/*.css', './img-hoteles/*.{png, jpg, git}', './js/*.js'];
    browserSync.init(files, {
      server: {
        baseDir: './'
      }
    });
  });

  gulp.task('default', ['browser-sync'], function(){
    gulp.start('sass:watch');
  });

  gulp.task('clean', function(){
    return del(['dist']);
  });

  gulp.task('copyfonts', function(){
    gulp.src('./node_modules/open-iconic/fonts/*.{ttf,woff,eof,svg,eot,otf}*')
      .pipe(gulp.dest('./dist/fonts'));
  });

  gulp.task('imagemin', function(){
    return gulp.src('./img-hoteles/*')
      .pipe(imagemin({optimizationLevel: 3, progressive: true, interlaced: true}))
      .pipe(gulp.dest('dist/img-hoteles'));
  });

  gulp.task('usemin', function(){
    return gulp.src('./*.html')
      .pipe(flatmap(function(stream, file){
        return stream
          .pipe(usemin({
            css: [rev()],
            html: [function() { return htmlmin({collapseWhitespace: true})}],
            js: [uglify(), rev()],
            inlinejs: [uglify()],
            inlinecss: [cleanCss(), 'concat']
          }))
      }))
      .pipe(gulp.dest('dist/'));

  });

    gulp.task('build', ['clean'], function(){
      gulp.start('copyfonts', 'imagemin', 'usemin');

    });
    
    //.{png, jpg, jpeg, gif}')

  // const gulp = require("gulp"),
  //   browserSync = require("browser-sync").create();
  //   gulp.task("default", () => {
  //   browserSync.init({
  //     server: "./",
  //   });
  //   gulp.watch("./*.html").on("change", browserSync.reload);
  //   gulp.watch("./*.css").on("change", browserSync.reload);
  //   gulp.watch("./*.js").on("change", browserSync.reload);
  // });