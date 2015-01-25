// First we have to configure RequireJS
require.config({
    // This tells RequireJS where to find Ractive and rvc
    paths: {
        ractive: 'lib/ractive',
        rv: 'loaders/rv',
        jquery: 'lib/jquery-1.11',
        jqueryui: 'lib/jquery_ui',
        bootstrap: 'bootstrap/bootstrap'
    }
});


require(["temperatures"]);
