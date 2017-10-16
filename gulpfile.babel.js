import browserSync    from 'browser-sync';
import gulp           from 'gulp';
import rev            from 'gulp-rev';
import revReplace     from 'gulp-rev-replace';
import plumber        from 'gulp-plumber';
import beep           from 'beepbeep';
import sourcemaps     from 'gulp-sourcemaps';
import concat         from 'gulp-concat';
import svgmin         from 'gulp-svgmin';
import image          from 'gulp-image';
import sass           from 'gulp-sass';
import postcss        from 'gulp-postcss';
import autoprefixer   from 'autoprefixer';
import cssnano        from 'cssnano';
import babel          from 'gulp-babel';
import uglify         from 'gulp-uglify';
import del            from 'del';

const paths = {
  default: {
    src: './source',
    dest: '/public'
  },
  assets: {
    src: './source/assets/fonts/*'
  },
  images: {
    src: './source/assets/images/*'
  },
  templates: {
    src: [
      './source/site/templates/*',
      './source/site/snippets/*'
    ]
  },
  kirby: {
    src: [
      './source/site/**/*',
      '!./source/site/templates/*',
      '!./source/site/snippets/*'
    ]
  },
  css: {
    src: './source/assets/styles/*.scss',
    dest: './public/assets/css'
  },
  js: {
    src: './source/assets/scripts',
    dest: './public/assets/js'
  }
};

const cleandirs = [
  './public/assets/css',
  './public/assets/fonts',
  './public/assets/js',
  './public/site/blueprints',
  './public/site/snippets',
  './public/site/templates'
];

export function watch() {
  browserSync.init({
    proxy: 'http://example.test:4000'
  });
  gulp.watch(paths.templates.src, templates);
  gulp.watch(paths.kirby.src, kirby);
  gulp.watch(paths.css.src, gulp.series(css, templates));
  gulp.watch(paths.js.src, js);
}

export const clean = () => del(cleandirs);

export const cleanImages = () => del('./public/assets/images');

export function imageMin() {
  return gulp.src(paths.images.src, {since: gulp.lastRun(imageMin)})
    .pipe(image())
    .pipe(gulp.dest(paths.default.dest));
}

const images = gulp.series(cleanImages, imageMin);
export { images }

export function assets() {
  return gulp.src(paths.assets.src, { base: './source'})
    .pipe(gulp.dest(paths.default.dest));
}

export function templates() {
  const manifest = gulp.src('./source/assets/rev-manifest.json');
  return gulp.src(paths.templates.src, {base: './source'})
  .pipe(revReplace({
    manifest: manifest,
    replaceInExtensions: ['.html', '.php']
  }))
  .pipe(gulp.dest(paths.default.dest))
  .pipe(browserSync.stream());
}

export function kirby() {
  return gulp.src(paths.kirby.src, {base: './source', since: gulp.lastRun(kirby)})
    .pipe(gulp.dest(paths.default.dest))
    .pipe(browserSync.stream());
}

export function css() {
  var plugins = [
    autoprefixer({browsers: ['last 2 versions']}),
    cssnano()
  ];
  return gulp.src(paths.css.src)
    .pipe(plumber((error) => { console.log(error); beep(3, 100); }))
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: ['./node_modules']
    }))
    .pipe(postcss(plugins))
    .pipe(rev())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.css.dest))
    .pipe(rev.manifest())
    .pipe(gulp.dest('./source/assets'))
    .pipe(browserSync.stream());
}

export function js() {
  return gulp.src([
    `${paths.js.src}/utils.js`,
    `${paths.js.src}/ui.js`
  ])
    .pipe(plumber(
      (error) => {
        console.log(error);
        beep(3, 250);
      }
    ))
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.js.dest))
    .pipe(browserSync.stream());
}


const build = gulp.series(clean, css, gulp.parallel(assets, templates, kirby, js));
export { build };

const def = gulp.series(css, gulp.parallel(assets, templates, kirby, js), watch);
export default def;

const serve = def;
export { serve };
