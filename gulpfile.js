/* eslint-env node */

'use strict';

const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const eslint = require('gulp-eslint');
const del = require('del');

gulp.task('js:dist', ()=>
  gulp.src('src/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({ presets: ['es2015'] }))
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'))
);

gulp.task('css', ()=>
  gulp.src('src/*.scss')
    .pipe(sourcemaps.init())
    .pipe(concat('all.scss'))
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'))
);

gulp.task('css:watch', ()=>
  gulp.watch('src/*.scss', ['css']));

gulp.task('js:lint', ()=>
  gulp.src(['src/*.js', 'gulpfile.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError())
);

gulp.task('js:dev', ['js:lint'], ()=>
  gulp.src('src/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('all.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'))
);

gulp.task('js:watch', ()=>
  gulp.watch(['src/*.js', 'gulpfile.js'], ['js:lint', 'js:dev']));

gulp.task('clean', ()=> del('dist'));

gulp.task('default', ['js:dist', 'css']);
gulp.task('dev', ['js:dev', 'css', 'js:watch', 'css:watch']);
