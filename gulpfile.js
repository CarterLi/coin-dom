/* eslint-env node */

'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
require('./tasks/dev');
require('./tasks/dist');

gulp.task('clean', ()=> require('del').sync('dist'));

gulp.task('dist', ['clean', 'all:dist']);
gulp.task('dev', ['clean', 'all:dev', 'all:watch']);
gulp.task('help', ()=> {
  $.util.log('');
  $.util.log('=========== gulp 使用说明 ===========');
  $.util.log(' $', $.util.colors.magenta('gulp help'), $.util.colors.gray('   # gulp 使用说明'));
  $.util.log(' $', $.util.colors.magenta('gulp dev'), $.util.colors.gray('    # 进入一般开发环境'));
  $.util.log(' $', $.util.colors.magenta('gulp dist'), $.util.colors.gray('   # 上线部署任务'));
  $.util.log(' $', $.util.colors.magenta('gulp clean'), $.util.colors.gray('  # 目录清理'));
  $.util.log('=====================================');
  $.util.log('');
});
gulp.task('default', ['help']);
