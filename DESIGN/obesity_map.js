/**
Made by: J.C. de Rijcke
10645012

In assignment of: Programmeerproject
last added: 24-1-2017
**/


// dictionary for category and their colour
var colours = {defaultFill: 'black',
          "verylowBMI": '#ffffa0',
          "lowBMI" : "#fed976",
          "average" : "#feb24c",
          "overweight" : "#fd8d3c",
          "obese" : '#fc4e2a'

}


// load data
d3.json("../DATA/obesity_data.json", function(datas) {
    // slider
    var slider = document.getElementById('slider2')
    var dropDown = document.getElementById('sex')

    // add interactivity to dropdown and slider
    slider.addEventListener("click",updateMap)
    dropDown.addEventListener("click", updateMap);

    // selected categories from dropdown
    var selectedYear = slider.value
    var selectedSex = dropDown.value

    // update title
    updateTitle(selectedSex, selectedYear)


//    console.log("loaded dataset, untransformed:", datas["1999"][selectedSex])
    // takes data from loaded data and maults it into a datamap compatible dataset
    var mapDataSet = mapDataFormat(datas, selectedYear, selectedSex, "mean_bmi")

    // create datamap
    var map = new Datamap({
        scope: 'world',
        // get container to fill map with
        element: document.getElementById('infomap'),
        projection: 'mercator',
        height: document.getElementById('infomap').clientHeight,
        maxWidth: 200,
        // colours of categories
        fills: colours,
        data: mapDataSet,
        geographyConfig: {
            dataUrl: null,
            hideAntarctica: true,
            hideHawaiiAndAlaska : false,
            borderWidth: 1,
            borderOpacity: 1,
            borderColor: 'black',
            // popup properties and enablement
            popupTemplate: function(geography, datas) {
            //console.log(geography["properties"]["name"]);
            //console.log(geography.id)
            //console.log(geography.id)
              return ['<div class="hoverinfo"><strong>' + geography["properties"]["name"] + '</strong>',
              '<br/>Mean BMI of the '+ sexTextConverter(selectedSex) + ' population: ' + getData(geography.id).toLocaleString() + ' kg/m2' +'<br/>',
               '</div>'].join('');
            },
            popupOnHover: true,
            highlightOnHover: false,
            highlightFillColor: 'red',
            highlightBorderColor: 'black',
            highlightBorderWidth: 3,
            highlightBorderOpacity: 1,
            },

            done: function(map){
            map.svg.selectAll('.datamaps-subunit').on('mouseenter', function(geo) {
            highlight_bargraph_on(geo.id)
            highlight_scatterPlot_on(geo.id);
            highlight_country(this)

            }),
            map.svg.selectAll('.datamaps-subunit').on('click', function(geo) {
            country_pick(geo.id)
            highlight_country(this)

            }),

            map.svg.selectAll('.datamaps-subunit').on('mouseleave', function(geo) {
            highlight_bargraph_off(geo.id),
            reset_opacity(),
            highlight_scatterPlot_off(geo.id
            ),
            function(d, i) {
                d3.selectAll('path')
                        .style({
                            'fill-opacity':1.0,
                            'highlight': "red"
                        });
                }
            })}


    })

// create legend
map.legend()

    // update datamap
    function updateMap() {
        selectedYear = slider.value;
        selectedSex = dropDown.value
        mapDataSet = mapDataFormat(datas, selectedYear, selectedSex, "mean_bmi")
        map.updateChoropleth(mapDataSet)
        updateTitle(selectedSex, selectedYear)
//        console.log("selected year:", selectedSex)
    }

    function getData(country_id){
        for (country in datas[selectedYear][selectedSex]){
            if(datas[selectedYear][selectedSex][country]["country_code"] == country_id){
                return Number(datas[selectedYear][selectedSex][country]["mean_bmi"]);
            }
        }
   }

// retrieve sex string for right context
   function sexTextConverter(sex){
       var sexText = "to be determined"
       if(selectedSex == "Men"){
           return "male"
       }
       else{
           return "female"
       }
   }
});

// format data to datamap compatible data
function mapDataFormat(data, year, sex, category){
    preDataSet = data[year][sex];
    dataSet = {};
    for(i = 0; i < preDataSet.length; i++){

        var fillValue = correspondingFillKey(+(preDataSet[i][category]), category)
        dataSet[preDataSet[i]["country_code"]] = {"fillKey":fillValue}
    };
    return dataSet
};

// retrieve category for colour
function correspondingFillKey(value, category){
    if(category == "mean_bmi"){
        if(value < 22){
        return "verylowBMI"
        }
        if(value < 24){
        return "lowBMI"
        }
        if(value < 26){
        return "average"
        }
        if(value < 28){
        return "overweight"
        }
        else{
        return "obese"
        }
    }
    else if(category == "fraction_obese"){
        if(value < 15){
        return "verylowBMI"
        }
        if(value < 20){
        return "lowBMI"
        }
        if(value < 25){
        return "average"
        }
        if(value < 30){
        return "overweight"
        }
        else{
        return "obese"
        }
    };
};

// highlight country
function highlight_country(country_id){
    var currentState = country_id
    var thoseStates = d3
            .selectAll('path')[0]
            .filter(function(state) {
                return state !== currentState;
            });
    d3.selectAll(thoseStates)
            .style({
                'fill-opacity':.3
            });
    d3.select(currentState)
            .style({
                'fill-opacity':1.0,
                'stroke-width' : 3,
                'stroke' : "black"
            });
}

// dehighlight country
function reset_opacity(){
    d3.selectAll('path')
    .style({
        'fill-opacity':1.0,
        'stroke-width' : 1,
        'stroke' : "black"
    })
};

// retrieve colour on mean BMI value base
function determineColour(meanBMI){
    if(meanBMI < 18){
        return '#ffffa0'
    }
    else if(meanBMI < 25){
        return "#fed976"
    }
    else if(meanBMI < 30){
        return "#feb24c"
    }
    else{
        return "red"
    }
}

// update title
function updateTitle(sex, year){
    var sexText = "to be determined"
    if(sex == "Men"){
        sexText = "male"
    }
    else{
        sexText = "female"
    }

    d3.select("#title_infomap").selectAll("*").remove()
    d3.select("#title_infomap")
        .attr("class", "Title")
               .append("text")
                    .attr("x", 200)
                    .attr("y", 0)
                    .attr("text-anchor", "middle")
                    .style("font-size", "15px")
                    .text("Average BMI of " + sexText + " population per country in " + year);
}

