var gulp = require("gulp");
var gutil = require("gulp-util");
var uglify = require("gulp-uglify");
var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");
var browserify = require("browserify");
var watchify = require("watchify");
var babel = require("babelify");

function compile(watch) {
  var bundler = watchify(browserify("./src/index.js", {
    debug: true,
    parserOptions: {
      "ecmaVersion": 6,
      "sourceType": "module"
    },
  }).transform(babel, {
    presets: ["es2015"]
  }));

  function rebundle() {
    bundler.bundle()
      .on("error", function(err) {
        gutil.log(err);
        this.emit("end");
      })
      .pipe(source("Game.js"))
      .pipe(buffer())
      //.pipe(uglify())
      .pipe(gulp.dest("./dist"));
  }

  if (watch) {
    bundler.on("update", function() {
      rebundle();
    });
  }

  bundler.on("log", function(message) {
    gutil.log("Building...");
    gutil.log(message);
  });

  rebundle();
}

function watch() {
  return compile(true);
}

gulp.task("build", function() {
  return compile();
});
gulp.task("watch", function() {
  return watch();
});

gulp.task("default", ["watch"]);
