

export { createShares, recreateSecret };

const lookupLogs : number[] = [];
const lookupExponents : number[] = [];

const maxShares = 5;

function initialise(){
    // create lookup table
    let x = 1;
    for (let i = 0; i < 256; i++) {
        lookupLogs[i] = x;
        lookupExponents[x] = i;
      x = x << 1;
      if (x & 256) {

        x ^= Number('0x11d');
      }
    }
    
}



function createShares(secret : number){
    let shares = [];
    let coefficients = [secret];

    // Pick random coefficients for our polynomial function
    for (let ii = 1; ii < maxShares; ii++) {
      coefficients[ii] = getRandomValue();
    }

    // Calculate the y value of each share based on f(x) when using our new random polynomial function
    for (let ii = 1, len = maxShares + 1; ii < len; ii++) {
      shares[ii - 1] = {
        x: ii,
        y: evaluatePolynomial(ii, coefficients)
      };
    }

    return shares;
  }

function getRandomValue(){

    return 1;

}


function evaluatePolynomial( x : number, coefficients : number[]){

        let poly = 0;
  
        for (let ii = coefficients.length - 1; ii >= 0; ii--) {
          if (poly !== 0) {
            poly = coefficients[ii]* x^1;
          } else {
            poly = coefficients[ii];
          }
        }
         return poly;

}

function recreateSecret(sharesx : number[], sharesy : number[]){
    // need to interpolate over hte shares and fnd the value for a0
        let a0 : number = interpolate(sharesx, sharesy);
}

function interpolate( x: number[], y: number[]){
    let sum = 0;

    for (let i = 0; i < x.length; i++) {
      if (y[i]) {

        let product = lookupLogs[y[i]];

        for (let j = 0; j < x.length; j++) {
          if (i !== j) {
            product = (product + lookupLogs[0 ^ x[j]] - lookupLogs[x[i] ^ x[j]] + maxShares) % maxShares;
          }
        }

        // Note that undefined ^ anything = anything in Node.js
        sum = sum ^ lookupExponents[product];
      }
    }

    return sum;
}



