
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const { get, parseInt } = require("lodash");

const session = require('express-session');
const passport =require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname +"/public"));

app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/accountingDB", {useNewUrlParser: true});

const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema ({
  name: String,
  userRole: String,
  email: String,
  created_at: Date,
  username: String,
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
  balance_amount: Number,
  created_by: String,
  created_at:Date,
  updated_at: Date
}

const bank_account = mongoose.model("bank_account", bank_accountsSchema);

const supplier_accountsSchema = {
  supplier_name: String,
  a_name: String,
  contact_person: String,
  email: String,
  address: String,
  opening_balance: Number,
  beneficiary_name: String,
  beneficiary_address: String,  
  bank_name: String,
  iban_no: String,
  swift_code: String,
  billed: Number,
  paid: Number,
  balance_amount: Number,
  active_status: Number,
  created_by:String,
  created_at:Date,
  updated_at:Date
}

const supplier_account = mongoose.model("supplier_account", supplier_accountsSchema);

const supplier_billSchema = {
  supplier_id: String,
  supplier_name: String,
  bill_number: String,
  bill_date: String,
  documents: String,
  description: String,
  total_payment: Number,
  total_items: String,
  status: String,
  created_by:String,
  created_at:Date,
  updated_at:Date
}

const supplier_bill = mongoose.model("supplier_bill", supplier_billSchema);


let bill_itemSchema = new Schema({
  bill_number: String,
  items: String,
  items_description: String,
  cost_center: String,
  inv_no: String,
  inv_date: String,
  lpo: String,
  items_price:Number,
  items_qty:Number,
  sub_total:Number,
  created_by:String,
  created_at:Date,
  updated_at:Date
});

let bill_item = mongoose.model("bill_item", bill_itemSchema);


const payment_vouchersSchema = {
  payment_voucher_no: String,
  supplier_id: String,
  supplier_name: String,
  payment_from: String,
  bank_id: String,
  payment_mode: String,
  date: String,
  description: String,
  documents: String,
  total_payment: Number,
  amountInWords: String,
  selected_bill_no: Array,
  status: String,
  created_by: String,
  created_at: Date,
  updated_at: Date
}

const payment_voucher = mongoose.model("payment_voucher", payment_vouchersSchema);


let payment_modeSchema = new Schema({
  payment_voucher_no: String,
  cheque_no: String,
  beneficiary_name: String,
  cheque_date: String,
  cheque_status: String,
  cheque_amount: Number
});

let payment_mode = mongoose.model("payment_mode", payment_modeSchema);

const bank_transferSchema = {
  payment_voucher_no: String,
  b_name: String,
  b_address: String,
  payment_from: String,
  bank_name: String,
  iban_no: String,
  swift_code: String,
  transfer_charge: String,
  transfer_purpose: String,
  currency: String,
  amount: Number,
  amountInWords: String,
  transfer_amount: Number
}

const bank_transfer = mongoose.model("bank_transfer", bank_transferSchema);

const chart_of_accountsSchema = {
  name: String,
  code: String,
  created_by: String,
  created_at:Date,
  updated_at:Date
}

const chart_of_account = mongoose.model("chart_of_account", chart_of_accountsSchema);

const cost_centerSchema = {
  cost_center: String,
  code: String,
  created_by: String,
  created_at:Date,
  updated_at:Date
}

const cost_center = mongoose.model("cost_center", cost_centerSchema);

const purpose_transferSchema = {
  purpose: String,
  code: String,
  created_by: String,
  created_at:Date,
  updated_at:Date
}

const purpose_transfer = mongoose.model("purpose_transfer", purpose_transferSchema);

const settingsSchema = {
  name: String,
  prefix: String,
  starting_no: String,
  created_by: String,
  created_at:Date,
  updated_at:Date
}

const settings = mongoose.model("settings", settingsSchema);

const journal_EntrySchema = {
  journalId: Number,
  date: Date,
  reference: String,
  description: String,
  created_at: Date
};
  
const journal_Entry = mongoose.model("journal_Entry", journal_EntrySchema);

const settings1 = new settings({
  name: "bill_settings",
  prefix: "#PUV/2022/",
  starting_no: "100",
  created_by: "Admin",
  created_at: Date.now(),
  updated_at: Date.now()
});

const settings2 = new settings({
  name: "payment_voucher_settings",
  prefix: "#PAV/2022/",
  starting_no: "100",
  created_by: "Admin",
  created_at: Date.now(),
  updated_at: Date.now()
});

const chartOfAccount1 = new chart_of_account({
  name: "Office Stationery",
  code: "101",
  created_by: "Admin",
  created_at: Date.now()
});

const chartOfAccount2 = new chart_of_account({
  name: "Petrol Expenses",
  code: "102",
  created_by: "Admin",
  created_at: Date.now()
});

const chartOfAccount3 = new chart_of_account({
  name: "Repair and Maintenance",
  code: "103",
  created_by: "Admin",
  created_at: Date.now()
});

const chartOfAccount4 = new chart_of_account({
  name: "Vehicle Insurance",
  code: "104",
  created_by: "Admin",
  created_at: Date.now()
});
const chartOfAccount5 = new chart_of_account({
  name: "Life Insurance",
  code: "105",
  created_by: "Admin",
  created_at: Date.now()
});
const chartOfAccount6 = new chart_of_account({
  name: "Ticket & Hotel Booking",
  code: "106",
  created_by: "Admin",
  created_at: Date.now()
});
const chartOfAccount7 = new chart_of_account({
  name: "Travel Insurance",
  code: "107",
  created_by: "Admin",
  created_at: Date.now()
});
const chartOfAccount8 = new chart_of_account({
  name: "Visa",
  code: "108",
  created_by: "Admin",
  created_at: Date.now()
});
const chartOfAccount9 = new chart_of_account({
  name: "Rent for Villa",
  code: "109",
  created_by: "Admin",
  created_at: Date.now()
});
const chartOfAccount10 = new chart_of_account({
  name: "Repair and Maintenance - Villa",
  code: "110",
  created_by: "Admin",
  created_at: Date.now()
});
const chartOfAccount11 = new chart_of_account({
  name: "Repair and Maintenance - Vihicle",
  code: "111",
  created_by: "Admin",
  created_at: Date.now()
});
const chartOfAccount12 = new chart_of_account({
  name: "Repair and Maintenance - Office",
  code: "112",
  created_by: "Admin",
  created_at: Date.now()
});

const journal1 = new journal_Entry({
  journalId: + 1,
  date: Date.now(),
  reference: "Payment for instalation",
  description: "Payment first before setup",
  created_at: Date.now()
});

const supplier1 = new supplier_account({
  supplier_name: "AC supplier",
  a_name: "Arabic Name",
  contact_person: "Mark Go",
  email: "mark@acsupp.com",
  address: "Al Mounsora Doha",
  opening_balance: 521902,
  beneficiary_name: "Al Nakeel",
  beneficiary_address: "Doha City",  
  bank_name: "QNB",
  iban_no: "32CVE234",
  swift_code: "CW4213DWE",
  billed: 0,
  paid: 0,
  balance_amount: 0,
  active_status: 1,
  created_by: "Admin",
  created_at: Date.now(),
  updated_at: Date.now()

});

const supplier2 = new supplier_account({
  supplier_name: "Al Mana Vehicle Parts Supply",
  a_name: "Arabic Name",
  contact_person: "Glen Go",
  email: "glen@amvps.com",
  address: "City Center",
  opening_balance: 7854234,
  beneficiary_name: "Al Abdul Ghani",
  beneficiary_address: "Doha City",  
  bank_name: "CBQ",
  iban_no: "FAW34323",
  swift_code: "5HJR673",
  billed: 0,
  paid: 0,
  balance_amount: 0,
  active_status: 1,
  created_by: "Admin",
  created_at: Date.now(),
  updated_at: Date.now()
});


const account1 = new bank_account({
  bank_name: "Arab Bank",
  account_name: "DR. Nasser Abdulghani",
  account_number: "65753213216",
  account_type: "Current Account",
  bank_email: "jhon@arabbank.com",
  deposited: 10000,
  withdrawal: 0,
  balance_amount: 10000,
  created_by: "Admin",
  created_at: Date.now(),
  updated_at: Date.now()
});

const account2 = new bank_account({
  bank_name: "Industrial Credit Bank",
  account_name: "DR. Nasser Abdulghani",
  account_number: "216545432",
  account_type: "Fixed Deposit",
  bank_email: "go@icb.com",
  deposited: 10000,
  withdrawal: 0,
  balance_amount: 10000,
  created_by: "Admin",
  created_at: Date.now(),
  updated_at: Date.now()
});

const account3 = new bank_account({
  bank_name: "Doha bank",
  account_name: "Nafeesa Ahmed",
  account_number: "98198291",
  account_type: "Fusion Account",
  bank_email: "mark@dohabank.com",
  deposited: 10000,
  withdrawal: 0,
  balance_amount: 10000,
  created_by: "Admin",
  created_at: Date.now(),
  updated_at: Date.now()
});

const defaultChartAccount = [chartOfAccount1,
  chartOfAccount2,
  chartOfAccount3,
  chartOfAccount4,
  chartOfAccount5,
  chartOfAccount6,
  chartOfAccount7,
  chartOfAccount8,
  chartOfAccount9,
  chartOfAccount10,
  chartOfAccount11,
  chartOfAccount12
];
const defaultJournalAccount = [journal1];
const defaultBankAccount = [account1,account2,account3];
const defaultSupplierAccount = [supplier1,supplier2];
const defaultSettings = [settings1,settings2];


app.get("/",(req,res)=>{

      // let dateNow = new Date();
      // let name = "bherth";
      // let userRole = "Admin";
      // let userEmail="b@g.com";
      // let username= "admin";
      // let password="123";
      // User.register({name: name, userRole: userRole, email: userEmail, created_at: dateNow, username: username},password, function(err, user){
      //   if(err){
      //     console.log(err);
      //   }else{
      //    console.log("success.");
      //   }
      // });
  

  if (req.isAuthenticated()){
    payment_voucher.find({}, function(err, foundItem){
      if (err){
        console.log(err);
      }else{
        res.render("index",{voucherItems: foundItem, userName: req.user.name, userRole: req.user.userRole, alert: alert});
      alert=0;
      }
      
    });
    // res.render("index", {userName: req.user.name, userRole: req.user.userRole});
   }else{
    res.redirect("/sign-in");
   }
});

app.get("/sign-in",(req,res)=>{
  res.render("sign-in", {alert: alert});
  });

app.get("/incorrect-sign-in",(req,res)=>{
    alert = 1;
    res.render("sign-in", {alert: alert});
    alert = 0;
    });
  
app.post("/sign-in", (req, res)=>{


      const user = new User({
        username: req.body.username,
        password: req.body.password
      });

    req.login(user, function(err){
      if(err){
        console.log(err);
        
      }else{
        passport.authenticate("local", { failureRedirect: '/incorrect-sign-in'})(req, res, function(){
          res.redirect("/");
        });
      
      }
    });



});

app.get("/sign-up",(req,res)=>{
  res.render("sign-up");
  });

app.post("/sign-up", (req, res)=>{
  if (req.isAuthenticated()){

      let dateNow = Date.now;
      User.register({name: req.body.name, userRole: req.body.userRole, email: req.body.userEmail, created_at: dateNow, username: req.body.username},req.body.password, function(err, user){
        if(err){
          console.log(err);
        }else{
          res.redirect("/users")
        }
      });

  }else{
    res.redirect("/sign-in");
  }
});


app.get('/logout', (req, res)=>{
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

app.get("/view-journal",(req,res)=>{
  if (req.isAuthenticated()){

   res.render("view-journal", {userName: req.user.name, userRole: req.user.userRole});

  }else{
    res.redirect("/sign-in");
  }
  });

app.get("/journal-accounts",(req,res)=>{

    if (req.isAuthenticated()){

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
        
    }else{
      res.redirect("/sign-in");
    }
      
  });

app.get("/bank-accounts", (req,res)=>{
 
  if (req.isAuthenticated()){

      bank_account.find({}, function(err, foundItems){
          if (foundItems.length === 0){
          bank_account.insertMany(defaultBankAccount, function(err){
                supplier_account.insertMany(defaultSupplierAccount, function(err){
                  if (err) {
                    console.log(err);
                  } else {
                    console.log("Successfully saved supplier default items to DB.");
                  }
                });
            if (err) {
              console.log(err);
            } else {
              console.log("Successfully saved bank default items to DB.");
            }
          });
          res.redirect("bank-accounts");
        } else {
          res.render("bank-accounts", {bankAccount: foundItems, userName: req.user.name, userRole: req.user.userRole, alert: alert});
        alert= 0;
        }
      });

    }else{
      res.redirect("/sign-in");
    }
});

app.get("/supplier-accounts", (req,res)=>{
  if (req.isAuthenticated()){

      supplier_account.find({active_status: 1}, function(err, foundItems){
          if (foundItems.length === 0){
        
            supplier_account.insertMany(defaultSupplierAccount, function(err){
                  if (err) {
                    console.log(err);
                  } else {
                    console.log("Successfully saved supplier default items to DB.");
                  }
                });
          res.redirect("supplier-accounts");
        } else {
          res.render("supplier-accounts", {supplierAccount: foundItems, userName: req.user.name, userRole: req.user.userRole, alert: alert});
        alert= 0;
        }
      });

  }else{
    res.redirect("/sign-in");
  }
});

app.get("/create-voucher", (req,res) =>{
  if (req.isAuthenticated()){
    res.render("payment-voucher",{userName: req.user.name, userRole: req.user.userRole, alert: alert});

  }else{
    res.redirect("/sign-in");
  }
});


app.post("/create-voucher", (req,res) =>{
  if (req.isAuthenticated()){

    chart_of_account.find({}, function(err, foundItems){
      if (foundItems.length === 0){
        chart_of_account.insertMany(defaultChartAccount, function(err){
          if (err) {
            console.log(err);
          } else {
            console.log("Successfully saved default items to DB.");
        
          }
        });
      }else{
            const accountID =  req.body.accountID;
            bank_account.findOne({_id: accountID}, function(err, foundItem){
          
              res.render("payment-voucher", {chartAccounts: foundItems, 
                accountID:foundItem._id,
                bankName: foundItem.bank_name, 
                ownerName: foundItem.account_name, 
                userName: req.user.name, 
                userRole: req.user.userRole });
              
            });
      }
    });

  }else{
    res.redirect("/sign-in");
  }
});

app.post("/create-supplier-bill", (req,res) =>{
  if (req.isAuthenticated()){

      chart_of_account.find({}, function(err, chartOfAccount){
        if(err){
          console.log(err);
        }else{
        
          cost_center.find({}, function(err, costCenter){
            if (err){
              console.log(err);
            }else{
            supplier_account.findOne({_id: req.body.accountID}, function(err, foundItem){
              if (err){
                console.log(err);
              }else{
                supplier_bill.find({supplier_id: foundItem._id, status: "Pending"}, function(err, foundBill){
                  if (err){
                    console.log(err);
                  }else{
                  
                    settings.findOne({name: "bill_settings"}, function(err, billSetting){
                      if (err) {
                        console.log(err);
                      }else{
                        let puvno = billSetting.prefix + billSetting.starting_no;
                        res.render("create-supplier-bill", {puvno: puvno, chartAccounts: chartOfAccount, costCenter: costCenter,
                          suppBills: foundBill,
                          accountID:foundItem._id,
                          supplierName: foundItem.supplier_name, 
                          aName: foundItem.a_name, 
                          userName: req.user.name, 
                          userRole: req.user.userRole });
                      }
                    
                    });
                  }
                });
              }
            });

            }
          });
        }
      });

  }else{
    res.redirect("/sign-in");
  }

});

app.post("/pay-supplier-bill", (req,res) =>{
  if (req.isAuthenticated()){

      bank_account.find({}, function(err, foundItems){
        if (foundItems.length === 0){
          bank_account.insertMany(defaultBankAccount, (err)=>{
            if (err) {
              console.log(err);
            } else {
              console.log("Successfully saved default items to DB.");
          
            }
          });
        }else{
          supplier_account.findOne({_id: req.body.accountID}, (err, foundItem)=>{
            if (err){
              console.log(err);
            }else{
              supplier_bill.find({supplier_id: foundItem._id, status: "Pending"}, (err, foundBill)=>{
                if (err){
                  console.log(err);
                }else{
                  settings.findOne({name: "payment_voucher_settings"}, (err, paySetting)=>{
                    if (err) {
                      console.log(err);
                    }else{

                        purpose_transfer.find({}, function(err, purposeItems){
                          if(!err){

                            let pavno = paySetting.prefix + paySetting.starting_no;
                    
                            res.render("pay-supplier-bill", {purposeItems: purposeItems, pavno:pavno, bankAccounts: foundItems,
                              suppBills: foundBill,
                              accountID:foundItem._id,
                              supplierName: foundItem.supplier_name,
                              beneficiaryName: foundItem.beneficiary_name,
                              aName: foundItem.a_name, 
                              userName: req.user.name, 
                              userRole: req.user.userRole });

                          }

                            
                        });
                      }
                    });
                }
              });
            }
          });
        }
      });

    }else{
      res.redirect("/sign-in");
    }

});

app.post("/supplier-billed", (req,res) =>{
  if (req.isAuthenticated()){


      bank_account.findOne({_id: req.body.paymentFrom,}, function(bankerr, foundItem){ 
         
        if (bankerr){
            console.log(bankerr);
          }else{
           
            const  Bank_Name = foundItem.bank_name;
            let Bank_Withdrawal = '' + foundItem.withdrawal;
            let Bank_Deposited = '' + foundItem.deposited;

            
           const payment_amount = +(req.body.totalPayment).split(',').join('');
           
            Bank_Withdrawal = +(Bank_Withdrawal).split(',').join('');
            Bank_Deposited = +(Bank_Deposited).split(',').join('');


            var x =(req.body.totalPayment).split(',').join('');
                x = parseFloat(x)
              x = "" + x
            const totalAmountInWords = toWords(x);
           
            const pay = new payment_voucher({
              payment_voucher_no:  req.body.pavNo,
              supplier_id: req.body.supplierID,
              supplier_name: req.body.supplierName,
              payment_from: Bank_Name,
              bank_id:  req.body.paymentFrom,
              payment_mode:  req.body.paymentMode,
              date: req.body.billDate,
              description:  req.body.description,
              documents: req.body.documents,
              total_payment: payment_amount,
              amountInWords: totalAmountInWords,
              selected_bill_no: req.body.selectedbillNo,
              status: "Pending",
              created_by: req.user.name,
              created_at: Date.now(),
              updated_at: Date.now()
  
            });
            pay.save((err, saved) =>{
            
  
              if(err){
                console.log(err);
              }else{

                supplier_account.findOne({_id: req.body.supplierID,}, function(err, foundSuppItem){ 
                  if (err){
                    console.log(err);
                  }else{

                  

                // -------------------------------> saving payment mode


                      if (req.body.paymentMode === "Bank Transfer"){
                       
                        console.log("Bank Transfer Here")
                        const transfer = new bank_transfer({
                          payment_voucher_no: req.body.pavNo,
                          b_name:  foundSuppItem.beneficiary_name,
                          b_address: foundSuppItem.beneficiary_address,
                          payment_from: Bank_Name,
                          bank_name:  foundSuppItem.bank_name,
                          iban_no: foundSuppItem.iban_no,
                          swift_code: foundSuppItem.swift_code,
                          transfer_charge: req.body.transferCharge,
                          transfer_purpose: req.body.transferPurpose,
                          currency: req.body.curreny,
                          amount: + (req.body.bankAmount).split(',').join(''),
                          amountInWords: req.body.amountInWords,
                          transfer_amount: + (req.body.bankTransferAmount).split(',').join('')
              
                        });
                        transfer.save()

                      }else{

                     
                      
                        let totalItem = +  req.body.numOfItem;
                       
                        if (totalItem === 1) {

                          let cheque = new payment_mode({
                            payment_voucher_no: req.body.pavNo,
                            cheque_no:  req.body.chequeNo,
                            beneficiary_name:  req.body.beneficiaryName,
                            cheque_date:  req.body.chequeDate,
                            cheque_status: req.body.chequeStatus,
                            cheque_amount:  + (req.body.chequeAmount).split(',').join('')
                          });
                          cheque.save(function(err, saved){
                            if(err){
                              console.log(err);
                            }
                          });

                        }else{

                              for (var i = 0; i < totalItem; i++){
                
                              let cheque = new payment_mode({
                                payment_voucher_no: req.body.pavNo,
                                cheque_no:  req.body.chequeNo[i],
                                beneficiary_name:  req.body.beneficiaryName[i],
                                cheque_date:  req.body.chequeDate[i],
                                cheque_status: req.body.chequeStatus[i],
                                cheque_amount:  req.body.chequeAmount[i]
                              });
                              cheque.save(function(err, saved){
                                if(err){
                                  console.log(err);
                                }
                              });
                            }
                          }
                      }
                    }
                  });


                // -------------------------------> updating bank account deposited and withdrawal
                Bank_Withdrawal += payment_amount;
                Bank_Deposited -= payment_amount;


                bank_account.findOneAndUpdate({_id: req.body.paymentFrom},
                  {$set: {
                  deposited: Bank_Deposited,
                  withdrawal: Bank_Withdrawal }}, function(err){
                    if (err){
                      console.log(err);
                    }
                });


                   // -------------------------------> updating supplier account billed and paid
                  supplier_account.findOne({_id: req.body.supplierID,}, function(err, foundItem){ 
                  if (err){
                    console.log(err);
                  }else{
                   
                    let totalBilled = foundItem.billed;
                    let totalPaid = foundItem.paid;

                    totalPaid +=payment_amount;
                    totalBilled -= payment_amount;
  
                      supplier_account.findOneAndUpdate({_id: req.body.supplierID},
                        {$set: {
                        billed: totalBilled,
                        paid: totalPaid }}, function(err){
                          if (err){
                            console.log(err);
                          }
                      });

                    
                
                     // -------------------------------> updating supllier bill status
                      if (parseFloat(req.body.numOfBill) <= 1){
                            
                        supplier_bill.findOneAndUpdate({bill_number: req.body.selectedbillNo},
                          {$set: {status: "Paid" }}, function(err, foundSupBill){
                          
                            if (err){
                              console.log(err);
                            }
                        });

                      }else if (parseFloat(req.body.numOfBill) >= 2){

                        for(var i = 0; i < req.body.selectedbillNo.length; i++){
                        
                          supplier_bill.findOneAndUpdate({bill_number: req.body.selectedbillNo[i]},
                            {$set: {status: "Paid" }}, function(err, foundSupBill){
                           
                              if (err){
                                console.log(err);
                              }
                          });

                         }
                      }
                    }

                  });

                 // -------------------------------> updating setting for payment voucher number
                  settings.findOne({name: "payment_voucher_settings"}, function(err, billSetting){
                
                  let pavno = parseFloat(billSetting.starting_no) + 1;
  
                      settings.findOneAndUpdate({name: "payment_voucher_settings"},
                        {$set: {starting_no:  pavno}}, function(err, foundList){
                      });
                  }); 
  
  
                  alert = 4;
                  res.redirect("supplier-accounts");
                }
            });
            
          }
      });

   
 
  }else{
    res.redirect("/sign-in");
  }
});

app.get("/voucher-item", (req,res) =>{
  if (req.isAuthenticated()){

    payment_voucher.find({}, function(err, foundItems){
      res.render("voucher-items",{voucherItems: foundItems, userName: req.user.name, userRole: req.user.userRole, alert: alert});
    });

  }else{
    res.redirect("/sign-in");
  } 
});

app.post("/voucher-item", (req,res) =>{
  if (req.isAuthenticated()){
   
    payment_voucher.findOne({_id: req.body.accountID}, function(err, foundItem){
      if (err){
        console.log(err);
      }else{
        res.render("voucher-items",{voucherItems: foundItem, userName: req.user.name, userRole: req.user.userRole, alert: alert});
      }
      
    });

  }else{
    res.redirect("/sign-in");
  }
});

app.post("/payment-voucher", (req,res)=>{
  if (req.isAuthenticated()){

      let totalBalance = 0;

      bank_account.findOne({_id: req.body.accountID,}, function(err, foundItem){ 

        totalBalance =  foundItem.balance_amount - req.body.totalPayment ;

        bank_account.findOneAndUpdate({_id: req.body.accountID},
          {$set: {
          withdrawal: req.body.totalPayment,
          balance_amount: totalBalance }}, function(err, foundList){
        });

      });

      const voucher = new payment_voucher({
        bank_id:  req.body.accountID,
        bank_name: req.body.pVbankName,
        voucher_number: "PVR/2022/001",
        payment_mode:  req.body.payment,
        date:  req.body.date,
        documents:  req.body.document,
        description:  req.body.description,
        total_payment: req.body.totalPayment,
        total_items: req.body.numOfAcc,
        status: "Pending",
        account_item: req.body.account,
        account_description: req.body.memo,
        account_amount:req.body.amount,
        created_by: req.user.name,
        created_at: Date.now()
      });
      voucher.save();
      res.redirect("/bank-accounts")

  }else{
    res.redirect("/sign-in");
  }
});

app.post("/supplier-bill", (req,res)=>{
  if (req.isAuthenticated()){

        let totalBilled = 0;
      
       
          supplier_account.findOne({_id: req.body.accountID,}, function(err, foundItem){ 
          if (err){
            console.log(err);
          }else{


          totalBilled = + foundItem.billed;
          
          totalBilled += +(req.body.totalPayment).split(',').join('');
      
           
          supplier_account.findOneAndUpdate({_id: req.body.accountID},
              {$set: {
              billed: totalBilled }}, function(err){
                if (err){
                  console.log(err);
                }
            });
          }
        });

        settings.findOne({name: "bill_settings"}, function(err, billSetting){
        
          let puvno = parseFloat(billSetting.starting_no) + 1;

              settings.findOneAndUpdate({name: "bill_settings"},
                {$set: {starting_no:  puvno}}, function(err, foundList){
              });
          });    

          const totalPayment = + (req.body.totalPayment).split(',').join('');

        const bill = new supplier_bill({
          supplier_id:  req.body.accountID,
          supplier_name: req.body.supplierName,
          bill_number: req.body.puvNo,
          bill_date:  req.body.date,
          documents:  req.body.documents,
          description:  req.body.description,
          total_payment: totalPayment,
          total_items: req.body.numOfItem,
          status: "Pending",
          created_by: req.user.name,
          created_at: Date.now(),
          updated_at: Date.now()
        });
        bill.save( function(err, docs){
          if(err){
            console.log(err);
          }else{

            let totalItem = +  req.body.numOfItem;
       
             if (totalItem == 1){

                  let newitem = new bill_item({
                    bill_number:  req.body.puvNo,
                    items:  req.body.item,
                    items_description: req.body.itemDesc,
                    cost_center:  req.body.costCenter,
                    inv_no:  req.body.invNo,
                    inv_date:  req.body.invDate,
                    lpo:  req.body.lpo,
                    items_price: + (req.body.price).split(',').join(''),
                    items_qty: + (req.body.qty).split(',').join(''),
                    sub_total: +(req.body.total).split(',').join(''), 
                    created_by:  req.user.name,
                    created_at: Date.now(),
                    updated_at: Date.now()
                  });
                  newitem.save(function(err, saved){
                    if(err){
                      console.log(err);
                    }
                  });

             }else{
              
              for (var i = 0; i < totalItem; i++){


                let newitem = new bill_item({
                  bill_number:  req.body.puvNo,
                  items:  req.body.item[i],
                  items_description: req.body.itemDesc[i],
                  cost_center:  req.body.costCenter[i],
                  inv_no:  req.body.invNo[i],
                  inv_date:  req.body.invDate[i],
                  lpo:  req.body.lpo[i],
                  items_price: + (req.body.price[i]).split(',').join(''),
                  items_qty: + (req.body.qty[i]).split(',').join(''),
                  sub_total: +(req.body.total[i]).split(',').join(''), 
                  created_by:  req.user.name,
                  created_at: Date.now(),
                  updated_at: Date.now()
                });
                newitem.save(function(err, saved){
                  if(err){
                    console.log(err);
                  }
                });
              }

             } 
                  
          

          }
        });

        alert = 4;
        res.redirect("/supplier-accounts")

  }else{
    res.redirect("/sign-in");
  }

});

app.post("/view-journal", (req,res)=>{
  if (req.isAuthenticated()){
    res.redirect("/view-journal");
  }else{
    res.redirect("/sign-in");
  }

});

app.get("/view-voucher",(req,res)=>{
  res.render("view-voucher", {userName: req.user.name, userRole: req.user.userRole});
  });

app.post("/view-voucher", (req,res)=>{
  if (req.isAuthenticated()){

    payment_voucher.findOne({payment_voucher_no: req.body.pavNO}, function(errVoucher, foundVoucher){
     
      if(!errVoucher){

          supplier_bill.find({bill_number: { $in: foundVoucher.selected_bill_no}}, function(errBill, foundBills){
            
            if(!errBill){

                console.log(foundVoucher.selected_bill_no);
                console.log(foundBills);
                
                res.render("view-voucher", {foundBills: foundBills, foundItems: foundVoucher,userName: req.user.name, userRole: req.user.userRole});
            
             }else{
              console.log(errVoucher)
             }
          
          });  
              
        }else{
          console.log(errVoucher)
        } 
      
      });
   
  }else{
    res.redirect("/sign-in");
  }

});

app.get("/print-bank-voucher",(req,res)=>{
  res.render("print-bank-voucher", {userName: req.user.name, userRole: req.user.userRole});
  });

app.post("/print-bank-voucher", (req,res)=>{
  if (req.isAuthenticated()){

    bank_transfer.findOne({payment_voucher_no: req.body.pavNO}, function(err, foundItem){
    
      if(!err){
        res.render("print-bank-voucher", {foundItems: foundItem,userName: req.user.name, userRole: req.user.userRole});
      } 
    });

  }else{
    res.redirect("/sign-in");
  }

});


app.post("/bank-accounts", (req, res)=>{
  if (req.isAuthenticated()){
  const bankName = req.body.bankName;
  const ownerName =  req.body.ownerName;
  const accountNumber = req.body.accountNumber;
  const accountType = req.body.accountType;
  const bankEmail = req.body.bankEmail;
  const balanceAmount = + (req.body.openingBalance).split(',').join('');

  const account = new bank_account({
    bank_name: bankName,
    account_name: ownerName,
    account_number: accountNumber,
    account_type: accountType,
    bank_email: bankEmail,
    deposited: balanceAmount,
    withdrawal: 0,
    balance_amount: balanceAmount,
    created_by: req.user.name,
    created_at: Date.now(),
    updated_at: Date.Now()
  });
  account.save();
  alert = 1;
  res.redirect("/bank-accounts");
  }else{
    res.redirect("/sign-in");
  }
});

app.post("/supplier-accounts", (req, res)=>{
  if (req.isAuthenticated()){

    const openingBalance = + (req.body.openingBalance).split(',').join('');

      const account = new supplier_account({
        supplier_name: req.body.supplierName,
        a_name: req.body.arabicName,
        contact_personal: req.body.contactPerson,
        email: req.body.supplierEmail,
        address: req.body.address,
        opening_balance: openingBalance,
        beneficiary_name: req.body.bName,
        beneficiary_address: req.body.bAddress,
        bank_name: req.body.bBankName,
        iban_no: req.body.ibanNo,
        swift_code: req.body.swiftCode,
        billed: 0,
        paid: 0,
        balance_amount: 0,
        active_status: parseInt(req.body.status),
        created_by: req.user.name,
        created_at: Date.now(),
        updated_at: Date.now()
      });
      account.save();
      alert = 1;
      res.redirect("/supplier-accounts");
  }else{
    res.redirect("/sign-in");
  }
});

app.post("/deleteAccount", (req,res)=>{
  if (req.isAuthenticated()){

    const accountID =  req.body.deleteAccount;
    bank_account.findByIdAndRemove(accountID, function(err){
      if (!err) {
        alert=2;
        res.redirect("/bank-accounts");
      }
    });

  }else{
    res.redirect("/sign-in");
   } 
});

app.post("/deleteSupplier", (req,res)=>{
  if (req.isAuthenticated()){

    const accountID =  req.body.deleteAccount;
    supplier_account.findByIdAndRemove(accountID, function(err){
      if (!err) {
        alert=2;
        res.redirect("/supplier-accounts");
      }
    });

  }else{
    res.redirect("/sign-in");
   } 
});

app.post("/viewAccount",(req, res)=>{
  if (req.isAuthenticated()){

    const accountID = req.body.viewAccount;
    bank_account.findOne({_id: accountID}, function(err, foundList){
      
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

  }else{
    res.redirect("/sign-in");
   }
    
});

app.post("/viewSuppplier",(req, res)=>{
  if (req.isAuthenticated()){ 
  
    const accountID = req.body.viewAccount;
    supplier_account.findOne({_id: accountID}, function(err, foundList){
      
      res.render("view-supplier-account", {accountID:foundList._id ,
        supplierName: foundList.supplier_name, 
        arabicName: foundList.a_name,
        contactPerson: foundList.contact_person,
        email: foundList.email, 
        bankEmail: foundList.bank_email,
      userName: req.user.name, userRole: req.user.userRole,
      
        
      });
    });

  }else{
    res.redirect("/sign-in");
   }
});

app.post("/updateAccount", (req,res)=>{

  if (req.isAuthenticated()){

      bank_account.findOneAndUpdate({_id: req.body.accountID},
        {$set: {bank_name:  req.body.bankName,
          account_name:  req.body.ownerName,
          account_number: req.body.accountNumber, 
          account_type:  req.body.accountType, 
          bank_email: req.body.bankEmail, 
          deposited: req.body.deposited}}, function(err, foundList){
        if (!err){
          res.redirect("/bank-accounts");
        }else{
          console.log(err);
        }
      });

  }else{
   res.redirect("/sign-in");
  }   

});

app.post("/updateSupplier", (req,res)=>{

  if (req.isAuthenticated()){

    supplier_account.findOneAndUpdate({_id: req.body.accountID},
      {$set: {supplier_name:  req.body.supplierName,
        a_name:  req.body.arabicName,
        contact_person: req.body.contactPerson, 
        email:  req.body.email,
        address: req.body.address,
        opening_balance: parseFloat(req.body.openingBalance),
        beneficiary_name: req.body.bName,
        beneficiary_address: req.body.bAddress,
        bank_name: req.body.bBankName,
        iban_no: req.body.ibanNo,
        swift_code: req.body.swiftCode,
        active_status: parseInt(req.body.status),
        updated_at: Date.now()
      }}, function(err, foundList){
      if (!err){
        alert=3;
        res.redirect("/supplier-accounts");
      }else{
        console.log(err);
      }
    });

  }else{
    res.redirect("/sign-in");
   }  

});

app.get("/users", (req, res)=>{

  if (req.isAuthenticated()){

    User.find({}, function(err, foundItems){
      res.render("users", {UsersList: foundItems, userName: req.user.name, userRole: req.user.userRole});
    });

   }else{
    res.redirect("/sign-in");
   }
});


//--------------------------------------------------------ACCOUNT LEDGER SETTINGS //
app.get("/master", (req, res)=>{
  if (req.isAuthenticated()){
   
    purpose_transfer.find({}, function(err,  purposeFoundItems){
      cost_center.find({}, function(err,  costFoundItems){
       chart_of_account.find({}, function(err, chartFoundItems){
          res.render("account-ledger", {chartFoundItems: chartFoundItems, purposeFoundItems:purposeFoundItems, costFoundItems: costFoundItems, userName: req.user.name, userRole: req.user.userRole, alert: alert});
          alert=0;
       });
      });
    });
    
   }else{
    res.redirect("/sign-in");
   }
});

app.post("/account-ledger", (req, res) => {
  if (req.isAuthenticated()){
    
    const accountLedger = new chart_of_account({
      name:  req.body.ledgerName,
      code: req.body.ledgerCode,
      created_at: Date.now()
    });
    accountLedger.save();
    alert=1;
    res.redirect("/master");
   
  }else{
    res.redirect("/sign-in");
   }
});

app.post("/deleteAccLedger", (req,res) =>{
  if (req.isAuthenticated()){
      chart_of_account.findByIdAndRemove(req.body.deleteAccount, function(err){
        if (!err) {
          alert=2;
          res.redirect("/master");
        }
      });
 }else{
    res.redirect("/sign-in");
 }
});

app.post("/update-account-ledger", (req,res) => {
  if (req.isAuthenticated()){
    chart_of_account.findOneAndUpdate({_id: req.body.accountID},
      {$set: {name:  req.body.ledgerName,
        code:  req.body.ledgerCode}}, function(err, foundList){
      if (!err){
        alert=3;
        res.redirect("/master");
      }else{
        console.log(err);
      }
    });

  }else{
    res.redirect("/sign-in");
   }

});


//-------------------------------------------------------- COST CENTER SETTINGS //
app.get("/cost-center", (req, res) => {
  if (req.isAuthenticated()){
    purpose_transfer.find({}, function(err,  purposeFoundItems){
     chart_of_account.find({}, function(err, chartFoundItems){
      cost_center.find({}, function(err,  costFoundItems){
        res.render("cost-center", {costFoundItems: costFoundItems,purposeFoundItems:purposeFoundItems, chartFoundItems: chartFoundItems, userName: req.user.name, userRole: req.user.userRole, alert: alert});
        alert=0;
      });
     });
    });
   }else{
    res.redirect("/sign-in");
   }
});

app.post("/add-cost-center", function(req, res){
  if (req.isAuthenticated()){
    const constCenter = new cost_center({
      cost_center:  req.body.costCenter,
      code: req.body.cCcode,
      created_by: req.user.name,
      created_at: Date.now()
    });
    constCenter.save();
    alert=1;
    res.redirect("/cost-center");
   }else{
    res.redirect("/sign-in");
   }
});

app.post("/deleteCostCenter", (req,res)=>{
  cost_center.findByIdAndRemove(req.body.deleteAccount, function(err){
    if (!err) {
      alert=2;
      res.redirect("/cost-center");
    }
  });
});

app.post("/update-cost-center", (req,res)=>{
  if (req.isAuthenticated()){
    
    cost_center.findOneAndUpdate({_id: req.body.accountID},
      {$set: {cost_center:  req.body.costCenter,
        code:  req.body.cCcode}}, function(err, foundList){
      if (!err){
        alert=3;
        res.redirect("/cost-center");
      }else{
        console.log(err);
      }
    });

  }else{
    res.redirect("/sign-in");
   }

});

//-------------------------------------------------------- Purpose Transfer SETTINGS //
app.get("/purpose-transfer", (req, res) => {
  if (req.isAuthenticated()){
    chart_of_account.find({}, function(err, chartFoundItems){
     cost_center.find({}, function(err,  costFoundItems){
        purpose_transfer.find({}, function(err,  purposeFoundItems){
          res.render("bank-transfer-purpose", {purposeFoundItems: purposeFoundItems, costFoundItems: costFoundItems, chartFoundItems: chartFoundItems, userName: req.user.name, userRole: req.user.userRole, alert: alert});
          alert=0;
        });
      });
     });
   }else{
    res.redirect("/sign-in");
   }
});

app.post("/add-purpose-transfer", function(req, res){
  if (req.isAuthenticated()){
    const transPurpose = new purpose_transfer({
      purpose:  req.body.purpose,
      code: req.body.purposeCode,
      created_by: req.user.name,
      created_at: Date.now(),
      updated_at: Date.now()
    });
    transPurpose.save();
    alert=1;
    res.redirect("/purpose-transfer");
   }else{
    res.redirect("/sign-in");
   }
   
});

app.post("/delete-purpose-transfer", (req,res)=>{
  if (req.isAuthenticated()){
    
    purpose_transfer.findByIdAndRemove(req.body.deleteAccount, function(err){
      if (!err) {
        alert=2;
        res.redirect("/purpose-transfer");
      }
    });

  }else{
    res.redirect("/sign-in");
  }
});

app.post("/update-purpose-transfer", (req,res)=>{
  if (req.isAuthenticated()){
    purpose_transfer.findOneAndUpdate({_id: req.body.accountID},
        {$set: {purpose:  req.body.purpose,
          code:  req.body.purposeCode,
          updated_at: Date.now()}}, function(err, foundList){
        if (!err){
          alert=3;
          res.redirect("/purpose-transfer");
        }else{
          console.log(err);
        }
      });
  }else{
    res.redirect("/sign-in");
  }
});


//-------------------------------------------------------- COST SYSTEM SETTINGS //
app.get("/system-settings", (req, res)=>{
  if (req.isAuthenticated()){

    settings.find({}, (err, foundItems)=>{
      if (foundItems.length === 0) {
        settings.insertMany(defaultSettings, err =>{
          if (err) {
            console.log(err);
          } else {
            console.log("Successfully saved default items to DB.");
          }
      });
      res.redirect("system-settings");
     } else {

      settings.findOne({name: "bill_settings"}, (err, billSetting)=>{
        settings.findOne({name: "payment_voucher_settings"}, function(err, PAVSetting){

          res.render("system-settings", {billSetting: billSetting,PAVSetting:PAVSetting, userName: req.user.name, userRole: req.user.userRole, alert: alert});
          alert=0;  
           
         });
      });
     }
    });

   }else{
    res.redirect("/sign-in");
   }
});


app.post("/update-system-settings", (req,res)=>{
  if (req.isAuthenticated()){
    
    settings.findOneAndUpdate({_id: req.body.billID},
      {$set: {prefix:  req.body.billPrefix,
        starting_no:  req.body.billStartingNo}}, (err, billFound)=>{
      if (!err){


        settings.findOneAndUpdate({_id: req.body.payID},
          {$set: {prefix:  req.body.payPrefix,
          starting_no:  req.body.payStartingNo}}, (err2, payFound) =>{
            if (!err2){
              alert=3;
              res.redirect("/system-settings");
            }
          });
      
      }else{
        console.log(err);
      }
    });

  }else{
    res.redirect("/sign-in");
  }
 



});


//----------------------------------------------------------  Serrver setup//

function toWords(s) {

  var th = ['', 'Thousand', 'Million', 'Billion', 'Trillion'];
  var dg = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  var tn = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  var tw = ['Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];


    s = s.toString();
    s = s.replace(/[\, ]/g, '');
    if (s != parseFloat(s)) return 'not a number';
    var x = s.indexOf('.');
	var fulllength=s.length;
	
    if (x == -1) x = s.length;
    if (x > 15) return 'too big';
	var startpos=fulllength-(fulllength-x-1);
    var n = s.split('');
	
    var str = '';
    var str1 = ''; 
    var sk = 0;
    for (var i = 0; i < x; i++) {
        if ((x - i) % 3 == 2) {
            if (n[i] == '1') {
                str += tn[Number(n[i + 1])] + ' ';
                i++;
                sk = 1;
            } else if (n[i] != 0) {
                str += tw[n[i] - 2] + ' ';

                sk = 1;
            }
        } else if (n[i] != 0) {
            str += dg[n[i]] + ' ';
            if ((x - i) % 3 == 0) str += 'Hundred ';
            sk = 1;
        }
        if ((x - i) % 3 == 1) {
            if (sk) str += th[(x - i - 1) / 3] + ' ';
            sk = 0;
        }
    }
    if (x != s.length) {
        
        str += 'and '; 
		 var j=startpos;
		
		 for (var i = j; i < fulllength; i++) {
		 
        if ((fulllength - i) % 3 == 2) {
            if (n[i] == '1') {
                str += tn[Number(n[i + 1])] + ' ';
                i++;
                sk = 1;
            } else if (n[i] != 0) {
                str += tw[n[i] - 2] + ' ';
				
                sk = 1;
            }
        } else if (n[i] != 0) {
		
            str += dg[n[i]] + ' ';
            if ((fulllength - i) % 3 == 0) str += 'Hundred ';
            sk = 1;
        }
        if ((fulllength - i) % 3 == 1) {
		
            if (sk) str += th[(fulllength - i - 1) / 3] + ' ';
            sk = 0;
        }
    }
    }
	var result=str.replace(/\s+/g, ' ');
    return result  + "Riyals Only";
    
	
	
}







let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, ()=>{
console.log("Server started successfully.");
});



