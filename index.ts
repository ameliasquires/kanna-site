import { readFileSync } from "fs"
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
function log(m:any){
  var date = new Date;
  console.log('['+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()+'] ' + m.toString())
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


//http
var httpServer = http.createServer(app);
var credentials = {key: privateKey, cert: certificate};
var httpsServer = https.createServer(credentials, app);
httpServer.listen(80,'0.0.0.0', () => {
  log(`kanna is on http://${ip.address()} click on me click on me! :3`)
})
httpsServer.listen(443,'0.0.0.0', () => {
  log(`kanna is secure now too!! https://${ip.address()}`)
})
//end
app.get('/', (req:any, res:any) => {
  res.sendFile(__dirname+"/html/index.html")
})
app.get('/kanna.txt', (req:any, res:any) => {
  res.sendFile(__dirname+"/kanna.txt")
})
app.get('/src/bundle.js', (req:any, res:any) => {
  res.sendFile(__dirname+'/src/bundle.js')
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
  }
})

app.post('/login/submit', async (req:{body:{json:boolean,enc:boolean,data:string,sid:keyof keyring}}, res:any) => {
  const key = new NodeRSA({b: 1024})

  key.importKey(keyring[req.body.sid].mypriv,'pkcs1-private')
  let dec:{user:string,pass:string} = JSON.parse((atob(key.decrypt(req.body.data,'base64','base64'))))
  
  let users = JSON.parse(readFileSync('json/user.json').toString())
  for(let user of users){
    let use=user as typeof users
    if(user.name==dec.user&&user.pass==dec.pass){
      const skey = new NodeRSA()
      skey.importKey(keyring[req.body.sid].theirpub,'pkcs8-public')
      res.send(JSON.stringify({data:skey.encrypt('<h1>hello!</h1>','base64'),enc:true,html:true}))
    }
  }
})
  

