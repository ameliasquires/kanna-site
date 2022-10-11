# kanna

because the internet needs rewriting

security project to ~~learn client and server encryption~~ mail & advanced requests

create generic keys `openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ./certs/selfsigned.key -out ./certs/selfsigned.crt`

run `npm i` & `npm start`

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

## currently

- [x] learning how mail works
  - [ ] make mail prettier
  - [ ] add functionality
    - [ ] send
    - [ ] reply
    - [ ] draft
    - [ ] forward
    - [ ] sender info
  - [ ] allow for email account adding (soon)
  - [ ] docs
    - [ ] how everthing works (pseudocode)

FeMail (iron mail)
