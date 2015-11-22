/* eslint-env node */

'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const url = require('postcss-url');
const fs = require('fs');
const path = require('path');
const mime = require('mime');

gulp.task('js:dist', ()=>
  gulp.src('src/*.js')
    .pipe($.sourcemaps.init())
    .pipe($.babel({ presets: ['es2015'] }))
    .pipe($.concat('all.js'))
    .pipe($.uglify())
    .pipe($.rev())
    .pipe($.sourcemaps.write('.'))
    .pipe($.size({ title: 'Scripts:' }))
    .pipe(gulp.dest('dist/dist'))
    .pipe($.rev.manifest('dist/rev-manifest.json', { base: 'dist', merge: true }))
    .pipe(gulp.dest('dist'))
);

function getRevedImageUrl(URL, manifest, basePath) {
  basePath = basePath || '.';
  if (URL.startsWith('../')) {
    const revedPath = manifest[URL.substr(3)];

    if (revedPath) {
      URL = `../${revedPath}`;
    }
  }
  const file = path.resolve(path.join(basePath, URL));
  if (!fs.existsSync(file)) {
    $.util.log($.util.colors.red(`Can't read file ${URL}, ignoring`));
    return URL;
  }
  const stats = fs.statSync(file);
  if (stats.size >= 140 * 1024) {
    return URL;
  }
  const mimeType = mime.lookup(file);
  if (!mimeType) {
    $.util.log($.util.colors.yellow(`Unable to find asset mime-type for`), file);
    return URL;
  }

  if (mimeType === 'image/svg+xml') {
    $.util.log($.util.colors.green('Inlining svg'), file);
    return `data:image/svg+xml;charset=US-ASCII,` +
      encodeURIComponent(fs.readFileSync(file).toString('utf-8').replace(/'/gmi, '\\i'))
        .replace(/\(/g, '%28').replace(/\)/g, '%29');
  }

  $.util.log($.util.colors.green('Inlining image'), file);
  return `data:${mimeType};base64,${fs.readFileSync(file).toString('base64')}`;
}

gulp.task('css:dist', ['img:dist'], ()=> {
  const manifest = JSON.parse(fs.readFileSync('dist/rev-manifest.json').toString());

  return gulp.src('src/*.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass({ outputStyle: 'compressed' }))
    .pipe($.concat('all.css'))
    .pipe($.postcss([
      url({ url: URL => getRevedImageUrl(URL, manifest, 'dist/dist') }),
      autoprefixer({ browsers: ['last 1 version'] }),
      cssnano({ mergeIdents: false, reduceIdents: false }),
    ]))
    .pipe($.rev())
    .pipe($.sourcemaps.write('.'))
    .pipe($.size({ title: 'Styles: ' }))
    .pipe(gulp.dest('dist/dist'))
    .pipe($.rev.manifest('dist/rev-manifest.json', { base: 'dist', merge: true }))
    .pipe(gulp.dest('dist'));
});

gulp.task('img:dist', ()=> {
  return gulp.src('img/*', { base: '.' })
    .pipe($.if('**.*.svg', $.svgmin()))
    .pipe($.rev())
    .pipe(gulp.dest('dist'))
    .pipe($.rev.manifest('dist/rev-manifest.json', { base: 'dist', merge: true }))
    .pipe(gulp.dest('dist'));
});

gulp.task('all:dist', ['js:dist', 'css:dist', 'img:dist'], ()=>
  gulp.src('index.html')
    .pipe($.revReplace({ manifest: gulp.src('dist/rev-manifest.json') }))
    .pipe(gulp.dest('dist'))
);
