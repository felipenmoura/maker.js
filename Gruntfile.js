module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: ''
      },
      build: {
        src: 'dist/maker.js',
        dest: 'dist/maker.min.js'
      }
    },
    watch: {
      scripts: {
        files: ['src/**/*.js', 'src/**'],
        tasks: ['default'],
        options: {
          spawn: false,
        },
      },
    },
    concat: {
      options: {
      },
      dist: {
        src: ['src/maker.js', 'src/makers/**.js'],
        dest: 'dist/maker.js',
      },
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['concat', 'uglify']);

};
