const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const cssWrap = require('gulp-css-wrap');
const less = require('gulp-less');
const plumber = require('gulp-plumber');
const concat = require('gulp-concat');
const notify = require('gulp-notify');
const fs = require('fs');

//主题
const themes = require('./src/theme-config');

const taskFun = [];
themes.forEach(theme => {
  taskFun.push(async () => {
    let data = fs.readFileSync('./src/assets/less/variable.less', { encoding: "utf-8" });
    for (let varKey in theme.variables) {
      data = data.replace(new RegExp(`(?<=${varKey}:).+(?=;)`, 'g'), theme.variables[varKey]);
    }
    fs.writeFileSync('./src/assets/less/variable.less', data);
  }, () => {
    return gulp.src(['./src/assets/less/main.less'])
      .pipe(plumber({
        errorHandler: notify.onError('Error: <%= error.message %>')
      }))
      .pipe(less())
      .pipe(cssWrap({ selector: `.pso-theme-${theme.name}` }))
      .pipe(cleanCSS())
      .pipe(concat(`theme-${theme.name}.css`))
      .pipe(gulp.dest('./src/assets/theme/'));
  }, () => {
    return gulp.src(['./src/assets/theme/theme-*.css'])
      .pipe(concat(`index.css`))
      .pipe(gulp.dest('./src/assets/theme/'));
  })
})

gulp.task('watch-less', function () {
  gulp.watch([
    './src/assets/less/main.less',
    './src/assets/less/global.less',
    './src/assets/less/*/*.less',
    './src/assets/less/*/*/*.less'
  ],
    gulp.series(...taskFun)
  );
});

gulp.task('watch', gulp.series('watch-less'));
