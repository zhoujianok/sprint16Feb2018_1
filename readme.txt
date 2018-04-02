Reset Counters steps:

#1 while runnning the application uncomment the both reset counters statement first time

#2 upload the default file

#3 then stop both the node and python instance

#4 in the second go, comment the 1st user.resetCounter('userid') statement and comment the update statement 
in DataAccess.py resetLogCounter() method

#5 and run bothe the instance