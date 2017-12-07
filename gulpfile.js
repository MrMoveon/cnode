var gulp = require("gulp");
var path = require("path");
var less = require("gulp-less"); //less 2 css插件
var concat = require("gulp-concat"); //css合并
var cleanCss = require('gulp-clean-css'); //css压缩
var postcss = require('gulp-postcss');//css兼容
var autoprefixer = require('autoprefixer'); 
var del = require('del'); //删除文件
var rename=require('gulp-rename');//重命名
var spriter=require('gulp-css-spriter');//雪碧图
var base64 = require('gulp-base64');//base64
var browserSync = require('browser-sync').create(); //浏览器异步刷新
var reload=browserSync.reload;

var dev={
    basePath:'src/',
	css:'src/css/',
	images: 'src/images/',
    less:'src/less/',
    views:'src/',
    js:'src/js/'
}

// 静态服务器
gulp.task('server:dev', function() {
    browserSync.init({
        server: {
            baseDir: dev.basePath,
            index:'/main.html'
        },
        port: 8081
    });
    gulp.watch(["src/*.html"], ["html:dev"]);
    gulp.watch("src/less/*.less", ["less"]);
    gulp.watch("src/css/*.css", ["css:dev"]);
    gulp.watch(["src/js/*.js"],['js:dev']);
});

gulp.task('html:dev' , function(){
	gulp.src([
        dev.views+'*.html'
	])
	.pipe(reload({
		stream:true
	}))
});
gulp.task('js:dev' , function(){
	gulp.src([
        dev.js+'*.js'
	])
	.pipe(reload({
		stream:true
	}))
});
// 编译less
gulp.task('less', function(){
	gulp.src([dev.less+'*.less'])
		.pipe(less())
		.pipe(gulp.dest(dev.css))	
});
// postcss  css兼容
gulp.task('postcss',function(){
    var plugins = [
        autoprefixer({browsers:["Android 4.1", "iOS 7.1", "Chrome > 31", "ff > 31", "ie >= 10"]})
    ];
    gulp.src([dev.css + 'app.css'])
    .pipe(postcss(plugins))
    .pipe(gulp.dest(dev.css))
})
gulp.task('css:dev',function(){
    var plugins = [
        autoprefixer({browsers:["Android 4.1", "iOS 7.1", "Chrome > 31", "ff > 31", "ie >= 10"]})
    ];
    return gulp.src([dev.css + 'app.css'])
        .pipe(postcss(plugins))
        // 雪碧图
		.pipe(spriter({
           'spriteSheet': dev.images+'spritesheet.png',
           'pathToSpriteSheetFromCSS': '../images/spritesheet.png'
           }))
        .pipe(gulp.dest(dev.css)) //输出一个未压缩版本
        .pipe(rename('./app.min.css'))
        .pipe(gulp.dest(dev.css)) //输出一个改名的版本
		.pipe(reload({
			stream:true
		}))
});


//css压缩
gulp.task('css:min', function() {
    gulp.src([dev.css + 'app.min.css'])
    .pipe(cleanCss())
    .pipe(gulp.dest(dev.css)) 
    .pipe(base64({
        maxImageSize: 8*1024, // bytes 
        debug: true
    }))
    .pipe(gulp.dest(dev.css))
});



// 删除任务
gulp.task('del', function () {
    del(['./src/static/css/all.css','./src/static/css/all.min.css'])
});


