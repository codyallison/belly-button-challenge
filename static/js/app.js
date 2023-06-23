function init() {
  var selector = d3.select("#selDataset");
  
  const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
  d3.json(url).then(data => {
    var names = data.names;
    names.forEach(sample => {
        selector.append("option").text(sample).property("value", sample);
    });
    var initsample = names[0];
    createMetadata(data, initsample);
    createChart(data, initsample);
  });
  }
  
  init();

function createMetadata(data, sample) {
  var metadataArray = data.metadata.filter(sampleObj => sampleObj.id == sample);
  var selectedSample = metadataArray[0];
  var metaPanel = d3.select("#sample-metadata");
  metaPanel.html("");
  Object.entries(selectedSample).forEach(([key, value]) => {
    metaPanel.append("h4").text(`${key}: ${value}`);
  });
}

function createChart(data, sample) {
  var samples = data.samples;
  var sampleArray = samples.filter(sampleObj => sampleObj.id == sample);
  var selectedSample = sampleArray[0];
  var otu_ids = selectedSample.otu_ids;
  var otu_labels = selectedSample.otu_labels;
  var sample_values = selectedSample.sample_values;

  var metadataArray = data.metadata.filter(sampleObj => sampleObj.id == sample);
  var wfreq = parseFloat(metadataArray[0].wfreq);
  console.log(wfreq);
  
  // Bar chart
  // Create y labels with "OTU" preceding otu_id ie. OTU 1167
  var yticks = otu_ids.slice(0,10).map(otuId => `OTU ${otuId}`).reverse();
  var barData = [{
      x: sample_values.slice(0,10).reverse(),
      y: yticks,
      type: "bar",
      orientation: "h",
      text: otu_labels.slice(0,10)
  }];
  var barLayout = {
      title: `Subject ID: ${sample} Top 10 OTUs`,
      height: 500,
      width: 500
  };
  Plotly.newPlot("bar", barData, barLayout);

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
    height: 500,
    width: 800
  };
  Plotly.newPlot("bubble", bubbleData, bubbleLayout);
//Guage Chart
  let GAUGE = document.getElementById("gauge");
  var gaugedata = [
  {
    domain: { x: [0, 1], y: [0, 1] },
    value: wfreq,
    title: { text: "Belly Button Washing Frequency" },
    type: "indicator",
    mode: "gauge+number",
    gauge: {
      axis: { 
        range: [null, 10],
        visible: true,
        tickmode:"array",
        tickwidth:2,
        tickvals: ["0-1", "1-2","2-3","3-4","4-5","5-6","6-7","7-8","8-9","9-10"],
        ticks:"inside"},
      steps: [
        { range: [0, 1], color: "#009a60" },
        { range: [1, 2], color: "#4aa84e" },
        { range: [2, 3], color: "#92b73a" },
        { range: [3, 4], color: "#c6bf22" },
        { range: [4, 5], color: "#edbd02" },
        { range: [5, 6], color: "#ffad00" },
        { range: [6, 7], color: "#ff8c00" },
        { range: [7, 8], color: "#fc6114" },
        { range: [8, 9], color: "#f43021" },
        { range: [9, 10], color: "#ed0022" }
      ]
    }
  }
];

var gaugelayout = { 
  width: 500, 
  height: 350,
  margin: { t: 0, b: 0 } };
Plotly.newPlot(GAUGE, gaugedata, gaugelayout);
}

function optionChanged(sample) {
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
d3.json(url).then(data => {
  createMetadata(data, sample);
  createChart(data, sample);
});
}



    