
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const { get } = require("lodash");

const session = require('express-session');
const passport =require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/accountingDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema ({
  name: String,
  userRole: String,
  email: String,
  password: String
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);


passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


let alert = 0;

const bank_accountsSchema = {
  bank_name: String,
  account_name: String,
  account_number: String,
  account_type: String,
  bank_email: String,
  deposited: Number,
  withdrawal: Number,
  balance_amount: Number
}
const bank_Account = mongoose.model("bank_Account", bank_accountsSchema);

const journal_EntrySchema = {
  journalId: Number,
  date: Date,
  reference: String,
  description: String,
  created_at: Date
};
  
const journal_Entry = mongoose.model("journal_Entry", journal_EntrySchema);

const journal1 = new journal_Entry({
  journalId: + 1,
  date: Date.now(),
  reference: "Payment for instalation",
  description: "Payment first before setup",
  created_at: Date.now()
});


const account1 = new bank_Account({
  bank_name: "Arab Bank",
  account_name: "DR. Nasser Abdulghani",
  account_number: "65753213216",
  account_type: "Current Account",
  bank_email: "jhon@arabbank.com",
  deposited: 140300000,
  withdrawal: 0,
  balance_amount: 140300000
});

const account2 = new bank_Account({
  bank_name: "Industrial Credit Bank",
  account_name: "DR. Nasser Abdulghani",
  account_number: "216545432",
  account_type: "Fixed Deposit",
  bank_email: "go@icb.com",
  deposited: 1706000,
  withdrawal: 0,
  balance_amount: 1706000
});

const account3 = new bank_Account({
  bank_name: "Doha bank",
  account_name: "Nafeesa Ahmed",
  account_number: "98198291",
  account_type: "Fusion Account",
  bank_email: "mark@dohabank.com",
  deposited: 17303750,
  withdrawal: 0,
  balance_amount: 17303750
});

const defaultJournalAccount = [journal1];
const defaultBankAccount = [account1,account2,account3];

app.get("/",function(req,res){
  
  if (req.isAuthenticated()){
    res.render("index", {userName: req.user.name, userRole: req.user.userRole});
   }else{
    res.redirect("/sign-in");
   }
});

app.get("/sign-in",function(req,res){
  res.render("sign-in");
  });
  
app.post("/sign-in", function(req, res){
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

 req.login(user, function(err){
  if(err){
    console.log(err);
  }else{
    passport.authenticate("local")(req, res, function(){
      res.redirect("/");
    });
   
  }
 });
});



app.get("/sign-up",function(req,res){
  res.render("sign-up");
  });

app.post("/sign-up", function(req, res){
  User.register({name: req.body.name, userRole: req.body.userRole, username: req.body.username},req.body.password, function(err, user){
    if(err){
      console.log(err);
    }else{
      res.redirect("/users")
    }
  });
});

app.get('/logout', function(req, res){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

app.get("/view-journal",function(req,res){
  res.render("view-journal", {userName: req.user.name, userRole: req.user.userRole});
  });

app.get("/journal-accounts",function(req,res){
  journal_Entry.find({}, function(err, foundItems){
    if (foundItems.length === 0) {
      journal_Entry.insertMany(defaultJournalAccount, function(err){
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully saved default items to DB.");
        }
    });
    res.redirect("journal-accounts");
   } else {
    res.render("journal-accounts", {journalAccounts: foundItems, userName: req.user.name, userRole: req.user.userRole});
  }
  });
  });

app.get("/bank-accounts", function(req,res){

  bank_Account.find({}, function(err, foundItems){
      if (foundItems.length === 0){
      bank_Account.insertMany(defaultBankAccount, function(err){
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully saved default items to DB.");
        }
      });
      res.redirect("bank-accounts");
    } else {
      res.render("bank-accounts", {bankAccount: foundItems, userName: req.user.name, userRole: req.user.userRole, alert: alert});
    alert= 0;
    }
  });
});

app.get("/create-voucher", function(req,res){
res.render("payment-voucher",{userName: req.user.name, userRole: req.user.userRole, alert: alert});
});

app.post("/create-voucher", function(req,res){
const acountID =  req.body.accountID;

  bank_Account.find({_id: accountID}, function(err, foundItems){
    res.render("payment-voucher", {accountID:foundItems._id, bankName: foundItems.bank_name, ownerName: foundItems.acount_name});
  });
});



app.post("/view-journal", function(req,res){
  if (req.isAuthenticated()){
    res.redirect("/view-journal");
  }else{
    res.redirect("/sign-in");
  }

});


app.post("/bank-accounts", function(req, res){
  if (req.isAuthenticated()){
  const bankName = req.body.bankName;
  const ownerName =  req.body.ownerName;
  const accountNumber = req.body.accountNumber;
  const accountType = req.body.accountType;
  const bankEmail = req.body.bankEmail;
  const balanceAmount = parseFloat(req.body.openingBalance);
 

  const account = new bank_Account({
    bank_name: bankName,
    account_name: ownerName,
    account_number: accountNumber,
    account_type: accountType,
    bank_email: bankEmail,
    deposited: balanceAmount,
    withdrawal: 0,
    balance_amount: balanceAmount
  });
  account.save();
  alert = 1;
  res.redirect("/bank-accounts");
  }else{
    res.redirect("/sign-in");
  }
});


app.post("/deleteAccount", function(req,res){
  const accountID =  req.body.deleteAccount;

  bank_Account.findByIdAndRemove(accountID, function(err){
    if (!err) {
      alert=2;
      res.redirect("/bank-accounts");
    }
  });
});

app.post("/viewAccount",function(req, res){
  const accountID = req.body.viewAccount;
  bank_Account.findOne({_id: accountID}, function(err, foundList){
    
    res.render("view-update-account", {accountID:foundList._id ,
      bankName: foundList.bank_name, 
      ownerName: foundList.account_name,
      accountNumber: foundList.account_number,
      accountType: foundList.account_type, 
      bankEmail: foundList.bank_email,
      deposited: foundList.deposited,
      withdrawal:foundList.withdrawal, userName: req.user.name, userRole: req.user.userRole,
      balanceAmount: foundList.balance_amount
      
    });
  });
});



app.get("/view-update-account", function(req,res){
  
    let format = (2500).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
    console.log(format);
    res.render("view-update-account");

});


app.post("/updateAccount", function(req,res){
  const accountID = req.body.accountID;
  const bankName = req.body.bankName;
  const ownerName = req.body.ownerName;
  const accountNumber = req.body.accountNumber;
  const accountType = req.body.accountType;
  const bankEmail = req.body.bankEmail;
  const deposited = req.body.deposited;
  const withdrawal = req.body.withdrawal;
  const balanceAmount = req.body.balanceAmount;


  bank_Account.findOneAndUpdate({_id: accountID},
     {$set: {bank_name: bankName,
      account_name:  ownerName,
      account_number: accountNumber, 
      account_type: accountType, 
      bank_email: bankEmail, 
      deposited: deposited,
      withdrawal: withdrawal,
      balance_amount: balanceAmount }}, function(err, foundList){
    if (!err){
      res.redirect("/bank-accounts");
    }else{
      console.log(err);
    }
  });

});


app.get("/users", function(req, res){
  if (req.isAuthenticated()){

    User.find({}, function(err, foundItems){
      res.render("users", {UsersList: foundItems, userName: req.user.name, userRole: req.user.userRole});
    });

   }else{
    res.redirect("/sign-in");
   }
});





// Serrver setup -------------------------//

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function(){
console.log("Server started successfully.");
});