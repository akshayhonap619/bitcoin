const nodemailer = require("nodemailer");
const axios = require("axios")
var CronJob = require('cron').CronJob;


  function init(){
    return nodemailer.createTestAccount().then(()=>{
        // create reusable transporter object using the default SMTP transport
     
        let  transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.UNAME, 
                pass: process.env.PASSWORD 
            }
        });
        
         transporter.verify(function(error, success) {
            if (error) {
              console.log(error);
            } else {
              console.log("Server is ready to take our messages");
            }
          });
          return transporter;
});

}

const getBTCRate=()=>{
  return axios.get("https://api.coindesk.com/v1/bpi/currentprice/BTC.json").then(res=>{
      const rate = res.data.bpi.USD.rate
      return rate;
  })
 }


const computeEverything=(transporter)=>{
  getBTCRate().then(rate=>{
    let totalVal =parseFloat(rate.replace(',','')) *7625 / 10968 ;
    let profit = totalVal - 7625
    let percentProfit = profit/7625 * 100;

 let mailOptions = {
    from: process.env.UNAME, // sender address
    to: "remindmemister@gmail.com", // list of receivers
    subject: "BTC : "+rate, // Subject line
    //html: "<b>Fat Fluffy</b>", // html body
    text: `Profit = ${profit} \nTotal = ${totalVal} \n Percent Return = ${percentProfit} 
    `
    
  };

    transporter.sendMail(mailOptions).then((info)=>{
            console.log(info);
  }).catch(err=>{
    console.log(err)
  })


  })
}




init().then(transporter=>{
  //computeEverything(transporter)
  const job = new CronJob('0 * * * * *', function(){
      computeEverything(transporter)
    }, null, true, 'America/New_York');
  job.start()
})