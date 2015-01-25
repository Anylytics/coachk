// Now we've configured RequireJS, we can load our dependencies and start
define([ 'ractive', 'rv!../ractive/tweets', 'jquery'], function ( Ractive, template, jquery) {


tweetRactive = new Ractive({
  el: 'tweetBoxContents',
  template: template,
  data: {
    tweets: [],
    time: function(utctime)
    {
        time = utctime.split(" ")[3];
        split_time = time.split(":");
        split_time[0] = String(parseInt(split_time[0])-5);
        return split_time[0]+":"+split_time[1];
    }
  }
});

tweetRactive.on( 'update', function( event, timebin )  {
    console.log(timebin);
    $.ajax({
        dataType: "json",
        url: "./tweets/"+timebin,
        success: function(json) {
            tweetRactive.set("tweets", json["tweets"]);

        }
    });
});


return tweetRactive;

});