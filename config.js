var config = {};

config.flask = {};
config.mongodb = {};


config.host = "";
config.port = process.env.PORT || 3000;
config.flask.endpoint = "https://python-webapi.azurewebsites.net";
//config.flask.endpoint = "http://127.0.0.1:5555";
config.mongodb.host = "localhost"
config.mongodb.dbname = "LorialTestDB"
config.encryptionKey = "thisissecretkeyforlorealsprint"

config.su_username = "superadmin";
config.su_password = "superadmin#123";
config.su_contact = "";
config.su_email = "su@loreal.com";

module.exports = config;