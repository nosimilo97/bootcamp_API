document.addEventListener("alpine:init", () => {
  Alpine.data("bootcampApi", () => {
    return {
      sentence: "",
      ShortestWord: "",
      longestWord: "",
      wordLengths: 0, 
      billString: "",
      total: null,
      callCost: 2.75,
      smsCost: 0.65,
     prices: {
          call: 2.75,
          sms: 0.65
      },
      projectedUsage: '',
                availableAirtime: 0,
                remainingAirtime: 'N/A',

      async analyzeSentence() {
        try {
          const res = await fetch(`https://bootcamp-api-6ioq.onrender.com/api/word_game?sentence=${this.sentence}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          });

          if (!res.ok) {
            throw new Error('Network response was not ok');
          }

          const json = await res.json(); 
          console.log('RESPONSE', json);
          this.ShortestWord= json.ShortestWord || 'No shortest word found';
          this.longestWord = json.longestWord;
          this.wordLengths = json.wordLengths; 
          
        } catch (error) {
          console.error('Error fetching sentence analysis:', error);
        }
      },
      async calculateBill() {
        try {
            const response = await fetch(`https://bootcamp-api-6ioq.onrender.com/api/phonebill/total`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ bill: this.billString })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log(data);
            this.total = data.total;
            this.updatePrices();
        } catch (error) {
            console.error('Error calculating bill:', error);
            this.total = null;
        }
    },

    async updatePrices() {
      try {
          const response = await fetch(`https://bootcamp-api-6ioq.onrender.com/api/phonebill/price`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  type: 'call',
                  price: this.callCost
              })
          });

          if (response.ok) {
              const responseSms = await fetch(`https://bootcamp-api-6ioq.onrender.com/api/phonebill/price`, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                      type: 'sms',
                      price: this.smsCost
                  })
              });

              const data = await response.json();
              this.prices = {
                  call: this.callCost,
                  sms: this.smsCost
              };
          }
      } catch (error) {
          console.error('Error updating prices:', error);
      }
  },    

    
    async init() {
        try {
            const response = await fetch(`https://bootcamp-api-6ioq.onrender.com/api/phonebill/prices`);
            if (response.ok) {
                const data = await response.json();
                this.prices = data;
                this.callCost = data.call;
                this.smsCost = data.sms;
            }
        } catch (error) {
            console.error('Error fetching initial prices:', error);
        }
    },
    async calculateAirtime() {
      try {
          const response = await fetch(`https://bootcamp-api-6ioq.onrender.com/api/enough_airtime/enough`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  projectedUsage: this.projectedUsage,
                  availableAirtime: this.availableAirtime
              })
          });

          if (!response.ok) {
              throw new Error('Network response was not ok');
          }

          const data = await response.json();
          this.remainingAirtime = data.result ? `R${data.result}` : 'R0.00';
      } catch (error) {
          console.error('Error calculating airtime:', error);
          this.remainingAirtime = 'N/A';
      }
  }
    };
  });
});
