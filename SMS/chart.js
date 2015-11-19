function drawChart() {alert(localStorage.values);
        var test = Array();
        test[0]= ['Servers', 'Average Waiting Time' , 'Average Time Spent'];
        if(localStorage.values!="")
        {
                tdata = localStorage.values.split(";");
                for(var i =0;i<tdata.length-1;i++)
                {
                        test[i+1] = [parseInt(tdata[i].split(":")[0]),parseFloat(tdata[i].split(":")[1].split(",")[0]),parseFloat(tdata[i].split(":")[1].split(",")[1])];
                }
                var data = google.visualization.arrayToDataTable(test);
                var options = {
                  title: 'Billing Performance',
                  curveType: 'function',
                  legend: { position: 'bottom' }
                };
                var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
                chart.draw(data, options);
        }
      }
 function resetChart()
 {
         if(localStorage.values)
         {
                localStorage.values="";
                alert("Chart Data Refreshed");
         }
 }