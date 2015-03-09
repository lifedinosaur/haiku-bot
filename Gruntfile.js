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

    volo: {
      'cmd-add': 'volo:add:-nostamp:',
      'cmd-addF': 'volo:add:-f:-nostamp:',
      'cmd-amdify': 'volo:amdify:-noprompt:',

      // amdify files with volo
      // property name should be the name of the .js file to amdify
      // assign a config object with options for each file
      amdify: {
        // Bootstrap:
        affix: '<%= volo.tmpl.bootstrapTransition %>',
        alert: '<%= volo.tmpl.bootstrapTransition %>',
        button: '<%= volo.tmpl.bootstrapTransition %>',
        carousel: '<%= volo.tmpl.bootstrapTransition %>',
        collapse: '<%= volo.tmpl.bootstrapTransition %>',
        dropdown: '<%= volo.tmpl.bootstrapTransition %>',
        modal: '<%= volo.tmpl.bootstrapTransition %>',
        popover: '<%= volo.tmpl.bootstrapTransition %>',
        scrollspy: '<%= volo.tmpl.bootstrapTransition %>',
        tab: '<%= volo.tmpl.bootstrapTransition %>',
        tooltip: '<%= volo.tmpl.bootstrapTransition %>',
        transition: '<%= volo.tmpl.bootstrap %>',
        // Greensock:
        ColorPropsPlugin: '<%= volo.tmpl.greensock %>',
        EasePack: '<%= volo.tmpl.greensock %>'
      },
      // template config objects:
      tmpl: {
        bootstrapTransition: {
          src: '<%= config.paths.dest.bootstrap %>',
          deps: [
            'jquery',
            'lib/bootstrap/transition'
          ]
        },
        bootstrap: {
          src: '<%= config.paths.dest.bootstrap %>',
          deps: ['jquery']
        },
        greensock: {
          src: '<%= config.paths.dest.greensock %>'
        }
      }
    },

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
      pkg: '<%= config.paths.pkg %>',
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
          src: '<%= config.paths.pkg %>' + 'bootstrap/js/*.js',
          dest: '<%= config.paths.dest.bootstrap %>'
        }, {
          expand: true,
          flatten: true,
          src: '<%= config.paths.pkg %>' + 'bootstrap/fonts/*',
          dest: '<%= config.paths.dest.fonts %>'
        }]
      },
      codePrettify: {
        files: [{
          expand: true,
          flatten: true,
          src: '<%= config.paths.pkg %>' + 'codePrettify/src/prettify.js',
          dest: '<%= config.paths.dest.lib %>'
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
      greensock: {
        files: [{
          expand: true,
          flatten: true,
          src: [
            '<%= config.paths.pkg %>' + 'greensock/src/uncompressed/TweenLite.js',
            '<%= config.paths.pkg %>' + 'greensock/src/uncompressed/easing/EasePack.js',
            '<%= config.paths.pkg %>' + 'greensock/src/uncompressed/plugins/ColorPropsPlugin.js'
          ],
          dest: '<%= config.paths.dest.greensock %>'
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
          src: '<%= config.paths.pkg %>' + 'jquery/dist/jquery.js',
          dest: '<%= config.paths.dest.lib %>'
        }]
      },
      lodash: {
        files: [{
          expand: true,
          flatten: true,
          src: '<%= config.paths.pkg %>' + 'lodash/lodash.js',
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
          src: '<%= config.paths.pkg %>' + 'require/require.js',
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
          '<%= config.paths.pkg %>' + 'bootstrap/less/bootstrap.less',
          '<%= config.paths.src.less %>' + 'prettify.less',
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


  grunt.registerTask('packages', function () {
    // if 'dl' is not specified and the packages folder is missing
    // add the arg and continue
    if (this.args.length === 0) {
      var folder = grunt.config.get('config.paths.pkg');
      if(!grunt.file.exists(folder)) {
        this.args[0] = 'dl';
      }
    }

    // Clean all build lib:
    var cmd = ['clean:bootstrap', 'clean:lib'];

    // Add dl as first arg to enable packages:download task
    // Additional arguments are passed to packages:download
    // Disabled by default to reduce calls to API.
    if (this.args[0] === 'dl') {
      var dl = 'packages:download';

      if (this.args.length > 1) {
        for (var i = 1; i < this.args.length; i++) {
          dl += ':' + this.args[i];
        }
      }
      cmd.push(dl);
    }
    cmd.push('copy:packages');

    grunt.task.run(cmd);
  });

  grunt.registerTask('packages:download', function () {
    var add = grunt.config.get('volo.cmd-add');
    var addF = grunt.config.get('volo.cmd-addF');
    var cmd = [];

    // Construct a volo add command for the given lib and save repo in pkg/lib:
    function writeVolo (useAdd, lib) {
      return useAdd + grunt.config.get('pkgJson.volo.add.' + lib) + ':' +
        grunt.config.get('config.paths.pkg') + lib + '/';
    }

    // Add all packages from volo config var:
    function addAll (useAdd) {
      for(var pkg in grunt.config.get('pkgJson.volo.add')) {
        cmd.push(writeVolo(useAdd, pkg));
      }
    }

    // Args can target a particular lib by name:
    if (this.args.length > 0) {
      for (var i = 0; i < this.args.length; i++) {
        var useAdd = add;

        // Allow '-f' flag to force each lib:
        var parts = this.args[i].split('-');
        var lib = parts[0];
        var flag = parts[1];

        // Parse out errors:
        if (parts.length > 2) {
          grunt.log.error(['packages:download only supports one var flag: use -f only']);
          return;
        }
        if (parts.length === 1 && !lib) {
          grunt.log.error(['packages:download does not recognize that library']);
          return;
        }

        // Add '-f' to volo add:
        if (flag === 'f') {
          useAdd = addF;
        }
        if (!lib) {
          // Only '-f' was specified. Load all packages:
          addAll(useAdd);
        }
        else {
          // Load the given lib
          cmd.push(writeVolo(useAdd, lib));
        }
      }
    }
    else {
      // Load all packages with no '-f':
      addAll(add);
    }

    grunt.task.run(cmd);
  });

  grunt.registerTask('packages:amdify', function () {
    var amdify = grunt.config.get('volo.cmd-amdify');
    var cmd = [];

    // Construct a volo amdify command for the given file
    function writeVolo (file) {
      // Find the def object in volo.pkg.amdify
      var obj = grunt.config.get('volo.amdify.' + file);
      var cmd = amdify + obj.src + file + '.js';

      if (obj.deps) {
        cmd += ':depends=' + obj.deps.toString();
      }
      if (obj.exports) {
        cmd += ':exports=' + obj.exports.toString();
      }

      return cmd;
    }

    // Add all files to the task:
    for (var file in grunt.config.get('volo.amdify')) {
      cmd.push(writeVolo(file));
    }

    grunt.task.run(cmd);
  });

  grunt.registerTask('copy:packages', [
    'copy:bootstrap',
    'copy:codePrettify',
    'copy:greensock',
    'copy:jquery',
    'copy:lodash',
    'copy:require',
    'packages:amdify'
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
    'packages',
    'copy:source',
    'copy:dictionary',
    'source:dev'
  ]);

  grunt.registerTask('build:prod', [
    'clean:build',
    'packages',
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
