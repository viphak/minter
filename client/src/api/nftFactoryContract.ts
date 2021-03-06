import { TezosToolkit } from '@taquito/taquito';
import { TransactionWalletOperation } from '@taquito/taquito';
import {
  OperationContentsAndResultTransaction,
  OperationResultTransaction
} from '@taquito/rpc';
import { Address } from './contractUtil';

export interface NftFactoryContract {
  createNftContract(name: string): Promise<string>;
}

const mkNftFactoryContract = async (
  tzClient: TezosToolkit,
  factoryAddress: Address
): Promise<NftFactoryContract> => {
  const factory = await tzClient.wallet.at(factoryAddress);

  return {
    async createNftContract(name: string): Promise<Address> {
      const operation = await factory.methods.main(name).send();
      await operation.confirmation();
      return extractOriginatedContractAddress(operation);
    }
  };
};

async function extractOriginatedContractAddress(
  op: TransactionWalletOperation
): Promise<Address> {
  const txResults = await op.operationResults();
  const txResult = txResults[0] as OperationContentsAndResultTransaction;

  if (!txResult.metadata.internal_operation_results)
    throw new Error('Unavailable internal origination operation');

  const internalResult = txResult.metadata.internal_operation_results[0]
    .result as OperationResultTransaction;

  if (!internalResult.originated_contracts)
    throw new Error('Originated contract address is unavailable');

  return internalResult.originated_contracts[0];
}

export default mkNftFactoryContract;
