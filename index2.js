const axios = require('axios')
const {init} = require('./index')
var CronJob = require('cron').CronJob;

const getRates = async (transporter)=>{
    
    let url = `https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD`;
    const BTC = "BTC : "+ await axios.get(url).then(response=> response.data.USD
    )

     url = `https://min-api.cryptocompare.com/data/price?fsym=ETC&tsyms=USD`;
    const ETC = "ETC : "+await axios.get(url).then(response=> {return response.data.USD}
    )
    await sendEmail(transporter,ETC + "  "+BTC,"")    
}

const createJob = (schedule,callback,transporter)=>{
    return new CronJob(schedule,function(){
        callback(transporter)
    },null,true,'America/New_York')
}

const sendEmail = (transporter, subject, text)=>{
 let mailOptions = {
    from: process.env.UNAME, 
    //to: "remindmemister@gmail.com",
    to: ["remindmemister@gmail.com"],
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
    createJob('0 * * * * *',getRates,transporter).start()
})
