var mysql = require('mysql');
const fs = require('fs');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "ashika123o",
  database:'aibt'
});

con.connect(function(err) {
   if (err) {
     return console.error('error: ' + err.message);
   }
  console.log("Connected!");
  let users = `create table if not exists users(
                          id int primary key auto_increment,
                          pass varchar(255)not null,
                          name varchar(255) not null,
                          account varchar(15) not null
                      )`;
  let stocks = 'create table if not exists stocks(Item varchar(255) primary key,Quantity int not null, Cost int not null, TotalCost int not null)';
  let logs = 'create table if not exists logs(Item varchar(255) not null,Quantity int not null, Action varchar(255) not null, Date DATETIME not null, EmployeeID varchar(255) not null, Cost int ,Sold int ,Customer varchar(255))';
  con.query(users, function(err, results, fields) {
      if (err) {
            console.log(err.message);
      }
      console.log("created users");
  });
  con.query(stocks, function(err, results, fields) {
      if (err) {
            console.log(err.message);
      }
      console.log("created stocks");
  });
  con.query(logs, function(err, results, fields) {
      if (err) {
            console.log(err.message);
      }
      console.log("created logs");
  });
});

module.exports = {mysql,con,
  verifylogin: (req,res) =>{
    var id=req.body.id;
    var pass=req.body.pass;
    if (id && pass){
        con.query('SELECT * FROM users WHERE id = ? AND pass = ?', [id, pass], function(error, results, fields) {
            if (results.length > 0) {
                req.session.loggedin = true;
                req.session.user = id;
                req.session.user.at=results[0].account;
                res.send('1');
            } else {
                res.send('0');
            }
            res.end();
        });
    } else {
        res.send('Please enter Username and Password!');
        res.end();
    }
  },
  savereciept: (req,res) =>{
    var item=req.body.item;
    var quantity=req.body.quantity;
    var cost=req.body.cost;
    var total=req.body.total;
    var action=req.body.action;
    var customer=req.body.customer;
    var sold=req.body.sold;
    var checkitem;
    var itemdetails;
    var itemcost;
    con.query('select * from stocks where Item = ?',[item],function(error,results,fields){
      // console.log(results);
      if(error){
        console.log(error);
      }
      if(results.length==0){
        checkitem=0;
      }
      else{
        checkitem=1;
        itemdetails=results[0].Quantity;
        itemcost=results[0].Cost;
      }
      processquery();
      soldgoods();
    });
    function processquery(){
      if(action=="new" && checkitem==0){
         con.query('insert into stocks(Item,Quantity,Cost,TotalCost) values(?,?,?,?)',[item,quantity,cost,total],function(error,results,fields){
           if(error){
             console.log(error);
           }
         });
         con.query("insert into logs(Item,Quantity, Action,Date,EmployeeID,Cost) values(?,?,?,?,?,?)",[item,quantity,action,new Date(),req.session.user,cost],function(error,results,fields){
         if(error){
           console.log(error);
         }
         res.send("new item added");
       });

      }else if(action=="new" && checkitem==1){
        res.send("Item already exist");
      }
      else if(action=="update" && checkitem==1){
        con.query('update stocks set Quantity = ? , cost = ? , TotalCost= ? where Item = ?',[quantity,cost,total,item],function(error,results,fileds){
          if(error){
            console.log(error);
          }
        });
          con.query("insert into logs(Item,Quantity, Action,Date,EmployeeID,Cost) values(?,?,?,?,?,?)",[item,quantity,action,new Date(),req.session.user,cost],function(error,results,fields){
          if(error){
            console.log(error);
          }
        });
        res.send("item updated");
      }
      else if(action=="update" && checkitem==0){
      res.send("Item not in stock");
      }
    }
    function soldgoods(){
      if(action=="sold" && checkitem==1){
        if(itemdetails>=quantity){
          con.query('update stocks set Quantity = ? , TotalCost= ? where Item = ?',[(itemdetails-quantity),itemcost*(itemdetails-quantity),item],function(error,results,fileds){
            if(error){
              console.log(error);
            }
          });
            console.log(sold);
            con.query("insert into logs(Item,Quantity, Action,Date,EmployeeID,Sold,Customer) values(?,?,?,?,?,?,?)",[item,quantity,action,new Date(),req.session.user,sold,customer],function(error,results,fields){
            if(error){
              console.log(error);
            }
          });
          res.send("item sold");
        }else{
          res.send("check the quantity of item");
        }
      }
      else if(action=="sold" && checkitem==0){
        res.send("we dont have that item in stock");
      }
    }
  }
};
