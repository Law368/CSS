const project_folder = 'dist';
const source_folder = 'src';

const path = {
  build: {
    html: `${project_folder}/`,
    css: `${project_folder}/css/`,
    stylesheet: `${project_folder}/css/`,
    js: `${project_folder}/js/`,
    img: `${project_folder}/img`,
    fonts: `${project_folder}/fonts`,
  },
  src: {
    html: `${source_folder}/*.html`,
    css: `${source_folder}/scss/styles.scss`,
    stylesheet: `${source_folder}/scss/stylesheet.css`,
    js: `${source_folder}/js/index.js`,
    img: `${source_folder}/img/*.gif`,
    fonts: `${source_folder}/fonts/*.{woff,woff2,eot,ttf}`,
  },
  watch: {
    html: `${source_folder}/**/*.html`,
    css: `${source_folder}/scss/**/*.scss`,
    stylesheet: `${source_folder}/scss/**/*.css`,
    js: `${source_folder}/js/**/*.js`,
    img: `${source_folder}/img/*.gif`,
  },
  clean: `./${project_folder}+/`,
};

let { src, dest } = require('gulp'),
  gulp = require('gulp'),
  browsersync = require('browser-sync').create(),
  scss = require('gulp-sass')(require('sass')),
  autoprefixer = require('gulp-autoprefixer'),
  group_media = require('gulp-group-css-media-queries');

function browserSync(params) {
  browsersync.init({
    server: {
      baseDir: `./${project_folder}/`,
    },
    port: 3000,
    notify: false,
  });
}

function watchFiles(params) {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.stylesheet], styleSheet);
  gulp.watch([path.watch.js], js);
}

function html() {
  return src(path.src.html)
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream());
}

function js() {
  return src(path.src.js).pipe(dest(path.build.js)).pipe(browsersync.stream());
}
//var buildFonts = gulp.src('app/fonts/**/*') // Переносим шрифты в продакшен
//	.pipe(gulp.dest('dist/fonts'))

function css() {
  return src(path.src.css)
    .pipe(
      scss({
        outputStyle: 'expanded',
      })
    )
    .pipe(group_media())
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['IE 10', 'Chrome 43', 'Safari 10'],
        cascade: true,
      })
    )
    .pipe(gulp.dest(path.build.css))
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream());
}

function styleSheet() {
  return src(path.src.stylesheet)
    .pipe(dest(path.build.stylesheet))
    .pipe(browsersync.stream());
}

function fonts() {
  return src(path.src.fonts).pipe(dest(path.build.fonts));
}

function images() {
  return src(path.src.img).pipe(dest(path.build.img));
}

let build = gulp.series(
  gulp.parallel(js, css, styleSheet, html, fonts, images)
);
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.fonts = fonts;
exports.css = css;
exports.js = js;
exports.build = build;
exports.html = html;
exports.watch = watch;
exports.default = watch;
