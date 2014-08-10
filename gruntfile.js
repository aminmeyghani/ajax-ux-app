module.exports = function (grunt) {
  //  Load all modules.
  require('load-grunt-tasks')(grunt, {pattern: ['grunt-contrib-*', 'grunt-*']});

  // Control variables
    var app = {
      // Refresh server if any of these files changes.
      toReloadFiles : [
        'gruntfile.js',
        'public/*.htm',
        'public/index.htm',
        'public/less/*.less',
        'public/js/*.js',
        'public/js/**/*.js',
      ],
      isLivereload : true
    };
  // Settings.
  grunt.initConfig({
    express: {
      options: {
        livereload: app.isLivereload,
        nospawn: app.isLivereload // to reload express.
      },
      // files: ['views/index.jade'],
      tasks: ['express:dev'],
      dev: {
        options: {
          script: 'server/bin/www',
        }
      }
    },
    less: {
      development: {
        files: {
          "public/css/app.css": "public/less/app.less"
        }
      },
      glyphtest: {
        files: {
         "font-maker/glyph-test.css": "font-maker/quisio-glyphs-main.less" 
        }
      }
    },
    watch: {
      // compile less if any of the less files is changed.
      less: {
        files: ['public/less/*.less'],
        tasks: ['less:development'],
        options: {
          spawn: false,
        },
      },
      livereload: {
        files: app.toReloadFiles,
        options: {
          livereload: app.isLivereload,
          nospawn: app.isLivereload // to reload express.
        }
      },
      // autoprefix: {
      //   files: ['public/less/*.less'],
      //   tasks: ['autoprefixer:dist'],
      // }
    },
    font: {
      all: {
        // SVG files to read in
        src: ['font-maker/svgs/*.svg'],

        // Location to output CSS variables
        destCss: 'font-maker/quisio-values.{less,json}',

        // Location to output fonts (expanded via brace expansion)
        destFonts: 'font-maker/quisio/quisio.{svg,woff,eot,ttf}',

        // Optional: Custom naming of font families for multi-task support
        fontFamily: 'quisio',
      }
    },
    // this is my own grunt plugin. Ask me for question :) (until i write the docs and the tests)
    json2less: {
      main: {
        options: {
        },
        files: {
          'font-maker/icon-names.less': ['font-maker/quisio-values.json']
        }
      },
    },
    copy: {
      glyphs:{
        files:[
          { dest:'public/css/quisio', expand:true, cwd:'font-maker/quisio',src:['**'] }
        ]
      },
      glyphLess:{
        files:[
          { dest:'public/less', expand:true, cwd:'font-maker',src:['icon-names.less', 'quisio-glyphs-main.less'] }
        ]
      },
    },
    autoprefixer: {
      options: {
        browsers: ["ff 3.6","opera 9.5", "ie 8", "chrome 5", "ios 3.2", "android 2.1", "safari 3.1"]
      },
      dist: {
        files: {
          "public/css/appprfx.css": "public/css/app.css"
        }
      }
    }
  });

  // Register Tasks
  grunt.registerTask('serve', function() {grunt.task.run(
    ['express:dev','watch']);
  });
  grunt.registerTask('icon', function() {grunt.task.run(
    ['font:all', 'json2less', 'less:glyphtest', 'copy:glyphs', 'copy:glyphLess']);
  });
};