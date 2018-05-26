var moment=require('moment');
//var date=moment();
//date.add(1,'year').subtract(7,'months');
//console.log(date.format('MMM Do, YYYY'));

//var date=moment();
//console.log(date.format('h:mm A'));
var createdAt=1234;
var date=moment(createdAt);
console.log(date);
console.log(date.format('h:mm a'));
