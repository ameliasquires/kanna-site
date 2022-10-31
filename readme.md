# kanna

![salt](/docs/src/salt.png)

because the internet needs rewriting

security project to ~~learn client and server encryption~~ mail & advanced requests

## hosting

### initial (needed) files

create generic keys `openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ./certs/selfsigned.key -out ./certs/selfsigned.crt`, or insert which ever ones to `./certs/selfsigned.key` and to `./certs/selfsigned.crt` respectively

---

### running

dependencies:

- ts-node |`npm i -g ts-node`
- package.json | `npm i`
- development (optional)
  - nodemon | `npm i -g nodemon`


#### windows

main build : `npm start`

dev : `npm run dev`

---

#### \*nix

###### please note, for linux you will need to run this as root (for permission to use these ports, 80,443)

main build : `sudo ts-node .`

dev : `sudo nodemon .`


---

[gitea](https://git.disroot.org/grantsquires/kanna-site) | [github](https://github.com/squiresgrant/kanna-site)

## todo

- [ ] add extra pages
  - [ ] home page (quick links, etc)
  - [ ] mail
    - [ ] allow for automation (ie, auto reply)
  - [ ] forums
  - [ ] storage
    - [ ] viewer for images
    - [ ] viewer for docs
  - [ ] login
- [ ] performance related
  - [ ] store all listeners in array and kill
  - [ ] go through all html files, clean up code
- [ ] increase initiation vector (IV) size

## currently

- [x] learning how mail works
  - [ ] toggle plaintext/html emails
  - [ ] option to markdownify email
  - [ ] write md emails, send as html
  - [ ] sexify
  - [ ] settings.json
  - [ ] make mail prettier
  - [ ] dont accept old login keys
  - [ ] add functionality
    - [x] loading screen
    - [x] storage for quicker (initial)loading
    - [x] delete
    - [ ] send
    - [ ] reply
    - [ ] draft
    - [ ] forward
    - [ ] sender info
  - [ ] allow for email account adding
  - [ ] docs
  - [x] extra pages
    - [x] 404 page
  - [ ] sub domains
    - [ ] ughh hate sub domains
  - [ ] make my own libs
    - [ ] encryption (md5 hashing, rsa, and aes)
  - [ ] add aliases that are used in cookies and randomly gen.
    - [ ] also server side hash to check/verify the alias  
  - [ ] more sexy gradients (everywhere)
  - [ ] lower verbosity (and options to change it)
  - [ ] move all dependencies to local ones
  - [ ] check for permissions on what ports to open

### issues 

  - [x] storage not saving
  - [ ] check for login key cookie on page load

FeMail (iron mail)
