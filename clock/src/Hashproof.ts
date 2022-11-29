
import { Field, Experimental, Circuit , UInt64, Poseidon} from 'snarkyjs';


export const HASH_PER_BREAKPOINT = 1000000;
export function runHash(counter: number,  x: Field): Field {
  let res = x;
  for (let ii = counter; ii < counter + HASH_PER_BREAKPOINT; ++ii) {
    res = Poseidon.hash([res]);

  }
  return res;
}



export const HashProof = Experimental.ZkProgram({
    publicInput: Field,
  
    methods: {
      run: {
        privateInputs: [],
  
        method(hashValue: Field) {
          let finalHash = runHash(0,hashValue);
          hashValue.assertEquals(finalHash);
        },
      }
    }
  });

  //TODO  ? do this with a reducer ?

// start of counter and limit of counter
function searchHashChain(start: UInt64, limit : UInt64, startHash : Field, requiredHash : Field) : boolean{
  let res = startHash;
  let found = false;
  for (let ii = start.toBigInt(); ii < limit.toBigInt(); ii++) {
     res = Poseidon.hash([res]);
     found =  Circuit.if((res==requiredHash),true,false);
  }

  return found;
}
