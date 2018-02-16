var humanize = require('humanize');
var colors = require('colors');
var logger = require('tracer').colorConsole({
        format : "{{timestamp}} {{message}}",
        dateformat : "HH:MM:ss.L",
        filters : {            
            trace : colors.magenta,
            debug : colors.yellow,
            info : colors.green,
            warn : colors.red,
            error : [ colors.red, colors.bold ]
        }
    });

module.exports = function responseSize(opts){

  opts = opts || {enable: false};

  return function(req, res, next){

    if (opts.enable && opts.threshold > 1) {

        res.on('finish', function() {

            var size = this.get('content-length');
            if (size && size > 0) {
                var out = humanize.filesize(parseInt(size, 10));
                if (opts.threshold && size > opts.threshold)
                    logger.error('HEAVY RESPONSE: %s FOR ROUTE %s', out, req.originalUrl);
            }
        });

    }

    next();
  };
};