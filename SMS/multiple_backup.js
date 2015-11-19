function create_multiple ()
 {
	servers=2;
	server_stat = new Array();
	arrivals = new Array();
	customers = 20;
	service = new Array();
	for (var i = 0; i < servers; i++) {
		server_stat.push(0);
	};
		for (var i = 0; i < customers; i++)
		{
			n = parseInt(Math.random()*10);
			if(i==0)
				arrivals.push(n);
			else
				arrivals.push(arrivals[i-1]+n);
			service.push(parseInt(Math.random()*10));
			if(n==0)
				arrivals[i]=arrivals[i-1]+1;
			if(service[i]==0)
				service[i]=1;
		}
	trial_json = new Array();
	startSimulation();
}

function getTime()
{
	return parseInt(document.getElementById('timer').value);
}

function startSimulation () 
{
	obj = {
			atc:arrivals[0],
			st:service[0],
			tsb:arrivals[0] ,
			tse:service[0]+arrivals[0],
			server:1
		};
	service1=obj.tse;
	service2=0;
	trial_json.push(obj);
	for (var i = 1; i < customers; i++) 
	{
		if(arrivals[i]>=service1)
		{
			tsb_m=arrivals[i];
			obj ={
				atc:arrivals[i],
				st:service[i],
				tsb:tsb_m,
				tse:service[i]+arrivals[i],
				server:1
			};
			trial_json.push(obj);
			service1 = obj.tse;
		}
		else if(arrivals[i]>=service2)
		{
			tsb_m=arrivals[i];
			obj ={
				atc:arrivals[i],
				st:service[i],
				tsb:tsb_m,
				tse:service[i]+arrivals[i],
				server:2
			};
			service2 = obj.tse;
			trial_json.push(obj);
		}
		else
		{
			if(service1 <= service2)
			{
			tsb_m = service1;
			obj ={
				atc:arrivals[i],
				st:service[i],
				tsb:tsb_m,
				tse:service[i]+arrivals[i],
				server:1
			};
			service1 = obj.tse;
			trial_json.push(obj);
			}
			else
			{
			 	tsb_m = service2;
				obj ={
					atc:arrivals[i],
					st:service[i],
					tsb:tsb_m,
					tse:service[i]+arrivals[i],
					server:2
				};
				service2 = obj.tse;
				trial_json.push(obj);
			}
		}
	}
	create_table();
}
function create_table () 
{
	div1 = document.getElementById("div1");
	tab=document.createElement("table");
	tab.border = "1px solid black";
	caption = document.createElement("caption");
	caption.innerHTML = "Simulation for Billing";
	tr = document.createElement("tr");
	td1=document.createElement("td");
	td1.innerHTML="atc";
	td2=document.createElement("td");
	td2.innerHTML="st";
	td3=document.createElement("td");
	td3.innerHTML="tsb";
	td5=document.createElement("td");
	td5.innerHTML="tse";
	td6=document.createElement("td");
	td6.innerHTML="server";
	tr.appendChild(td1);
	tr.appendChild(td2);
	tr.appendChild(td3);
	//tr.appendChild(td4);
	tr.appendChild(td5);
	tr.appendChild(td6);
	//tr.appendChild(td7);
	tab.appendChild(caption);
	tab.appendChild(tr);

	for (var i = 0; i < customers; i++) 
	{
		tr = document.createElement("tr");
		td1=document.createElement("td");
		td1.innerHTML=trial_json[i].atc;
		td2=document.createElement("td");
		td2.innerHTML=trial_json[i].st;
		td3=document.createElement("td");
		td3.innerHTML=trial_json[i].tsb
		td5=document.createElement("td");
		td5.innerHTML=trial_json[i].tse
		td6=document.createElement("td");
		td6.innerHTML=trial_json[i].server;
		tr.appendChild(td1);
		tr.appendChild(td2);
		tr.appendChild(td3);
		//tr.appendChild(td4);
		tr.appendChild(td5);
		tr.appendChild(td6);
		//tr.appendChild(td7);
		tab.appendChild(tr);
	}
	div1.appendChild(tab);
	//document.body.appendChild(div1);
	init();
	arrival_idx_trial = 0;
	service_idx_trial_start = 0;
	service_idx_trial_end = 0;
	populateTrialArrivals();
	populateServiceTrialEnd();
	populateServiceTrialStart();

}

function populateTrialQueue(serverno,obj)
{
	time = checkTimer();
	if(time == obj[arrival_idx_trial]['tsb'])
	{
		if(serverno == 1)
		{

		}
		else
		{
			
		}
	}
	else
		setTimeout(populateTrialQueue,1000);
}

function populateTrialArrivals() 
{
	time = checkTimer();
	arrivals = document.getElementById("arrivals");
	trial1 = document.getElementById("trial_q1");
	trial2 = document.getElementById("trial_q2");
	// console.log(time);
	// console.log(trial_json[arrival_idx_trial]['atc']);
	if(time == trial_json[arrival_idx_trial]['atc'])
	{
		//Add trial arrival animation
		// console.log(trial_json[arrival_idx_trial]['atc']);
		// create the img
		span = document.createElement("span");
		span.id = "c"+trial_json[arrival_idx_trial]+1;
		text = document.createTextNode("C"+trial_json[arrival_idx_trial]+1);
		img = document.createElement("img");
		img.src = "customer.jpg";
		img.height = "75";
		img.width = "75";	
		span.appendChild(img);
		span.appendChild(text);
		arrivals.appendChild(span);
		// place it in the correct queue
		if(trial_json[arrival_idx_trial]['server'] == 1)
		{
			populateTrialQueue(1,trial_json);
		}
		if(trial_json[arrival_idx_trial]['server'] == 2)
		{
			populateTrialQueue(1,trial_json);
		}
		arrival_idx_trial=arrival_idx_trial+1;
	}
	if(arrival_idx_trial < customers)
	{
		ta = setTimeout(populateTrialArrivals,1000);
	}
}
function populateServiceTrialEnd() 
{
	time = checkTimer();
	if(time==trial_json[service_idx_trial_end].tse)
	{
		//Add trial end animation
		service_idx_trial_end+=1;
	}
	if(service_idx_trial_end<customers)
	{
		te = setTimeout(populateServiceTrialEnd,1000);
	}	
}
function populateServiceTrialStart () 
{
	time = checkTimer();
	if(time==trial_json[service_idx_trial_start].tsb)
	{
		//Add payment start animation
		service_idx_trial_start+=1;
	}
	if(service_idx_trial_start<customers)
	{
		ts = setTimeout(populateServiceTrialStart,1000);
	}	
	
}