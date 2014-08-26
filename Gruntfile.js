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

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['watch']);

};
