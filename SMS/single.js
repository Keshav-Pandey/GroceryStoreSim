function json_sort(obj)
{
	var obj_arr = obj;
	for(var i=0;i<obj_arr.length;i++)
	{
		for(var j=i;j<obj_arr.length-1;j++)
		{
			if(obj_arr[j].tse > obj_arr[j+1].tse)
			{
				var temp = obj_arr[j];
				obj_arr[j+1] = obj_arr[j];
				obj_arr[j] = temp;
			}
		}
	}
	return obj_arr;
}
function init () 
{
	arrivals_payment = new Array();
	service_payment = new Array();
	id_arr = new Array();
	new_json = json_sort(trial_json);
	console.log("********* new json ********");
	console.log(new_json);
	console.log("********* new json ********");
	var lambda2 = parseFloat(prompt("Please enter lambda (rate parameter) for ST of payment"));
	for (var i = 0; i < new_json.length; i++)
	{
		// console.log(trial_json[i]);
		arrivals_payment.push(new_json[i].tse);
		id_arr.push(new_json[i].id);
		var rnn = Math.random();
		service_payment.push(Math.ceil(Math.log(1 - rnn) / (lambda2 * -1)));

		if(service_payment[i]==0)
			service_payment[i]=1;
	}
	// queue for Payment Arrivals
	/*
	var padiv = document.createElement("div");
	padiv.id = "payment_arr";
	var head = document.createElement("h2");
	head.innerHTML = "Payment Arrivals";
	padiv.appendChild(head);
	document.body.insertBefore(padiv,div1);
	// create the div and payment server img - service
	var div = document.createElement("div");
	div.id = "payment_q";
	var span = document.createElement("span");
	span.id = "spay";
	var img = document.createElement("img");
	img.src = "server.png";
	img.height = "75";
	img.width = "75";
	var text = document.createTextNode("Payment Server");
	span.appendChild(img);
	span.appendChild(text);
	div.appendChild(span);
	document.body.insertBefore(div,div1);
	payment_arr = document.getElementById("payment_arr");
	payment_q = document.getElementById("payment_q");
	*/
	createTable();
}
function createTable()
{
	payment_json = new Array();
	obj = {
		id: id_arr[0],
		atc:arrivals_payment[0],
		st:service_payment[0],
		tsb:arrivals_payment[0] ,
		cwtq:0,
		tse:service_payment[0]+arrivals_payment[0],
		tcss:service_payment[0]
	};
	payment_json.push(obj);
	//alert(payment_json[0].atc);
	 for (var i = 1; i < customers; i++) 
	 {
	 	if(arrivals_payment[i]>payment_json[i-1].tse)
	 	{
	 		tsb=arrivals_payment[i];
	 		cwtq=0;
	 	}
	 	else
	 	{
	 		cwtq = payment_json[i-1].tse-arrivals_payment[i]
	 		tsb=payment_json[i-1].tse;
	 	}

		obj = {
		id: id_arr[i],
		atc:arrivals_payment[i],
		st:service_payment[i],
		tsb:tsb,
		cwtq:cwtq,
		tse:service_payment[i]+tsb,
		tcss:(service_payment[i]+tsb)-arrivals_payment[i],
	};
	payment_json.push(obj);
	}
	arrival_idx=0;
	service_idx_end=0;
	service_idx_start=0;
	// populatePaymentArrivals();
	// populateServicePaymentStart();
	// populateServicePaymentEnd();
	console.log("************** payment_json ******************");
	console.log(payment_json);
	console.log("************** payment_json ******************");
	// startTimer(0);
	$.ajax({
		url : 'writedata.php',
		type : 'post',
		data : {'servers':servers, 'customers':customers, 'trial':trial_json, 'payment':payment_json},
		success : function(data){  console.log(data);},
		error : function(){console.log(" could not write to file");}
	});
	displayTable();
}
function checkTimer() {
	return parseInt(document.getElementById('timer').innerHTML);
}
function populatePaymentArrivals(cust) 
{
	time = checkTimer();
	//alert(time+" "+arrivals[arrival_idx]);
	// if(time==payment_json[arrival_idx].atc)
	// {
	// 	//Add payment arrival animation
	// 	//Add trial arrival animation
	// 	// console.log(trial_json[arrival_idx_trial]['atc']);
	// 	// create the img
	// 	var num = arrival_idx+1;
	// 	var span = document.createElement("span");
	// 	span.id = "c"+num;
	// 	var text = document.createTextNode("C"+num);
	// 	var img = document.createElement("img");
	// 	img.src = "cust.jpe";
	// 	img.height = "75";
	// 	img.width = "75";	
	// 	span.appendChild(img);
	// 	span.appendChild(text);
		var id = cust.id;
		var ind = parseInt(id.split("c")[1])-1;
		payment_arr.appendChild(cust);
		// place it in the correct queue

		populateServicePaymentStart(cust);
		arrival_idx=arrival_idx+1;
	// }
	if(arrival_idx<customers)
	{
		pa = setTimeout(populatePaymentArrivals,1000);
	}
	 if(arrival_idx == customers)
	 	populateServicePaymentEnd();
}
function populateServicePaymentStart(cust1) 
{
	time = checkTimer();
	var id = cust1.id;
	var ind = parseInt(id.split("c")[1])-1;
	// var cust1 = document.getElementById("c"+num);
	if(time==payment_json[ind].tsb)
	{
		//Add payment start animation
		// service_idx_start+=1;
		payment_q.appendChild(cust1);
		// service_idx_trial_start+=1;
		//alert("Service " + id);
		populateServicePaymentEnd(cust1);
	}
	else
	{
		pss = setTimeout(function(){populateServicePaymentStart(cust1);},1000);
	}	
	
}
function populateServicePaymentEnd (cust_end) 
{
	time = checkTimer();
	if(arrival_idx == customers)
	{
		alert("Finished Simulation");
		clearTimeout(t);
		clearTimeout(pa);
		clearTimeout(pss);
		clearTimeout(pse);
		clearTimeout(ta);
		clearTimeout(te);
		clearTimeout(ts);
		// create_table();
		// displayTable();
		//Graph Generation
		var avg_wt = 0;
		var avg_Wt = 0;
		for(var i =0;i<customers;i++)
		{
			avg_wt+=trial_json[i].tsb-trial_json[i].atc;
			avg_Wt+=trial_json[i].tse-trial_json[i].atc;
		}
		avg_wt/=customers;
		avg_Wt/=customers;
		if(localStorage.values)
			localStorage.values = localStorage.values + servers + ":" + avg_wt + "," + avg_Wt + ";";
		else
			localStorage.values = servers + ":" + avg_wt + "," + avg_Wt + ";";
		drawChart();
		alert("Chart Generated");
	}
	else {
		var id = cust_end.id;
		var ind = parseInt(id.split("c")[1])-1;
		if(time==payment_json[ind].tse)
	{
		//Add payment end animation
		// service_idx_end+=1;
		payment_q.removeChild(cust_end);
	}
	
	if(time != payment_json[ind].tse && arrival_idx < customers)
	{
		pse = setTimeout(function(){populateServicePaymentEnd(cust_end);},1000);
	}
	}
}
function displayTable()
{
	div2 = document.getElementById("div2");
	tab=document.createElement("table");
	tab.border = "1px solid black";
	caption = document.createElement("caption");
	caption.innerHTML = "Simulation for Payment";
	tr = document.createElement("tr");
	td0=document.createElement("td");
	td0.innerHTML="Cust #";
	td1=document.createElement("td");
	td1.innerHTML="atc";
	td2=document.createElement("td");
	td2.innerHTML="st";
	td3=document.createElement("td");
	td3.innerHTML="tsb";
	td4=document.createElement("td");
	td4.innerHTML="cwtq";
	td5=document.createElement("td");
	td5.innerHTML="tse";
	td6=document.createElement("td");
	td6.innerHTML="tcss";
	tr.appendChild(td0);
	tr.appendChild(td1);
	tr.appendChild(td2);
	tr.appendChild(td3);
	tr.appendChild(td4);
	tr.appendChild(td5);
	tr.appendChild(td6);
	tab.appendChild(caption);
	tab.appendChild(tr);

	for (var i = 0; i < customers; i++) 
	{
		tr = document.createElement("tr");
		td0=document.createElement("td");
		td0.innerHTML= i+1;
		td1=document.createElement("td");
		td1.innerHTML=payment_json[i].atc;
		td2=document.createElement("td");
		td2.innerHTML=payment_json[i].st;
		td3=document.createElement("td");
		td3.innerHTML=payment_json[i].tsb;
		td4=document.createElement("td");
		td4.innerHTML=payment_json[i].cwtq;
		td5=document.createElement("td");
		td5.innerHTML=payment_json[i].tse;
		td6=document.createElement("td");
		td6.innerHTML=payment_json[i].tcss;
		tr.appendChild(td0);
		tr.appendChild(td1);
		tr.appendChild(td2);
		tr.appendChild(td3);
		tr.appendChild(td4);
		tr.appendChild(td5);
		tr.appendChild(td6);
		tab.appendChild(tr);
	}
	div2.appendChild(tab);
	//document.body.appendChild(div2);
	// arrival_idx=0;
	// service_idx_end=0;
	// service_idx_start=0;
	// populatePaymentArrivals();
	// populateServicePaymentStart();
	// populateServicePaymentEnd();
	// startTimer(0);
}
function startTimer()
{

	timer = document.getElementById('timer');
	if (arguments[0]==0)
		timer.innerHTML = 0;
	else
		timer.innerHTML = parseInt(timer.innerHTML)+1;

	t = setTimeout(startTimer,1000);
}
function resetTimer () 
{
	clearTimeout(t);
	clearTimeout(pa);
	clearTimeout(pss);
	clearTimeout(pse);
	clearTimeout(ta);
	clearTimeout(te);
	clearTimeout(ts);

	div1.innerHTML="";
	div2.innerHTML="";
	timer.innerHTML = 0;
	create_multiple();
	startTimer(0);

}
