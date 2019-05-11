"# aibt-inventory" <br/>
This is a work in  progress, so not yet completed.<br/>
Do the following steps to run web app;<br/>
  install node.js and mqsql;<br/>
  create a database in sql with name aibt<br/>
    synatx: create database aibt;<br/>
  enter into database;<br/>
    syntax: use aibt;<br/>
    now go to project.database and open the databse.js and enter ur mysql username and password<br/>
    var con = mysql.createConnection({<br/>
    host: "localhost",<br/>
    user: "yoursqlusername",         //if you have not set mysql user name type "root"<br/>
    password: "yourmysqlpassword",  //if you have not set mysql password leave it blank ""<br/>
   database:'aibt'<br/>
    });<br/>
    
   open the folder in cmd and type the following<br/>
    syntax: npm install;<br/>
    syantax: node server.js;<br/>
   now minimize the project and return to mysql and type the following<br/>
    syantax:insert into users(id, pass, name,account) values("123","password","name","e");<br/>
   now open the browser and tpe the following<br/>
    http://localhost:3000<br/>
    and its ready;<br/>
