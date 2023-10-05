//  Datasource!
var source = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Chart building funtime, all at once!
function buildCharts(sampleId) {
    // Gather data for chart sonstruction...
    d3.json(source).then(data => {
        console.log("Fetched Data:", data);
        // Filter data based on the selected sampleId
        /*
        Format of data...
        metadata: Array
            Object
                age: 24
                bbtype: "I"
                ethnicity: "Caucasian"
                gender: "F"
                id: 940
                location: "Beaufort/NC"
                wfreq: 2
        names: Array
            Object
                just a series of strings and their index
        samples: Array
            Object
                id: "940"
                otu_ids: [1167, 2859, 482, 2264, 41, 1189, 352, 189, 2318, 1977, …]
                otu_labels: ["Bacteria;Bacteroidetes;Bacteroidia;Bacteroidales;Porphyromonadaceae;Porphyromonas"...]
                sample_values: 163
        */
       //  Why not at the beginning with id:0, gotta start somewhere~
        var sampleData = data.samples.filter(sample => sample.id === sampleId)[0];
        //Making a bar chart
        var barData = {
            x: sampleData.sample_values.slice(0, 10).reverse(),
            y: sampleData.otu_ids.slice(0, 10).map(otuId => `OTU ${otuId}`).reverse(),
            text: sampleData.otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h"
        };
        Plotly.newPlot("bar", [barData]);

        // Making a bubble chart
        var bubbleData = {
            x: sampleData.otu_ids,
            y: sampleData.sample_values,
            text: sampleData.otu_labels,
            mode: "markers",
            marker: {
                size: sampleData.sample_values,
                color: sampleData.otu_ids,
                colorscale: "Earth"
            }
        };
        Plotly.newPlot("bubble", [bubbleData]);

        // Making a dial chart
        var weeklyScrubs = data.metadata.filter(meta => meta.id == sampleId)[0].wfreq;
        var dialData = [
            {
                type: "indicator",
                mode: "gauge+number",
                value: weeklyScrubs,
                title: {
                    text: "<b>Belly Button Washing Frequency</b><br><span style='font-size:0.8em;color:gray'>Scrubs per Week</span>",
                    font: { size: 18 }
                },
                gauge: {
                    axis: { range: [null, 9], tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], ticktext: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9", ""],
                            tickmode: "array", tickangle: 45 },
                    bar: { color: "darkblue" },
                    bgcolor: "white",
                    borderwidth: 2,
                    bordercolor: "gray",
                    steps: [
                        { range: [0, 1], color: "rgba(240, 234, 214, 0.7)" }, // Eggshell
                        { range: [1, 2], color: "rgba(238, 246, 220, 0.7)" },
                        { range: [2, 3], color: "rgba(218, 234, 185, 0.7)" },
                        { range: [3, 4], color: "rgba(184, 206, 152, 0.7)" },
                        { range: [4, 5], color: "rgba(158, 201, 154, 0.7)" },
                        { range: [5, 6], color: "rgba(134, 186, 150, 0.7)" },
                        { range: [6, 7], color: "rgba(109, 171, 146, 0.7)" },
                        { range: [7, 8], color: "rgba(78, 157, 143, 0.7)" },
                        { range: [8, 9], color: "rgba(34, 139, 34, 0.7)" } // Forest Green
                    ],
                    needle: {
                        show: true,
                        thickness: 0.5,
                        value: weeklyScrubs,
                        reference: { show: false },
                        relative: false,
                        type: "path"
                    }
                }
            }
        ];

        var dialLayout = {
            width: 400,
            height: 400,
            margin: { t: 25, r: 25, l: 25, b: 25 },
            font: { color: "black", family: "Arial" }
        };

        Plotly.newPlot("gauge", dialData, dialLayout);

    });
    
}

// Function to display sample metadata
function buildMetadata(sampleId) {
    // Fetch metadata from the provided URL
    d3.json(source).then(data => {
        var metadata = data.metadata;
        // Filter metadata based on the selected sampleId
        var resultArray = metadata.filter(meta => meta.id == sampleId);
        var result = resultArray[0];
        // Select the panel with id of `#sample-metadata`
        var metadataPanel = d3.select("#sample-metadata");

        // Clear any existing metadata
        metadataPanel.html("");

        // Display each key-value pair from the metadata JSON object
        Object.entries(result).forEach(([key, value]) => {
            metadataPanel.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });
    });
}
// Function to update all plots and metadata when a new sample is selected
function optionChanged(newSampleId) {
    // Update charts and metadata based on the selected sample ID
    buildCharts(newSampleId);
    buildMetadata(newSampleId);
}

// Function to create the initial layout and charts
function init() {
    // Fetch data and populate dropdown menu
    d3.json(source).then(data => {
        var sampleIds = data.names;

        // Populate the dropdown menu with sample IDs
        var dropdownMenu = d3.select("#selDataset");
        sampleIds.forEach(sampleId => {
            dropdownMenu.append("option").property("value", sampleId).text(sampleId);
        });

        // Initialize charts and metadata with the first sample ID
        var initialSampleId = sampleIds[0];
        buildCharts(initialSampleId);
        buildMetadata(initialSampleId);
    });
}

// Gotta initialize it somewhere
init();