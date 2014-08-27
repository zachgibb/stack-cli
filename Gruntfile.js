module.exports = function(grunt){
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      index: ['lib/*.js', '*.js']
    },

    watch: {
      files: ['lib/*.js', '*.js'],
      tasks: ['jshint'],
      options: {
        spawn: false
      }
    },

    uglify: {
      options: {
        mangle: false
      },
      my_target: {
        files: {
          'lib/stack.min.js': ['lib/stack.js']
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['watch']);

};