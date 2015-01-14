'use strict';

var gulp = require('gulp');

var browserSync = require('browser-sync');
var reload = browserSync.reload;

var del = require('del');

var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var jshintstylish = require('jshint-stylish');
var minifycss = require('gulp-minify-css');
var minifyhtml = require('gulp-minify-html');
var rename = require('gulp-rename');
var sass = require('gulp-ruby-sass');
var sourcemaps = require('gulp-sourcemaps');
var to5 = require('gulp-6to5');
var uglify = require('gulp-uglify');

// Clean Build Scripts
gulp.task('clean-scripts', function () {
    return del(['dist/scripts/**/*.js']);
});

// Build Scripts
gulp.task('scripts', ['clean-scripts'], function () {
    return gulp.src('app/scripts/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter(jshintstylish))
        .pipe(sourcemaps.init())
        .pipe(to5())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/scripts'))
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/scripts'));
});

// Clean Build Styles
gulp.task('clean-styles', function () {
    return del(['dist/styles/**/*.css']);
});

// Build Styles
gulp.task('styles', ['clean-styles'], function () {
    return gulp.src('app/styles/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({style: 'expanded'}))
        .pipe(autoprefixer('last 2 versions'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/styles'))
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.init())
        .pipe(minifycss({keepSpecialComments: 0}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/styles'));
});

// Clean Build HTML Files
gulp.task('clean-html', function () {
    return del(['dist/**/*.html']);
});

// Build HTML
gulp.task('html', ['clean-html'], function () {
    return gulp.src('app/**/*.html')
        .pipe(minifyhtml())
        .pipe(gulp.dest('dist'));
});

// Clean Dist Folder
gulp.task('clean-copied', function () {
    return del([
        'dist/**/*',
        'dist/**/*.html',
        'dist/scripts/**/*.js',
        'dist/styles/**/*.css'
    ]);
});

// Copy All Other Files
gulp.task('copy', function () {
    return gulp.src([
        'app/**/*',
        '!app/**/*.html',
        '!app/scripts/**/*.js',
        '!app/styles/**/*.scss'
    ], {
        dot: true
    }).pipe(gulp.dest('dist'));
});

// Start Server, Watch Files For Changes & Reload
gulp.task('serve', ['default'], function () {
    browserSync({
        server: ['dist']
    });

    gulp.watch(['app/**/*.html'], ['html', reload]);
    gulp.watch(['app/styles/**/*.scss'], ['styles', reload]);
    gulp.watch(['app/scripts/**/*.js'], ['scripts', reload]);
    gulp.watch([
        'app/**/*',
        '!app/**/*.html',
        '!app/scripts/**/*.js',
        '!app/styles/**/*.scss'
    ], ['copy', reload]);
});

// Default: Build Project
gulp.task('default', ['scripts', 'styles', 'html', 'copy']);