/* gulpfile.js */
var 
    gulp = require('gulp'),
    sass = require('gulp-sass'),
    useref = require('gulp-useref'),
	uglify = require('gulp-uglify'),
	gulpif = require('gulp-if'),
	minifyCSS = require('gulp-minify-css'),
	imagemin = require('gulp-imagemin'),
	cache = require('gulp-cache'),
	concat = require('gulp-concat');

// source and distribution folder
var
    source = 'src/',
    dest = 'dist/';

// Bootstrap scss source
var bootstrapSass = {
    in: './bower_components/bootstrap-sass/'
};
    
// HTML
var html = {
    in: source + '*.html',
	out: dest + ''
};

// fonts
var fonts = {
    in: [source + 'fonts/*.*', bootstrapSass.in + 'assets/fonts/**/*'],
    out: dest + 'fonts/',
	locale: source + 'fonts/'
};

// css source file: .scss files
var css = {
    in: source + 'sass/main.scss',
    out: dest + 'css/',
	locale: source + 'css/',
    watch: source + 'sass/**/*',
    sassOpts: {
        outputStyle: 'nested',
        precison: 3,
        errLogToConsole: true,
        includePaths: [bootstrapSass.in + 'assets/stylesheets']
    }
};

var jquery = {
	in:'./bower_components/jquery/dist/jquery.min.js',
	out: source + 'js/'
};

var bootstrapJS = {
    in: bootstrapSass.in + 'assets/javascripts/bootstrap/*.js',
    out: source + 'js/'
};

// get bootstrap javascript from bower
gulp.task('bootstrapJS', function() {
  return gulp.src(bootstrapJS.in) // ignore ['./**/*.js', '!./node_modules/**']
    .pipe(concat('bootstrap.js'))
    .pipe(gulp.dest(bootstrapJS.out));
});

// get jQuery from bower
gulp.task('jquery', ['bootstrapJS'], function () {
    return gulp.src(jquery.in)
	    .pipe(uglify())
        .pipe(gulp.dest(jquery.out));
});

// Optimizing Images
gulp.task('images', ['jquery'], function(){
  return gulp.src(source + 'img/**/*.+(png|jpg|jpeg|gif|svg)')
  .pipe(cache(imagemin({
      // Setting interlaced to true
      interlaced: true
    })))
  .pipe(gulp.dest(dest + 'img/'))
});

// Compress js, css files
gulp.task('useref', ['images'], function () {
    return gulp.src(html.in)
        .pipe(useref())
        .pipe(gulpif('**/*.js', uglify()))
        .pipe(gulpif('**/*.css', minifyCSS()))
        .pipe(gulp.dest(html.out));
});

// copy bootstrap required fonts to dest
gulp.task('fonts', ['useref'], function () {
    return gulp
        .src(fonts.in)
        .pipe(gulp.dest(fonts.out))
	    .pipe(gulp.dest(fonts.locale));
});

// compile scss
gulp.task('sass', ['fonts'], function () {
    return gulp.src(css.in)
        .pipe(sass(css.sassOpts))
	    .pipe(gulp.dest(css.locale));
});

// default task
gulp.task('default', ['sass'], function () {
     gulp.watch(css.watch, ['sass']);
});