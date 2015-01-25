// Now we've configured RequireJS, we can load our dependencies and start
define([ 'ractive', 'rv!../ractive/temperatures', 'jquery', "tweets", "bootstrap"], function ( Ractive, template, jquery, tweetRactive, bootstrap) {

var linearScale, getPointsArray, resize, ractive, twitterdata;


//our polling function
function poll() {
  console.log("Polling");
  $.ajax({
    dataType: "json",
    url: "./data",
    success: function(json) {
        var newBand = json["band"];
        var newCounts = json["counts"];

        ractive.set('timeBand', newBand);
        ractive.set('counts', newCounts);
        tweetRactive.fire('update', undefined, newBand[newBand.length-1]);
    }
  });
}

// this returns a function that scales a value from a given domain
// to a given range. Hat-tip to D3
linearScale = function ( domain, range ) {
  var d0 = domain[0], r0 = range[0], multipler = ( range[1] - r0 ) / ( domain[1] - d0 );

  return function ( num ) {
    return r0 + ( ( num - d0 ) * multipler );
  };
};

// this function takes an array of values, and returns an array of
// points plotted according to the given x scale and y scale
getPointsArray = function ( array, xScale, yScale) {
  var result = array.map( function ( data, i ) {
    return xScale( i + 0.5 ) + ',' + yScale( data );
  });

  // add the december value in front of january, and the january value after
  // december, to show the cyclicality
  //result.unshift( xScale( -0.5 ) + ',' + yScale( array[ array.length - 1 ][ point ] ) );
  //result.push( xScale( array.length + 0.5 ) + ',' + yScale( array[0][ point ] ) );

  return result;
};

resize = function () {
  var width, height;

  width = ractive.nodes.svg_wrapper.clientWidth;
  height = ractive.nodes.svg_wrapper.clientHeight;

  ractive.set({
    width: width,
    height: height
  });
};


ractive = new Ractive({
  el: 'timelineContainer',
  template: template,
  data: {
    isChecked: true,
    max_count: 5,
    format: function ( val ) {
      if ( this.get( 'degreeType' ) === 'fahrenheit' ) {
        // convert celsius to fahrenheit
        val = ( val * 1.8 ) + 32;
      }

      return val.toFixed( 1 ) + '°';
    },
    // this function returns the SVG string for the polygon representing the
    // temperature band
    band: function ( timeBand ) {
      var xScale, yScale, data;

      xScale = this.get( 'xScale' );
      yScale = this.get( 'yScale' );
      var counts = ractive.get('counts');
      high = getPointsArray( counts, xScale, yScale );
      //return high.concat( low.reverse() ).join( ' ' );
      return high;
    },
    time: function(utctime) {
      var hour = parseInt(utctime.substring(0,2));
      var minute = utctime.substring(2,4);
      return String(hour-5)+":"+minute;
    }
  }
});

//our polling function
function poll() {
  if ( ractive.get("isChecked") == true) {
    console.log("Polling");
    $.ajax({
      dataType: "json",
      url: "./data",
      success: function(json) {
          var newBand = json["band"];
          var newCounts = json["counts"];
          var max_count = Math.max.apply(Math, newCounts);

          ractive.set('max_count', max_count);
          ractive.set('timeBand', newBand);
          ractive.set('counts', newCounts);
          tweetRactive.fire('update', undefined, newBand[newBand.length-1]);
      }
    });
  }
}



// recompute xScale and yScale when we need to
ractive.observe({
  width: function ( width ) {
    this.set( 'xScale', linearScale([ 0, 10 ], [ 0, width ]) );
  },
  height: function ( height ) {
    var max_count = ractive.get("max_count");
    this.set( 'yScale', linearScale([ 1, max_count*1.25 ], [ height - 40, 25 ]) );
  },
  max_count: function( max_count ) {
    var height = ractive.get("height");
    this.set( 'yScale', linearScale([ 1, max_count*1.25 ], [ height - 40, 25 ]) );
  },
  isChecked: function(status){
    if (status == true)
    {
      poll();
    }
    tweetRactive.set("isLive", status);
  }
});


ractive.on( 'load_tweets', function( event, timebin )  {
  ractive.set("isChecked", false);
  tweetRactive.fire('update', undefined, timebin);

});

//var initval = ['2300', '2301', '2302', '2303', '2304', '2305', '2306', '2307','2308','2309', '2310', '2311'];
//ractive.set('timeBand', initval);

// update width and height when window resizes
window.addEventListener( 'resize', resize );
resize();

setInterval(poll, 60000);
poll();



$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})


return ractive;

});