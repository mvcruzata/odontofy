/**
 * System configuration for Angular 2 samples
 * Adjust as necessary for your application needs.
 */
(function(global) {
    // map tells the System loader where to look for things
    var map = {
        'app':                        'app', // 'dist',
        '@angular':                   'node_modules/@angular',
        'angular2-in-memory-web-api': 'node_modules/angular2-in-memory-web-api',
        'rxjs':                       'node_modules/rxjs',
        'primeng':                    'node_modules/primeng',
        'angular2-datatable':         'node_modules/angular2-datatable',
        'lodash':                     'node_modules/lodash',
        'angular2-localstorage':      'node_modules/angular2-localstorage',
        'moment':                     'node_modules/moment',
        'angular2-calendar': 'node_modules/angular2-calendar',
        'date-fns': 'node_modules/date-fns',
        'ng-lightning': 'node_modules/ng-lightning'
        
    };
    // packages tells the System loader how to load when no filename and/or no extension
    var packages = {
        'app':                        { main: 'main.js',  defaultExtension: 'js' },
        'rxjs':                       { defaultExtension: 'js' },
        'angular2-in-memory-web-api': { main: 'index.js', defaultExtension: 'js' },
        'primeng':                    { defaultExtension: 'js' },
        'angular2-datatable':         { defaultExtension: 'js' },
        'lodash':                     { main: 'index.js', defaultExtension: 'js' },
        'angular2-localstorage':      { defaultExtension: "js" },
        'moment':                     { main: 'moment.js', defaultExtension: "js" },
        'angular2-calendar':          { defaultExtension: "js" },
        'date-fns': { defaultExtension: "js" },
        'ng-lightning': { defaultExtension: "js" }
    };
    var ngPackageNames = [
        'common',
        'compiler',
        'core',
        'forms',
        'http',
        'platform-browser',
        'platform-browser-dynamic',
        'router',
        'router-deprecated',
        'upgrade',
        'lodash'
    ];
    // Individual files (~300 requests):
    function packIndex(pkgName) {
        packages['@angular/'+pkgName] = { main: 'index.js', defaultExtension: 'js' };
    }
    // Bundled (~40 requests):
    function packUmd(pkgName) {
        packages['@angular/'+pkgName] = { main: '/bundles/' + pkgName + '.umd.js', defaultExtension: 'js' };
    }
    // Most environments should use UMD; some (Karma) need the individual index files
    var setPackageConfig = System.packageWithIndex ? packIndex : packUmd;
    // Add package entries for angular packages
    ngPackageNames.forEach(setPackageConfig);
    var config = {
        map: map,
        packages: packages
    };

    System.config(config);
})(this);
