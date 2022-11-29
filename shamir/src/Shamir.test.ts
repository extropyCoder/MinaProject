import { evaluatePolynomial, Shamir } from './Shamir';
import {
  isReady,
  shutdown,
  UInt64,
  Field,
  Mina,
  PrivateKey,
  PublicKey,
  AccountUpdate,
} from 'snarkyjs';
//import { evaluatePolynomial } from './Intrpolate';



let proofsEnabled = false;

describe('Shamir', () => {
  let deployerAccount: PrivateKey,
    zkAppAddress: PublicKey,
    zkAppPrivateKey: PrivateKey,
    zkApp: Shamir;

    beforeAll(async () => {
      await isReady;
      if (proofsEnabled) Shamir.compile();
    });

  

    beforeEach(() => {
      const Local = Mina.LocalBlockchain({ proofsEnabled });
      Mina.setActiveInstance(Local);
      deployerAccount = Local.testAccounts[0].privateKey;
      zkAppPrivateKey = PrivateKey.random();
      zkAppAddress = zkAppPrivateKey.toPublicKey();
      zkApp = new Shamir(zkAppAddress);
    });
  

  afterAll(async () => {
    setTimeout(shutdown, 0);
  });

  it('generates and deploys the `Shamir` smart contract', async () => {
    const zkAppInstance = new Shamir(zkAppAddress);
    await localDeploy();
  });

  // it('creates points', async () => {
  //   //const _PRIME = 2 ** 127 - 1;
  //   const zkAppInstance = new Shamir(zkAppAddress);
  //   await localDeploy();
  //   const txn = await Mina.transaction(deployerAccount, () => {
  //     zkAppInstance.makeRandomShares(
  //       UInt32.from(1234),
  //       UInt32.from(3),
  //       UInt32.from(87878),
  //       UInt32.from(2323),
  //       UInt32.from(2323),
  //       UInt32.from(2323)
  //     );
  //     zkAppInstance.sign(zkAppPrivateKey);
  //   });
  //   await txn.prove();
  //   await txn.send();
  // });


  // it('evaluates a polynomial at points', async () => {

  //   const zkAppInstance = new Shamir(zkAppAddress);
  //   await localDeploy();
  //   const txn = await Mina.transaction(deployerAccount, () => {
  //     const coeffs = [1,2,3];
  //     zkAppInstance.evaluatePolynomial(4,coeffs);

  //   });
  //   await txn.prove();
  //   await txn.send();
  // });

  // it('tests power', async () => {

  //   const zkAppInstance = new Shamir(zkAppAddress);
  //   await localDeploy();
  //   const txn = await Mina.transaction(deployerAccount, () => {
  //     const pow1 = 2;
  //     const x = 5;
  //     const res = power(x,pow1);
  //     expect(res).toEqual(25);

  //   });
  //   await txn.prove();
  //   await txn.send();
  // });

  it('tests polynomial', async () => {

    const zkAppInstance = new Shamir(zkAppAddress);
    await localDeploy();
    const txn = await Mina.transaction(deployerAccount, () => {
    
      let x  = UInt64.from(2);
      const res = evaluatePolynomial(x,[UInt64.from(2),UInt64.from(1),UInt64.from(1)]);
      expect(res).toEqual(UInt64.from(8));

    });
    await txn.prove();
    await txn.send();
  });

  it('tests polynomial 2', async () => {

    const zkAppInstance = new Shamir(zkAppAddress);
    await localDeploy();
    const txn = await Mina.transaction(deployerAccount, () => {
    
      let x  = UInt64.from(5);
      const res = evaluatePolynomial(x,[UInt64.from(3),UInt64.from(2),UInt64.from(1)]);
      expect(res).toEqual(UInt64.from(38));

    });
    await txn.prove();
    await txn.send();
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




});