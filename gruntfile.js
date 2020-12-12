module.exports = function (grunt) {
	const cssFiles = [
		'working/assets/*.css',
		'assets/css/*.css',
		'node_modules/animate.css/animate.css'
	]

	const stylusFiles = [
		'assets/stylus/*.styl'
	]

	const watchfiles = ['views/shared/*.pug', 'assets/workers/*.js']

	let allFiles = []
	allFiles = allFiles.concat(watchfiles, cssFiles, stylusFiles)

	const copyCommand = [{
		expand: true,
		cwd: 'working/assets/fonts/',
		src: ['*.*'],
		dest: 'dist/css/fonts',
		filter: 'isFile'
	}]

	grunt.initConfig({
		jsDistDir: 'dist/js/',
		cssDistDir: 'dist/css/',
		pkg: grunt.file.readJSON('package.json'),
		exec: {
			confirmDialogTemplate: 'npx pug --client --no-debug --pretty --out working/templates --name confirmDialogTemplate views/shared/confirm-dialog.pug'
		},
		copy: {
			main: {
				files: copyCommand
			}
		},
		stylus: {
			options: {
				compress: false
			},
			compile: {
				files: {
					'working/assets/marlin-stylus.css': stylusFiles
				}
			}
		},
		concat: {
			css: {
				src: cssFiles,
				dest: '<%=cssDistDir%>marlin.css',
				nonull: true
			}
		},
		cssmin: {
			dist: {
				options: {
					rebase: false
				},
				files: {
					'<%=cssDistDir%>marlin.min.css': ['<%=cssDistDir%>marlin.css']
				}
			}
		},
		watch: {
			files: allFiles,
			tasks: ['exec', 'copy', 'stylus', 'concat']
		}
	})

	grunt.loadNpmTasks('grunt-contrib-copy')
	grunt.loadNpmTasks('grunt-contrib-stylus')
	grunt.loadNpmTasks('grunt-contrib-concat')
	grunt.loadNpmTasks('grunt-contrib-cssmin')
	grunt.loadNpmTasks('grunt-contrib-watch')
	grunt.loadNpmTasks('grunt-exec')

	grunt.registerTask('default', [
		'exec',
		'copy',
		'stylus',
		'concat',
		'cssmin'
	])

	grunt.registerTask('devel', [
		'exec',
		'copy',
		'stylus',
		'concat',
		'watch'
	])
}
