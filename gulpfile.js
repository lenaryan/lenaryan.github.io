const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();

const cssFiles = [
    './src/css/main.css',
    './src/css/media.css'
]

const jsFiles = [
    './src/js/main.js'
]

const styles = () => {
    return gulp.src(cssFiles)
    .pipe(concat('style.css'))
    .pipe(autoprefixer({
        overrideBrowserslist: ['last 2 versions'],
        cascade: false 
    }))
    .pipe(cleanCSS({
        level: 2
    }))
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.stream());
}

exports.styles = styles;

const scripts = () => {
    return gulp.src(jsFiles)
    .pipe(concat('script.js'))
    .pipe(uglify({
        toplevel: true
    }))
    .pipe(gulp.dest('./build/js'))
    .pipe(browserSync.stream());
}

exports.scripts = scripts;

const clean = () => {
    return del(['build/*']);
}

exports.clean = clean;

const watch = () => {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
    gulp.watch('./src/css/**/*.css', styles);
    gulp.watch('./src/js/**/*.js', scripts);
    gulp.watch('./*.html').on('change', browserSync.reload);
}

exports.watch = watch;

const build = (done) => {
    return gulp.series(clean, gulp.parallel(styles, scripts))(done);
}

exports.build = build;
exports.dev = gulp.series(build, watch);