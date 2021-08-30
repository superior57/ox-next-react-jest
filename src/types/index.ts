import { alertSensitivity, fallRisk } from '@/lib/constants'

export interface DataFetcher<T> {
  readonly data: T
  readonly isLoading: boolean
  readonly isError: boolean
}

export interface Option {
  readonly label: string
  readonly value: string
}

// https://github.com/dawnlight-ai-for-good/chronicare-api/blob/develop/src/main/resources/swagger/iot-api.yaml#L652
export type DeviceStatus = 'RUNNING' | 'STOP' | 'OPENING' | 'CLOSEING' | 'BREAKDOWN'

export type BedStatus =
  | 'Loading'
  | 'Unknown'
  | 'Unassigned'
  | 'Offline'
  | 'Still'
  | 'MultiplePeople'
  | 'Restless'
  | 'LikelyBedExit'
  | 'BedExit'
  | 'Fall'

export type FallRisk = typeof fallRisk[keyof typeof fallRisk]

export type AlertSensitivity = typeof alertSensitivity[keyof typeof alertSensitivity]

export interface WSBedAlert {
  bedId: string
  configId: number
  duration: number
  event: string
  metric: string
  patientId: string
  severity: string
  status: number
}

export interface WSBed {
  alert: WSBedAlert
  bedId: string
  bedName: string
  devices: {
    deviceId: string
    id: number
    keyId: number
    serialNumber: string
    status: string
  }[]
  patient: {
    age: number
    bedId: string
    firstName: string
    sex: string
    id: number
    lastName: string
    patientId: string
  }
}

export interface WSMessage {
  messageType: string
}

// Ideally we should be getting these types from the API specs directly
// TBD when we work on API versioning and release
export interface WSInitMessage {
  available: number
  beds: WSBed[]
  total: number
  messageType: 'init'
}

export interface WSEventMessage extends WSBedAlert {
  messageType: 'event'
}

export interface WSBedMapping {
  [bedId: string]: WSBed
}

// this is auto-generated from:
// https://github.com/dawnlight-ai-for-good/chronicare-api/blob/develop/src/main/resources/swagger/swagger.yaml
// using https://github.com/drwpow/openapi-typescript
export * from './Api'
