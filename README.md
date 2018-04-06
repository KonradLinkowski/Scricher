# Scricher
Node.js/express social media service.
## Features
Create your own account.
Log in to your account.
Write a post.
Comment others posts.
## Running
Use postman to send requests with x-www-form-urlencoded.
To access endpoints which require authorization, you need to pass:
Authorization           JWT _access_token_
Inside Headers tab.
### Remote
Use my remote server on heroku:
https://scricher.herokuapp.com/
### Local
Clone repository and run it yourself.
Remember to add config/keys.js file containing mongodb and jwt string!
```bash
$ git clone https://github.com/KonradLinkowski/Scricher
$ cd Scricher
$ npm install
$ npm start
```
## Endpoints
### POST /api/auth/signup
#### Request
```
email           _your_email_
password        _your_password_
```
### POST /api/auth/signin
#### Request
```
email           _your_email_
password        _your_password_
```
#### Response
Access token.
### GET /api/posts/
#### Response
List of posts.
### POST /api/posts/
#### Request
```
message         _your_message_
```
### GET /api/posts/:id
#### Response
Post specified by id.
### GET /api/comments/:id
#### Response
Comments on the post.
### POST /api/comments/:id
#### Request
```
message         _your_message_
```
### GET /api/user/:id
### Response
Post created by user specified by id.
## Dependencies
* Node.js
* express
* async
* bcryptjs
* mongoose
* jasmine
* passport
* passport-jwt