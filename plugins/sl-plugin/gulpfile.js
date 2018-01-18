var gulp = require('gulp');

// css
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifycss    = require( 'gulp-uglifycss' );

// js
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var babelify = require('babelify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var jquery = require('jquery');
var stripDebug = require('gulp-strip-debug');

// utility
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var options = require('gulp-options');
var gulpif = require('gulp-if');

// browers related plugins
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

var adminStyleDir = 'src/scss/admin/';
var adminStyleDist = './assets/admin/';
var adminStyleFiles = ['sl.scss'];

var clientStyleDir = 'src/client/scss/';
var clientStyleDist = './assets/client/';

var styleWatch = 'src/scss/**/*.scss';

var adminJsDir = 'src/js/admin/';
var adminJsDist = './assets/admin/';
var adminJsFiles = ['sl.js'];

var clientJsDir = 'src/js/client/';
var clientJsDist = './assets/client/';

var jsWatch = 'src/js/**/*.js';

gulp.task('admin.style', function() {
    gulp.src([
        'src/scss/admin/**/*.scss'
    ])
    .pipe(sourcemaps.init())
    .pipe(sass({
        errorLogToConsole: true,
        outputStyle: 'compressed'
    }))
    .on('error', console.error.bind(console))
    .pipe(autoprefixer({
        browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
    }))
    .pipe(concat('sl-admin.min.css'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(adminStyleDist));
});

gulp.task('client.style', function() {
    gulp.src([
        'src/scss/client/**/*.scss'
    ])
    .pipe(sourcemaps.init())
    .pipe(sass({
        errorLogToConsole: true,
        outputStyle: 'compressed'
    }))
    .on('error', console.error.bind(console))
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(concat('sl-client.min.css'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(clientStyleDist));
});

gulp.task('admin.js', function() {
    adminJsFiles.map(function(entry) {
        return browserify({
            entries: [adminJsDir + entry]
        })
        .transform(babelify, {presets: ['env']})
        .bundle()
        .pipe(source(entry))
        .pipe(rename({extname: '.min.js'}))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(adminJsDist))
    });
});

gulp.task('client.js', function() {
    gulp.src([
        'node_modules/jquery/dist/jquery.js',
        clientJsDir + 'calendar.js',
        clientJsDir + 'carreta-1.0.0.js'
    ])
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(concat('sl-client.min.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(clientJsDist));
});

gulp.task('client.images', function() {
    gulp.src([
            'src/images/client/**/*'
        ])
        .pipe(gulp.dest('./assets/client/images/'));
});

gulp.task('client.fonts', function() {
    gulp.src([
            'src/fonts/client/**/*'
        ])
        .pipe(gulp.dest('./assets/client/fonts/'));
});

function triggerPlumber( src, url ) {
    return gulp.src( src )
        .pipe( plumber() )
        .pipe( gulp.dest( url ) );
}

gulp.task('default', ['admin.style', 'client.style', 'admin.js', 'client.js', 'client.images', 'client.fonts']);

gulp.task('watch', ['default'], function() {
    gulp.watch(styleWatch, ['admin.style', 'client.style']);
    gulp.watch(jsWatch, ['admin.js', 'client.js']);
});
