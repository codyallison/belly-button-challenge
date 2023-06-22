function init() {
  var selector = d3.select("#selDataset");
  
  const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
  d3.json(url).then(data => {
    var names = data.names;
    names.forEach(sample => {
        selector.append("option").text(sample).property("value", sample);
    });
    var initsample = names[0];
    getMetadata(data, initsample);
    getChart(data, initsample);
  });
  }
  
  init();

function getMetadata(data, sample) {
  var metadata = data.metadata;
  var metadataArray = metadata.filter(sampleObj => sampleObj.id == sample);
  var selectedSample = metadataArray[0];
  var PANEL = d3.select("#sample-metadata");
  // Clear PANEL before populating with new data
  PANEL.html("");
  Object.entries(selectedSample).forEach(([key, value]) => {
      PANEL.append("h4").text(`${key}: ${value}`);
  });
}

function getChart(data, sample) {
  var samples = data.samples;
  var sampleArray = samples.filter(sampleObj => sampleObj.id == sample);
  var selectedSample = sampleArray[0];
  var otu_ids = selectedSample.otu_ids;
  var otu_labels = selectedSample.otu_labels;
  var sample_values = selectedSample.sample_values;

  var metadataArray = data.metadata.filter(sampleObj => sampleObj.id == sample);
  var wfreq = metadataArray[0].wfreq;
  
  // Bar chart
  // Create y labels with "OTU" preceding otu_id ie. OTU 1167
  var yticks = otu_ids.slice(0,10).map(otuId => `OTU ${otuId}`).reverse();
  var Data = [{
      x: sample_values.slice(0,10).reverse(),
      y: yticks,
      type: "bar",
      orientation: "h",
      text: otu_labels.slice(0,10)
  }];
  var barLayout = {
      title: `Subject ID: ${sample} Top 10 OTUs`,
      height: 600,
      width: 1200
  };
  Plotly.newPlot("bar", Data, barLayout);
//Bubble chart
var bubbleData = [{
  x: otu_ids,
  y: sample_values,
  mode: "markers",
  marker: {
      size: sample_values,
      color: otu_ids
  },
  text: otu_labels
}];
var bubbleLayout = {
  xaxis: {title: "OTU ID"},
  height: 600,
  width: 1500
};
Plotly.newPlot("bubble", bubbleData, bubbleLayout);
// -------- BUBBLE CHART -------------------------------------
}

function optionChanged(sample) {
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
d3.json(url).then(data => {
  getMetadata(data, sample);
  getChart(data, sample);
});
}



    