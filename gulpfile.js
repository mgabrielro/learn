// var gulp = require('gulp-help')(require('gulp')),
var gulp = require('gulp'),
    definitions = require('./gulp//config/definitions.json'),
    del = require('del'),
    gulpif = require('gulp-if'),
    plumber = require('gulp-plumber'),
    watch = require('gulp-watch'),
    util = require('gulp-util'),
    taskListing = require('gulp-task-listing');

// Include css Plugins
var less = require('gulp-less'),
    sourcemaps = require('gulp-sourcemaps'),
    cleanCSS = require('gulp-clean-css'),
    concatCSS = require('gulp-concat-css'),
    compressor = require('gulp-compressor'),
    lesshint = require('gulp-lesshint');

// Include javascript Plugins
var concatJS = require('gulp-concat'),
    uglifyJS = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    autoprefixer = require('gulp-autoprefixer'),
    optimizejs = require('gulp-optimize-js');

var Config = {

    production: !!util.env.production,
    hinting: !!util.env.hint,
    sourcemaps: !!util.env.sourcemaps

};

if (Config.production === false) {
    require('gulp-stats')(gulp);
}

/* ------ Gulp Tasks ------ */

var compileGroups = [],
    groupedTasks = [];

function errorHandling(e, errorObject) {
    var report = util.colors.red.bold('ERROR');
    report += util.colors.red.bold('    [' + e.plugin + ']: ' + e.message + ' (' + e.fileName.replace(/^.*[\\\/]/, '') + ')');
    util.log(report);
    errorObject.emit('end');
}

function createTask(name, srcArray, type) {

    gulp.task(name, function () {

        var path = srcArray.src;

        if (type === 'JS') {

            return gulp.src(path)
                .pipe(plumber({
                    errorHandler: function (e) {
                        var errorObject = this;
                        errorHandling(e, errorObject);
                    }
                }))
                .pipe(gulpif(Config.production === false || Config.hinting === true, jshint()))
                .pipe(gulpif(Config.production === false || Config.hinting === true, jshint.reporter(stylish)))
                .pipe(gulpif(Config.production === true || Config.hinting === true, uglifyJS(
                    {
                        mangle: true,
                        compress: {
                            sequences: true,
                            dead_code: true,
                            conditionals: true,
                            booleans: true,
                            unused: true,
                            if_return: true,
                            join_vars: true,
                            drop_console: true
                        }
                    }
                )))
                .pipe(concatJS(srcArray.target.name))
                .pipe(optimizejs())
                .pipe(plumber.stop())
                .pipe(gulp.dest(srcArray.target.path));

        } else if (type === 'CSS') {

            return gulp.src(path)
                .pipe(plumber({
                    errorHandler: function (e) {
                        var errorObject = this;
                        errorHandling(e, errorObject);
                    }
                }))
                .pipe(concatCSS(srcArray.target.name))
                .pipe(gulpif(Config.production === false, cleanCSS({
                    compatibility: 'ie8',
                    debug: true
                }, function (details) {
                    gulpif(Config.production === false, util.log(util.colors.magenta('size before') + ': ' + util.colors.cyan(details.stats.originalSize / 1000 + 'kB') + '   |  ' + util.colors.yellow(details.name)));
                    gulpif(Config.production === false, util.log(util.colors.magenta('size after ') + ': ' + util.colors.cyan(details.stats.minifiedSize / 1000 + 'kB') + '   |  ' + util.colors.yellow(details.name)));
                    gulpif(Config.production === false, util.log(util.colors.magenta('duration   ') + ': ' + util.colors.cyan(details.stats.timeSpent + 'ms') + '       |  ' + util.colors.yellow(details.name)));
                    gulpif(Config.production === false, util.log(util.colors.magenta('efficiency ') + ': ' + util.colors.cyan(Math.round(details.stats.efficiency * 1000) / 10) + '%      |  ' + util.colors.yellow(details.name)));
                })))
                .pipe(gulpif(Config.production === true, cleanCSS({compatibility: 'ie8'})))
                .pipe(plumber.stop())
                .pipe(gulp.dest(srcArray.target.path));

        } else if (type === 'LESS') {

            return gulp.src(path)
                .pipe(plumber({
                    errorHandler: function (e) {
                        var errorObject = this;
                        errorHandling(e, errorObject);
                    }
                }))
                .pipe(gulpif(Config.production === false || Config.sourcemaps === true || Config.hinting === true, sourcemaps.init({debug: false})))
                .pipe(gulpif(Config.production === false, less({
                    compress: false,
                    plugins: [require('less-plugin-glob')]
                })))
                .pipe(gulpif(Config.production === true, less({
                    compress: true,
                    plugins: [require('less-plugin-glob')]
                })))
                .pipe(gulpif(Config.production === false || Config.hinting === true, lesshint('.lesshintrc')))
                .pipe(gulpif(Config.production === false || Config.hinting === true, lesshint.reporter())) // Leave empty to use the default, 'stylish'
                .pipe(autoprefixer('last 6 versions', 'safari 5', 'ie6', 'ie7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
                .pipe(gulpif(Config.production === false, cleanCSS({
                    compatibility: 'ie8',
                    debug: true
                }, function (details) {
                    gulpif(Config.production === false, util.log(util.colors.magenta('size before') + ': ' + util.colors.cyan(details.stats.originalSize / 1000 + 'kB') + '   |  ' + util.colors.yellow(details.name)));
                    gulpif(Config.production === false, util.log(util.colors.magenta('size after ') + ': ' + util.colors.cyan(details.stats.minifiedSize / 1000 + 'kB') + '   |  ' + util.colors.yellow(details.name)));
                    gulpif(Config.production === false, util.log(util.colors.magenta('duration   ') + ': ' + util.colors.cyan(details.stats.timeSpent + 'ms') + '       |  ' + util.colors.yellow(details.name)));
                    gulpif(Config.production === false, util.log(util.colors.magenta('efficiency ') + ': ' + util.colors.cyan(Math.round(details.stats.efficiency * 1000) / 10) + '%      |  ' + util.colors.yellow(details.name)));
                })))
                .pipe(gulpif(Config.production === true, cleanCSS({advanced: true, compatibility: 'ie8'})))
                .pipe(gulpif(Config.production === false || Config.sourcemaps === true || Config.hinting === true, sourcemaps.write('./maps', {
                    includeContent: false,
                    sourceRoot: '../less_elements'
                })))
                .pipe(plumber.stop())
                .pipe(gulp.dest(srcArray.target.path));

        }

    });

}

for (var compileGroup in definitions) {

    compileGroups.push(compileGroup);

    for (var taskKey in definitions[compileGroup]) {

        if (taskKey !== 'group_key') {

            var taskName = definitions[compileGroup].group_key + '-' + taskKey;
            var targetFileName = definitions[compileGroup][taskKey].target.name;

            if (!targetFileName) {
                targetFileName = '';
            }

            var targetPath = definitions[compileGroup][taskKey].target.path + targetFileName;
            del(targetPath, {force: true});
            createTask(definitions[compileGroup].group_key + '-' + taskKey, definitions[compileGroup][taskKey], definitions[compileGroup].group_key);
            groupedTasks.push(taskName);

        }

    }

}

gulp.task('hintLESS', function () {

    return gulp.src(definitions.compileLESS.HC.lib)
        .pipe(lesshint('.lesshintrc'))
        .pipe(lesshint.reporter());

});

gulp.task('generate', groupedTasks, function () {

    if (Config.production === false) {

        for (var compileGroup in compileGroups) {

            for (var compileTask in definitions[compileGroups[compileGroup]]) {

                if (compileTask !== 'group_key') {

                    var sources = definitions[compileGroups[compileGroup]][compileTask].src;
                    var taskKey = definitions[compileGroups[compileGroup]].group_key;

                    util.log('Starting ' + util.colors.cyan('"watch"') + ' on ' + util.colors.magenta.bold(taskKey + '-' + compileTask) + ' sources');
                    gulp.watch(sources, [taskKey + '-' + compileTask]);

                }

            }

        }

    }

});

gulp.task('build', ['generate'], function () {});
gulp.task('release', ['generate'], function () {});
gulp.task('default', ['generate'], function () {});

gulp.task('help', taskListing);
