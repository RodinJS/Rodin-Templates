/*
 Copyright (C) 2016 Grigor Khachatryan <grig@rodin.io>
 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:
 * Redistributions of source code must retain the above copyright
 notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 notice, this list of conditions and the following disclaimer in the
 documentation and/or other materials provided with the distribution.
 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS 'AS IS'
 AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
 DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

'use strict';

const gulp = require('gulp');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const rename = require("gulp-rename");
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const watch = require('gulp-watch');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const sequence = require('run-sequence');
const del = require('del');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const size = require('gulp-size');
const connect = require('gulp-connect');

const JS = ['src/**/*.js', '!src/**/models/**/*.js'];
const SASS = ['src/**/*.scss'];
const OTHER = ['src/**/*.{jpg,jpeg,ico,png,mtl,obj,json}'];
const VIDEO = ['src/**/*'];
const HTML = ['src/**/*.html'];


const AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
];

const UGLIFY_AGRESIVE = {
    // conditionals  : true,  // optimize if-s and conditional expressions
    // comparisons   : true,  // optimize comparisons
    // evaluate      : true,  // evaluate constant expressions
    // booleans      : true  // optimize boolean expressions
    preserveComments: 'license',
    mangle: true,
    compress: true
};

const SIZE_OPTIONS = {
    onLast: true,
    title: 'SASS -> ',
    // gzip: true,
    // showFiles: true,
    // showTotal: true,
    pretty: true
};

const ERROR_MESSAGE = {
    errorHandler: notify.onError("Error: <%= error.message %>")
};

gulp.task('js', () => {
    const s = size({title: 'JS -> ', pretty: true});
    return gulp.src(JS)
        .pipe(plumber(ERROR_MESSAGE))
        .pipe(babel())
        .pipe(s)
        .pipe(plumber.stop())
        .pipe(gulp.dest('./build'))
        .pipe(notify({
            onLast: true,
            message: () => `JS - Total size ${s.prettySize}`
        }));
});

gulp.task('js-prod', () => {
    const s = size({title: 'JS production -> ', pretty: true});
    return gulp.src(JS)
        .pipe(plumber(ERROR_MESSAGE))
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(uglify(UGLIFY_AGRESIVE))
        .pipe(sourcemaps.write('.'))
        .pipe(s)
        .pipe(gulp.dest('./build'))
        .pipe(notify({
            onLast: true,
            message: () => `JS(prod) - Total size ${s.prettySize}`
        }));
});

gulp.task('sass', () => {
    const s = size(SIZE_OPTIONS);
    return gulp.src(SASS)
        .pipe(plumber(ERROR_MESSAGE))
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('style.css'))
        .pipe(sourcemaps.init())
        .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
        .pipe(sourcemaps.write())
        .pipe(s)
        .pipe(gulp.dest('./build'))
        .pipe(notify({
            onLast: true,
            message: () => `SASS - Total size ${s.prettySize}`
        }));
});

gulp.task('sass-prod', () => {
    const s = size(SIZE_OPTIONS);
    return gulp.src(SASS)
        .pipe(plumber(ERROR_MESSAGE))
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('style.css'))
        .pipe(sourcemaps.init())
        .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write())
        .pipe(s)
        .pipe(gulp.dest('./build'))
        .pipe(notify({
            onLast: true,
            message: () => `SASS(prod) - Total size ${s.prettySize}`
        }));
});

gulp.task('OTHER', () => {
    gulp.src(OTHER)
        .pipe(plumber(ERROR_MESSAGE))
        .pipe(gulp.dest('./build'));
});

gulp.task('html', () => {
    gulp.src(HTML)
        .pipe(plumber(ERROR_MESSAGE))
        .pipe(gulp.dest('./build'));
});

gulp.task('watch', () => {
    gulp.watch(SASS, ['sass']);
    gulp.watch(HTML, ['html']);
    gulp.watch(JS, ['js']);
    gulp.watch(OTHER, ['OTHER']);
});

gulp.task('clean', () => {
    return del(['./build']);
});

gulp.task('connect', () => {
    connect.server({
        root: './build',
        port: 8000,
        livereload: true
    });
});


gulp.task('prod', (done) => {
    sequence('clean', ['html', 'js-prod', 'sass-prod', 'OTHER'], done);
});

gulp.task('default', (done) => {
    sequence('clean', ['html', 'js', 'sass', 'OTHER', 'connect', 'watch'], done);
});