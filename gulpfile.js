//Main Module
import gulp from "gulp";
//Import Path
import { path } from "./gulp/config/path.js";
//Import plugins
import { plugins } from "./gulp/config/plugins.js";



//Put values to global variable
global.app = {
  isBuild: process.argv.includes("--build"),
  isDev: !process.argv.includes("--build"),
  path: path,
  gulp: gulp,
  plugins: plugins
}

//Import tasks
import { copy } from "./gulp/tasks/copy.js";
import { html } from "./gulp/tasks/html.js";
import { reset } from "./gulp/tasks/reset.js";
import { server } from "./gulp/tasks/server.js";
import { scss } from "./gulp/tasks/scss.js";
import { js } from "./gulp/tasks/js.js";
import { images } from "./gulp/tasks/images.js";
import { otfToTtf, ttfToWoff, fontsStyle } from "./gulp/tasks/fonts.js";
import { svgSprive } from "./gulp/tasks/svgSprive.js";
import { zip } from "./gulp/tasks/zip.js";
import { ftp } from "./gulp/tasks/ftp.js";
//File change watcher
function watcher(){
  gulp.watch(path.watch.files, copy);
  gulp.watch(path.watch.html, html);
  gulp.watch(path.watch.scss, scss);
  gulp.watch(path.watch.js, js);
  gulp.watch(path.watch.images, images);
}

export { svgSprive }

const fonts = gulp.series(otfToTtf, ttfToWoff, fontsStyle);
//Tasks
const mainTasks = gulp.series(fonts, gulp.parallel(copy, html, scss, js, images));

//Script for executing tasks
const dev = gulp.series(
  reset,
  mainTasks, 
  gulp.parallel(watcher,server)
  );
const build = gulp.series(reset, mainTasks);
const deployZip = gulp.series(reset, mainTasks, zip);
const deployFTP = gulp.series(reset, mainTasks, ftp);

//Default script execution
export { dev }
export { build }
export { deployZip }
export { deployFTP }

gulp.task('default', dev);

