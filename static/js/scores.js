// Now we've configured RequireJS, we can load our dependencies and start
define([ 'ractive', 'rv!../ractive/scoreboard'], function ( Ractive, template) {


ractive = new Ractive({
  el: 'score',
  template: template
});



return ractive;

});