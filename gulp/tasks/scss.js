import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import rename from 'gulp-rename';

import cleanCss from 'gulp-clean-css'; //css file compression
import webpCss from 'gulp-webpcss'; //show webp images
import autoPrefixer from 'gulp-autoprefixer'; //add vendor prefixers
import groupCssMediaQueries from 'gulp-group-css-media-queries'; //group media queries



const sass = gulpSass(dartSass);


export const scss = () => {
  return app.gulp.src(app.path.src.scss, {sourcemaps: app.isDev})
    .pipe(app.plugins.plumber(
      app.plugins.notify.onError({
        title: 'SCSS',
        message: 'Error: <%= error.message %>'
      })))
      .pipe(sass({
      outputStyle: 'expanded'
    }))
    .pipe(app.plugins.replace(/@img\//g, '../img/'))

    .pipe(
      app.plugins.if(
        app.isBuild,
        groupCssMediaQueries()
      ))
    .pipe(
      app.plugins.if(
        app.isBuild,
          webpCss({
          webpClass: '.webp',
          noWebpClass: '.no-webp'
        })
    ))
    .pipe(
      app.plugins.if(
        app.isBuild,
        autoPrefixer({
            grid: true,
            overrideBrowserlist: ["last 3 version"],
            cascade: true
          })
    ))
    .pipe(app.gulp.dest(app.path.build.css)) //comment this string if you don't need not zipped css
    .pipe(cleanCss())
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(app.gulp.dest(app.path.build.css))
    .pipe(app.plugins.browserSync.stream());
}