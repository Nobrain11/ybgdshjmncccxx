import { ethers } from 'ethers';
import { getProvider } from './wallet';

const LENS_ABI = [
  'function getTokenState(address token) external view returns (address curve, address feeShare, bytes32 poolId, bool migrated, uint256 realQuoteReserves, uint256 thresholdQuote, uint256 virtualQuoteReserves, uint256 virtualBaseReserves, uint256 totalSupply)',
];
const BONDING_CURVE_ABI = [
  'function buy(uint256 minTokensOut, address recipient) external payable returns (uint256)',
  'function sell(uint256 tokensIn, uint256 minEthOut, address recipient) external returns (uint256)',
  'function getBuyPrice(uint256 ethIn) external view returns (uint256 tokensOut, uint256 fee)',
  'function getSellPrice(uint256 tokensIn) external view returns (uint256 ethOut, uint256 fee)',
  'function migrated() external view returns (bool)',
];
const ERC20_ABI = [
  'function approve(address spender, uint amount) external returns (bool)',
  'function balanceOf(address account) external view returns (uint)',
];

const LENS_ADDRESS = '0xC82Db941dAf90B754aecb5F7D14c683dc608d595';
const UNIVERSAL_ROUTER = '0x8876789976dEcBfCbBbe364623C63652db8C0904';
const V4_QUOTER = '0x8Dc178eFB8111BB0973Dd9d722ebeFF267c98F94';

export async function getTokenPhase(token: string) {
  const lens = new ethers.Contract(LENS_ADDRESS, LENS_ABI, getProvider());
  const state = await lens.getTokenState(token);
  return { migrated: state.migrated, curve: state.curve, poolId: state.poolId };
}

export async function getQuote(token: string, ethIn: string, isBuy: boolean) {
  const { migrated, curve } = await getTokenPhase(token);
  if (!migrated) {
    const curveContract = new ethers.Contract(curve, BONDING_CURVE_ABI, getProvider());
    const [tokensOut, fee] = await curveContract.getBuyPrice(ethIn);
    return { tokensOut, fee, isBondingCurve: true };
  } else {
    // Uniswap V4 quote (simplified)
    // In production, use V4Quoter properly
    throw new Error('Uniswap V4 quote not implemented yet');
  }
}

export async function executeTrade(token: string, amount: string, isBuy: boolean, privateKey: string, minOut?: string) {
  const wallet = new ethers.Wallet(privateKey, getProvider());
  const { migrated, curve } = await getTokenPhase(token);
  if (!migrated) {
    const curveContract = new ethers.Contract(curve, BONDING_CURVE_ABI, wallet);
    if (isBuy) {
      const tx = await curveContract.buy(minOut || '0', wallet.address, { value: amount });
      return await tx.wait();
    } else {
      const tokenContract = new ethers.Contract(token, ERC20_ABI, wallet);
      await tokenContract.approve(curve, amount);
      const tx = await curveContract.sell(amount, minOut || '0', wallet.address);
      return await tx.wait();
    }
  } else {
    // Uniswap V4 via UniversalRouter (placeholder)
    throw new Error('Uniswap V4 execution not implemented yet');
  }
}
