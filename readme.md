# kanna

because the internet needs rewriting

security project to ~~learn client and server encryption~~ mail & advanced requests

## hosting

### initial (needed) files

create generic keys `openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ./certs/selfsigned.key -out ./certs/selfsigned.crt`, or insert which ever ones to `./certs/selfsigned.key` and to `./certs/selfsigned.crt` respectively

---

### running

#### windows

dependencies:

- [ ] ts-node |`npm i -g ts-node`

run `npm i` & `npm start`

---

#### \*nix

dependencies:

- [ ] ts-node |`sudo npm i -g ts-node`

run `npm i` & `sudo ts-node .`

---

<sub>kanna was here</sub>

visit the [main git](https://git.disroot.org/grantsquires/kanna-site) or the [github](https://github.com/squiresgrant/kanna-site)

## todo

- [ ] add extra pages
  - [ ] home page (quick links, etc)
  - [ ] mail
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
  - [ ] make mail prettier
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
  - [ ] extra pages
    - [x] 404 page
  - [ ] sub domains
  - [ ] make my own libs
    - [ ] encryption (md5 hashing, and rsa)
  - [ ] add aliases that are used in cookies and randomly gen.

FeMail (iron mail)
