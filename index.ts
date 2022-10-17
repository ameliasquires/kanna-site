import { readFileSync, writeFileSync } from "fs"
import { LogLevel } from "node-ts";
var privateKey  = readFileSync('certs/selfsigned.key', 'utf8');
var certificate = readFileSync('certs/selfsigned.crt', 'utf8');
var http = require('http');
var https = require('https');
const express = require('express')
const app = express()
import { Sequelize, Model, DataTypes } from 'sequelize';
//const port = 8008
const fs = require('fs')
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const NodeRSA = require('node-rsa');
var ip = require("ip")
var crypt = require('crypto');
Object.defineProperty(global, '__stack', {
  get: function() {
          var orig = Error.prepareStackTrace;
          Error.prepareStackTrace = function(_, stack) {
              return stack;
          };
          var err = new Error;
          Error.captureStackTrace(err, arguments.callee);
          var stack = err.stack;
          Error.prepareStackTrace = orig;
          return stack;
      }
  });
  
  Object.defineProperty(global, '__line', {
  get: function() {
          // @ts-ignore
          return __stack[1].getLineNumber();
      }
  });
  
  Object.defineProperty(global, '__function', {
  get: function() {
    // @ts-ignore
          return __stack[1].getFunctionName();
      }
  });


const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'data/user.sqlite'
});
  let User=sequelize.define('user',{
    "html":DataTypes.BOOLEAN,
    "name":DataTypes.TEXT,
    "hash":DataTypes.TEXT,
    "sudo":DataTypes.BOOLEAN,
    "last_login":DataTypes.TEXT,
    "alias":DataTypes.TEXT,
    "login_key":DataTypes.TEXT,
    "mail":DataTypes.TEXT
})

//User.sync({ force: true })
User.sync({ alter: true }).then(()=>{
  //User.create(
    //{"html":false,"name":"root","hash":"OTVYg/fHYeVbtyrusPl8fV+zQcp1ImjzbP+3Cy+3lk14fl2icYhzlULKtbTpOx4E","sudo":true,"last_login":"","alias":"root","login_key":"Pqx5y5fKHNu7APUOt1t1n+zUGwWos+iLpxH2Z/LzFKw57l/GPy3GSN/WK1iXDKcm","mail":"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"}
  //)
})
  /*
sequelize.authenticate().then(async()=>{
  let User=sequelize.define('user',{
    name:DataTypes.TEXT
  })
  await User.sync({ force: true })
  const user = await User.create({ name: 'SuperUser123' })
  user.save()
  const users = await User.findAll();
  console.log(JSON.stringify(users))
})
*/
const IV = "5183666c72eec9e4"; //!increase size eventually
var encrypt = ((val:any,ENC_KEY:any) => {
  let cipher = crypt.createCipheriv('aes-256-cbc', ENC_KEY, IV);
  let encrypted = cipher.update(val, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
});
var decrypt = ((encrypted:any,ENC_KEY:any) => {
  try{
  let decipher = crypt.createDecipheriv('aes-256-cbc', ENC_KEY, IV);
  let decrypted = decipher.update(encrypted, 'base64', 'utf8');
  return (decrypted + decipher.final('utf8'));
  } catch(err){
    return false;
  }
});
//
function log(m:any){
  var date = new Date;
  let e:any = new Error();
  let frame = e.stack.split("\n")[2]; // change to 3 for grandparent func
  let lineNumber = frame.split(":").reverse()[1];
  let functionName = frame.split(" ")[5];
  console.log('['+functionName+'/'+lineNumber+'][./index.ts]'+'['+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()+'] ' + m.toString())
}
function d(){
  var date = new Date;
  return(date.getHours()+''+date.getMinutes()+''+date.getSeconds())

}
interface keyring{
  [sid: string]: {
    mypub:string,
    theirpub:string,
    mypriv:string,
  },
 }
let keyring = {} as keyring
let key:any;
var ImapClient = require('emailjs-imap-client').default

app.post('/mail/get/update',async(req:any,res:any)=>{
  const key = new NodeRSA({b: 1024})

  key.importKey(keyring[req.body.sid].mypriv,'pkcs1-private')
  let dec:any = JSON.parse((atob(key.decrypt(req.body.data,'base64','base64'))))
  //console.log(key)
  //console.log(dec.data.login_key)
  //let users = JSON.parse(readFileSync('json/user.json').toString())
  const users:any = await User.findAll();
  let logkey:any,mail:any
  for(let user of users){
    //console.log(user,dec)
    if(user.name==dec.data.user){
      logkey = (decrypt(user.login_key,dec.data.login_key))
      mail =JSON.parse(decrypt(user.mail,logkey)).emails[parseInt(dec.data.requested)]
    }
  }
  //console.log(JSON.parse(decrypt(users[0].mail,logkey)).emails)
  var client = new ImapClient(mail.host, parseInt(mail.port), {
    auth: {
        user: mail.address,
        pass: mail.creds,
        
    },logLevel:1000
  });
  client.connect().then(()=>{
    //['uid', 'flags','envelope'] for just header stuff
    //['uid', 'flags','envelope','body']
    //body 0 is plani, 1 is plain
    let bo="body[0]"
    for(let user of users){
      if(user.name==dec.data.user){
        if(user.html){
          bo="body[2]"
        }
      }
    }
    client.listMessages('INBOX', '1:*', ['uid', 'flags','envelope','bodystructure',bo ]).then((messages:any) => {
      const skey = new NodeRSA()
      let mail;
      skey.importKey(keyring[req.body.sid].theirpub,'pkcs8-public')
      for(let user of users){
        if(user.name==dec.data.user){
          mail = JSON.parse(decrypt(user.mail,logkey))
          mail.emails[parseInt(dec.data.requested)].storage = messages
          user.setDataValue('mail',encrypt(JSON.stringify(mail),logkey))
          user.save()
          User.sync({ alter: true })

          break
        }
      }
      //console.log(users,(JSON.stringify(messages)))
      res.send(JSON.stringify({data:skey.encrypt(JSON.stringify({messages:messages,bod:bo}),'base64'),enc:true,html:true}))
      client.close()
  });
  })
})
app.post('/mail/del',async(req:any,res:any)=>{
  const key = new NodeRSA({b: 1024})

  key.importKey(keyring[req.body.sid].mypriv,'pkcs1-private')
  let dec:any = JSON.parse((atob(key.decrypt(req.body.data,'base64','base64'))))
  //console.log(key)
  //console.log(dec.data.login_key)
  //let users = JSON.parse(readFileSync('json/user.json').toString())
  const users:any = await User.findAll();
  let logkey:any,mail:any
  for(let user of users){
    //console.log(user,dec)
    if(user.name==dec.data.user){
      logkey = (decrypt(user.login_key,dec.data.login_key))
      mail =JSON.parse(decrypt(user.mail,logkey)).emails[parseInt(dec.data.requested)]
    }
  }
  //console.log(JSON.parse(decrypt(users[0].mail,logkey)).emails)
  var client = new ImapClient(mail.host, parseInt(mail.port), {
    auth: {
        user: mail.address,
        pass: mail.creds,
        
    },logLevel:1000
  });
  client.connect().then(()=>{
    const skey = new NodeRSA()
      skey.importKey(keyring[req.body.sid].theirpub,'pkcs8-public')
      client.deleteMessages('INBOX',dec.data.index).then(()=>{
      res.send(JSON.stringify({data:skey.encrypt(JSON.stringify({'comp':true}),'base64'),enc:true,html:true}))
      client.close()
    })
      //console.log(users,(JSON.stringify(messages)))
      
  
  })
})
app.post('/mail/reg',async(req:any,res:any)=>{
  const key = new NodeRSA({b: 1024})
  const skey = new NodeRSA()
  skey.importKey(keyring[req.body.sid].theirpub,'pkcs8-public')
  key.importKey(keyring[req.body.sid].mypriv,'pkcs1-private')
  let dec:any = JSON.parse((atob(key.decrypt(req.body.data,'base64','base64'))))

  //let users = JSON.parse(readFileSync('./json/user.json').toString())
  const users:any = await User.findAll();
  let logkey:any,mail:any
  for(let user of users){
    
    if(user.name==dec.data.user){
      logkey = await (decrypt(user.login_key,dec.data.login_key))
      console.log(logkey)
      mail=users.indexOf(user)
    }
  }
  users[mail].mail=encrypt(JSON.stringify({'emails':[{
    'address':dec.data.address,
    'host':dec.data.host,
    'port':dec.data.port,
    'creds':dec.data.creds,
    'salt':crypt.randomBytes(64).toString('hex')
  }]}),logkey)
  //users.save()
})
app.get('/mail', (req:any, res:any) => {
  res.sendFile(__dirname+'/html/mail.html')
  
})
app.post('/mail/get/storage',async(req:any,res:any)=>{
  const key = new NodeRSA({b: 1024})
  const skey = new NodeRSA()
  skey.importKey(keyring[req.body.sid].theirpub,'pkcs8-public')
  key.importKey(keyring[req.body.sid].mypriv,'pkcs1-private')
  console.log(req.body.data)
  let dec:any = JSON.parse((atob(key.decrypt(req.body.data,'base64','base64'))))
  console.log(dec)
  //let users = JSON.parse(readFileSync('./json/user.json').toString())
  const users:any = await User.findAll();
  let logkey:any,mail:any
  for(let user of users){
    //console.log(user,dec)
    if(user.name==dec.data.user){
      logkey = (decrypt(user.login_key,dec.data.login_key))
      mail =JSON.parse(decrypt(user.mail,logkey))
    }
  }
  let d = skey.encrypt((mail.emails[parseInt(dec.data.requested)].storage),'base64')
  res.send(JSON.stringify({data:d,enc:true,html:true}))
})
app.get('/mail', (req:any, res:any) => {
  res.sendFile(__dirname+'/html/mail.html')
  
})

app.get('/', (req:any, res:any) => {
  res.sendFile(__dirname+"/html/index.html")
})
app.get('/kanna.txt', (req:any, res:any) => {
  res.sendFile(__dirname+"/kanna.txt")
})
app.get('/src/bundle.js', (req:any, res:any) => {
  res.sendFile(__dirname+'/src/bundle.js')
})
app.get('/src/autolink.js', (req:any, res:any) => {
  res.sendFile(__dirname+'/src/autolink.js')
})
app.get('/src/quoted-printable.js', (req:any, res:any) => {
  res.sendFile(__dirname+'/src/quoted-printable.js')
})
app.get('/src/lights-out.gif', (req:any, res:any) => {
  res.sendFile(__dirname+'/src/lights-out.gif')
})
app.get('/src/kanna.gif', (req:any, res:any) => {
  res.sendFile(__dirname+'/src/kanna.gif')
})
app.get('/src/sauce-code-mono.ttf', (req:any, res:any) => {
  res.sendFile(__dirname+'/src/sauce-code-mono.ttf')
})
app.get('/home', (req:any, res:any) => {
  res.sendFile(__dirname+'/html/home.html')
})
app.post('/pub.key', async (req:{body:{json:boolean,sid:keyof keyring,pub:string}}, res:any) => {
  if(req.body.json){
    
    
    const key = new NodeRSA({b: 1024});
    keyring[req.body.sid]={mypriv:key.exportKey('pkcs1-private'),
    mypub:key.exportKey('pkcs8-public'),
    theirpub:req.body.pub}
    res.send(key.exportKey('pkcs8-public'))
    //console.log(keyring)
  }
})

app.post('/login/submit', async (req:{body:{json:boolean,enc:boolean,data:string,sid:keyof keyring}}, res:any) => {
  const key = new NodeRSA({b: 1024})

  key.importKey(keyring[req.body.sid].mypriv,'pkcs1-private')
  let dec:{user:string,pass:string} = JSON.parse((atob(key.decrypt(req.body.data,'base64','base64'))))
  
  const users:any =await User.findAll();
  for(let user of users){
    let use=user as typeof users
    let hash = crypt.createHash('md5').update(dec.pass).digest('hex');
    if(user.name==dec.user&&hash==decrypt(user.hash,hash)){
      
      const skey = new NodeRSA()
      skey.importKey(keyring[req.body.sid].theirpub,'pkcs8-public')
      let logkey = crypt.createHash('md5').update(crypt.randomBytes(64).toString('hex')).digest('hex')
      res.send(JSON.stringify({data:skey.encrypt(JSON.stringify({login_key:logkey}),'base64'),enc:true,html:false,json:true,type:'key'}))
      
      user.setDataValue('login_key',encrypt(hash,logkey))
      user.save()
      User.sync({ alter: true })
      break
      //console.log(users[users.indexOf(user)].login_key,logkey,hash)
      //console.log(users)
      //writeFileSync('./json/user.json',JSON.stringify(users))
    }
  }
})
app.use((req:any, res:any, next:any) => {
  res.status(418).sendFile(__dirname+'/html/404.html')
})

//http
var httpServer = http.createServer(app);
var credentials = {key: privateKey, cert: certificate};
var httpsServer = https.createServer(credentials, app);
app.listen(8008,function local(){
  log(`kanna is local http://${ip.address()}:8008`)
})
httpServer.listen(80, function http() {
  log(`kanna is on http://${ip.address()} click on me click on me! :3`)
})
httpsServer.listen(443, function https() {
  log(`kanna is secure now too!! https://${ip.address()}`)
})
//end
/*let l = (encrypt(JSON.stringify({
        'emails':[{
          'address':'grantsquires@disroot.org',
          'host':'disroot.org',
          'port':'993',
          'creds':pass,
          'salt':crypt.randomBytes(64).toString('hex')
        }], //how much salt do you want? 'all of it'
        'salt':[
          d(),crypt.randomBytes(64).toString('hex'),crypt.randomBytes(64).toString('base64'),d()
        ],
        'storage':'./storage/'+user.name,

      }),hash))
*/

