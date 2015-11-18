/// <binding Clean='clean' />

var gulp = require("gulp"),
    resolve = require("resolve"),
    when = require("when"),
    fobject = require("fobject"),
    indx = require("indx"),
    glob = require("glob"),
    lodash = require("lodash"),
    rimraf = require("rimraf"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-uglify"),
    git = require("gulp-git"),
    sass = require("gulp-sass"),
    less = require('gulp-less'),
    path = require("path"),
    rename = require("gulp-rename"),
    project = require("./project.json");

var paths = {
    webroot: "./" + project.webroot + "/",
    gitlib: project.gitlibroot
};

var libs = {
    
};

paths.js = paths.webroot + "js/**/*.js";
paths.minJs = paths.webroot + "js/**/*.min.js";
paths.css = paths.webroot + "css/**/*.css";
paths.minCss = paths.webroot + "css/**/*.min.css";
paths.concatJsDest = paths.webroot + "js/site.min.js";
paths.concatCssDest = paths.webroot + "css/site.min.css";

paths.vendorCss = "css/vendor/**/*.css";

libs.boostrapv4 = "https://github.com/twbs/bootstrap.git";

gulp.task("clean:js", function (cb) {
    rimraf(paths.concatJsDest, cb);
});

gulp.task("clean:css", function (cb) {
    rimraf(paths.concatCssDest, cb);
});

gulp.task("clean", ["clean:js", "clean:css"]);

gulp.task("min:js", function () {
    gulp.src([paths.js, "!" + paths.minJs], { base: "." })
        .pipe(concat(paths.concatJsDest))
        .pipe(uglify())
        .pipe(gulp.dest("."));
});

gulp.task("min:css", function () {
    gulp.src([paths.css, "!" + paths.minCss])
        .pipe(concat(paths.concatCssDest))
        .pipe(cssmin())
        .pipe(gulp.dest("."));
});

gulp.task("min", ["min:js", "min:css"]);

///New tasks
gulp.task("git:clone", function(){
    git.clone(libs.boostrapv4, { args: paths.gitlib + '/bootstrapv4/ --branch v4.0.0-alpha' }, function (err) {
        if(err)throw err;
    });
});

gulp.task("git:pull", function () {
    git.pull('origin', 'v4-dev', { args: paths.gitlib + '/bootstrapv4/ --rebase' }, function (err) {
        if (err) throw err;
    });
});

gulp.task('sass:bootstrap', function () {
    gulp.src(paths.gitlib + '/bootstrapv4/bootstrap/scss/bootstrap.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(rename('bootstrap.css'))
      .pipe(gulp.dest(paths.webroot + 'css/vendor/'));
});

gulp.task('less:bootstrap', function () {
    gulp.src(paths.gitlib + '/bootstrap/less/bootstrap.less')
      .pipe(less({ paths: [paths.gitlib + '/bootstrap/less/'] }))
      .pipe(gulp.dest(paths.webroot + 'css/vendor/'));
});