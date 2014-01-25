/*
 * pusher-gif
 *
 * Copyright(c) 2014 Nathan Walker <nathan.walker@infowrap.com>, Kirk Strobeck <kirk.strobeck@infowrap.com>
 * MIT Licensed
 *
 */

module.exports = function (grunt) {

    'use strict';

    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    var banner = '/*! <%= pkg.name %> (v<%= pkg.version %>) - Copyright: 2013, <%= pkg.license %> */\n';

    grunt.initConfig({
        pkg: grunt.file.readJSON('bower.json'),
        coffee: {
            options: {
                bare:true,
                expand:true
            },
            dev: {
                expand: true,
                cwd: './',
                src: ["*.coffee"],
                dest: "./",
                ext: ".js"
            }
        },
        concat: {
            options: {
                banner: banner
            },
            dist: {
                src: ['lib/glif.js', 'pusher-gif.js'],
                dest: 'js/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: banner
            },
            dist: {
                src: 'js/<%= pkg.name %>.js',
                dest: 'js/<%= pkg.name %>.min.js'
            }
        }
    });

    grunt.registerTask('default', ['coffee:dev', 'concat:dist', 'uglify:dist']);
};
