
	var companyList = [];
	var maxX = 0;
	var maxY = 0;
	var scatterPlot = [];
	var temp = [];

	// interact with this variable from a javascript console
	var pc1;

	var q = d3.queue()
	.defer(d3.csv, "webmobile.csv")
	.awaitAll(function(error, data) {
		if (error) throw error;
		
		console.log(data);
		data = data[0];

		for (var i =0; i<data.length; i++)
		{
			var acqPice = parseFloat(data[i]['Acquisition Price']);
			var totalFund = parseFloat(data[i]['Total Funding']);
			var cName = data[i]['Company Name'];
			scatterPlot[i] = new Array();
			scatterPlot[i].push(cName);
			scatterPlot[i].push(totalFund);
			scatterPlot[i].push(acqPice);
			if(totalFund > maxX) maxX = totalFund;
			if(acqPice > maxY) maxY = acqPice;
		}

		for( var i =0 ; i < scatterPlot.length ; i++)
		{
			/*temp[i] = new Array();
			temp[i].push(lonely[0][i].slice());*/
			temp[i] = scatterPlot[i].slice();
		}

		console.log(temp);

		drawScatter(temp);

	});

	function drawScatter(scatterPlot)
		{
			//console.log(selectedYear);
			//console.log(dataset[0]);
			//console.log(dataset);
			var chartWidth = 800;
			var chartHeight = 800;
			var z = d3.scale.category10();

			var yScale = d3.scale.linear()
				.domain([0,maxY])
				.range([chartHeight,0]);

			var xScale = d3.scale.linear()
				.domain([0,maxX])
				.range([0,chartWidth]);

			var rScale = d3.scale.linear()
				.domain([0, maxX])
				.range([0, 50]);

			var group = d3.select('#scatter').append("g")
				.attr("transform", "translate(100, 100)");

			var div = d3.select("body").append("div")	
			    .attr("class", "tooltip")				
			    .style("opacity", 0);

			//http://bl.ocks.org/WilliamQLiu/bd12f73d0b79d70bfbae
			group.selectAll(".dot")
				      .data(scatterPlot)
				      .enter().append("circle")
				      .attr("class", "dot")
				      .attr("r", function(d){
				      	//console.log(d);
				      	return 5;
				      })
				      .attr("cx", function(d,i){
				      	return xScale(d[1]);
				      })
				      .attr("cy", function(d,i){
				      	return yScale(d[2]);
				      })
				      .style("fill", function(d,i) { return z(i); })
				      .on('mouseover', function(d,i){
				    	div.transition()		
			                .duration(200)		
			                .style("opacity", .9);		
			            div	.html(d[0]
			            	+ "<br/>funding: " + d[1].toLocaleString()
			            	+ "<br/>price: " + d[2].toLocaleString()
			            	)	
			                .style("left", (d3.event.pageX) + "px")		
			                .style("top", (d3.event.pageY - 28) + "px");	
				    })
      				.on('mouseout', function(d) {		
			            div.transition()		
			                .duration(500)		
			                .style("opacity", 0);	
			        })
			        .on('click', function(d){
			        	div.transition()		
			                .duration(500)		
			                .style("opacity", 0);

			        	$.each(temp, function(i){
		  					  if(temp[i][0] === d[0]) {
						        temp.splice(i,1);
					        return false;
					    }
					    
					});

			        	d3.select("#scatter").selectAll('g').remove();
			        	getMax(temp);
			        	drawScatter(temp);
			        	console.log(temp);
			    });

			var xAxis = d3.svg.axis()
				.scale(xScale)
				.orient('bottom')
				.ticks(10);

			group.append("g")
				.attr('class', 'axis')
				.attr('transform', 'translate(0,' + chartHeight + ')')
				.call(xAxis)
				.append("text")
				.attr("x", chartWidth)
			    .attr("y", 10)
			    .attr("dy", ".71em")
		        .style("text-anchor", "start")
		        .style("font-size", "10px")
	   	        .text("Total Funding");

			var yAxis = d3.svg.axis()
				.scale(yScale)
				.orient('left');

			group.append("g")
				.attr('class', 'axis')
				.attr('transform', 'translate(-2,0)')
				.call(yAxis)
				.append("text")
			    .attr("transform", "rotate(-90)")
			    .attr("y", 6)
			    .attr("dy", ".71em")
		        .style("text-anchor", "middle")
		        .style("font-size", "12px")
	   	        .text("Acq");

		}

function objectFindByKey(array, key, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
            return array[i];
        }
    }
    return null;
}

function getMax(array){
	maxX = 0 ;
	maxY = 0 ;
	console.log("get max");
	console.log(array);
	for (var i =0; i<array.length; i++)
		{
			var acqPice = parseFloat(array[i][2]);
			var totalFund = parseFloat(array[i][1]);

			if(totalFund > maxX) maxX = totalFund;
			if(acqPice > maxY) maxY = acqPice;
		}
}