import { Clock } from './Clock';
import {
  isReady,
  shutdown,
  Field,
  Mina,
  PrivateKey,
  PublicKey,
  AccountUpdate,
} from 'snarkyjs';



let proofsEnabled = false;

describe('Hash', () => {
  let deployerAccount: PrivateKey,
    zkAppAddress: PublicKey,
    zkAppPrivateKey: PrivateKey,
    zkApp: Clock;

  beforeAll(async () => {
    await isReady;
    if (proofsEnabled) Clock.compile();
  });

  beforeEach(() => {
    const Local = Mina.LocalBlockchain({ proofsEnabled });
    Mina.setActiveInstance(Local);
    deployerAccount = Local.testAccounts[0].privateKey;
    zkAppPrivateKey = PrivateKey.random();
    zkAppAddress = zkAppPrivateKey.toPublicKey();
    zkApp = new Clock(zkAppAddress);
  });

  afterAll(() => {

    setTimeout(shutdown, 0);
  });

  async function localDeploy() {
    const txn = await Mina.transaction(deployerAccount, () => {
      AccountUpdate.fundNewAccount(deployerAccount);
      zkApp.deploy();
    });
    await txn.prove();
    // this tx needs .sign(), because `deploy()` adds an account update that requires signature authorization
    await txn.sign([zkAppPrivateKey]).send();
  }

  it('generates and deploys Clock', async () => {
    await localDeploy();
    //TODO

  });

  it('runs the hash function on the contract', async () => {
    await localDeploy();

    // update transaction
    const txn = await Mina.transaction(deployerAccount, () => {

    });
    await txn.prove();
    await txn.send();
    //TODO 

  });
});
