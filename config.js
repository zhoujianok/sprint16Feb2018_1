var config = {};

config.flask = {};
config.mongodb = {};


config.host = "";
config.port = 3010;
//config.flask.endpoint = "http://127.0.0.1:5555";
//config.port = 80;
config.flask.endpoint = "https://sprintoolbox-python1.azurewebsites.net";
config.mongodb.host = "localhost"
config.mongodb.dbname = "LorialTestDB"
config.encryptionKey = "thisissecretkeyforlorealsprint"

config.su_username = "superadmin";
config.su_password = "tisSprs@dmin147";
config.su_contact = "";
config.su_email = "su@loreal.com";

module.exports = config;