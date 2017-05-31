module.exports = function(grunt) {
  "use strict";

  // underscore:
  var _ = grunt.util._;

  // load tasks:
  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  // main config:
  grunt.initConfig({
    config: grunt.file.readJSON('grunt-config.json', { encoding: 'utf8'}),
    pkgJson: grunt.file.readJSON('package.json', { encoding: 'utf8'}),

    // tasks init:

    autoprefixer: {
      options: {
        browsers: '<%= config.autoprefixerBrowsers %>'
      },
      compile: {
        src: '<%= config.paths.dest.css %>' + 'custom.min.css'
      }
    },

    clean: {
      bootstrap: [
        '<%= config.paths.dest.bootstrap %>',
        '<%= config.paths.dest.fonts %>' + 'glyphicons-*'
      ],
      build: '<%= config.paths.dest.dist %>',
      css: '<%= config.paths.dest.css %>',
      fonts: '<%= config.paths.dest.fonts %>',
      lib: '<%= config.paths.dest.lib %>',
      prod: [
        '<%= config.paths.dest.js %>' + '*.js',
        '!' + '<%= config.paths.dest.js %>' + 'main.js',
        '<%= config.paths.dest.lib %>' + '**/*',
        '!' + '<%= config.paths.dest.lib %>' + 'require.js'
      ],
      source: '<%= config.paths.dest.js %>' + '*.js'
    },

    connect: {
      server: {
        options: {
          port: 8888,
          base: '.'
        }
      }
    },

    copy: {
      bootstrap: {
        files: [{
          expand: true,
          flatten: true,
          src: '<%= config.paths.bower %>' + 'bootstrap/fonts/*',
          dest: '<%= config.paths.dest.fonts %>'
        }]
      },
      dictionary: {
        files: [{
          expand: true,
          flatten: true,
          src: '<%= config.paths.src.dict %>' + 'dictionary.json',
          dest: '<%= config.paths.dest.dict %>'
        }]
      },
      html: {
        files: [{
          expand: true,
          cwd: '<%= config.paths.src.html %>',
          src: '**/*.html',
          dest: '<%= config.paths.dest.dist %>',
          ext: '.html'
        }]
      },
      jquery: {
        files: [{
          expand: true,
          flatten: true,
          src: '<%= config.paths.bower %>' + 'jquery/dist/jquery.js',
          dest: '<%= config.paths.dest.lib %>'
        }]
      },
      lodash: {
        files: [{
          expand: true,
          flatten: true,
          src: '<%= config.paths.bower %>' + 'lodash/lodash.js',
          dest: '<%= config.paths.dest.lib %>'
        }]
      },
      source: {
        files: [{
          expand: true,
          cwd: '<%= config.paths.src.js %>',
          src: '**/*.js',
          dest: '<%= config.paths.dest.js %>',
          ext: '.js',
          extDot: 'first'
        }]
      },
      require: {
        files: [{
          expand: true,
          flatten: true,
          src: '<%= config.paths.bower %>' + 'requirejs-bower/require.js',
          dest: '<%= config.paths.dest.lib %>'
        }]
      }
    },

    jshint: {
      source: [
        'Gruntfile.js',
        '<%= config.paths.src.js %>' + '*.js',
        '!' + '<%= config.paths.src.js %>' + 'plugins.js'
      ]
    },

    less: {
      compile: {
        options: {
          strictMath: true,
          sourceMap: false,
          outputSourceFiles: false
        },
        src: [
          '<%= config.paths.bower %>' + 'bootstrap/less/bootstrap.less',
          '<%= config.paths.src.less %>' + 'custom.less'
        ],
        dest: '<%= config.paths.dest.css %>' + 'custom.min.css'
      }
    },

    qunit: {
      all: {
        options: {
          urls: ['http://localhost:8888/tests/test-suite.html']
        }
      }
    },

    recess: {
      compress: {
        options: {
          compress: true
        },
        files: [{
          src: '<%= config.paths.dest.css %>' + 'custom.min.css',
          dest: '<%= config.paths.dest.css %>' + 'custom.min.css'
        }]
      },
      validate: {
        options: {
          noIDs: true,
          noJSPrefix: true,
          noOverqualifying: false,
          noUnderscores: true,
          noUniversalSelectors: false,
          prefixWhitespace: true,
          strictPropertyOrder: false,
          zeroUnits: false
        },
        files: [{
          src: '<%= config.paths.dest.css %>' + 'custom.min.css'
        }]
      }
    },

    requirejs: {
      compile: {
        options: {
          mainConfigFile: '<%= config.paths.dest.js %>' + 'main.js',
          baseUrl: '<%= config.paths.dest.js %>',
          name: 'main',
          out: '<%= config.paths.dest.js %>' + 'main.js',
          findNestedDependencies: true,
          insertRequire: ['main']
        }
      }
    },

    uglify: {
      prod: {
        files: [{
          expand: true,
          flatten: true,
          src: [
            '<%= config.paths.dest.lib %>' + 'require.js'
          ],
          dest: '<%= config.paths.dest.lib %>'
        }],
      }
    },

    watch: {
      html: {
        files: ['<%= config.paths.src.html %>' + '**/*.html'],
        tasks: ['copy:html'],
        options: {
          spawn: false
        }
      },
      js: {
        files: [
          '<%= config.paths.src.js %>' + '**/*.js'
        ],
        tasks: ['js:dev'],
        options: {
          spawn: false
        }
      },
      less: {
        files: ['<%= config.paths.src.less %>' + '**/*.less'],
        tasks: ['less:dev'],
        options: {
          spawn: false
        }
      },
      tests: {
        files: ['tests/js/**/*.js'],
        tasks: ['qunit'],
        options: {
          spawn: false
        }
      }
    }

  }); // End initConfig


  grunt.registerTask('copy:packages', [
    'copy:bootstrap',
    'copy:jquery',
    'copy:lodash',
    'copy:require'
  ]);

  grunt.registerTask('less:dev', [
    'clean:css',
    'less:compile',
    'autoprefixer:compile',
    'recess:validate'
  ]);

  grunt.registerTask('less:prod', [
    'less:dev',
    'recess:compress'
  ]);

  grunt.registerTask('js:dev', [
    'jshint:source',
    'clean:source',
    'copy:source',
    'clean:lib',
    'copy:packages',
    'qunit'
  ]);

  grunt.registerTask('js:prod', [
    'clean:lib',
    'copy:packages',
    'connect',
    'js:dev',
    'requirejs',
    'uglify'
  ]);

  grunt.registerTask('source:dev', [
    'less:dev',
    'connect',
    'js:dev',
    'copy:html'
  ]);

  grunt.registerTask('source:prod', [
    'less:prod',
    'js:prod',
    'copy:html'
  ]);

  grunt.registerTask('build:dev', [
    'clean:build',
    'copy:source',
    'copy:dictionary',
    'source:dev'
  ]);

  grunt.registerTask('build:prod', [
    'clean:build',
    'copy:source',
    'copy:dictionary',
    'source:prod',
    'clean:prod'
  ]);

  grunt.registerTask('update', [
    'connect',
    'watch'
  ]);


  // main tasks:
  grunt.registerTask('build', ['build:prod']);
  grunt.registerTask('default', ['build:dev']);
};
