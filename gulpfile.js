
const project_folder = 'dist';
const source_folder = 'src';

const path = {
  build: {
    html: `${project_folder}/`,
    css: `${project_folder}/css/`,
    js: `${project_folder}/js/`,
    img: `${project_folder}/img`,
    fonts: `${project_folder}/img`,
  },
  src: {
    html: `${source_folder}/*.html`,
    css: `${source_folder}/scss/styles.scss`,
    js: `${source_folder}/js/index.js`,
    img: `${source_folder}/img/*.gif`,
    fonts: `${source_folder}/img`,
  },
  watch: {
    html: `${source_folder}/**/*.html`,
    css: `${source_folder}/scss/**/*.scss`,
    js: `${source_folder}/js/**/*.js`,
    img: `${source_folder}/img/*.gif`,
  },
  clean: `./${project_folder}+/`,
};

let {src, dest} = require('gulp'),
    gulp = require('gulp'),
    browsersync = require("browser-sync").create(),
    scss = require("gulp-sass")(require('sass')),
    autoprefixer = require("gulp-autoprefixer"),
    group_media = require("gulp-group-css-media-queries");

function browserSync(params) {
  browsersync.init({
    server: {
      baseDir: `./${project_folder}/`
    },
    port: 3000,
    notify: false
  })
}

function watchFiles(params) {
  gulp.watch([path.watch.html], html)
  gulp.watch([path.watch.css], css)
  gulp.watch([path.watch.js], js)
}


function html() {
  return src(path.src.html)
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream())
}

function js() {
  return src(path.src.js)
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream())
}

function css() {
  return src(path.src.css)
    .pipe(
      scss({
        outputStyle: "expanded"
      })
    )
    .pipe(
      group_media()
    )
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['IE 10','Chrome 43', 'Safari 10'],
        cascade: true
      })
    )
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream())
}

let build = gulp.series(gulp.parallel(js, css, html));
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.css = css;
exports.js = js;
exports.build = build;
exports.html = html;
exports.watch = watch;
exports.default = watch;