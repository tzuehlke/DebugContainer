Fork of: https://github.com/DanielMeixner/DebugContainer

Parameters:
* COLOR: sets background color for call /. Example: green
* ERRORRATE: sets the number of calls who fails with the configured error-code. Was used in the calls / and /ping, not at the call /api/whoareu. The /api/cascade call will return the response code from the defined called, therefore if the cascade call return 404 the defined cascade call returns 404. Example: 8
* ERRORCODE: the response code that should be returned each ERRORRATE call. Example: 404
* CASCADECONFIG: the JSON configuration of the calls. If multiple configuration are applied, the called service will be randomly selected. Example: [{"ip":"172.17.0.2","port":"80","path":"/"},{"ip":"172.17.0.3", "port":"80", "path":"/ping"}]

Calls:
* /: shows some debug info and the statuscode
* /ping: responds with pong and statusocde
* /api/whoareyou: responses with the color and the IP
* /api/cascade --> calls one of the given services in the CASCADECONFIG

Setup an Environment:
```
docker run -p 8083:80 -e COLOR=red -e ERRORRATE=4 -e ERRORCODE=405 tzuehlke/dbgc
docker run -p 8082:80 -e COLOR=tomato -e ERRORRATE=8 -e ERRORCODE=404 tzuehlke/dbgc
docker run -p 8081:80 -e COLOR=yellow -e CASCADECONFIG='[{"ip":"172.17.0.2","port":"80","path":"/"},{"ip":"172.17.0.3", "port":"80", "path":"/ping"}]' tzuehlke/dbgc
docker run -p 8080:80 -e COLOR=green -e CASCADECONFIG='[{"ip":"172.17.0.4","port":"80","path":"/api/cascade"}]' tzuehlke/dbgc
```
that looks like this:
![DebugContainer-Overview](https://user-images.githubusercontent.com/32843441/62822286-71724400-bb81-11e9-9c0b-59fe58dd39a8.png)
