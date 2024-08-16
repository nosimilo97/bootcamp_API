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
          const res = await fetch(`http://localhost:3001/api/word_game?sentence=${this.sentence}`, {
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
          this.wordLengths = json.wordLengths; // Corrected capitalization
          
        } catch (error) {
          console.error('Error fetching sentence analysis:', error);
        }
      },
      async calculateBill() {
        try {
            const response = await fetch('http://localhost:3001/api/phonebill/total', {
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
        } catch (error) {
            console.error('Error calculating bill:', error);
            this.total = null;
        }
    },

    async updatePrices() {
        try {
            const response = await fetch('http://localhost:3001/api/phonebill/prices', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    call: this.callCost,
                    sms: this.smsCost
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            this.prices = data;
        } catch (error) {
            console.error('Error updating prices:', error);
        }
    },

    async init() {
        try {
            const response = await fetch('http://localhost:3001/api/phonebill/prices');
            if (response.ok) {
                const data = await response.json();
                this.prices = data;
            }
        } catch (error) {
            console.error('Error fetching initial prices:', error);
        }
    },
    async calculateAirtime() {
      try {
          const response = await fetch('http://localhost:3001/api/enough_airtime/enough', {
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
