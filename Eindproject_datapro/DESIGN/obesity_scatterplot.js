/**
Made by: J.C. de Rijcke
10645012

In assignment of: Programmeerproject
last added: 24-1-2017
**/

// place scatterplot in separate function to divide it from the barplot
function drawScatterPlot(){
    // set borders of scatterplot
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 960 - margin.left - margin.right,
        height = 900 - margin.top - margin.bottom;

    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    // set x-axis
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    // set y-axis
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    // set chart plane
    var scatterPlot = d3.select("#scatterplot")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // load data
    d3.json("../DATA/obesity_data.json", function(data) {
    //    console.log("preformatted data in scatterplot:", data[2010])

        // retrieve categories from dropdown menu and link scatterplot
        var dropDownSex = document.getElementById('sex')
        dropDownSex.addEventListener("click", updateScatterPlot);
        var dropDownCategory = document.getElementById('category_scatterplot')
        dropDownCategory.addEventListener("click", updateScatterPlot);

        updateScatterPlot()

        // create scatterplot
        function updateScatterPlot(){
            var dots = scatterPlot.selectAll("*")
            dots.remove()

            var selectedSex = dropDownSex.value

            // create text variable for title use
            var sexText = "to be determined"
            if(selectedSex == "Men"){
                sexText = "male"
            }
            else{
                sexText = "female"
            }

            // for the scatterplot, only the 2010 data is used
            var datas = data[2010][selectedSex]
    //        console.log("data set for the year and sex: ", datas)
            // retrieve category for Y label from dropdown
            var categoryY= dropDownCategory.value
            var categoryX = "mean_bmi"

            // set domains
            x.domain(d3.extent(datas, function(d) {
    //        console.log("in x_domain:",  +d[categoryX]);
            return +d[categoryX]; }));
            y.domain(d3.extent(datas, function(d) {
    //        console.log("in y_domain:",  +d[categoryY]);
            return +d[categoryY]; }));

            // add x-axis
          scatterPlot.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis)
            .append("text")
              .attr("class", "label")
              .attr("x", width)
              .attr("y", -6)
              .style("text-anchor", "end")
              .text("Mean BMI (kg/m2)");

            // variables for tabel texts
            var textLabelY = "to be determined"
            var titleScatter = "to be determined"

            // retrieve titel
            if(dropDownCategory.value == "food_supply"){
                textLabelY = "Food supply in Kcal per person per day"
                titleScatter = "Food supply (Kcal per person per day) against mean " + sexText + " BMI for  per Country in 2010"
            } else if(dropDownCategory.value == "physicial_activity"){
                textLabelY = "Amount of the population that performs insufficient amount of physical activity in %"
                titleScatter = "Percentage of the " + sexText + " population with an insufficient amount of physical activity against mean BMI per Country in 2010"
            } else if(dropDownCategory.value == "fraction_obese"){
                textLabelY = "Fraction obese"
                titleScatter = "Fraction of the " + sexText + "  population that is obese against the mean BMI per Country in 2010"
            } else{
                textLabelY = "Fraction overweight"
                titleScatter = "Fraction of the " + sexText + " population that is overweight against the mean BMI per Country in 2010"
            }

            // add y-axis
          scatterPlot.append("g")
              .attr("class", "y axis")
              .call(yAxis)
            .append("text")
              .attr("class", "label")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text(textLabelY)

            // add title
         scatterPlot.append("g")
        .attr("class", "Title")
               .append("text")
                    .attr("x", (width / 2))
                    .attr("y", 0 - (margin.top / 4))
                    .attr("text-anchor", "middle")
                    .style("font-size", "15px")
                    .text(titleScatter);

            // add dots
          scatterPlot.selectAll(".dot")
              .data(datas)
            .enter().append("circle")
              .attr("class", "dot")
              .attr("r", 3.5)
              .attr("id", function(d) { return d["country_code"]; })
              .attr("x", function(d) { return x(d["country_name"]); })
              .style("fill", function(d){return determineColour(d["mean_bmi"])})
              .attr("cx", function(d) {
                console.log(typeof d[categoryY] == "undefined")
               if(!isNaN(+d[categoryY]) && (+d[categoryY] != 0) && (!isNaN(+d[categoryX])) && (typeof d[categoryY] != "undefined")){
               return x(+d[categoryX]); }})
              .attr("cy", function(d) {
                if(!isNaN(+d[categoryY]) && (+d[categoryY]) != 0 && !isNaN(+d[categoryX]) && (typeof d[categoryY] != "undefined")){
                return y(+d[categoryY]);
                }})
    //          .style("fill", function(d) { return color(d["mean_bmi"])
                .on("mouseover", function(d){
                    console.log("country_code on hover:", d)
                    highlight_bargraph_on(d["country_code"], 1);
                    highlight_country('.datamaps-subunit.'+d["country_code"]);
                    highlight_scatterPlot_on(d["country_code"], 1);
    //            .on("mousemove", function(){
    //            //                return tooltip.style("top",(d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
                })
                .on("mouseout", function(d){
                highlight_bargraph_off(d["country_code"]);
                reset_opacity();
                highlight_scatterPlot_off(d["country_code"]);
    //            return tooltip.style("visibility", "hidden");
                })

        }
    });
}

// draw scatterplot
drawScatterPlot()

// highlight dot in scatterplot
function highlight_scatterPlot_on(country_code){
    var for_select = "circle#"+ country_code;
    d3.select(for_select)
        .attr("r", 7.0)
        .style("margin", "10px 1 px")
        .style('stroke-width' , 3)
        .style('stroke' , "black")
    }

// dehighlight dot in scatterplot
function highlight_scatterPlot_off(country_code, meanBMI){
    var for_select = "circle#"+ country_code;
    d3.select(for_select)
     .attr("r", 3.5)
     .style("margin", "10px 1 px")
     .style('stroke-width' , 1)
    .style('stroke' , "none")
    }