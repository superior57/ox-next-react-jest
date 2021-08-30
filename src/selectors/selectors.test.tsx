import { eventToBedStatus } from '@/lib/utils'
import '@testing-library/jest-dom/extend-expect'

import {
  getUnitById,
  getBedById,
  getBeds,
  getBedStatusById,
  getBedStatus,
  isHighFallRisk,
  getFallRisk,
  getAlertSensitivity,
} from './selectors'

const arrayUnits = [
  {
    id: 103,
    unitId: 'f7910d1a-56b7-481c-b226-21b476a4f14e',
    name: 'ST',
    description: null,
    customerAccountId: 2,
    summary: {
      roomsTotal: 0,
      bedsTotal: 0,
      devicesTotal: 0,
      devicesOnline: 0,
    },
    details: {
      beds: [],
    },
  },
  {
    id: 100,
    unitId: 'a34f3866-cb1d-4426-b5fd-dcbb347aae91',
    name: 'Test2',
    description: null,
    customerAccountId: 2,
    summary: {
      roomsTotal: 0,
      bedsTotal: 0,
      devicesTotal: 0,
      devicesOnline: 0,
    },
    details: {
      beds: [],
    },
  },
  {
    id: 101,
    unitId: '0a1418cc-250a-47f7-bc4b-108e5b6aba53',
    name: 'WOW',
    description: null,
    customerAccountId: 2,
    summary: {
      roomsTotal: 0,
      bedsTotal: 0,
      devicesTotal: 0,
      devicesOnline: 0,
    },
    details: {
      beds: [],
    },
  },

  {
    id: 92,
    unitId: 'b70d4b65-8f86-4fdf-ad34-d1592f6fd6fa',
    name: 'zzq',
    description: null,
    customerAccountId: 2,
    summary: {
      roomsTotal: 1,
      bedsTotal: 5,
      devicesTotal: 5,
      devicesOnline: 5,
    },
    details: {
      beds: [],
    },
  },
]

const unit = {
  id: 92,
  unitId: 'b70d4b65-8f86-4fdf-ad34-d1592f6fd6fa',
  name: 'zzq',
  description: null,
  customerAccountId: 2,
  summary: {
    roomsTotal: 1,
    bedsTotal: 5,
    devicesTotal: 5,
    devicesOnline: 5,
  },
  details: {
    beds: [],
  },
}

const beds = [
  {
    id: null,
    bedId: 'f7558871-e3ac-11eb-8883-4b4b1617767e',
    bedName: 'room1-101',
    room: {
      assetId: 'd77dd480-e3ac-11eb-8883-4b4b1617767e',
      assetName: 'room1',
      assetType: 'ROOM',
      deviceCount: null,
      parent: {
        assetId: 'd2b242b0-e3ac-11eb-8883-4b4b1617767e',
        assetName: 'floor1',
        assetType: 'FLOOR',
        deviceCount: null,
        parent: null,
        children: null,
        devices: null,
      },
      children: null,
      devices: null,
    },
    patient: {
      id: 48,
      patientId: 'a01b427d-aac5-4f5e-b4bf-edf7dc351ec7',
      firstName: 'zhenqiu11111111',
      lastName: 'zhao',
      sex: '',
      age: null,
      dateOfBirth: null,
      phoneNumber: null,
      healthSummary: {
        baseline: null,
        baselineUpdatedAt: null,
        primaryDoctor: '',
        primaryNurse: '',
        primaryCondition: null,
        otherConditions: null,
      },
      tags: [
        {
          key: 'fall_risk',
          value: 'High',
        },
        {
          key: 'alert_sensitivity',
          value: 'FALL',
        },
      ],
      customerAccountId: null,
      unitId: 'b70d4b65-8f86-4fdf-ad34-d1592f6fd6fa',
      roomId: 'd77dd480-e3ac-11eb-8883-4b4b1617767e',
      bedId: 'f7558871-e3ac-11eb-8883-4b4b1617767e',
    },
    devices: [
      {
        id: null,
        deviceId: 'd1d4aaa0-26bb-11b2-8080-808080808080',
        serialNumber: '05146a0001016288',
        keyId: null,
        status: 'RUNNING',
      },
    ],
    alert: null,
  },
  {
    id: null,
    bedId: 'f75e3b01-e3ac-11eb-8883-4b4b1617767e',
    bedName: 'room1-102',
    room: {
      assetId: 'd77dd480-e3ac-11eb-8883-4b4b1617767e',
      assetName: 'room1',
      assetType: 'ROOM',
      deviceCount: null,
      parent: {
        assetId: 'd2b242b0-e3ac-11eb-8883-4b4b1617767e',
        assetName: 'floor1',
        assetType: 'FLOOR',
        deviceCount: null,
        parent: null,
        children: null,
        devices: null,
      },
      children: null,
      devices: null,
    },
    patient: {
      id: 49,
      patientId: '0aadb305-3278-46f4-a5bd-193500ba5a5f',
      firstName: 'zhenqiu',
      lastName: 'zhao',
      sex: '',
      age: null,
      dateOfBirth: null,
      phoneNumber: null,
      healthSummary: {
        baseline: null,
        baselineUpdatedAt: null,
        primaryDoctor: '',
        primaryNurse: '',
        primaryCondition: null,
        otherConditions: null,
      },
      tags: [
        {
          key: 'fall_risk',
          value: 'Medium',
        },
        {
          key: 'alert_sensitivity',
          value: 'BED_EXIT',
        },
      ],
      customerAccountId: null,
      unitId: 'b70d4b65-8f86-4fdf-ad34-d1592f6fd6fa',
      roomId: 'd77dd480-e3ac-11eb-8883-4b4b1617767e',
      bedId: 'f75e3b01-e3ac-11eb-8883-4b4b1617767e',
    },
    devices: [
      {
        id: null,
        deviceId: 'd1d63140-26bb-11b2-8080-808080808080',
        serialNumber: '00625a0001016c9c',
        keyId: null,
        status: 'RUNNING',
      },
    ],
    alert: {
      bedId: 'f75e3b01-e3ac-11eb-8883-4b4b1617767e',
      patientId: '0aadb305-3278-46f4-a5bd-193500ba5a5f',
      configId: 317,
      event: 'FALL',
      severity: 'Medium Risk',
      metric: null,
      duration: null,
      status: 1,
    },
  },
  {
    id: null,
    bedId: 'f9afea71-e0ff-11eb-8883-4b4b1617767e',
    bedName: 'room101',
    room: {
      assetId: '1e0c1a00-da3a-11eb-b26a-4b4b1617767e',
      assetName: 'room101',
      assetType: 'ROOM',
      deviceCount: null,
      parent: {
        assetId: '1dddde10-da3a-11eb-b26a-4b4b1617767e',
        assetName: 'floor1',
        assetType: 'FLOOR',
        deviceCount: null,
        parent: null,
        children: null,
        devices: null,
      },
      children: null,
      devices: null,
    },
    patient: null,
    devices: [
      {
        id: null,
        deviceId: '635adf70-1de9-11b2-8080-808080808080',
        serialNumber: 'a69b1a12390001b4',
        keyId: null,
        status: 'RUNNING',
      },
    ],
    alert: null,
  },
  {
    id: null,
    bedId: '0a83a8a1-e3ad-11eb-8883-4b4b1617767e',
    bedName: 'room1-105',
    room: {
      assetId: 'd77dd480-e3ac-11eb-8883-4b4b1617767e',
      assetName: 'room1',
      assetType: 'ROOM',
      deviceCount: null,
      parent: {
        assetId: 'd2b242b0-e3ac-11eb-8883-4b4b1617767e',
        assetName: 'floor1',
        assetType: 'FLOOR',
        deviceCount: null,
        parent: null,
        children: null,
        devices: null,
      },
      children: null,
      devices: null,
    },
    patient: {
      id: 52,
      patientId: 'a5090148-a505-407b-805d-d1a7195ba6be',
      firstName: 'zhenqiu',
      lastName: 'zhao',
      sex: '',
      age: null,
      dateOfBirth: null,
      phoneNumber: null,
      healthSummary: {
        baseline: null,
        baselineUpdatedAt: null,
        primaryDoctor: '',
        primaryNurse: '',
        primaryCondition: null,
        otherConditions: null,
      },
      tags: [
        {
          key: 'fall_risk',
          value: 'Medium',
        },
        {
          key: 'alert_sensitivity',
          value: 'BED_EXIT',
        },
      ],
      customerAccountId: null,
      unitId: 'b70d4b65-8f86-4fdf-ad34-d1592f6fd6fa',
      roomId: 'd77dd480-e3ac-11eb-8883-4b4b1617767e',
      bedId: '0a83a8a1-e3ad-11eb-8883-4b4b1617767e',
    },
    devices: [
      {
        id: null,
        deviceId: 'd1ebdc20-26bb-11b2-8080-808080808080',
        serialNumber: '03d53a000101fa5b',
        keyId: null,
        status: 'RUNNING',
      },
    ],
    alert: {
      bedId: '0a83a8a1-e3ad-11eb-8883-4b4b1617767e',
      patientId: 'a5090148-a505-407b-805d-d1a7195ba6be',
      configId: 332,
      event: 'FALL',
      severity: 'Medium Risk',
      metric: null,
      duration: null,
      status: 1,
    },
  },
]

const bed = {
  id: null,
  bedId: '0a83a8a1-e3ad-11eb-8883-4b4b1617767e',
  bedName: 'room1-105',
  room: {
    assetId: 'd77dd480-e3ac-11eb-8883-4b4b1617767e',
    assetName: 'room1',
    assetType: 'ROOM',
    deviceCount: null,
    parent: {
      assetId: 'd2b242b0-e3ac-11eb-8883-4b4b1617767e',
      assetName: 'floor1',
      assetType: 'FLOOR',
      deviceCount: null,
      parent: null,
      children: null,
      devices: null,
    },
    children: null,
    devices: null,
  },
  patient: {
    id: 52,
    patientId: 'a5090148-a505-407b-805d-d1a7195ba6be',
    firstName: 'zhenqiu',
    lastName: 'zhao',
    sex: '',
    age: null,
    dateOfBirth: null,
    phoneNumber: null,
    healthSummary: {
      baseline: null,
      baselineUpdatedAt: null,
      primaryDoctor: '',
      primaryNurse: '',
      primaryCondition: null,
      otherConditions: null,
    },
    tags: [
      {
        key: 'fall_risk',
        value: 'Medium',
      },
      {
        key: 'alert_sensitivity',
        value: 'BED_EXIT',
      },
    ],
    customerAccountId: null,
    unitId: 'b70d4b65-8f86-4fdf-ad34-d1592f6fd6fa',
    roomId: 'd77dd480-e3ac-11eb-8883-4b4b1617767e',
    bedId: '0a83a8a1-e3ad-11eb-8883-4b4b1617767e',
  },
  devices: [
    {
      id: null,
      deviceId: 'd1ebdc20-26bb-11b2-8080-808080808080',
      serialNumber: '03d53a000101fa5b',
      keyId: null,
      status: 'RUNNING',
    },
  ],
  alert: {
    bedId: '0a83a8a1-e3ad-11eb-8883-4b4b1617767e',
    patientId: 'a5090148-a505-407b-805d-d1a7195ba6be',
    configId: 332,
    event: 'FALL',
    severity: 'Medium Risk',
    metric: null,
    duration: null,
    status: 1,
  },
}

const patient = {
  id: 54,
  patientId: '766fdc7a-799d-4b41-ab63-d7fb30ae2691',
  firstName: 'test1',
  lastName: 'Tom',
  sex: 'male',
  age: 30,
  dateOfBirth: '1991/09/17',
  phoneNumber: '13290987890',
  healthSummary: {
    baseline: null,
    baselineUpdatedAt: null,
    primaryDoctor: '1',
    primaryNurse: '1',
    primaryCondition: null,
    otherConditions: null,
  },
  tags: [
    {
      key: 'fall_risk',
      value: 'High',
    },
    {
      key: 'alert_sensitivity',
      value: 'FALL',
    },
  ],
  customerAccountId: 2,
  unitId: '693c9963-bd32-4195-83c5-3df90f85a500',
  roomId: '25d2bc60-e44b-11eb-8883-4b4b1617767e',
  bedId: '1f5542e2-d958-11eb-aa22-42010a0a202c',
}

const bedState = {
  'f9afea71-e0ff-11eb-8883-4b4b1617767e': {
    alert: null,
    bedId: 'f9afea71-e0ff-11eb-8883-4b4b1617767e',
    bedName: 'room101',
    devices: [
      {
        deviceId: '635adf70-1de9-11b2-8080-808080808080',
        id: 0,
        keyId: 0,
        serialNumber: 'a69b1a12390001b4',
        status: 'RUNNING',
      },
    ],
    id: 0,
    patient: null,
    room: {
      assetId: '1e0c1a00-da3a-11eb-b26a-4b4b1617767e',
      assetName: 'room101',
      assetType: 'ROOM',
      children: [],
      deviceCount: 0,
      devices: [],
      parent: {
        assetId: '1dddde10-da3a-11eb-b26a-4b4b1617767e',
        assetName: 'floor1',
        assetType: 'FLOOR',
        children: [],
        deviceCount: 0,
        devices: [],
        parent: null,
      },
    },
  },
  'f7558871-e3ac-11eb-8883-4b4b1617767e': {
    alert: null,
    bedId: 'f7558871-e3ac-11eb-8883-4b4b1617767e',
    bedName: 'room1-101',
    devices: [
      {
        deviceId: 'd1d4aaa0-26bb-11b2-8080-808080808080',
        id: 0,
        keyId: 0,
        serialNumber: '05146a0001016288',
        status: 'RUNNING',
      },
    ],
    id: 0,
    patient: {
      age: 0,
      bedId: '0a83a8a1-e3ad-11eb-8883-4b4b1617767e',
      customerAccountId: 0,
      dateOfBirth: '',
      firstName: 'zhenqiu11111111',
      healthSummary: {
        baseline: '',
        baselineUpdatedAt: 0,
        otherConditions: [],
        primaryCondition: '',
        primaryDoctor: '',
        primaryNurse: '',
      },
      id: 48,
      lastName: 'zhao',
      patientId: 'a01b427d-aac5-4f5e-b4bf-edf7dc351ec7',
      phoneNumber: '',
      roomId: 'd77dd480-e3ac-11eb-8883-4b4b1617767e',
      sex: '',
      tags: [
        {
          key: 'fall_risk',
          value: 'High',
        },
        {
          key: 'alert_sensitivity',
          value: 'FALL',
        },
      ],
      unitId: 'b70d4b65-8f86-4fdf-ad34-d1592f6fd6fa',
    },
    room: {
      assetId: 'd77dd480-e3ac-11eb-8883-4b4b1617767e',
      assetName: 'room1',
      assetType: 'ROOM',
      children: [],
      deviceCount: 0,
      devices: [],
      parent: {
        assetId: 'd2b242b0-e3ac-11eb-8883-4b4b1617767e',
        assetName: 'floor1',
        assetType: 'FLOOR',
        children: [],
        deviceCount: 0,
        devices: [],
        parent: null,
      },
    },
  },
  'f75e3b01-e3ac-11eb-8883-4b4b1617767e': {
    alert: {
      bedId: 'f75e3b01-e3ac-11eb-8883-4b4b1617767e',
      configId: 317,
      duration: 0,
      event: 'FALL',
      metric: '',
      patientId: '0aadb305-3278-46f4-a5bd-193500ba5a5f',
      severity: 'Medium Risk',
      status: 1,
    },
    bedId: 'f75e3b01-e3ac-11eb-8883-4b4b1617767e',
    bedName: 'room1-102',
    devices: [
      {
        deviceId: 'd1d63140-26bb-11b2-8080-808080808080',
        id: 0,
        keyId: 0,
        serialNumber: '00625a0001016c9c',
        status: '',
      },
    ],
    id: 0,
    patient: {
      age: 0,
      bedId: 'f75e3b01-e3ac-11eb-8883-4b4b1617767e',
      customerAccountId: 0,
      dateOfBirth: '',
      firstName: 'zhenqiu',
      healthSummary: {
        baseline: '',
        baselineUpdatedAt: 0,
        otherConditions: [],
        primaryCondition: '',
        primaryDoctor: '',
        primaryNurse: '',
      },
      id: 49,
      lastName: 'zhao',
      patientId: '0aadb305-3278-46f4-a5bd-193500ba5a5f',
      phoneNumber: '',
      roomId: 'd77dd480-e3ac-11eb-8883-4b4b1617767e',
      sex: '',
      tags: [
        {
          key: 'fall_risk',
          value: 'Medium',
        },
        {
          key: 'alert_sensitivity',
          value: 'BED_EXIT',
        },
      ],
      unitId: 'b70d4b65-8f86-4fdf-ad34-d1592f6fd6fa',
    },
    room: {
      assetId: 'd77dd480-e3ac-11eb-8883-4b4b1617767e',
      assetName: 'room1',
      assetType: 'ROOM',
      children: [],
      deviceCount: 0,
      devices: [],
      parent: {
        assetId: 'd2b242b0-e3ac-11eb-8883-4b4b1617767e',
        assetName: 'floor1',
        assetType: 'FLOOR',
        children: [],
        deviceCount: 0,
        devices: [],
        parent: null,
      },
    },
  },
}

describe('Selectors', () => {
  it('getUnitById', () => {
    expect(getUnitById(unit.unitId, arrayUnits)).toMatchObject(unit)
  })
  it('getBedById', () => {
    expect(getBedById(bed.bedId, beds)).toMatchObject(bed)
  })
  it('get bed details', () => {
    expect(getBeds(unit)).toMatchObject(unit.details.beds)
  })
  it('getBedStatusById', () => {
    expect(getBedStatusById('0a83a8a1-e3ad-11eb-8883-4b4b1617767e', bedState)).toBe('Loading')
    expect(getBedStatusById('f7558871-e3ac-11eb-8883-4b4b1617767e', bedState)).toBe('Unknown')
    expect(getBedStatusById('f75e3b01-e3ac-11eb-8883-4b4b1617767e', bedState)).toBe('Offline')
    expect(getBedStatusById('f9afea71-e0ff-11eb-8883-4b4b1617767e', bedState)).toBe('Unassigned')
  })
  it('getBedStatus loading fall', () => {
    expect(getBedStatus(bed)).toBe('Fall')
  })
  it('getBedStatus Unassigned', () => {
    const bed = {
      id: null,
      bedId: '0a83a8a1-e3ad-11eb-8883-4b4b1617767e',
      bedName: 'room1-105',
      room: {
        assetId: 'd77dd480-e3ac-11eb-8883-4b4b1617767e',
        assetName: 'room1',
        assetType: 'ROOM',
        deviceCount: null,
        parent: {
          assetId: 'd2b242b0-e3ac-11eb-8883-4b4b1617767e',
          assetName: 'floor1',
          assetType: 'FLOOR',
          deviceCount: null,
          parent: null,
          children: null,
          devices: null,
        },
        children: null,
        devices: null,
      },
      devices: [
        {
          id: null,
          deviceId: 'd1ebdc20-26bb-11b2-8080-808080808080',
          serialNumber: '03d53a000101fa5b',
          keyId: null,
          status: 'RUNNING',
        },
      ],
      alert: {
        bedId: '0a83a8a1-e3ad-11eb-8883-4b4b1617767e',
        patientId: 'a5090148-a505-407b-805d-d1a7195ba6be',
        configId: 332,
        event: 'FALL',
        severity: 'Medium Risk',
        metric: null,
        duration: null,
        status: 1,
      },
    }

    expect(getBedStatus(bed)).toBe('Unassigned')
  })
  it('getBedStatus Offline', () => {
    const bed = {
      id: null,
      bedId: '0a83a8a1-e3ad-11eb-8883-4b4b1617767e',
      bedName: 'room1-105',
      room: {
        assetId: 'd77dd480-e3ac-11eb-8883-4b4b1617767e',
        assetName: 'room1',
        assetType: 'ROOM',
        deviceCount: null,
        parent: {
          assetId: 'd2b242b0-e3ac-11eb-8883-4b4b1617767e',
          assetName: 'floor1',
          assetType: 'FLOOR',
          deviceCount: null,
          parent: null,
          children: null,
          devices: null,
        },
        children: null,
        devices: null,
      },
      patient: {
        id: 52,
        patientId: 'a5090148-a505-407b-805d-d1a7195ba6be',
        firstName: 'zhenqiu',
        lastName: 'zhao',
        sex: '',
        age: null,
        dateOfBirth: null,
        phoneNumber: null,
        healthSummary: {
          baseline: null,
          baselineUpdatedAt: null,
          primaryDoctor: '',
          primaryNurse: '',
          primaryCondition: null,
          otherConditions: null,
        },
        tags: [
          {
            key: 'fall_risk',
            value: 'Medium',
          },
          {
            key: 'alert_sensitivity',
            value: 'BED_EXIT',
          },
        ],
        customerAccountId: null,
        unitId: 'b70d4b65-8f86-4fdf-ad34-d1592f6fd6fa',
        roomId: 'd77dd480-e3ac-11eb-8883-4b4b1617767e',
        bedId: '0a83a8a1-e3ad-11eb-8883-4b4b1617767e',
      },
      devices: [
        {
          id: null,
          deviceId: 'd1ebdc20-26bb-11b2-8080-808080808080',
          serialNumber: '03d53a000101fa5b',
          keyId: null,
          status: 'Fall',
        },
      ],
      alert: {
        bedId: '0a83a8a1-e3ad-11eb-8883-4b4b1617767e',
        patientId: 'a5090148-a505-407b-805d-d1a7195ba6be',
        configId: 332,
        event: 'FALL',
        severity: 'Medium Risk',
        metric: null,
        duration: null,
        status: 1,
      },
    }
    expect(getBedStatus(bed)).toBe('Offline')
  })
  it('getBedStatus Loading', () => {
    const bed = null
    expect(getBedStatus(bed)).toBe('Loading')
  })
  it('getBedStatus Unknown', () => {
    const bed = {
      id: null,
      bedId: '0a83a8a1-e3ad-11eb-8883-4b4b1617767e',
      bedName: 'room1-105',
      room: {
        assetId: 'd77dd480-e3ac-11eb-8883-4b4b1617767e',
        assetName: 'room1',
        assetType: 'ROOM',
        deviceCount: null,
        parent: {
          assetId: 'd2b242b0-e3ac-11eb-8883-4b4b1617767e',
          assetName: 'floor1',
          assetType: 'FLOOR',
          deviceCount: null,
          parent: null,
          children: null,
          devices: null,
        },
        children: null,
        devices: null,
      },
      patient: {
        id: 52,
        patientId: 'a5090148-a505-407b-805d-d1a7195ba6be',
        firstName: 'zhenqiu',
        lastName: 'zhao',
        sex: '',
        age: null,
        dateOfBirth: null,
        phoneNumber: null,
        healthSummary: {
          baseline: null,
          baselineUpdatedAt: null,
          primaryDoctor: '',
          primaryNurse: '',
          primaryCondition: null,
          otherConditions: null,
        },
        tags: [
          {
            key: 'fall_risk',
            value: 'Medium',
          },
          {
            key: 'alert_sensitivity',
            value: 'BED_EXIT',
          },
        ],
        customerAccountId: null,
        unitId: 'b70d4b65-8f86-4fdf-ad34-d1592f6fd6fa',
        roomId: 'd77dd480-e3ac-11eb-8883-4b4b1617767e',
        bedId: '0a83a8a1-e3ad-11eb-8883-4b4b1617767e',
      },
      devices: [
        {
          id: null,
          deviceId: 'd1ebdc20-26bb-11b2-8080-808080808080',
          serialNumber: '03d53a000101fa5b',
          keyId: null,
          status: 'Fall',
        },
      ],
      alert: {
        bedId: '0a83a8a1-e3ad-11eb-8883-4b4b1617767e',
        patientId: 'a5090148-a505-407b-805d-d1a7195ba6be',
        configId: 332,
        event: '',
        severity: 'Medium Risk',
        metric: null,
        duration: null,
        status: 1,
      },
    }
    expect(eventToBedStatus(bed.alert.event)).toBe('Unknown')
  })
  it('isHighFallRisk returns true', () => {
    expect(isHighFallRisk(patient)).toBeTruthy()
  })
  it('getFallRisk returns true', () => {
    expect(getFallRisk(patient)).toBeTruthy()
  })
  it('getAlertSensitivity returns FALL', () => {
    expect(getAlertSensitivity(patient)).toBe('FALL')
  })
})
