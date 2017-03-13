module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        abideCreate: {
            default: { // Target name.
                options: {
                    template: 'locale/templates/LC_MESSAGES/messages.pot', // (default: 'locale/templates/LC_MESSAGES/messages.pot')
                    languages: ['en-US', 'ar'],
                    localeDir: 'locale',
                }
            }
        },
        abideExtract: {
            // js: {
            //     src: 'dist/**/**/*.js',
            //     dest: 'locale/templates/LC_MESSAGES/messages.pot',
            //     options: {
            //         language: 'JavaScript',
            //     }
            // },
            html: {
                src: 'src/views/**/*.html',
                dest: 'locale/templates/LC_MESSAGES/messages.pot',
                options: {
                    language: 'Ejs',
                }
            },
        },
        abideMerge: {
            default: { // Target name.
                options: {
                    template: 'locale/templates/LC_MESSAGES/messages.pot', // (default: 'locale/templates/LC_MESSAGES/messages.pot')
                    localeDir: 'locale',
                }
            }
        },
        abideCompile: {
            json: {
                dest: 'media/locale/',
                options: {
                    type: 'json',
                    createJSFiles: false, // defaults to true
                }
            }
        },
    });

    grunt.loadNpmTasks('grunt-i18n-abide');
};