var gulp = require("gulp");
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
        console.error(err);
        this.emit("end");
      })
      .pipe(source("Game.js"))
      .pipe(buffer())
      //.pipe(uglify())
      .pipe(gulp.dest("./dist"));
  }

  if (watch) {
    bundler.on("update", function() {
      console.log("Building...");
      rebundle();
    });
  }

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
