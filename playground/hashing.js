const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
    id: 10,
    name: 'yahalom',
    sign : true
};

var token = jwt.sign(data, '123abc').toString();
console.log(token)

var decoded = jwt.verify(token, '123abc');
console.log(decoded);

/*
var massage = 'im'
var Hash = SHA256(massage).toString()

console.log(massage);

console.log(Hash);

var data = {
    id : 4
};

var token = {
  data,
  hash: SHA256(JSON.stringify(data) ).toString()
}

 token.data.id = 5

var resultHash = SHA256(JSON.stringify(token.data)).toString();

if(resultHash === token.hash){
    console.log('Data was not chaing');
}else{
    console.log('Data was chaing, warning!');
}*/