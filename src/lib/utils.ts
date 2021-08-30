/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { BedStatus, definitions, Option, WSEventMessage, WSInitMessage, WSMessage } from '@/types'
import isPlainObject from 'lodash/isPlainObject'

export const stringIsNullOrEmpty = (str: string): boolean => (str ? false : true)

export const flattenQueryString = (queryString: string | string[]): string => {
  if (Array.isArray(queryString)) {
    return queryString.length > 0 ? queryString[0] : undefined
  }
  return queryString
}

export const fromAssetToOption = ({ assetId, assetName }: definitions['Asset']): Option => ({
  label: assetName,
  value: assetId,
})

export const arraysAreEqual = (
  array1: Array<string | number>,
  array2: Array<string | number>
): boolean => {
  if (!Array.isArray(array1) || !Array.isArray(array2) || array1.length !== array2.length) {
    return false
  }

  // .concat() to not mutate arguments
  const arr1 = array1.concat().sort()
  const arr2 = array2.concat().sort()

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false
    }
  }

  return true
}

export const firstItemIfArray = <T>(array: Array<T>): T | null => {
  return Array.isArray(array) && array.length > 0 ? array[0] : null
}

export const isWSMessage = (obj: any): obj is WSMessage =>
  isPlainObject(obj) ? 'messageType' in obj : false

export const isWSInitMessage = (obj: WSMessage): obj is WSInitMessage => obj.messageType === 'init'
export const isWSEventMessage = (obj: WSMessage): obj is WSEventMessage =>
  obj.messageType === 'event'

export const eventToBedStatus = (event: string): BedStatus => {
  // we explicitly filter and normalize the event name since the frontend must have an exact match from the API
  // https://dawnlight.atlassian.net/browse/ENV1-224
  switch (event) {
    case 'STILL':
      return 'Still'
    case 'RESTLESS':
      return 'Restless'
    case 'LIKELY_BED_EXIT':
      return 'LikelyBedExit'
    case 'BED_EXIT':
      return 'BedExit'
    case 'FALL':
      return 'Fall'
    case 'MULTI_PEOPLE':
      return 'MultiplePeople'
    case 'InvalidEventType':
    case 'UNKNOWN':
    default:
      return 'Unknown'
  }
}
