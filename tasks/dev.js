/* eslint-env node */

'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();

function getNotifiySettings(type, s) {
  return {
    onLast: true,
    title: `${type} were compiled`,
    message: file => `Created: ${file.relative}, ${s.prettySize}`,
  };
}

gulp.task('css:dev', ()=> {
  const type = 'Styles';
  const s = $.size(type);
  return gulp.src('src/*.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass({outputStyle: 'compressed'}).on('error', $.sass.logError))
    .pipe($.concat('all.css'))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('dist'))
    .pipe(s)
    .pipe($.notify(getNotifiySettings(type, s)))
    .on('error', $.notify.onError(err => err));
});

gulp.task('css:watch', ()=>
  gulp.watch('src/*.scss', ['css:dev']));

gulp.task('js:lint', ()=>
  gulp.src(['tasks/*.js', 'src/*.js', 'gulpfile.js'])
    .pipe($.eslint())
    .pipe($.eslint.format())
);

gulp.task('js:dev', ()=> {
  const type = 'Scripts';
  const s = $.size(type);
  return gulp.src('src/*.js')
    .pipe($.sourcemaps.init())
    .pipe($.concat('all.js'))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('dist'))
    .pipe(s)
    .pipe($.notify(getNotifiySettings(type, s)));
});

gulp.task('js:watch:1', ()=>
  gulp.watch(['tasks/*.js', 'gulpfile.js', 'src/*.js'], evt=> {
    if (evt.type !== 'deleted') {
      return gulp.src(evt.path)
        .pipe($.eslint())
        .pipe($.eslint.format())
        .pipe($.eslint.failAfterError())
        .on('error', $.notify.onError(err => ({ title: err.name, message: err.message })));
    }
  }
));

gulp.task('js:watch:2', ()=>
  gulp.watch(['src/*.js'], ['js:dev']));

gulp.task('all:dev', ['js:lint', 'js:dev', 'css:dev']);
gulp.task('all:watch', ['js:watch:1', 'js:watch:2', 'css:watch']);
