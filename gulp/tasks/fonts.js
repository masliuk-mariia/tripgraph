import fs from 'fs';
import fonter from 'gulp-fonter';
import ttf2woff2 from 'gulp-ttf2woff2';



export const otfToTtf = () => {
  //search *.otf files
  // return app.gulp.src(`${app.path.srcFolder}/fonts/*.{eot,ttf,otf,otc,ttc,woff,woff2,svg}`, {})
  return app.gulp.src(`${app.path.srcFolder}/fonts/*.otf`, {})
    .pipe(app.plugins.plumber(
      app.plugins.notify.onError({
        title: "FONTS",
        message: "<%= error.message%>"
      })
    ))
    //convert  to *.ttf
    .pipe(fonter({
      formats: ['ttf']
    }))
    //upload to folder
    .pipe(app.gulp.dest(`${app.path.srcFolder}/fonts/`))
}

export const ttfToWoff = () =>{
  //search *.ttf files
  return app.gulp.src(`${app.path.srcFolder}/fonts/*.ttf`, {})
  .pipe(app.plugins.plumber(
    app.plugins.notify.onError({
      title: "FONTS",
      message: "<%= error.message%>"
    })
  ))
  //convert to *.woff
  .pipe(fonter({
    formats: ['woff']
  }))
  //upload to folder
  .pipe(app.gulp.dest(`${app.path.build.fonts}`))
  //search fo *.ttf files
  .pipe(app.gulp.src(`${app.path.srcFolder}/fonts/*.ttf`))
  //convert to .woff2
  .pipe(ttf2woff2())
  //upload to folder
  .pipe(app.gulp.dest(`${app.path.build.fonts}`));
}

export const fontsStyle = () => {
  //fonts style. connecting fonts
  let fontsFile = `${app.path.srcFolder}/scss/fonts.scss`;
  //check fonts file exists
  fs.readdir(app.path.build.fonts, function (err, fontsFiles){
    if (fontsFiles){
      //check styles files to connect fonts
      if (!fs.existsSync(fontsFile)){
        //if no file create it
        fs.writeFile(fontsFile, '', cb);
        let newFileOnly;
        for (let i=0; i < fontsFiles.length; i++){
          //write connect fonts to style file
          let fontFileName = fontsFiles[i].split('.')[0];
          if (newFileOnly !== fontFileName){
            let fontName = fontFileName.split('-')[0] ? fontFileName.split('-')[0] : fontFileName;
            let fontWeight = fontFileName.split('-')[1] ? fontFileName.split('-')[1] : fontFileName;
            switch (fontWeight.toLowerCase){
              case "thin": fontWeight = 100; break;
              case "extralight": fontWeight = 200; break;
              case "light": fontWeight = 300; break;
              case "medium": fontWeight = 500; break;
              case "semibold": fontWeight = 600; break;
              case "bold": fontWeight = 700; break;
              case "extrabold":
              case "heavy": fontWeight = 800; break;
              case "black": fontWeight = 900; break;
              default: fontWeight = 400; break;
            }
            fs.appendFile(fontsFile,
              `@font-face{\n\tfont-family: ${fontName};\n\tfont-display: swap;\n\tsrc: url("../fonts/${fontFileName}.woff2") format("woff2"),url("../fonts/${fontFileName}.woff") format("woff");\n\tfont-weight: ${fontWeight};\n\tfont-style: normal;\n\t}\r\n`, cb);
              newFileOnly = fontFileName;
          }

        }

      }
      else{
        //if file exists show message
        console.log("scss/Fonts.scss file exists already. Delete file to update");
      }
    }
  });
  return app.gulp.src(`${app.path.srcFolder}`);
  function cb(){}
}