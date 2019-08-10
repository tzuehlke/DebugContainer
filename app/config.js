var config = {}

config.port = process.env.MYPORT || 80;
config.color = process.env.COLOR;
config.cascadeconfig = process.env.CASCADECONFIG || "";
config.myvar = process.env.MYVAR;
config.errorrate = process.env.ERRORRATE || 0;
config.errorcode = process.env.ERRORCODE || 404;
config.requestcount = 0;

module.exports = config;