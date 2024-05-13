function init() {
  // Load the data from samples.json
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
   
    // Get the names field
    var names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    var dropdownMenu = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    names.forEach((sample) => {
      dropdownMenu.append("option").text(sample).property("value", sample);
    });

    // Get the first sample from the list
    var firstSample = names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}
function optionChanged(newSample) {
  // Update charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    var metadata = data.metadata;

    // Filter metadata for the selected sample
    var selectedMetadata = metadata.filter((obj) => obj.id === parseInt(sample))[0];

    // Select the panel with id `sample-metadata`
    var metadataPanel = d3.select("#sample-metadata");

    // Clear any existing metadata
    metadataPanel.html("");

    // Loop through each key-value pair in the metadata
    Object.entries(selectedMetadata).forEach(([key, value]) => {
      // Append an HTML tag with the key-value pair to the metadata panel
      metadataPanel.append("p").text(`${key}: ${value}`);
    });
  });
}
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    var samples = data.samples;

    // Filter samples for the selected sample
    var selectedSample = samples.filter((obj) => obj.id === sample)[0];

    // Extract necessary data for charts
    var otuIds = selectedSample.otu_ids;
    var sampleValues = selectedSample.sample_values;
    var otuLabels = selectedSample.otu_labels;

    // Build the Bubble Chart
    var bubbleTrace = {
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: "markers",
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: "Earth"
      }
    };

    var bubbleData = [bubbleTrace];

    var bubbleLayout = {
      // Set layout options for the bubble chart
          title: "Bubble Chart", // Set the chart title
          xaxis: { title: "OTU IDs" }, // Set the x-axis title
          yaxis: { title: "Sample Values" }, // Set the y-axis title
          hovermode: "closest" // Set the hover mode
    };

    // Render the Bubble Chart
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // Build the Bar Chart
    var barTrace = {
      x: sampleValues.slice(0, 10).reverse(),
      y: otuIds.slice(0, 10).map(otuId => `OTU ${otuId}`).reverse(),
      text: otuLabels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
    };

    var barData = [barTrace];

    var barLayout = {
      // Set layout options for the bar chart
        title: "Bar Chart", // Set the chart title
        xaxis: { title: "Sample Values" }, // Set the x-axis title
        yaxis: { title: "OTU IDs" }, // Set the y-axis title
   
    };

    // Render the Bar Chart
    Plotly.newPlot("bar", barData, barLayout);
  });
}
init();
