// require('dotenv-extended').load();
const http = require('http');
const express = require('express');
const app = express();
const config = require('./config')
const request = require('request');


getClientAddress = function (req) {
    return (req.headers['x-forwarded-for'] || '').split(',')[0]
        || req.connection.remoteAddress;
};

getHostIps = function () {
    var os = require('os');
    var ifaces = os.networkInterfaces();
    var ips = "";
    Object.keys(ifaces).forEach(function (ifname) {
        var alias = 0;

        ifaces[ifname].forEach(function (iface) {
            if ('IPv4' !== iface.family || iface.internal !== false) {
                // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                return;
            }
            if (alias >= 1) {
                // this single interface has multiple ipv4 addresses
                console.log(ifname + ':' + alias, iface.address);
                ips += iface.address;
            } else {
                // this interface has only one ipv4 adress
                console.log(ifname, iface.address);
                ips += iface.address;
            }
            ++alias;
        });
    });
    return ips;
}

// Routes
app.get('/ping', function (req, res) {
    console.log('received ping');
	config.requestcount++;
	var statuscode = 200;
	if(config.requestcount >= config.errorrate && config.errorrate > 0){
		statuscode = config.errorcode;
		config.requestcount = 0;
	}
    //res.send('Pong');
	res.status(statuscode).send('Pong ' + statuscode);
});

app.get('/api/whoareu', function (req, res) {
    var clientIP = getClientAddress(req);
    var addresses = getHostIps();
    res.send("I'm ... " + config.color + " running on " + addresses);
});

app.get('/api/cascade', function (req, res) {
    //example for cascadeconfig '[{"ip":"1.1.1.1", "port":"80", "path":"/ping"}, {"ip":"2.2.2.2", "port":"82", "path":"/ping2"}]'
	var cascadeconfig = JSON.parse(config.cascadeconfig);
	var pos = Math.floor(Math.random() * Math.floor(cascadeconfig.length));
	var cc = cascadeconfig[pos];
	console.log("start cascading... " + cc.ip + ":" + cc.port + cc.path)

    var clientIP = getClientAddress(req);
    http.get(
        {
            host: cc.ip,
            path: cc.path,
            port: cc.port
        },
        (resp) => {
            let data = '';
            console.log("Getting data from " + cc.ip);
            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                console.log("data came in... ");
                data += chunk;
            });
			console.log("cascade statusCode: " + resp.statusCode);
            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                console.log("request done ... ");
                res.writeHead(resp.statusCode, { 'Content-Type': 'text/plain' });
                console.log(data);
                res.write(cc.ip + " answered with ... \n\t\t\t\t | \n\t\t\t\t | \n\t\t\t\t |  \n\t\t\t\t v \n" + data);
                res.send();
                console.log("Done");
            });

        }).on('error', (err) => {
            console.log("Error: " + err.message);
        });
});

app.get('/', function (req, res) {
    var clientIP = getClientAddress(req);
    var addresses = getHostIps();
	config.requestcount++;
	var statuscode = 200;
	if(config.requestcount >= config.errorrate && config.errorrate > 0){
		statuscode = config.errorcode;
		config.requestcount = 0;
	}
    tabs = "\t\t";

	var targets="";
	if(config.cascadeconfig.length)
	{
		var cc =  JSON.parse(config.cascadeconfig);
		cc.forEach(function(elem) {
			//console.log(elem);
			targets += "\n<br>-> " + elem.ip + ":" + elem.port + elem.path + ",";
		});
	}
	
	res.writeHead(statuscode, { 'Content-Type': 'text/html' });
    res.end('<html><body bgcolor='+ config.color + '><h1>DebugContainer - '+ statuscode +'</h1>' +
        "<p>Make sure you started this container as described <a href=\"https://github.com/DanielMeixner/DebugContainer\">here</a>. </p>" +
        "<p>You can start this container multiple times locally. Make sure you provide your docker bridge gateway IP as CASCADECONFIG.</p>"+
        
        "<p>Get <a href=\"/api/cascade\">/api/cascade</a> to randomly call:</p>" +
        "Targets:" + targets + "<br><br>" +
        
        "Port=" + tabs + config.port + "<br>" +
        "Color=" + tabs + config.color + "<br>" +
        "ClientIP=" + tabs + clientIP + "<br>" +
        "ServerIP=" + tabs + addresses + "<br>" +
        "myvar=" + tabs + config.myvar + "<br>" +
        
        
        ""
    );
});
app.listen(config.port);
console.log("running & listening on " + config.port)
//console.log(`Running on http://${HOST}:${PORT}`);
