module.exports = function(grunt) {

  grunt.initConfig({
    cssmin: {
      files: {
        src: "public/css/style.css",
        dest: "public/css/style.min.css"
      }
    },
    pkg: grunt.file.readJSON('package.json'),
    //uglify: {
    //  options: {
    //    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
    //    '<%= grunt.template.today("yyyy-mm-dd") %> */'
    //  },
    //  target: {
    //    files: {
    //      '': ['components/**/*.js']
    //    }
    //  }
    //},
    concat: {
      options: {
        stripBanners: true,
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      dist: {
        src: ['components/**/*.js'],
        dest: 'public/js/components.js'
      }
    },
    watch: {
      css: {
        files: ['public/css/style.css'],
        tasks: ['cssmin']
      },
      js: {
        files: ['components/**/*.js'],
        tasks: ['concat']
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', ['cssmin', 'concat', 'watch']);
};