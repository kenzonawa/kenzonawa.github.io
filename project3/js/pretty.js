
	var companyList = [];
	var maxPrice = 0;
	var minPrice = 0;
  var maxFunding = 0;
  var minFunding = 0;
	var temp = [];
  var rectWidth = 0;
  var goBack = [];
  var status = "set";

	// Append Div for tooltip to SVG
	var div = d3.select("body")
		.append("div")   
		.attr("class", "tooltip")               
		.style("opacity", 0);

  var colorScale = d3.scale.ordinal()
      .domain([0,1,2,3,4])
      .range(['#F2FFF3','#C6F2C8','#7bccc4','#43a2ca','#0868ac'])

	var q = d3.queue()
	.defer(d3.csv, "rectangles.csv")
	.defer(d3.csv, "rectangle2.csv")
  .defer(d3.csv, "mobile_by_funding.csv")
	.awaitAll(function(error, data) {
		if (error) throw error;
		
    maxPrice = d3.max(data[2], function(d) {
      return parseInt(d.price_amount);
      });
    maxFunding = d3.max(data[2], function(d) {
      return parseInt(d.funding_total_usd);
      });

    minPrice = d3.min(data[2], function(d) {
      return parseInt(d.price_amount);
      });
    minFunding = d3.min(data[2], function(d) {
      return parseInt(d.funding_total_usd);
      });

		var data1 = data[0];
		var data2 = data[1];
    var mobile = [];
    var rects = new Array();
    var currentRow = 0;
    var lastScale = new Array();
    var noDup = new Array();


    for (var i =0;i<5;i++){
      lastScale[i] = new Array();
      noDup[i] = new Array();
    } 

    //console.log(data[2])

    for( var i =0 ; i < data[2].length ; i++)
    {
      var newObject = jQuery.extend(true, {}, data[2][i]);
      mobile[i] = newObject;
    }

    mobile.sort(function(x, y){
      return x.price_amount - y.price_amount;
    })

      var intervalPrice = getIntervals(mobile,'price');

      var y1AxisScale = d3.scale.ordinal()
        .domain([intervalPrice[0].toLocaleString(),intervalPrice[1].toLocaleString(),intervalPrice[2].toLocaleString(),
          intervalPrice[3].toLocaleString(),intervalPrice[4].toLocaleString(),intervalPrice[5].toLocaleString()])
        .rangeRoundBands([300, 0], -0.5);

      var zScale2 = d3.scale.linear()
              .domain([intervalPrice[0],intervalPrice[1],intervalPrice[2],intervalPrice[3],intervalPrice[4],intervalPrice[5]])
              .range([0,1,2,3,4,4])

		var svg = d3.select("#pretty").append("g")
		.attr("transform", "translate(100, 100)")
	      .attr({
	        "width": "1200",
	        "height": "1000"
	      })	    
      

      var xScale = d3.scale.ordinal()
      .domain(d3.range(13))
      .rangeRoundBands([0,300])

      rectWidth = xScale.rangeBand();
      
      var yScale = d3.scale.ordinal()
      .domain(d3.range(mobile.length))
      .rangeRoundBands([300,0], 0.05)

      var zScale = d3.scale.quantize()
      .domain([minPrice,maxPrice])
      .range([0,1,2,3,4])

      

      var y0 = d3.scale.ordinal()
        .domain(d3.range(5))
        .rangeRoundBands([300, 0], .5);
      
      var scalesArray = new Array();

      var intervals = getIntervals(data[2],'funding');

      var y0AxisScale = d3.scale.ordinal()
        .domain([intervals[0].toLocaleString(),intervals[1].toLocaleString(),intervals[2].toLocaleString(),
          intervals[3].toLocaleString(),intervals[4].toLocaleString(),intervals[5].toLocaleString()])
        .rangeRoundBands([300, 0], -0.5);

      

      var fundScale = d3.scale.linear()
        .domain([intervals[0],intervals[1],intervals[2],intervals[3],intervals[4],intervals[5]])
        .range([0,1,2,3,4,4])

      var yAxis = d3.svg.axis()
        .scale(y0AxisScale)
        .orient("left");

      var yAxis2 = d3.svg.axis()
        .scale(y1AxisScale)
        .orient("left");

//        ************************************************************************************************************        
//        ***                                                                                                      *** 
//        ***                                        CREATE THE FIRST BATCH                                        ***        
//        ***                                                                                                      ***
//        ************************************************************************************************************

    var crazy = svg.selectAll("rect")
        .data(data[2])
      .enter().append("rect")
        .attr("rx", 2)
        .attr("ry", 2)
        .style("stroke", "#263238")
        .style("stroke-width", 4)
        .style("fill", function(d,i) { 
          lastScale[(Math.floor(zScale2(parseInt(d.price_amount))))].push(parseInt(d.price_amount));
          
          return colorScale(Math.floor(fundScale(d.funding_total_usd))); })
        .attr("width", xScale.rangeBand())
        .attr("x", function(d,i) { 
          goBack[i] = new Array();
          goBack[i].push(xScale(i%13));
          return xScale(i%13); })
        .attr("y", function(d,i) { 
          var a = y0(Math.floor(fundScale(d.funding_total_usd)));
          goBack[i].push(a)
          return a; })
        .attr("height", function(d) { return 25; })
        .on('mouseover', function(d,i){
              div.transition()    
                      .duration(200)    
                      .style("opacity", .9);    
                  div .html(d.name
                    + "<br/>funding: " + parseInt(d.funding_total_usd).toLocaleString()
                    + "<br/>price: " + parseInt(d.price_amount).toLocaleString()
                    ) 
                      .style("left", (d3.event.pageX) + "px")   
                      .style("top", (d3.event.pageY - 28) + "px"); 
            })
              .on('mouseout', function(d) {   
                  div.transition()    
                      .duration(500)    
                      .style("opacity", 0); 
              });

        svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
          .append("text")
          .attr("transform", "translate(0,-30)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "middle")
          .style("font-size", "12px")
          .text("funding");;
        
        svg.append("g")
          .attr("transform", "translate(399,0)")
          .attr("class", "y2 axis")
          .call(yAxis2)
          .append("text")
          .attr("transform", "translate(0,-30)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "middle")
          .style("font-size", "12px")
          .text("acquisition price");;

         for (var i =0; i<5; i++){
          noDup[i] = lastScale[i].filter(function(item, pos) {
              return lastScale[i].indexOf(item) == pos;
          })
        }     

        for (var i =0; i<5; i++){
          noDup[i].sort(function(x, y){
            return x - y;
          })
        }

        for (var i =0; i<5; i++){
          lastScale[i].sort(function(x, y){
            return x - y;
          })
        }


        d3.select("#change")
        	.on("click", function(){

          if(status == "go1" || status == "set"){


            if(status== "set"){
              for (var i=0;i<5;i++){
              scalesArray.push(new rightScale(noDup[i],lastScale[i]));
              }
            }
              crazy
              .transition()
              .delay(function(d, i) {
                return (i*50);
              })
              .duration(2000)
              .attr("x", function(d,i) {
                return scalesArray[Math.floor(zScale2(parseInt(d.price_amount)))].scaleIt(d.price_amount);
              })
              .attr("y", function(d,i) {
                return y0(Math.floor(zScale2(parseInt(d.price_amount))));
              });
            status = "go2"
        	}
            else if(status == "go2") {
              crazy
              .transition()
              .delay(function(d, i) {
                return (i*50);
              })
              .duration(2000)
              .attr("x", function(d,i) {
                return goBack[i][0];
              })
              .attr("y", function(d,i) {
                return goBack[i][1];
              });

              for (var i=0; i<scalesArray.length ; i++){
                scalesArray[i].resetMap();
              }
              status = "go1"
            }
        });


	});



function getIntervals(data, column){
  var intervals = new Array();
  var counter = 0;
  var bucketSize = Math.round(data.length/5);
  if(column == 'funding') intervals.push(minFunding);
  else if(column == 'price') intervals.push(minPrice);

  for (var i =0; i<data.length;i++){
    if(counter == bucketSize){
      if(column == 'funding') intervals.push(parseInt(data[i].funding_total_usd));
      else if(column == 'price') intervals.push(parseInt(data[i].price_amount));
      counter = 0;
    }
    counter++;
  }

  if(column == 'funding') intervals.push(maxFunding);
  else if(column == 'price') intervals.push(maxPrice);
  return intervals;
}

function manualMap(price){
  this.filled = false;
  this.price = price;
  this.out = 0;
}



function rightScale(data, sizeArray) {
	this.currentIndex = 0;
  var size = sizeArray.length-1;
  var map = [];

  for(var i=0;i<sizeArray.length;i++){
    var point = new manualMap(parseInt(sizeArray[i]));
    point.out = i;
    map.push(point);
  }
  this.map = map;
  //console.log(map);
}

rightScale.prototype.resetMap = function(){
  var map = this.map;
  for(var i=0;i<map.length;i++){
    this.map[i].filled = false;
  }
}

rightScale.prototype.scaleIt = function(price) {
	var i = this.currentIndex;
  this.currentIndex++;

  for (var i =0;i<this.map.length;i++){
    
    if (price == this.map[i].price){
      if(this.map[i].filled == false){
        this.map[i].filled = true;
        var out = this.map[i].out;
        var value = 400 + (out*(rectWidth+1));
        return value;
      }
    }
  }
  return 0;
  
};