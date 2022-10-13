import { readFileSync, writeFileSync } from "fs"
import { LogLevel } from "node-ts";
var privateKey  = readFileSync('certs/selfsigned.key', 'utf8');
var certificate = readFileSync('certs/selfsigned.crt', 'utf8');
var http = require('http');
var https = require('https');
const express = require('express')
const app = express()
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
const IV = "5183666c72eec9e4"; //!not really sure what this is lol 
//TODO: learn what IV is
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
    return('false')
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

app.post('/mail/get/update',(req:any,res:any)=>{
  const key = new NodeRSA({b: 1024})

  key.importKey(keyring[req.body.sid].mypriv,'pkcs1-private')
  let dec:any = JSON.parse((atob(key.decrypt(req.body.data,'base64','base64'))))
  //console.log(key)
  //console.log(dec.data.login_key)
  let users = JSON.parse(readFileSync('json/user.json').toString())
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
        if(user.settings.html){
          bo="body[2]"
        }
      }
    }
    client.listMessages('INBOX', '1:*', ['uid', 'flags','envelope','bodystructure',bo ]).then((messages:any) => {
      const skey = new NodeRSA()
      skey.importKey(keyring[req.body.sid].theirpub,'pkcs8-public')
      for(let user of users){
        if(user.name==dec.data.user){
          users[users.indexOf(user)].mail = JSON.parse(decrypt(users[users.indexOf(user)].mail,logkey))
          users[users.indexOf(user)].mail.emails[parseInt(dec.data.requested)].storage = messages
          delete users[users.indexOf(user)].mail.storage
          users[users.indexOf(user)].mail = encrypt(JSON.stringify(users[users.indexOf(user)].mail),logkey)
          fs.writeFileSync('./json/user.json',JSON.stringify(users))
          break
        }
      }
      //console.log(users,(JSON.stringify(messages)))
      res.send(JSON.stringify({data:skey.encrypt(JSON.stringify({messages:messages,bod:bo}),'base64'),enc:true,html:true}))
      client.close()
  });
  })
})
app.post('/mail/reg',async(req:any,res:any)=>{
  const key = new NodeRSA({b: 1024})
  const skey = new NodeRSA()
  skey.importKey(keyring[req.body.sid].theirpub,'pkcs8-public')
  key.importKey(keyring[req.body.sid].mypriv,'pkcs1-private')
  let dec:any = JSON.parse((atob(key.decrypt(req.body.data,'base64','base64'))))

  let users = JSON.parse(readFileSync('./json/user.json').toString())
  let logkey:any,mail:any
  console.log(dec)
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
  writeFileSync('./json/user.json',JSON.stringify(users))
})
app.get('/mail', (req:any, res:any) => {
  res.sendFile(__dirname+'/html/mail.html')
  
})
app.post('/mail/get/storage',(req:any,res:any)=>{
  const key = new NodeRSA({b: 1024})
  const skey = new NodeRSA()
  skey.importKey(keyring[req.body.sid].theirpub,'pkcs8-public')
  key.importKey(keyring[req.body.sid].mypriv,'pkcs1-private')
  console.log(req.body.data)
  let dec:any = JSON.parse((atob(key.decrypt(req.body.data,'base64','base64'))))
  console.log(dec)
  let users = JSON.parse(readFileSync('./json/user.json').toString())
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
  
  let users = JSON.parse(readFileSync('json/user.json').toString())
  for(let user of users){
    let use=user as typeof users
    let hash = crypt.createHash('md5').update(dec.pass).digest('hex');
    if(user.name==dec.user&&hash==decrypt(user.hash,hash)){
      
      const skey = new NodeRSA()
      skey.importKey(keyring[req.body.sid].theirpub,'pkcs8-public')
      let logkey = crypt.createHash('md5').update(crypt.randomBytes(64).toString('hex')).digest('hex')
      res.send(JSON.stringify({data:skey.encrypt(JSON.stringify({login_key:logkey}),'base64'),enc:true,html:false,json:true,type:'key'}))
      users[users.indexOf(user)].login_key = encrypt(hash,logkey)
      //console.log(users[users.indexOf(user)].login_key,logkey,hash)
      //console.log(users)
      writeFileSync('./json/user.json',JSON.stringify(users))
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
  log(`kanna is local http://${ip.address()}:8080`)
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

