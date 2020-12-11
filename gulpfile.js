
var gulp = require('gulp');
var postcss = require('gulp-postcss');
var cssnano = require('cssnano');
var uncss = require('postcss-uncss');
rmLines = require('gulp-rm-lines');


var exec = require('child_process').exec;

/* ==========================================================================
   UNCSS tasks
   ========================================================================== */
// parse sitemap and make list of page from it and generate . Currently this list is too big for your site, so i manually remove repeating in style pages from this list 
// gulp.task('parse_sitemap', function (cb) {
//     exec('node ./uncss/sitemaptojson.js', function (err, stdout, stderr) {
//         console.log(stdout);
//         console.log(stderr);
//         cb(err);
//     });
// })

//download pages from sitemap list to ./uncss/saved_html/, update folder after changes on site. You can place template urls by hands to uncss\siteUrls.json .
gulp.task('dlhtml', function (cb) {
    exec('node ./uncss/downloadpages.js', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });

    //remove-scripts from downloaded html to prevent js errors.
    gulp.src(['./uncss/saved_html/*.html'])
        .pipe(rmLines({
            'filters': [
                /<script/i,
                /<\/script/i
            ]
        }))
        .pipe(gulp.dest('./uncss/saved_html/processed'));
})



//main uncss task
gulp.task('uncss', function () {
    var plugins = [
        uncss({
            html: ['./uncss/saved_html/processed/*.html'],//1 page process up to ~1-2 minutes
            //    ignore: ['.cs_description', '.cs_title', '.cs_wrapper','.active'] //put javascript added classes here, or classes that you want to save
        }),
        // autoprefixer({
        //     browsers: ['last 1 version']
        // }),
        cssnano({
            preset: ['default', {
                reduceIdents: { keyframes: false },
            }]
        })
    ];
    return gulp.src(['./uncss/css/*.css'])
        .pipe(postcss(plugins))
        .pipe(gulp.dest('./uncss/final/'))
});

