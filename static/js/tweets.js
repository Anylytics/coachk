// Now we've configured RequireJS, we can load our dependencies and start
define([ 'ractive', 'rv!../ractive/tweets', 'jquery'], function ( Ractive, template, jquery) {


tweetRactive = new Ractive({
  el: 'tweetBox',
  template: template,
  data: {
    tweets: [],
    isLive: true,
    currentTime: "0",
    time: function(utctime)
    {
        time = utctime.split(" ")[3];
        split_time = time.split(":");
        hour = parseInt(split_time[0])-5;
        if (hour <= 0)
            hour = 24 + hour;
        if (hour >= 12)
            hour = hour - 12;
        split_time[0] = String(hour);
        return split_time[0]+":"+split_time[1];
    },
    time2: function(utctime) {
      var hour = parseInt(utctime.substring(0,2)) - 5;
      if (hour<=0)
        hour = 24+hour;
      if (hour >= 12)
        hour = hour - 12;
      var minute = utctime.substring(2,4);
      return String(hour)+":"+minute;
    }
  }
});

tweetRactive.on( 'update', function( event, timebin )  {
    tweetRactive.set("currentTime", timebin);
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