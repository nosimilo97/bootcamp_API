






import express from 'express';
import cors from 'cors';

const app = express();

app.use(express.urlencoded({extended: false }))
app.use(express.json())
app.use(express.static('public'));
app.use(cors())

function longestWord(sentence) {
    // Split the sentence into an array of words
    var words = sentence.split(" ");

    // Initialize variables to store the longest word and its length
    var longest = "";
    var maxLength = 0;

    // Iterate through each word in the array
    for (var i = 0; i < words.length; i++) {
        // Check if the current word is longer than the previous longest word
        if (words[i].length >= maxLength) {
            longest = words[i];
            maxLength = words[i].length;
        }
    }

    // Return the longest word
    return longest;
}
function shortestWord(sentence) {
    // Split the sentence into an array of words
    var words = sentence.split(" ");

    // Initialize variables to store the shortest word and its length
    var shortest = words[0];
    var minLength = shortest.length;

    // Iterate through each word in the array
    for (var i = 1; i < words.length; i++) {
        // Check if the current word is shorter than the previous shortest word
        if (words[i].length <= minLength) {
            shortest = words[i];
            minLength = words[i].length;
        }
    }

    // Return the shortest word
    return shortest;
}

function wordLengths(sentence) {
    // Split the sentence into an array of words
    var words = sentence.split(" ");

    // Initialize variable to store the sum of word lengths
    var sum = 0;

    // Iterate through each word in the array
    for (var i = 0; i < words.length; i++) {
        // Add the length of the current word to the sum
        sum += words[i].length;
    }

    // Return the sum of word lengths
    return sum;
}

app.get('/api/word_game', function(req, res){
   const sentence = req.query.sentence;
    res.json({
        message: sentence,
        longestWord: longestWord(sentence),
        ShortestWord: shortestWord(sentence),
        wordLengths: wordLengths(sentence)

    });
});


let prices = {
    call: 2.75,
    sms: 0.65
};

app.post('/api/phonebill/total', function(req, res){
   const bill = req.body.bill;
function totalPhoneBill(bill) {
    // Split the input string into an array of call and SMS entries
    const entries = bill.split(',');

    // Initialize variables to keep track of call and SMS counts
    let callCount = 0;
    let smsCount = 0;

    // Calculate the number of calls and SMS messages
    for (const entry of entries) {
        if (entry === 'call') {
            callCount++;
        } else if (entry === 'sms') {
            smsCount++;
        }
    }
    // Calculate the total cost
    const callCost = callCount * prices.call; 
    const smsCost = smsCount * prices.sms; 
    const total = callCost + smsCost;
    // Return the total bill formatted as a string
    return total;
}

const result = totalPhoneBill(bill);
    return res.json ({
        total: result.toFixed(2)
    });
});


app.get('/api/phonebill/prices', function(req, res){
    const call = req.query.call;
    const sms = req.query.sms;
     res.json({
        
    call : 2.75,
    sms : 0.65
     });
 });


 app.post('/api/phonebill/price', function(req, res){
    const call = 0;
 const sms = 0;
   const type = req.body.type;
   const price = parseFloat(req.body.price);
   
   if (type === 'sms' || type === 'call') {
    return res.json({
        status: 'success',
        message: `The ${type} price was set to ${price}`
    });
   } else {
    return res.json({
        status:'failed',
        message: 'type invalid'
    });
   }

  
});



app.post('/api/enough_airtime/enough', function(req, res){
    const projectedUsage = req.body.projectedUsage;
const availableAirtime =req.body.availableAirtime;
// const totalRemainingAirtime = req.body.totalRemainingAirtime;
    function enoughAirtime(projectedUsage, availableAirtime) {
        const usage = projectedUsage.split(',');
        let totalCost = 0;
      const call = 1.88;
      const data = 12;
      const sms =0.75;
      for (const item of usage) {
       
        if (item ==='call') {
          totalCost += call;
        } else if (item ==='data') { 
        
          totalCost += data;
      } else if (item ==='sms'){
        
          totalCost += sms ;
        }
      }
     var remainingAirtime = availableAirtime - totalCost;
      if (remainingAirtime < 0.00) {
        return  'R0.00';
      }
     return remainingAirtime.toFixed(2);
    
    }
    
    const result = enoughAirtime(projectedUsage,availableAirtime);
 return res.json ({
    result: result

 });
     

});


app.listen(3001, function () {
    console.log('Example app listening on port 3001!');
    
})