// Now we've configured RequireJS, we can load our dependencies and start
define([ 'ractive', 'rv!../ractive/scoreboard'], function ( Ractive, template) {

//our polling function
function poll() {
  console.log("Polling Scores");
  $.ajax({
    dataType: "json",
    url: "./score",
    success: function(json) {
        ractive.set('duke', json["duke"]);
        ractive.set('stj', json["stj"]);
    }
  });
}

ractive = new Ractive({
  el: 'score',
  template: template,
  data: {
    duke: 0,
    stj: 0
  }
});

poll();

return ractive;

});