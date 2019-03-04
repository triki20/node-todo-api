const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var pass = 'Aa250990!';

bcrypt.genSalt(10, (err, salt) => {
    console.log(salt + 101);
    bcrypt.hash(pass, salt,(err, hash) => {
        console.log(hash);
    });
});
/*
var haspass = '$2a$10$khNXuol/1yF9znS8oMqaF.nAFXBoi9Rh1RVxUH8bN67fPq4S7EIZ6';

bcrypt.compare(pass, haspass, (err, res) => {
    console.log(res);
});
*/
/*
var data = {
    id: 10,
    name: 'yahalom',
    sign : true
};

var token = jwt.sign(data, '123abc').toString();
console.log(token)

var decoded = jwt.verify(token, '123abc');
console.log(decoded);


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