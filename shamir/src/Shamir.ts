import { SmartContract, method, UInt32,UInt64, Field , Circuit, Struct} from 'snarkyjs';

export class SharePoint extends Struct({
  x_value : UInt64,
  y_value : UInt64,

}){
  
}


export function evaluatePolynomial( x : UInt64, coefficients : UInt64[]) : UInt64 {

  let poly : UInt64 = UInt64.zero;

  for (let ii = coefficients.length - 1; ii > 0; ii--) {
    let xval  = UInt64.one;
    for (let jj = 0; jj < ii; jj++) {
      xval =  x.mul(xval);
    }
    poly = poly.add ( xval.mul(coefficients[ii] ));
  }
  poly = poly.add(coefficients[0]);
   return poly;

}


export function interpolate(x_shares : UInt64[], y_shares: UInt64[], poly_degree : UInt64) : UInt64 {
  let basis  : UInt64 = UInt64.one;
  let result  : UInt64 = UInt64.zero;
  for (let ii=0;ii<poly_degree.toBigInt();ii++){

      let x = 0;
      for (let jj=0;jj<poly_degree.toBigInt();jj++){
        if (ii == jj) {
          continue;
        }
        let num  : UInt64= x_shares[jj].add(x);
        let denom : UInt64 = x_shares[ii].add(x_shares[jj]);
        let term  : UInt64 =  num.div(denom);
        basis = basis.mul(term);
      }
      let group : UInt64 = y_shares[ii].mul(basis);
     result = result.add(group);

  }

  return result;
}


export class Shamir extends SmartContract {

  @method makeRandomShares(
    secret: UInt32,
    number_shares : UInt64,
    poly_degree : UInt64,
    
  ) : UInt64[] {
  const MAX_COEFF = 13;
  let shares_x : Array<UInt64> = [];
  let shares_y : Array<UInt64> = [];
  let coeffs : Array<UInt64> = [];
  
    for (let ii=0;ii<poly_degree.toBigInt();ii++){
      let x  = UInt64.from(Field.random());
      coeffs[ii]  = x.mod (MAX_COEFF);
    }

     for (let ii=0;ii<number_shares.toBigInt();ii++){
       
      
      shares_x[ii]  = UInt64.from(ii);
      shares_y[ii] = evaluatePolynomial(shares_x[ii],coeffs);
     }




    return shares_y;
  }


  @method recreateSecret(sharesx1 : UInt64, sharesy1 : UInt64,sharesx2 : UInt64 , sharesy2 : UInt64 ): UInt64 {
    // need to interpolate over the shares and find 
    // the value for the zero coeeficient
 
    let secret = interpolate([sharesx1,sharesx2],[sharesy1,sharesy2] ,UInt64.from(2));


    return secret;
}

@method submitEncryptedShare(){

}

}