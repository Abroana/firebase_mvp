var gulp = require('gulp'),
  autoprefixer = require('gulp-autoprefixer'),
  cleanCSS = require('gulp-clean-css'),
  importCss = require('gulp-import-css'),
  rollup = require('rollup'),
  jsdoc = require('gulp-jsdoc3'),
  eslint = require('gulp-eslint'),
  babel = require('rollup-plugin-babel')

gulp.task('doc', function(cb) {
  var config = require('./jsdoc.json')

  gulp.src(['./js/app/**/*.js'], { read: false }).pipe(jsdoc(config, cb))
})

gulp.task('css:minify', function() {
  gulp
    .src('./app/css/main.css')
    .pipe(importCss())
    .pipe(
      autoprefixer({
        browsers: ['last 10 versions', 'ie >= 10']
      })
    )
    .pipe(cleanCSS())
    .pipe(gulp.dest('./dist/css/'))
})

gulp.task('js:lint', function() {
  return gulp
    .src(['./app/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
})

gulp.task('js:build', ['js:lint'], async function() {
  const bundle = await rollup.rollup({
    input: './app/js/main.js',
    // external: ['tui-image-editor'],
    plugins: [babel({ exclude: 'node_modules/**' })]
  })

  await bundle.write({
    file: './dist/js/app.js',
    format: 'iife',
    name: 'Next',
    sourcemap: true
    // globals: { 'tui-image-editor': 'ImageEditor' }
  })
})

gulp.watch(['./app/**'], ['js:build', 'css:minify'])

gulp.task('default', ['js:build', 'css:minify'])
