var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.4.1.js';
document.getElementsByTagName('head')[0].appendChild(script); 
var wrapper;
var data;
var seName;
//Convert day to milliseconds.
function daysToMilliseconds(days) {
  return days * 24 * 60 * 60 * 1000;
}
function millisecondsToDays(days) {
  return days / (24 * 60 * 60 * 1000);
}

//Initialize objects and setting.
function Init()
{
	// Initialize ChartWrapper.
	// Problem: DataTable can NOT only have first column data. That say gantt chart can NOT be empty when loading...
	wrapper = new google.visualization.ChartWrapper({
  chartType: 'Gantt',
  dataTable: [['Task ID', 'Task Name', 'Start Date','End Date', 'Duration','Percent Complete','Dependencies'],
              ['EXAMPLE', 'EXAMPLE', new Date(2019, 0, 1),new Date(2019, 0, 5), daysToMilliseconds(4),  100,  null]],
  options: {'height': '275'},
  containerId: 'visualization'
	});

	// Show gantt chart on browser.
	wrapper.draw(chart_div);
	// Link the select(click) event.
	google.visualization.events.addListener(wrapper, 'select', selectHandler);

  data = wrapper.getDataTable();
}

// Load resource from google chart
google.charts.load('current', {'packages':['gantt']});
google.charts.setOnLoadCallback(Init);

// Update the chart.
function Test_Draw()
{
  data = wrapper.getDataTable();
  for(var i = 0; i < data.getNumberOfRows(); i++)
  {
    if("EXAMPLE" === data.getValue(i,0))
    {
      data.removeRow(i);
    }
    //console.log(data.getValue(i,0));
  }
	data = wrapper.getDataTable();
	wrapper.draw(chart_div);
}

// Add new task
function AddTask()
{
  data = wrapper.getDataTable();

  //Get all text data.
  if(document.getElementById("taskName").value == "")
    taskName = null;
  else
  	taskName = document.getElementById("taskName").value;
  if(document.getElementById("startDay").value == "")
    startDay = null;
  else
  	startDay = new Date(document.getElementById("startDay").value);
  if(document.getElementById("endDay").value == "")
    endDay = null;
  else
  	endDay = new Date(document.getElementById("endDay").value);
  if(document.getElementById("duration").value == "")
    duration = 1;
  else
  	duration = document.getElementById("duration").value;
  if(document.getElementById("percentComplete").value == "")
    percentComplete = 0;
  else
  	percentComplete = +document.getElementById("percentComplete").value;
  if(document.getElementById("dependencies").value == "")
    dependencies = null;
  else
    dependencies = document.getElementById("dependencies").value;
	//TODO: Check data table if there any task has same name.

	data.addRow([taskName, taskName,
  startDay, endDay, daysToMilliseconds(duration), percentComplete, dependencies]);
	Test_Draw();
}

// Trigger a select event.
function selectHandler()
{
	var selection = wrapper.getChart().getSelection();
	if(selection.length == 0) return;
 	for(var i = 1; i < 7; i++)
 	{
    if(i == 1)
    {
      seName = data.getValue(selection[0].row,i);
      document.getElementById("taskName2").value = data.getValue(selection[0].row,i);
    }
    else if(i == 2)
    {
      temp = data.getValue(selection[0].row,i);
      if(temp == null)
        document.getElementById("startDay2").value = "";
      else
        document.getElementById("startDay2").value = new Date(Date.parse(temp)).toISOString().substr(0, 10);
    }
    else if(i == 3)
    {
      temp = data.getValue(selection[0].row,i);
      if(temp == null)
        document.getElementById("endDay2").value = "";
      else
        document.getElementById("endDay2").value = new Date(Date.parse(temp)).toISOString().substr(0, 10);
    }
    else if(i == 4)
      document.getElementById("duration2").value = millisecondsToDays(data.getValue(selection[0].row,i));
    else if(i == 5)
      document.getElementById("percentComplete2").value = data.getValue(selection[0].row,i);
    else if(i == 6)
      document.getElementById("dependencies2").value = data.getValue(selection[0].row,i);
 		//console.log(data.getValue(selection[0].row,i));

 		//console.log(typeof(data.getValue(selection[0].row,i)));
  }
}

function DeleteTask()
{
  data = wrapper.getDataTable();
  for(var i = 0; i < data.getNumberOfRows(); i++)
  {
    if(seName === data.getValue(i,0))
    {
      data.removeRow(i);
    }
    //console.log(data.getValue(i,0));
  }
  Test_Draw();
}

function ModifyTask()
{
  DeleteTask();
  data = wrapper.getDataTable();
  if(seName!= "")
  {
		 //Get all text data.
	  if(document.getElementById("taskName2").value == "")
		taskName = null;
	  else
		taskName = document.getElementById("taskName2").value;
	  if(document.getElementById("startDay2").value == "")
		startDay = null;
	  else
		startDay = new Date(document.getElementById("startDay2").value);
	  if(document.getElementById("endDay2").value == "")
		endDay = null;
	  else
		endDay = new Date(document.getElementById("endDay2").value);
	  if(document.getElementById("duration2").value == "")
		duration = 1;
	  else
		duration = document.getElementById("duration2").value;
	  if(document.getElementById("percentComplete2").value == "")
		percentComplete = 0;
	  else
		percentComplete = +document.getElementById("percentComplete2").value;
	  if(document.getElementById("dependencies2").value == "")
		dependencies = null;
	  else
		dependencies = document.getElementById("dependencies2").value;
	  //TODO: Check data table if there any task has same name.

	  data.addRow([taskName, taskName,
	  startDay, endDay, daysToMilliseconds(duration), percentComplete, dependencies]); 
  }

  
  Test_Draw();
}

function DownloadData()
{
  //console.log(data.toJSON());
  downloadObjectAsJson(data.toJSON(),"test");
}

function downloadObjectAsJson(exportObj, exportName){
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
  var downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href",     dataStr);
  downloadAnchorNode.setAttribute("download", exportName + ".json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

function readTextFile(url)
{
	var allText;
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", url, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                allText = rawFile.responseText;
              //  alert(allText);
            }
        }
    }
    rawFile.send(null);
	return allText;
}

function importData(url){
	console.log(document.getElementById("importname").files[0].name);
	var allText = readTextFile(url);
	//console.log(allText);
	allText = JSON.parse(allText);
	//console.log(allText);
	
    wrapper.J = new google.visualization.DataTable(allText);
	//console.log(wrapper);
  Test_Draw();
}


function getObjectURL(file) {  
     var url = null;  
     if (window.createObjcectURL != undefined) {  
         url = window.createOjcectURL(file);  
     } else if (window.URL != undefined) {  
         url = window.URL.createObjectURL(file);  
     } else if (window.webkitURL != undefined) {  
         url = window.webkitURL.createObjectURL(file);  
     }  
	 console.log(url);
	 importData(url);
 }