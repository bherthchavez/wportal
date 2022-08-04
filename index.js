const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const { get } = require("lodash");

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/accountingDB", {useNewUrlParser: true});



const bank_accountsSchema = {
  bank_name: String,
  account_number: String,
  account_type: String,
  bank_address: String,
  current_balance: Number
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
  account_number: "65753213216",
  account_type: "Current Account",
  bank_address: "Doha",
  current_balance: 140300000
});

const account2 = new bank_Account({
  bank_name: "Industrial Credit Bank",
  account_number: "216545432",
  account_type: "Fixed Deposit",
  bank_address: "Doha",
  current_balance: 1706000
});

const account3 = new bank_Account({
  bank_name: "Doha bank",
  account_number: "98198291",
  account_type: "Fusion Account",
  bank_address: "Doha",
  current_balance: 17303750
});

const defaultJournalAccount = [journal1];
const defaultBankAccount = [account1,account2,account3];

app.get("/",function(req,res){
res.render("index");
});

app.get("/view-journal",function(req,res){
  res.render("view-journal");
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
    res.render("journal-accounts", {journalAccounts: foundItems});
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
      res.render("bank-accounts", {bankAccount: foundItems});
    }
  });
});

app.post("/view-journal", function(req,res){
res.redirect("/view-journal");
});


app.post("/bank-accounts", function(req, res){
 
  const bankName = req.body.bankName;
  const accountNumber = req.body.accountNumber;
  const accountType = req.body.accountType;
  const currentBalanace = parseFloat(req.body.currentBalance);
  const bankAddress = req.body.bankAddress;

  const account = new bank_Account({
    bank_name: bankName,
    account_number: accountNumber,
    account_type: accountType,
    bank_address: bankAddress,
    current_balance: currentBalanace
  });
  account.save();
  res.redirect("/bank-accounts");
})


app.post("/deleteAccount", function(req,res){
  const accountID =  req.body.deleteAccount;

  bank_Account.findByIdAndRemove(accountID, function(err){
    if (!err) {
      res.redirect("/bank-accounts");
    }
  });
});

app.post("/viewAccount",function(req, res){
  const accountID = req.body.viewAccount;
  bank_Account.findOne({_id: accountID}, function(err, foundList){
    
    res.render("view-update-account", {accountID:foundList._id ,
      bankName: foundList.bank_name, 
      accountNumber: foundList.account_number,
      accountType: foundList.account_type, 
      currentBalance: foundList.current_balance,
      bankAddress: foundList.bank_address});
  });
});



app.get("/view-update-account", function(req,res){
  
  let format = (2500).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  console.log(format);
  res.render("view-update-account");
})


app.post("/updateAccount", function(req,res){
  const accountID = req.body.accountID;
  const bankName = req.body.bankName;
  const accountNumber = req.body.accountNumber;
  const accountType = req.body.accountType;
  const currentBalance = req.body.currentBalance;
  const bankAddress = req.body.bankAddress;
  
  bank_Account.findOneAndUpdate({_id: accountID},
     {$set: {bank_name: bankName, 
      account_number: accountNumber, 
      account_type: accountType, 
      bank_address: bankAddress, 
      current_balance: currentBalance }}, function(err, foundList){
    if (!err){
      res.redirect("/bank-accounts");
    }else{
      console.log(err);
    }
  });

});







// Serrver setup -------------------------//

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function(){
console.log("Server started successfully.");
});