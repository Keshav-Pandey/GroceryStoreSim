function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
function create_multiple ()
{
	servers = parseInt(prompt("Enter number of servers"))
	server_stat = new Array();
	arrivals = new Array();
	customers = parseInt(prompt("Enter number of customers"));
	service = new Array();
	arrivals_q = document.getElementById("arrivals");
	div1 = document.getElementById("div1");
	for (var i = 0; i < servers; i++) 
	{
		server_stat.push(0);
		//create the server images and the divs
		/*
		var snum = i+1;
		var div = document.createElement("div");
		div.id = "trial_q"+snum;
		var span = document.createElement("span");
		span.id = "s"+snum;
		var img = document.createElement("img");
		img.src = "server.png";
		img.height = "75";
		img.width = "75";
		var text = document.createTextNode("Billing Server "+snum);
		span.appendChild(img);
		span.appendChild(text);
		div.appendChild(span);
		document.body.insertBefore(div,div1);
		*/
	}
	var lambda = parseFloat(prompt("Please enter lambda (rate parameter) for IAT"));
	var lambda1 = parseFloat(prompt("Please enter lambda (rate parameter) for ST"));
	for (var i = 0; i < customers; i++)
	{
	    n = Math.random();
	    var x = Math.log(1 - n) / (lambda * -1);
	    var y = Math.log(1 - n) / (lambda1 * -1);
		if(i==0)
			arrivals.push(Math.floor(x));
		else
		    arrivals.push(arrivals[i - 1] + Math.floor(x));
		service.push(Math.ceil(y));
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
			id : 1,
			atc:arrivals[0],
			st:service[0],
			tsb:arrivals[0] ,
			tse:service[0]+arrivals[0],
			server:1
		};
	server_stat[0] = obj.tse;
	trial_json.push(obj);
	flag = 0;
	for (var i = 1; i < customers; i++) 
	{
		if(arrivals[i] < Math.max(server_stat))
		{
			s = server_stat.indexOf(Math.min(server_stat));
			tsb_m=Math.min(server_stat);
				obj ={
					id : i+1,
					atc : arrivals[i],
					st : service[i],
					tsb : tsb_m,
					tse : service[i]+tsb_m,
					server : s+1
				};
				trial_json.push(obj);
				server_stat[s] = obj.tse;
		}
		else
		{
			for (var j = 0; j < server_stat.length; j++) 
			{
				if(arrivals[i] >= server_stat[j])
				{
					tsb_m = arrivals[i];
					obj = {
						id : i+1,
						atc : arrivals[i],
						st : service[i],
						tsb : tsb_m,
						tse : service[i]+arrivals[i],
						server : j+1
					};
					trial_json.push(obj);
					server_stat[j] = obj.tse;
					flag = 1;
					break;
				}
			}
		}
	}
	console.log("************** trial_json ******************");
	console.log(trial_json);
	console.log("************** trial_json ******************");
	init();
	arrival_idx_trial = 0;
	service_idx_trial_start = 0;
	service_idx_trial_end = 0;
	// populateTrialArrivals();
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
	td0=document.createElement("td");
	td0.innerHTML="Cust #";
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
	tr.appendChild(td0);
	tr.appendChild(td1);
	tr.appendChild(td2);
	tr.appendChild(td3);
	//tr.appendChild(td4);
	tr.appendChild(td5);
	tr.appendChild(td6);
	//tr.appendChild(td7);
	tab.appendChild(caption);
	tab.appendChild(tr);

	for (var i = 0; i < customers ; i++) 
	{
		tr = document.createElement("tr");
		td0=document.createElement("td");
		td0.innerHTML= i+1;
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
		tr.appendChild(td0);
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
	// init();
	// arrival_idx_trial = 0;
	// service_idx_trial_start = 0;
	// service_idx_trial_end = 0;
	// populateTrialArrivals();
	// populateServiceTrialEnd();
	// populateServiceTrialStart();

}

// function getPrev(obj,a,serverno)
// {
// 	for(var i=a-1;i>0;i++)
// 	{
// 		if(obj[i]['server'] == serverno)
// 		{
// 			var num = i+1;
// 			prev = document.getElementById("c"+num);
// 			return prev;
// 		}
// 	}
// }

// function populateTrialQueue(serverno,obj,a)
// {	
// 	time = checkTimer();
// 	var num = a+1;
// 	var sindex = serverno-1;
// 	cust = document.getElementById("c"+num);
// 	if(time == obj[a]['tsb'])
// 	{
// 		trial_q[sindex].appendChild(cust);
// 	}
// 	else
// 		setTimeout(populateTrialQueue,1000);
// }

function populateTrialArrivals() 
{
	time = checkTimer();
	trial_q = new Array();
	for(var i=0; i<servers; i++)
	{
		tnum = i+1;
		trial_q[i] = document.getElementById("trial_q"+tnum);
	}
	// console.log(time);
	// console.log(trial_json[arrival_idx_trial]['atc']);
	if(time == trial_json[arrival_idx_trial]['atc'])
	{
		//Add trial arrival animation
		// console.log(trial_json[arrival_idx_trial]['atc']);
		// create the img
		var num = arrival_idx_trial+1;
		var span = document.createElement("span");
		span.id = "c"+num;
		var text = document.createTextNode("C"+num);
		var img = document.createElement("img");
		img.src = "cust.jpe";
		img.height = "75";
		img.width = "75";	
		span.appendChild(img);
		span.appendChild(text);
		arrivals_q.appendChild(span);
		// place it in the correct queue

		populateServiceTrialStart(trial_json[arrival_idx_trial]['server'],trial_json,arrival_idx_trial);
		
		arrival_idx_trial=arrival_idx_trial+1;
	}
	if(arrival_idx_trial < customers)
	{
		ta = setTimeout(populateTrialArrivals,1000);
	}
	if(arrival_idx_trial == customers)
		populateServiceTrialEnd(1,trial_json,customers);
}
function populateServiceTrialStart(serverno,obj,a) 
{
	time = checkTimer();
	var num = a+1;
	var sindex = serverno-1;
	cust = document.getElementById("c"+num);
	if(time == obj[a].tsb)
	{
		//Add payment start animation
		trial_q[sindex].appendChild(cust);
		// service_idx_trial_start+=1;
		populateServiceTrialEnd(serverno,obj,a);
	}
	else
		ts = setTimeout(function(){populateServiceTrialStart(serverno,obj,a);},1000);
}
function populateServiceTrialEnd(serverno,obj,a) 
{
	time = checkTimer();
	var num = a+1;
	var sindex = serverno-1;
	cust = document.getElementById("c"+num);
	if(time==obj[a].tse)
	{
		//Add trial end animation
		// service_idx_trial_end+=1;
		trial_q[sindex].removeChild(cust);
		populatePaymentArrivals(cust);
		
	}
	if(time != obj[a].tse && a < customers)
	{
		te = setTimeout(function(){populateServiceTrialEnd(serverno,obj,a);},1000);
	}
	
}
