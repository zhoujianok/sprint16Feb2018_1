/*! 
* @license response-size - v0.0.1
* (c) 2013 Julien VALERY https://github.com/darul75/response-size
* License: MIT 
*/
var humanize=require("humanize"),colors=require("colors"),logger=require("tracer").colorConsole({format:"{{timestamp}} {{message}}",dateformat:"HH:MM:ss.L",filters:{trace:colors.magenta,debug:colors.yellow,info:colors.green,warn:colors.red,error:[colors.red,colors.bold]}});module.exports=function(a){return a=a||{enable:!1},function(b,c,d){a.enable&&a.threshold>1&&c.on("finish",function(){var c=this.get("Content-Length");if(c&&c>0){var d=humanize.filesize(parseInt(c,10));a.threshold&&c>a.threshold&&logger.error("HEAVY RESPONSE: %s FOR ROUTE %s",d,b.originalUrl)}}),d()}};