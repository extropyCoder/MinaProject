import { Field, SmartContract, state, State, Poseidon, Proof, UInt64, method, Experimental, Circuit } from 'snarkyjs';
import { HashProof } from './Hashproof';


export const HASH_PER_BREAKPOINT = 1000000;
export function runHash(counter: number,  x: Field): Field {
  let res = x;
  for (let ii = counter; ii < counter + HASH_PER_BREAKPOINT; ++ii) {
    res = Poseidon.hash([res]);

  }
  return res;
}








export class Clock extends SmartContract {
  @state(Field) startHash = State<Field>();
  @state(Field) counter = State<Field>();

  init() {
    super.init();
    this.startHash.set(Field(0));
    this.counter.set(Field(0));
  }


  // get the previous checkpoint values
  @method getCheckpoint(){

    let start = this.startHash.get();
    this.startHash.assertEquals(start);
    let counter = this.counter.get();
    this.counter.assertEquals(counter);
  }

  // run the calculation
  // and submit proof that it has worked
 // @method updateCheckpoint(counter : Field, lastHash : Field, aProof : HashProof.Proof){

 // }

}
