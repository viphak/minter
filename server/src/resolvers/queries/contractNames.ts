import _ from 'lodash';

import { mkTzStats, TzStats, Address, BigMapItem } from './tzStats';
import { Context } from '../../components/context';
import { all } from 'ramda';

interface ContractBigMapValue {
  owner: Address;
  name: string;
}

export interface Contract {
  address: Address;
  name: string;
}

const contractNftOwners = async (
  tzStats: TzStats,
  contractAddress: Address
): Promise<Address[]> => {
  const contract = await tzStats.contractByAddress(contractAddress);
  const [ledgerId] = _(contract.bigmap_ids).uniq().sort().value();

  const ledgerBigMap = await tzStats.bigMapById<string>(ledgerId);
  const values = await ledgerBigMap.values();
  return values.map(v => v.value);
};

const filterContractsByNftOwner = async (
  tzStats: TzStats,
  contracts: Contract[],
  nftOwnerAddress: Address
) => {
  const PairPromises = contracts.map(
    async (c): Promise<[string, Set<string>]> => {
      const owners = await contractNftOwners(tzStats, c.address);
      return [c.address, new Set(owners)];
    }
  );

  const pairs = await Promise.all(PairPromises);
  const contractToNftOwners = _.fromPairs(pairs);
  return contracts.filter(c => contractToNftOwners[c.address].has(nftOwnerAddress));
};

export const contractNames = async (
  contractOwnerAddress: string | null | undefined,
  nftOwnerAddress: string | null | undefined,
  ctx: Context
): Promise<Contract[]> => {
  const factoryAddress = ctx.configStore.get('contracts.nftFactory') as string;
  const faucetAddress = ctx.configStore.get('contracts.nftFaucet') as string;
  const tzStats = mkTzStats(ctx.tzStatsApiUrl);

  const contract = await tzStats.contractByAddress(factoryAddress);
  const bigMapId = contract.bigmap_ids[0];

  const bigMap = await tzStats.bigMapById<ContractBigMapValue>(bigMapId);
  const contractValues = await bigMap.values();

  const filteredContractValues = !_.isNil(contractOwnerAddress)
    ? contractValues.filter(i => i.value.owner === contractOwnerAddress)
    : contractValues;

  const contracts = filteredContractValues.map(i => ({
    address: i.key,
    name: i.value.name
  }));

  const allContracts = [{ address: faucetAddress, name: 'Minter' }, ...contracts];
  
  if (_.isNil(nftOwnerAddress))
    return allContracts;

  return filterContractsByNftOwner(tzStats, allContracts, nftOwnerAddress);
};
