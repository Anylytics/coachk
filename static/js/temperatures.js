// Now we've configured RequireJS, we can load our dependencies and start
define([ 'ractive', 'rv!../ractive/temperatures', 'jquery'], function ( Ractive, template, jquery) {

var linearScale, getPointsArray, resize, ractive, twitterdata;

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
    }
  }
});


// recompute xScale and yScale when we need to
ractive.observe({
  width: function ( width ) {
    this.set( 'xScale', linearScale([ 0, 20 ], [ 0, width ]) );
  },
  height: function ( height ) {
    this.set( 'yScale', linearScale([ 0, 10 ], [ height - 40, 25 ]) );
  }
});


//var initval = ['2300', '2301', '2302', '2303', '2304', '2305', '2306', '2307','2308','2309', '2310', '2311'];
//ractive.set('timeBand', initval);

// update width and height when window resizes
window.addEventListener( 'resize', resize );
resize();

$.ajax({
    dataType: "json",
    url: "./data",
    success: function(json) {
        console.log(json);
        var newBand = json["band"];
        var newCounts = json["counts"];
        //twitterdata = {};
        //var newBand = [];
        //for (var i =0; i<12; i++)
            //newBand.push(twitterdata[i]);
        console.log("NEW BAND" +newBand);
        console.log("NEW COUNTS" +newCounts);
        ractive.set('timeBand', newBand);
        ractive.set('counts', newCounts);
    }
});

/*ractive.observe('timeBand', function(newBand, oldValue, keyPath) {
    console.log("YES" + twitterdata);
    var counts = newBand.map( function(time) {
        if ( twitterdata[time] == undefined)
            return 0;
        else
            return twitterdata[time];
    });
    ractive.set('counts', counts);
}, {init: false});*/

return ractive;

});