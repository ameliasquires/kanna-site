import { readFileSync } from "fs"

const express = require('express')
const app = express()
const port = 3001
const fs = require('fs')
const crypt = require("crypto")
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//let priv = '';


interface keyring{
  [sid: string]: string,
 }
let keyring = {} as keyring
let key:any;
function decryptMessage(encryptedMessage:any, privateKey:any) {
  const rsaPrivateKey = {
    key: privateKey,
    passphrase: '',
    padding: crypt.constants.RSA_PKCS1_PADDING,
  };

  const decryptedMessage = crypt.privateDecrypt(
    rsaPrivateKey,
    Buffer.from(encryptedMessage, 'base64'),
  );

  return decryptedMessage.toString('utf8');
}
app.get('/', (req:any, res:any) => {
  res.sendFile(__dirname+"/html/index.html")
})
app.get('/kanna.txt', (req:any, res:any) => {
  res.sendFile(__dirname+"/kanna.txt")
})
app.get('/src/jsencrypt.min.js', (req:any, res:any) => {
  res.sendFile(__dirname+'/src/jsencrypt.min.js')
})
app.get('/src/crypto.js', (req:any, res:any) => {
  res.sendFile(__dirname+'/src/crypto.js')
})
app.get('/src/lights-out.gif', (req:any, res:any) => {
  res.sendFile(__dirname+'/src/lights-out.gif')
})
app.post('/pub.key', async (req:{body:{json:boolean,sid:keyof keyring}}, res:any) => {
  if(req.body.json){
    const { publicKey, privateKey } = crypt.generateKeyPairSync("rsa", {
      // The standard secure default length for RSA keys is 2048 bits
      modulusLength: 1024,
      publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      }
    })
    res.send(publicKey.toString("base64"))
    console.log(publicKey,privateKey)
    
    
  }
})

app.post('/login/submit', async (req:{body:{json:boolean,enc:boolean,data:string,sid:keyof keyring}}, res:any) => {
  //console.log(req.body)
  //console.log(keyring,req.body.sid)
  
  if(req.body.enc,req.body.json){
    try{
      console.log(key)
      // @ts-ignore
      /*
  let request = await decryptMessage(req.body.data, crypt.createPrivateKey({
            key: Buffer.from(key, 'base64'),
            padding:crypt.constants.RSA_PKCS1_PADDING,
          }))*/
          console.log(req.body)
          const decryptedData = crypt.privateDecrypt(
            {
              key: key,
              // In order to decrypt the data, we need to specify the
              // same hashing function and padding scheme that we used to
              // encrypt the data in the previous step
              padding: crypt.constants.RSA_PKCS1_OAEP_PADDING,
              oaepHash: "sha256",
            },
            req.body.data
          )
          //console.log(req.body)
          let request=JSON.parse(decryptedData)
          console.log(request)
          //console.log(request.user,request.pass)
          //if(request.date==null){return}
    let user:any=readFileSync("json/user.json")
    //console.log(user)
    for(let i of JSON.parse(user)){
      //console.log(i)
    if(request.user.trim() == i['user'] && request.pass.trim() == i['pass']){
      res.send("logged in")
    }
    
  }}catch(err){
    console.log(err)
    
  }
}
  
})
app.listen(port,'0.0.0.0', () => {
  console.log(`Example app listening on port ${port}`)
})