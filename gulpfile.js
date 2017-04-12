/*!
 * gulp
 * $
  cnpm install gulp gulp-sass gulp-rev gulp-rev-collector gulp-autoprefixer gulp-minify-css gulp-htmlmin gulp.spritesmith gulp-jshint gulp-concat gulp-order gulp-uglify gulp-imagemin gulp-notify gulp-rename browser-sync gulp-cache --save-dev
 */
// 加载各个模块
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    spritesmith = require('gulp.spritesmith'),
    //jshint = require('gulp-jshint'),
    rev = require('gulp-rev'), //- 对文件名加MD5后缀
    revCollector = require('gulp-rev-collector'),//- 路径替换
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    htmlmin = require('gulp-htmlmin');
    rename = require('gulp-rename'),
    order = require('gulp-order'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload;
// sass编译
gulp.task('sass', function() {
    return gulp.src(['src/scss/*.scss'])
        .pipe(sass())
        .pipe(gulp.dest('src/css'))
        //.pipe(notify({ message: 'sass编译完成' }));
});
// 图片压缩
gulp.task('images', function() {
    return gulp.src('src/images/*')
           .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
           .pipe(gulp.dest('dist/images'))
});
//雪碧图  在sass images 任务完成后合并雪碧图
gulp.task('sprite',[], function () {
    return gulp.src('src/images/{*title*,*zan*,*btn*,*lottery_img*}.{jpg,png}')
            .pipe(spritesmith({
                imgName: 'dist/images/sprite.png',
                cssName: 'dist/css/sprite.css',
                algorithm:'top-down',
            }))
            .pipe(gulp.dest(''));
});
//css合并
gulp.task('css',[], function() {
    return gulp.src(['src/css/*.css'])
           //.pipe(concat('concat.css'))
           .pipe(minifycss())
           //.pipe(rename({ suffix: '.min' }))
           // .pipe(autoprefixer({
           //      browsers:['last 4 versions'],
           //      cascade:true,//是否美化属性值 默认：true 像这样：
           //      //-webkit-transform:rotate(45deg);//transform:rotate(45deg);
           //      remove:true//是否去掉不必要的前缀 默认：true
           //  }))
           //.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
           .pipe(rev()) //- 文件名加MD5后缀
           .pipe(gulp.dest('dist/css')) //- 输出文件本地
           .pipe(rev.manifest()) //- 生成一个rev-manifest.json
           .pipe(gulp.dest('src/rev'))//- 将 rev-manifest.json 保存到 rev 目录内
           .pipe(reload({stream: true}))
           //.pipe(notify({ message: 'css合并压缩完成' }));
});
// js合并压缩
gulp.task('js', function() {
    return gulp.src(['src/js/*.js'])
            //.pipe(jshint())
            //.pipe(jshint.reporter('default'))
            .pipe(order([
                "vue.js",
                "zepto.js",
                "common.js",
                "weixin.js",
                "*.js",
            ]))
            .pipe(concat('concat.js'))
            //.pipe(rename({ suffix: '.min' }))
            .pipe(uglify())
            .pipe(gulp.dest('dist/js'))
            .pipe(reload({stream: true}))
            //.pipe(notify({ message: 'JS task complete' }));
});
gulp.task('html-rev',['css'],function(){
    var options = {
        collapseWhitespace:true,
        collapseBooleanAttributes:true,
        removeComments:true,
        removeEmptyAttributes:true,
        removeScriptTypeAttributes:true,
        removeStyleLinkTypeAttributes:true,
        minifyJS:true,
        minifyCSS:true
    };
    gulp.src(['src/rev/*.json', 'src/*.html'])
        .pipe(revCollector())
        .pipe(htmlmin(options))
        .pipe(gulp.dest('dist/'))
        .pipe(reload({stream: true}));
});
gulp.task('rev', function() {
    gulp.src(['src/rev/*.json', 'src/*.html'])
    //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
    .pipe(revCollector())
    //- 执行文件内css名的替换
    .pipe(gulp.dest('dist/'));
    //- 替换后的文件输出的目录
});
gulp.task('server', function() {
    browserSync.init({
        server: "./dist",
        //proxy: "http://text.dmooo.xyz/pages/vote/2017/0331/dist/index.html"
    });
    gulp.watch(['dist/*.html','dist/css/*.css','dist/js/*.js']).on('change', reload);
});
gulp.task('watch',['server'], function(){
    gulp.watch('src/scss/*.scss', ['sass']);
    gulp.watch('src/css/*.css', ['css','html-rev']);
    gulp.watch('src/js/*.js', ['js']);
    gulp.watch('src/images/*', ['images']);
    gulp.watch('src/*.html', ['html-rev']);
})
// 默认任务
gulp.task('default', ['watch','server'], function() {
    gulp.start('sass', 'images', 'sprite','css', 'js','html-rev');
});
