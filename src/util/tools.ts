import { ethers } from 'ethers'
import { Provider } from 'ethers/providers'
import { BigNumber, formatUnits } from 'ethers/utils'

export const isAddress = (address: string) => {
  try {
    ethers.utils.getAddress(address)
  } catch (e) {
    return false
  }
  return true
}

export const isContract = async (provider: Provider, address: string): Promise<boolean> => {
  const code = await provider.getCode(address)
  return !!code && code !== '0x'
}

export const range = (max: number): number[] => {
  return Array.from(new Array(max), (_, i) => i)
}

// Generate array of length size with values from 2^0 to 2^(size-1)
export const trivialPartition = (size: number) => {
  return range(size).reduce((acc: BigNumber[], _, index: number) => {
    const two = new BigNumber(2)
    acc.push(two.pow(index))
    return acc
  }, [])
}

export const formatBigNumber = (value: BigNumber, decimals: number, precision = 2): string =>
  Number(formatUnits(value, decimals)).toFixed(precision)