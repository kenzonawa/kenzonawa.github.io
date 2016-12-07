
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
	var color_set = d3.scale.linear()
	.range(["#3182bd", "#f33"]);

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
		    .composite("darken")
		    .color(function(d,i) { return blue_to_brown(d['Acquisition Price']); })  // quantitative color scale
		    .alpha(0.35)
		    .data(data)
		    .hideAxis(['Company Name'])
		    .mode("queue")
		    .rate(5)
		    .render()
		    .brushMode("1D-axes")  // enable brushing
		    .interactive();

		    // set the initial coloring based on the 3rd column
			update_colors(d3.keys(data[0])[2]);

			 // click label to activate coloring
			pc1.svg.selectAll(".dimension")
			    .on("click", update_colors)
			    .selectAll(".label")
			    	.style("font-size", "14px"); // change font sizes of selected lable


		    d3.select("#main svg")
		    .on("mousemove", function() {
			    var mousePosition = d3.mouse(this);			    
			    highlightLineOnClick(mousePosition, true); //true will also add tooltip
			})
			.on("mouseout", function(){
				cleanTooltip();
				pc1.unhighlight();
			});

	});

	function getClickedLines(mouseClick){
    var clicked = [];
    var clickedCenPts = [];

	// find which data is activated right now
	var activeData = getActiveData();

	// find centriod points
	var pc1CentPts = getCentroids(activeData);

    if (pc1CentPts.length==0) return false;

	// find between which axes the point is
    var axeNum = findAxes(mouseClick, pc1CentPts[0]);
    if (!axeNum) return false;
    
    pc1CentPts.forEach(function(d, i){
	    if (isOnLine(d[axeNum-1], d[axeNum], mouseClick, 2)){
	    	clicked.push(activeData[i]);
	    	clickedCenPts.push(pc1CentPts[i]); // for tooltip
	    }
	});
	
	return [clicked, clickedCenPts]
}

function update_colors(dimension) { 
	// change the fonts to bold
	pc1.svg.selectAll(".dimension")
		.style("font-weight", "normal")
		.filter(function(d) { return d == dimension; })
			.style("font-weight", "bold");

	// change color of lines
	// set domain of color scale
	var values = pc1.data().map(function(d){return parseFloat(d[dimension])}); 
	color_set.domain([d3.min(values), d3.max(values)]);
	
	// change colors for each line
	pc1.color(function(d){return color_set([d[dimension]])}).render();
};		

function highlightLineOnClick(mouseClick, drawTooltip){
	
	var clicked = [];
    var clickedCenPts = [];
	
	clickedData = getClickedLines(mouseClick);

	if (clickedData && clickedData[0].length!=0){

		clicked = clickedData[0];
    	clickedCenPts = clickedData[1];

	    // highlight clicked line
	    pc1.highlight(clicked);
		
		if (drawTooltip){
			// clean if anything is there
			cleanTooltip();
	    	// add tooltip
	    	addTooltip(clicked, clickedCenPts);
		}

	}
};

function cleanTooltip(){
	// removes any object under #tooltip is
	pc1.svg.selectAll("#tooltip")
    	.remove();
}

// Add highlight for every line on click
function getCentroids(data){
	// this function returns centroid points for data. I had to change the source
	// for parallelcoordinates and make compute_centroids public.
	// I assume this should be already somewhere in pc1 and I don't need to recalculate it
	// but I couldn't find it so I just wrote this for now
	var margins = pc1.margin();
	var pc1CentPts = [];
	
	data.forEach(function(d){
		
		var initCenPts = pc1.compute_centroids(d).filter(function(d, i){return i%2==0;});
		
		// move points based on margins
		var cenPts = initCenPts.map(function(d){
			return [d[0] + margins["left"], d[1]+ margins["top"]]; 
		});

		pc1CentPts.push(cenPts);
	});

	return pc1CentPts;
}

function getActiveData(){
	// I'm pretty sure this data is already somewhere in pc1
	if (pc1.brushed()!=false) return pc1.brushed();
	return pc1.data();
}

function isOnLine(startPt, endPt, testPt, tol){
	// check if test point is close enough to a line
	// between startPt and endPt. close enough means smaller than tolerance
	var x0 = testPt[0];
	var	y0 = testPt[1];
	var x1 = startPt[0];
	var	y1 = startPt[1];
	var x2 = endPt[0];
	var	y2 = endPt[1];
	var Dx = x2 - x1;
	var Dy = y2 - y1;
	var delta = Math.abs(Dy*x0 - Dx*y0 - x1*y2+x2*y1)/Math.sqrt(Math.pow(Dx, 2) + Math.pow(Dy, 2)); 
	//console.log(delta);
	if (delta <= tol) return true;
	return false;
}

function findAxes(testPt, cenPts){
	// finds between which two axis the mouse is
	var x = testPt[0];
	var y = testPt[1];

	// make sure it is inside the range of x
	if (cenPts[0][0] > x) return false;
	if (cenPts[cenPts.length-1][0] < x) return false;

	// find between which segment the point is
	for (var i=0; i<cenPts.length; i++){
		if (cenPts[i][0] > x) return i;
	}
}
	
function cleanTooltip(){
	// removes any object under #tooltip is
	pc1.svg.selectAll("#tooltip")
    	.remove();
}

function addTooltip(clicked, clickedCenPts){
	
	// sdd tooltip to multiple clicked lines
    var clickedDataSet = [];
    var margins = pc1.margin()

    // get all the values into a single list
    // I'm pretty sure there is a better way to write this is Javascript
    for (var i=0; i<clicked.length; i++){
    	for (var j=0; j<clickedCenPts[i].length; j++){
    		var text = d3.values(clicked[i])[j];
  			// not clean at all!
  			var x = clickedCenPts[i][j][0] - margins.left;
  			var y = clickedCenPts[i][j][1] - margins.top;
  			clickedDataSet.push([x, y, text]);
		}
	};

	// add rectangles
	var fontSize = 14;
	var padding = 2;
	var rectHeight = fontSize + 2 * padding; //based on font size

	pc1.svg.selectAll("rect[id='tooltip']")
        	.data(clickedDataSet).enter()
        	.append("rect")
        	.attr("x", function(d) { return d[0] - d[2].length * 5;})
			.attr("y", function(d) { return d[1] - rectHeight + 2 * padding; })
			.attr("rx", "2")
			.attr("ry", "2")
			.attr("id", "tooltip")
			.attr("fill", "grey")
			.attr("opacity", 0.9)
			.attr("width", function(d){return d[2].length * 10;})
			.attr("height", rectHeight);

	// add text on top of rectangle
	pc1.svg.selectAll("text[id='tooltip']")
    	.data(clickedDataSet).enter()
    		.append("text")
			.attr("x", function(d) { return d[0];})
			.attr("y", function(d) { return d[1]; })
			.attr("id", "tooltip")
			.attr("fill", "white")
			.attr("text-anchor", "middle")
			.attr("font-size", fontSize)
        	.text( function (d){ return d[2];})    
}

	function getData(Results){
		for (var i = 0; i <Results.length ; i++){
			var companyName = Results[i].name;
			var acquisitionPrice = Results[i].price_amount;
			var fundingTotal = Results[i].funding_total_usd;
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
