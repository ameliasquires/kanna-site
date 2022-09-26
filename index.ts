import { readFileSync } from "fs"

const express = require('express')
const app = express()
const port = 3001
const fs = require('fs')
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const NodeRSA = require('node-rsa');
//let priv = '';

interface keyring{
  [sid: string]: string,
 }
let keyring = {} as keyring
let key:any;

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
app.post('/pub.key', async (req:{body:{json:boolean,sid:keyof keyring}}, res:any) => {
  if(req.body.json){
    
    
    const key = new NodeRSA({b: 1024});
    keyring[req.body.sid]=key.exportKey('pkcs1-private')
    res.send(key.exportKey('pkcs8-public'))
  }
})

app.post('/login/submit', async (req:{body:{json:boolean,enc:boolean,data:string,sid:keyof keyring}}, res:any) => {
  const key = new NodeRSA({b: 1024})

  key.importKey(keyring[req.body.sid],'pkcs1-private')
  let dec:{user:string,pass:string} = JSON.parse((atob(key.decrypt(req.body.data,'base64','base64'))))
  
  let users = JSON.parse(readFileSync('json/user.json').toString())
  for(let user of users){
    let use=user as typeof users
    console.log(use)
    if(user.name==dec.user&&user.pass==dec.pass){
      res.send('logged in, hello!')
    }
  }
})
  

app.listen(port,'0.0.0.0', () => {
  console.log(`Example app listening on port ${port}`)
})