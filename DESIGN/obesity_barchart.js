    /**
    Made by: J.C. de Rijcke
    10645012

    In assignment of: Programmeerproject
    last added: 24-1-2017
    **/


// place barplot in separate function to divide it from the scatterplot
function drawBarchart(){
    // set borders of barchart
    var margin = {top: 20, right: 30, bottom: 70, left: 110},
        width = 1200 - margin.left - margin.right,
        height = 700 - margin.top - margin.bottom;

    // space between bars
    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);


    var y = d3.scale.linear()
        .range([height, 20]);

    // set x-axis
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickFormat("");

    // set y-axis
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    // set chart plane
    var chart = d3.select("#barchart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // load data
    d3.json("../DATA/obesity_data.json", function(datas) {
        // retrieve categories from dropdown menu and link scatterplot
        var slider = document.getElementById('slider2')
        slider.addEventListener("click",updateBarGraph)
        var dropDown = document.getElementById('sex')
        dropDown.addEventListener("click", updateBarGraph);
        // retrieve sort order from checkbox
        var checkbox = document.getElementById('checkbox')
        checkbox.addEventListener("change", updateBarGraph);

        // retrieve selected year
        var selectedYear = slider.value
        // create/update bargraph
        updateBarGraph()
        // retrieve selected sex
        var selectedSex = dropDown.value
        // set category
        var selectedCatergory = "fraction_obese"

        function updateBarGraph(){
            // remove chart, in case it needs to be updated
            chart.selectAll("*").remove()

            // retrieve selected year and sex
            var selectedYear = slider.value
            var selectedSex = dropDown.value
            // variable to insert in label
            var sexText = "to be determined"
            if(selectedSex == "Men"){
                sexText = "male"
            }
            else{
                sexText = "female"
            }
            // set data
            var selectedData = datas[selectedYear][selectedSex]
            // set category
            var selectedCatergory = "fraction_obese"
            // set x and y domains
            x.domain(selectedData.map(function(d) {return d["country_name"]}));
            // The + converts the string into a number.
            y.domain([0, d3.max(selectedData, function(d) {return +d[selectedCatergory]; })]);

            // add x-axis
            chart.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis)
              .selectAll("text")
              .attr("y", 0)
              .attr("x", 9)
              .attr("dy", ".35em")
              .attr("transform", "rotate(90)")
              .style("text-anchor", "start");
            // add y-axis
            chart.append("g")
              .attr("class", "y axis")
              .call(yAxis)
             .append("text")
               .attr("transform", "rotate(-90)")
               .attr("y", -50)
               .attr("dy", ".71em")
               .style("text-anchor", "end")
               .text("")
               .style("font-size", "15px")
               .style({"stroke-width": "1px"});

            // add title
            chart.append("g")
              .attr("class", "Title")
              .append("text")
              .attr("x", (width / 2))
              .attr("y", 0 - (margin.top / 4))
              .attr("text-anchor", "middle")
              .style("font-size", "15px")
              .text("Fraction obese of the " + sexText + " population for every country in "+ selectedYear);

            // add x-axis label
            chart.append('text')
              .attr("x", width / 2 )
              .attr("y", height + 30)
              .style("text-anchor", "middle")
              .text("Countries")

            // add y-axis label
            chart.append('text')
              .attr("transform", "rotate(-90)")
              .attr("y_gb", 6)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text("Fraction obese");

            // add tooltip

            // create bars
            chart.selectAll(".bar")
              .data(selectedData)
              .enter().append("rect")
                .attr("class", "bar")
                .attr("id", function(d) { return d["country_code"]; })
                .attr("x", function(d) { return x(d["country_name"]); })
                .attr("y", function(d) { return y(+d[selectedCatergory]); })
                .attr("height", function(d) { return height - y(+d[selectedCatergory]); })
                .attr("width", x.rangeBand())
                .style("fill" , function(d){ return determineColour(d["mean_bmi"])})
                .on("mouseover", function(d){
                    highlight_bargraph_on(d["country_code"], 1);
                    highlight_country('.datamaps-subunit.'+d["country_code"]) ;
                    highlight_scatterPlot_on(d["country_code"], 1);
                return tooltip.style("visibility", "visible")
                .text(d["country_name"] + ": " + (d[selectedCatergory]).toLocaleString() );})
                .on("mousemove", function(){return tooltip.style("top",(d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
                .on("mouseout", function(d){
                    highlight_bargraph_off(d["country_code"], d["mean_bmi"]);
                    reset_opacity();
                    highlight_scatterPlot_off(d["country_code"], d["mean_bmi"]);
                    return tooltip.style("visibility", "hidden");
                });

            // for sorting option
            var sortTimeout = setTimeout(function() {
            d3.select("checkbox").property("checked", true).each(change);
            }, 2000);
            clearTimeout(sortTimeout);

            // copy-on-write since tweens are evaluated after a delay
            var x0 = x.domain(datas[selectedYear][selectedSex].sort(this.checked
                ? function(a, b) { return +b[selectedCatergory] - +a[selectedCatergory]; }
                : function(a, b) { return d3.ascending(a["country_name"], b["country_name"]); })
                .map(function(d) { return d["country_name"]; }))
                .copy();

            // sort bars
            chart.selectAll(".bar")
                .sort(function(a, b) { return x0(a["country_name"]) - x0(b["country_name"]); });

            // set transition duration
            var transition = chart.transition().duration(750),
                delay = function(d, i) { return i * 5; };
            transition.selectAll(".bar")
                .delay(delay)
                .attr("x", function(d) { return x0(d["country_name"]); });
            transition.select(".x.axis")
                .call(xAxis)
              .selectAll("g")
                .delay(delay);
        }
    });
}

// add tooltip
    var tooltip = d3.select("body")
      .append("div")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden");

// draw barchart
drawBarchart();

// highlight bar
function highlight_bargraph_on(country_code){
    var for_select = "#"+ country_code;
    d3.select(for_select)
        .style("margin", "10px 1 px")
        .style('stroke-width' , 2)
        .style('stroke' , "black")
        }
// dehighlight bar
function highlight_bargraph_off(country_code, meanBMI){
        var for_select = "#"+ country_code;
        d3.select(for_select)
            .style("margin", "10px 1 px")
            .style('stroke-width' , 1)
            .style('stroke' , "none")
            }



