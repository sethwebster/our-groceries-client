'use strict';

import gulp from 'gulp';
import babel from 'gulp-babel';
import sourcemaps from 'gulp-sourcemaps';

const paths = {
  sources: {
    js: "src/*.js",
    package: 'package.json'
  },
  destinations: {
    output: "build"
  }
};

gulp.task('build-js', () => {
  return gulp.src(paths.sources.js)
         .pipe(babel({
            presets: ['es2015']
         }))
         .pipe(sourcemaps.init())
         .pipe(sourcemaps.write())
         .pipe(gulp.dest(paths.destinations.output));
});

gulp.task('build-npm-package', () => {
  return gulp.src(paths.sources.package)
         .pipe(gulp.dest(paths.destinations.output));
});

gulp.task('default',['build-js','build-npm-package']);
