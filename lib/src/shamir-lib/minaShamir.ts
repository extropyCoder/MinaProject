import { Field, SmartContract, method } from 'snarkyjs';

export class Shamir extends SmartContract {
  @method makeRandomShares(
    secret: Field,
    minimum: Field,
    range: number,
    shares: Field,
    prime: Field,
    RINT: Field
  ) {
    const arr = [];
    for (let i = range; i >= 0; i--) {
      let s = secret.add(RINT.mul(prime.sub(1)));
      arr.push(s);
    }
    return arr;
  }
}
