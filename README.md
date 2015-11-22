# GroceryStoreSim
Simulation for a Grocery Store following a Queuing Model with 2 stages of queues and servers. Stage 1 follows a single queue - N servers model where customers arrive at the Billing Queue and are served by any of the N servers. Customers serviced by the Billing Servers are pipelined to the 2nd Stage where these customers arrive at the Payment Queue and are serviced by a single payment server. This stage has adopted a Single Queue - Single Server Model.
Input Modeling has been done for the Inter-Arrival Times and Service times (for both Billing and Payment Servers) assuming exponential distributions for the same.
Charts have been provided to compare performance of the system for different inputs of number of customers vs number of billing queues. 

For the Grocery Store simulation, run sms.html on the browser. The files need to be hosted on a server.
Run animate.html for animation of the current simulation.
