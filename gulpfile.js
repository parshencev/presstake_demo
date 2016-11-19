var gulp = require("gulp"),
    rename = require("gulp-rename"),
    less = require("gulp-less"),
    uglify = require("gulp-uglify"),
    LessPluginAutoPrefix = require('less-plugin-autoprefix'),
    autoprefixPlugin = new LessPluginAutoPrefix({browsers: ["last 20 versions"]}),
    LessPluginCleanCSS = require('less-plugin-clean-css'),
    cleanCSSPlugin = new LessPluginCleanCSS({advanced: true}),
    browserSync = require('browser-sync').create(),
    paths = {
      less : "less/*.less",
      css : "css/",
      server : "./",
      cssMin : "css/min/",
      js : "js/presstake-banner-loader-2.js",
      jsMin : "js/"
    };

gulp.task("default", ["less", "js", "serve"]);

gulp.task("less", function(){
  return  gulp.src(paths.less)
          .pipe(less({
            plugins : [autoprefixPlugin]
          }))
          .pipe(gulp.dest(paths.css))
          .pipe(less({
            plugins : [autoprefixPlugin, cleanCSSPlugin]
          }))
          .pipe(rename({ suffix: '.min' }))
          .pipe(gulp.dest(paths.css));
});

gulp.task("js", function(){
  return  gulp.src(paths.js)
          .pipe(uglify())
          .pipe(rename({ suffix: '.min' }))
          .pipe(gulp.dest(paths.jsMin));
});

gulp.task("serve", function(){
  browserSync.init({
    server : paths.server
  });

  gulp.watch(paths.less, ["less"]);
  gulp.watch(paths.js, ["js"]);
  gulp.watch(paths.less).on("change", browserSync.reload);
  gulp.watch(paths.js).on("change", browserSync.reload);
  gulp.watch("./index.html").on("change", browserSync.reload);
});
