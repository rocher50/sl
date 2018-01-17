var gulp = require('gulp');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var jquery = require('jquery');
var concat = require('gulp-concat');

var adminStyleDir = 'src/admin/scss/';
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
    adminStyleFiles.map(function(entry) {
        return gulp.src(adminStyleDir + entry)
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
            .pipe(rename({suffix: '.min'}))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(adminStyleDist))
        });
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

gulp.task('default', ['admin.style', 'client.style', 'admin.js', 'client.js', 'client.images', 'client.fonts']);

gulp.task('watch', ['default'], function() {
    gulp.watch(styleWatch, ['admin.style', 'client.style']);
    gulp.watch(jsWatch, ['admin.js', 'client.js']);
});
