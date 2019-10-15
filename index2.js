const axios = require('axios')
const {init} = require('./index')
var CronJob = require('cron').CronJob;

let DogeRate = undefined
let ETCRate = undefined

const getRates = async (transporter)=>{
    
    let url = `https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD`;
    const BTC = "BTC : "+ await axios.get(url).then(response=> response.data.USD
    )

     url = `https://min-api.cryptocompare.com/data/price?fsym=ETC&tsyms=USD`;
    const ETC = "ETC : "+await axios.get(url).then(response=> {return response.data.USD}
    )

    url = `https://min-api.cryptocompare.com/data/price?fsym=DOGE&tsyms=USD`;
    const DOGE = "DOGE : "+await axios.get(url).then(response=> {return parseFloat(response.data.USD)*100 }
    )
    await sendEmail(transporter,ETC + "  "+BTC," "+DOGE)    
}

const createJob = (schedule,callback,transporter)=>{
    return new CronJob(schedule,function(){
        callback(transporter)
    },null,true,'America/New_York')
}

const sendEmail = (transporter, subject, text)=>{
 let mailOptions = {
    from: process.env.UNAME, 
    to: [process.env.UNAME],
    subject,
    text
  };
    transporter.sendMail(mailOptions).then((info)=>{
            console.log(info);
  }).catch(err=>{
    console.log(err)
  })
}

init().then(transporter=>{
    createJob('0 */30 * * * *',getRates,transporter).start()
})


//Express Bind
const express = require('express');
const app = express();

app.get('/',(req,res)=>{
   res.sendStatus(200);
 })

app.get('/ETC/:rate',(req,res)=>{
  const rate = req.params.rate
  ETCRate = parseFloat(rate)
  res.send(ETCRate+"" )
})

 const port = process.env.PORT || 3000;

 app.listen(port,()=>console.log("Server started on "))
