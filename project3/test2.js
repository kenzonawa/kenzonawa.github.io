
	function fundRound(type, amount){
		this.fundType = type;
		this.amount = amount;
	}

	function company(name, acquisitionPrice, fundingTotal) {
    this.companyName = name;
    this.acquisitionPrice = acquisitionPrice;
    this.fundingTotal = fundingTotal;
   // this.funds = new Array();
	}
	company.prototype.addFund = function (funds) {
    this.funds.push(funds);
	}

	var companyList = [];
	var max = 0;
	var min = 0;

	var margin = {top: 30, right: 10, bottom: 10, left: 10},
	    width = 960 - margin.left - margin.right,
	    height = 500 - margin.top - margin.bottom;

	var x = d3.scale.ordinal().rangePoints([0, width], 1),
	    y = {},
	    dragging = {};

	var line = d3.svg.line(),
	    axis = d3.svg.axis().orient("left"),
	    background,
	    foreground;

	var svg = d3.select("#main").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var blue_to_brown = d3.scale.linear()
	  .range(["steelblue", "brown"])
	  .interpolate(d3.interpolateLab);

	// Append Div for tooltip to SVG
	var div = d3.select("body")
		.append("div")   
		.attr("class", "tooltip")               
		.style("opacity", 0);

	// interact with this variable from a javascript console
	var pc1;

	var q = d3.queue()
	.defer(d3.csv, "webmobile.csv")
	.awaitAll(function(error, data) {
		if (error) throw error;
		
		console.log(data);
		console.log("WTF")
		//getData(Results[0]);
		console.log(companyList);
		data = data[0];

		for (var i =0; i<data.length; i++)
		{
			var temp = parseInt(data[i]['Acquisition Price']);
			if(min == 0) min = temp;
			if(temp > max) max = temp;
			if(temp < min) min = temp;
		}

		blue_to_brown.domain([min,max]);

		console.log("fuck")
		pc1 = d3.parcoords()("#main")
		    .data(data)
		    .hideAxis(['Company Name'])
		    .composite("darken")
		    .color(function(d,i) { return blue_to_brown(d['Acquisition Price']); })  // quantitative color scale
		    .alpha(0.35)
		    .render()
		    .brushMode("1D-axes")  // enable brushing
		    .interactive()  // command line mode

		pc1.svg
		    .on('mouseover', function(d,i){
				div.transition()		
			    .duration(200)		
			    .style("opacity", .9);		
			   	div	.html(d)	
			        .style("left", (d3.event.pageX) + "px")		
			        .style("top", (d3.event.pageY - 28) + "px");	
			})
      		.on('mouseout', function(d) {		
			    div.transition()		
			    .duration(500)		
		        .style("opacity", 0);	
	        })
	

		  var explore_count = 0;
		  var exploring = {};
		  var explore_start = false;
		  pc1.svg
		    .selectAll(".dimension")
		    .style("cursor", "pointer")
		    .on("click", function(d) {
		      exploring[d] = d in exploring ? false : true;
		      event.preventDefault();
		      if (exploring[d]) d3.timer(explore(d,explore_count));
		    });

		  function explore(dimension,count) {
		    if (!explore_start) {
		      explore_start = true;
		      d3.timer(pc1.brush);
		    }
		    var speed = (Math.round(Math.random()) ? 1 : -1) * (Math.random()+0.5);
		    return function(t) {
		      if (!exploring[dimension]) return true;
		      var domain = pc1.yscale[dimension].domain();
		      var width = (domain[1] - domain[0])/4;

		      var center = width*1.5*(1+Math.sin(speed*t/1200)) + domain[0];

		      pc1.yscale[dimension].brush.extent([
		        d3.max([center-width*0.01, domain[0]-width/400]),
		        d3.min([center+width*1.01, domain[1]+width/100])
		      ])(pc1.g()
		          .filter(function(d) {
		            return d == dimension;
		          })
		      );
		    };
		  };

	});
	
	function position(d) {
	  var v = dragging[d];
	  return v == null ? x(d) : v;
	}

	function transition(g) {
	  return g.transition().duration(500);
	}

	// Returns the path for a given data point.
	function path(d) {
	  return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
	}

	function brushstart() {
	  d3.event.sourceEvent.stopPropagation();
	}

	// Handles a brush event, toggling the display of foreground lines.
	function brush() {
	  var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
	      extents = actives.map(function(p) { return y[p].brush.extent(); });
	  foreground.style("display", function(d) {
	    return actives.every(function(p, i) {
	      return extents[i][0] <= d[p] && d[p] <= extents[i][1];
	    }) ? null : "none";
	  });
	}


	function getData(Results){
		for (var i = 0; i <Results.length ; i++){
			var companyName = Results[i].name;
			var acquisitionPrice = Results[i].price_amount;
			var fundingTotal = Results[i].funding_total_usd;
			//var funds = new fundRound(Results[i].funding_round_code, Results[i].raised_amount_usd);
			var tempComp = getbyValue(companyList, companyName);
			if(tempComp == null){
				tempComp = new company(companyName, acquisitionPrice, fundingTotal);
				companyList.push(tempComp);
			}
			//tempComp.addFund(funds);
		}
	}

	function getbyValue(list, companyName) {
	    for (var i = 0; i < list.length; i++) {
	        if (list[i].companyName === companyName) {
	            return list[i];
	        }
	    }
	    return null;
	}
