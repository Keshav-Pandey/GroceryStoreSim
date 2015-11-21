res = "";
timer = 0;
timeout = 1000;
function init()
{
	// read data from file and populate the globals
	$.ajax({
		url : 'readdata.php',
		type : 'get',
		success : function(data){
			res = JSON.parse(data);
			console.log(res);
			customers = parseInt(res.customers);
			servers = parseInt(res.servers);
			trial_json = res.trial;
			payment_json = res.payment;
			sim_end_time = parseInt(payment_json[payment_json.length-1].tse);
			// console.log(customers);
			// console.log(trial_json);
			console.log(sim_end_time);
			layCanvas();
		},
		error : function(){console.log("could not read data");}
	});
}

function layCanvas()
{
	// draw all billing server images
	for (var i = 0; i < servers; i++) 
	{
		//create the server images and the divs
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
		document.body.appendChild(div);
	}
	// draw the payment arrival queue and server
	var padiv = document.createElement("div");
	padiv.id = "payment_arr";
	var head = document.createElement("h2");
	head.innerHTML = "Payment Arrivals";
	padiv.appendChild(head);
	document.body.appendChild(padiv);
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
	document.body.appendChild(div);
	// get all queues
	arrivals_q = document.getElementById("arrivals");
	trial_q = new Array();
	for(var i=0; i<servers; i++)
	{
		tnum = i+1;
		trial_q[i] = document.getElementById("trial_q"+tnum);
	}
	payment_arr = document.getElementById("payment_arr");
	payment_q = document.getElementById("payment_q");
	animate();
}

function animate()
{
	
	clock = document.getElementById('timer');
	if(timer == 0)
	{
		// start the timer and call the animations
		clock.innerHTML = timer;
		doAnimation();
		timer += 1;
		t = setTimeout(animate,timeout);
	}
	else if(timer !=0 && timer <= sim_end_time)
	{
		// continue with the animations
		clock.innerHTML = timer;
		doAnimation();
		timer += 1;
		t = setTimeout(animate,timeout);
	}
	else
	{
		clearTimeout(t);
		alert("Finished Simulation");
		
	}
	
}

function doAnimation()
{
	populateBillingArrivals();
	beginBilling();
	endBilling();
	populatePaymentArrivals();
	beginPayment();
	endPayment();
}

function populateBillingArrivals()
{
	for(var i=0; i< trial_json.length;i++)
	{
		if(timer == parseInt(trial_json[i].atc))
		{
			// create the customer img and add to arrival queue
			var num = trial_json[i].id;
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
		}
	}
}

function beginBilling()
{
	for(var i=0; i< trial_json.length;i++)
	{
		if(timer == parseInt(trial_json[i].tsb))
		{
			// service the appropriate customer
			var cust_id = trial_json[i].id;
			var cust = document.getElementById("c"+cust_id);
			trial_q[parseInt(trial_json[i].server)-1].appendChild(cust);
		}
	}
}

function endBilling()
{
	for(var i=0; i< trial_json.length;i++)
	{
		if(timer == parseInt(trial_json[i].tse))
		{
			// service the appropriate customer
			var cust_id = trial_json[i].id;
			var cust = document.getElementById("c"+cust_id);
			trial_q[parseInt(trial_json[i].server)-1].removeChild(cust);
		}
	}
}

function populatePaymentArrivals()
{
	for(var i=0; i< payment_json.length;i++)
	{
		if(timer == parseInt(payment_json[i].atc))
		{
			// create the customer img and add to arrival queue
			var num = payment_json[i].id;
			var span = document.createElement("span");
			span.id = "c"+num;
			var text = document.createTextNode("C"+num);
			var img = document.createElement("img");
			img.src = "cust.jpe";
			img.height = "75";
			img.width = "75";	
			span.appendChild(img);
			span.appendChild(text);
			payment_arr.appendChild(span);
		}
	}
}

function beginPayment()
{
	for(var i=0; i< payment_json.length;i++)
	{
		if(timer == parseInt(payment_json[i].tsb))
		{
			// service the appropriate customer
			var cust_id = payment_json[i].id;
			var cust = document.getElementById("c"+cust_id);
			payment_q.appendChild(cust);
		}
	}
}

function endPayment()
{
	for(var i=0; i< payment_json.length;i++)
	{
		if(timer == parseInt(payment_json[i].tse))
		{
			// service the appropriate customer
			var cust_id = payment_json[i].id;
			var cust = document.getElementById("c"+cust_id);
			payment_q.removeChild(cust);
		}
	}
	// t = setTimeout(animate,timeout);
}

function resetTimer () 
{
	timer = 0;
	animate();
}