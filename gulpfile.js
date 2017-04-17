var gulp=require('gulp'),
    uglify=require('gulp-uglify'),
    rename=require('gulp-rename'),
    cssmin=require('gulp-cssmin');

gulp.task('uglify',function(){
    gulp.src('src/scripts/*.js')
        .pipe(uglify())
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest('dist/js'));
    gulp.src('src/styles/*.css')
        .pipe(cssmin())
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest('dist/css'))
});

gulp.task('default',['uglify']);
