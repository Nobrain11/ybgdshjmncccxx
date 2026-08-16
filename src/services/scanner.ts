import { ethers } from 'ethers';
import { getProvider } from './wallet';

const ERC20_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function owner() view returns (address)',
  'function isBlacklisted(address) view returns (bool)',
];

export async function scanContract(address: string) {
  const provider = getProvider();
  const contract = new ethers.Contract(address, ERC20_ABI, provider);
  const results: any = { address };
  try {
    results.name = await contract.name();
  } catch { results.name = 'N/A'; }
  try {
    results.symbol = await contract.symbol();
  } catch { results.symbol = 'N/A'; }
  try {
    results.decimals = await contract.decimals();
  } catch { results.decimals = 18; }
  try {
    results.totalSupply = ethers.formatUnits(await contract.totalSupply(), results.decimals);
  } catch { results.totalSupply = 'N/A'; }
  try {
    const owner = await contract.owner();
    results.owner = owner;
    results.isRenounced = owner === '0x0000000000000000000000000000000000000000';
  } catch { results.owner = 'N/A'; }
  try {
    const blacklist = await contract.isBlacklisted('0x0000000000000000000000000000000000000000');
    results.hasBlacklist = true;
  } catch { results.hasBlacklist = false; }
  return results;
}
