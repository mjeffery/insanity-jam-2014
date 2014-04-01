module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);
	grunt.initConfig({
		connect: {
			dev: {
				options: {
					hostname: 'localhost',
					base: ['./bower_components', './src'],
					livereload: true,
					open: true
				}
			}
		},
		watch: {
			dev: {
				files: ['src/**/*.{html,js,css,png,mp3,ogg}'],
				options: {
					livereload: true
				}
			}
		}
	});

	grunt.registerTask('serve', ['connect', 'watch']);
}
