let kitUtils = require('./kit_config/kit_utils');

let gulp = require('gulp');
let gulpSftp = require('gulp-sftp');
let gulpZip = require('gulp-zip');

let sftpConfigJsonObj = kitUtils.getGlobalConfig('./kit_config/sftp_config.json');

/**
 * 根据 sftp_config.json 将文件自动上传至服务器
 */
gulp.task('sftp', function () {
    let sftpModule = sftpConfigJsonObj.module,
        sftpSrc = sftpConfigJsonObj[sftpModule],
        sftpConfig = sftpConfigJsonObj.config;

    return gulp
        .src(sftpSrc)
        .pipe(gulpSftp(sftpConfig));
});

/**
 * 打包压缩 build 目录
 */
gulp.task('zip', function () {
    return gulp
        .src('./build/**')
        .pipe(gulpZip(`build${kitUtils.getTimeVersions()}.zip`))
        .pipe(gulp.dest('./'));
});

gulp.task('default', ['sftp']);
