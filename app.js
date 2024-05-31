url = 'https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json'

let data = d3.json(url).then(function(data){
    console.log(data)
});

//Create function to initialize dashboard at startup
function init () {
    //Select dropdown menu with D#
    dropdown = d3.select("#selDataset");
    //Populate dropdown menu with id's
    d3.json(url).then(function(data) {
        let sampleNames = data.names;
        //Iterate through array and append each name
        sampleNames.forEach((name) => {
            //Print in console to check
            //console.log(name)
            //Append each value to create dropdown menu
            dropdown.append("option")
            .text(name)
            .property("value", name);
        });

            //Call first sample from list
            firstSample = sampleNames[0]
            //console.log(firstSample)

            //Call first plots to initialize
            buildBarPlot(firstSample);
            buildBubblePlot(firstSample);
            buildMetadata(firstSample);
    });

};

init()

//Create function to build metadata panel
function buildMetadata (sampleID) {
    //Call json data
    d3.json(url).then(function(data) {
        metadata = data.metadata;

        //Filter data to get values for each sample
        sampleArray = metadata.filter(sample => sample.id == sampleID);
        //Set first object in sample array to variable
        sample = sampleArray[0];

        //Select panel from html and set to variable
        panel = d3.select("#sample-metadata");
        panel.html("");
        //Loop through each key and append data to panel
        for (key in sample) {
            panel.append("h6").text(key.toUpperCase()+": "+sample[key])
        }
    })
}

//Function that builds bar plot
function buildBarPlot (sampleID) {
    d3.json(url).then(function(data) {
        samples = data.samples;

    //Filter data to get values for each sample
    sampleArray = samples.filter(sample => sample.id == sampleID);
    sample = sampleArray[0];
    
    //Assign variables to sample values
    otu_ids = sample.otu_ids
    sample_values = sample.sample_values
    otu_labels = sample.otu_labels
    
    //Set variable for plot values
     trace1 = [
        {x: sample_values.slice(0,10).reverse(),
        y: otu_ids.slice(0,10).map(otu_id => "OTU "+otu_id).reverse(),
        text: otu_labels.slice(0,10).reverse(),
        type:"bar",
        orientation:"h" }
    ];
    //Define layout
    layout = {
        title:""
    };

    //Call Plotly to plot 
    Plotly.newPlot("bar", trace1, layout)

    });

};

//Function that builds bubble plot
function buildBubblePlot (sampleID) {
    d3.json(url).then(function(data) {
        samples = data.samples;

    //Filter data to get values for each sample
    sampleArray = samples.filter(sample => sample.id == sampleID);
    sample = sampleArray[0];
    
    //Assign variables to sample values
    otu_ids = sample.otu_ids
    sample_values = sample.sample_values
    otu_labels = sample.otu_labels
    
    //Set variable for plot values
     trace2 = [
        {x: otu_ids,
         y: sample_values,
         text: otu_labels,
         mode:"markers",
         marker:{
            size: sample_values, 
            color: otu_ids,
            colorscale: "Earth"
         }
         
        }];

    //Define layout
    layout = {
        xaxis: {title:"OTU ID"}
    };
    //Call Plotly to plot
    Plotly.newPlot("bubble", trace2, layout)

    });
};

//Function that updates plots on change
function optionChanged(sampleID) {
    buildMetadata(sampleID);
    buildBarPlot(sampleID);
    buildBubblePlot(sampleID);
};