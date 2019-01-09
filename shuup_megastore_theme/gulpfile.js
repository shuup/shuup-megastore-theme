var gulp = require("gulp");
var less = require("gulp-less");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var plumber = require("gulp-plumber");
var minifycss = require("gulp-cssnano");
var gutil = require("gulp-util");
var PRODUCTION = gutil.env.production || process.env.NODE_ENV === "production";

gulp.task("less", function() {
    return gulp.src([
        "node_modules/owl.carousel/dist/assets/owl.carousel.min.css",
        "static_src/less/style.less"
    ])
        .pipe(plumber({}))
        .pipe(less().on("error", function() {
            this.emit("end");
        }))
        .pipe(concat("shuup_megastore_theme.css"))
        .pipe((PRODUCTION ? minifycss() : gutil.noop()))
        .pipe(gulp.dest("static/shuup_megastore_theme/css/"));
});

gulp.task("less:watch", gulp.parallel(["less"]), function() {
    gulp.watch(["static_src/less/**/*.less"], ["less"]);
});

gulp.task("js", function() {
    return gulp.src([
        "node_modules/jquery-zoom/jquery.zoom.js",
        "static_src/js/custom/custom.js"
    ])
        .pipe(plumber({}))
        .pipe(concat("shuup_megastore_theme.js"))
        .pipe(gulp.dest("static/shuup_megastore_theme/js/"));
});

gulp.task("js:watch", gulp.parallel(["js"]), function() {
    gulp.watch(["static_src/js/**/*.js"], ["js"]);
});

gulp.task("copy_fonts", function() {
    return gulp.src([
        "node_modules/bootstrap/fonts/*",
        "node_modules/font-awesome/fonts/*"
    ]).pipe(gulp.dest("static/shuup_megastore_theme/fonts/"));
});

gulp.task("default", gulp.parallel(["js", "less", "copy_fonts"]));

gulp.task("watch", gulp.parallel(["js:watch", "less:watch"]));
