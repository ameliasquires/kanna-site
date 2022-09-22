const express = require('express')
const app = express()
const port = 3000
const fs = require('fs')
const crypt = require("crypto")
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const priv = `
MIICXQIBAAKBgQClTC6XhWz6iDHivz/F5A1q+C0YdVeaHnd1wktRLgRO3UEzXPnb
oniUqVgQfZ8QS6CNpwUjXEeolQmgnkqYNGYR/0DcEzrNWxCYiN4iLpKuVa0bGEiW
o06CShpdgadgoN4FL+mOZybi7ccf2h8niyPfTO9L6PS1zCGrFD4JibeEfwIDAQAB
AoGAQrPBQWeYGGkJKGTgiSyDtZy8JdiEJy8QKbbjybh2CJUEEIP+V4Dyg5rqbI0k
uOCrwz2YtzIvwHmTzvrRQyYx4X5FZKH307QjFlKw+vNh4pskO6LRJlfp7K+gxLLM
rI/mP4xWpVqVzOyvwQaYO135yQMxJ7AdaMRZ1feC/lv38wECQQDlr7/xgkwRDDog
ijeIevBN5CUJVQeG+pm/YxojH18bTswN7Ctbur2HqMBwwcao7cycDcxzvkqMP+Ci
2CzLzRc/AkEAuDwISy+Sz3qJ/U+zFN0epbK1cXfHKuJQ9K33lAeTlsNJwewtu+sT
i0ielJ9lqeGYSUhjjCnEqEQyFZ8IwfWCwQJAdHmFaqFalaKPr4Sn2KwPRFCXf34B
DS/z25wT2w/DmQOCcuT6r8+o4SxwOj3p0iyU/+X3chJjl2+lKK9bOBZO3QJBAJxe
z8dI/Lm/TynCoMQfneiT0y8Ys+JxLrdOhSmOeLVo0cyXsoWiU/dPTtHkrLxQ7xmc
KGoJ9ZHAOCZj0mIWCMECQQDQw81CWK6OWrNKVd3B/nSqQB7kn3J9S/L+hVkDuKw9
5WAEevrUpd0m3GgKahWfH1XHyv4CIPMrksLfy3uV8ZBX
`
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
  console.log("send")
  res.sendFile(__dirname+"/index.html")
})
app.get('/kanna.txt', (req:any, res:any) => {
  res.sendFile(__dirname+"/kanna.txt")
})
app.get('/jsencrypt.min.js', (req:any, res:any) => {
  res.sendFile(__dirname+'/jsencrypt.min.js')
})
app.get('/lights-out.gif', (req:any, res:any) => {
  res.sendFile(__dirname+'/lights-out.gif')
})
app.post('/login/submit', async (req:any, res:any) => {
  console.log(req.body)
  if(req.body.enc,req.body.json){
  let request = await decryptMessage(req.body.data, crypt.createPrivateKey({
            key: Buffer.from(priv, 'base64'),
            format: "der",
            type: 'pkcs1',
          }))
          request=JSON.parse(request)
          console.log(request.user,request.pass)
          //if(request.date==null){return}
    if(request.user.trim() == "root" && request.pass.trim() == "password"){
      console.log("hello:)")
      res.sendFile(__dirname+"/index.html")
    }
  }
  
})
app.listen(port,'0.0.0.0', () => {
  console.log(`Example app listening on port ${port}`)
})