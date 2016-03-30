'use strict';

import gulp from 'gulp';
import babel from 'gulp-babel';
import sourcemaps from 'gulp-sourcemaps';
import merge from 'merge-stream';

const paths = {
  sources: {
    js: "src/*.js",
    package: 'package.json',
    readme: 'README.md'
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
  var pkg = gulp.src(paths.sources.package)
         .pipe(gulp.dest(paths.destinations.output));
  var rm = gulp.src(paths.sources.readme)
         .pipe(gulp.dest(paths.destinations.output));
  return merge(pkg, rm);
});

gulp.task('default',['build-js','build-npm-package']);
