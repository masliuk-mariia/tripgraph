import replace from "gulp-replace"; //search and replace
import gulpPlumber from "gulp-plumber"; //Errors
import notify from "gulp-notify"; //warnings
import browserSync from "browser-sync"; //local server
import newer from "gulp-newer"; //Check for updates
import ifPlugin from "gulp-if";

export const plugins = {
  replace: replace,
  plumber: gulpPlumber,
  notify: notify,
  browserSync: browserSync,
  newer: newer,
  if: ifPlugin
}

