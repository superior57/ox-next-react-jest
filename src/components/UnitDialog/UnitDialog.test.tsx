import React from 'react'
import '@testing-library/jest-dom'
import { render, fireEvent, screen } from '@/lib/test-utils'
import { UnitDialog } from './UnitDialog'
import { waitFor } from '@testing-library/react'

const onClose = jest.fn()
const isOpen = true
const buildings = [
  {
    assetId: 'cabf8040-e3ac-11eb-8883-4b4b1617767e',
    assetName: 'ATest-zzq',
    assetType: 'BUILDING',
    deviceCount: null,
    parent: null,
    children: null,
    devices: null,
  },
  {
    assetId: '4f9549f0-d53c-11eb-b5be-9d10abbc879d',
    assetName: 'Dawnlight-Test-House',
    assetType: 'BUILDING',
    deviceCount: null,
    parent: null,
    children: null,
    devices: null,
  },
  {
    assetId: '1db26140-da3a-11eb-b26a-4b4b1617767e',
    assetName: 'QAAlertTest',
    assetType: 'BUILDING',
    deviceCount: null,
    parent: null,
    children: null,
    devices: null,
  },
  {
    assetId: '035db330-e449-11eb-8883-4b4b1617767e',
    assetName: 'QAtest342',
    assetType: 'BUILDING',
    deviceCount: null,
    parent: null,
    children: null,
    devices: null,
  },
  {
    assetId: '25bcea70-e44b-11eb-8883-4b4b1617767e',
    assetName: 'QAtest604',
    assetType: 'BUILDING',
    deviceCount: null,
    parent: null,
    children: null,
    devices: null,
  },
  {
    assetId: '14dc7b30-db81-11eb-b26a-4b4b1617767e',
    assetName: 'real clone building',
    assetType: 'BUILDING',
    deviceCount: null,
    parent: null,
    children: null,
    devices: null,
  },
]
const building = {
  assetId: '4f9549f0-d53c-11eb-b5be-9d10abbc879d',
  assetName: 'Dawnlight-Test-House',
  assetType: 'BUILDING',
  deviceCount: 3,
  parent: null,
  children: [
    {
      assetId: '606dba50-d53c-11eb-b5be-9d10abbc879d',
      assetName: 'QA Floor',
      assetType: 'FLOOR',
      deviceCount: 3,
      parent: null,
      children: null,
      devices: null,
    },
    {
      assetId: 'd2cfbf40-ee40-11eb-870f-4b4b1617767e',
      assetName: 'QA Installation',
      assetType: 'FLOOR',
      deviceCount: 0,
      parent: null,
      children: null,
      devices: null,
    },
    {
      assetId: '0426d510-db81-11eb-b26a-4b4b1617767e',
      assetName: 'clone building test',
      assetType: 'FLOOR',
      deviceCount: 0,
      parent: null,
      children: null,
      devices: null,
    },
  ],
  devices: null,
}
const availableBeds = [
  {
    id: null,
    bedId: '71ed4341-ebfd-11eb-95fb-4b4b1617767e',
    bedName: 'Demo Eyecloud',
    room: {
      assetId: 'fba3b980-db80-11eb-b26a-4b4b1617767e',
      assetName: 'clone floor test',
      assetType: 'ROOM',
      deviceCount: null,
      parent: {
        assetId: '606dba50-d53c-11eb-b5be-9d10abbc879d',
        assetName: 'QA Floor',
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
        deviceId: '635d0250-1de9-11b2-8080-808080808080',
        serialNumber: '3e2c2c1240000589',
        keyId: null,
        status: 'RUNNING',
      },
    ],
    alert: null,
  },
  {
    id: null,
    bedId: '6352edf1-ebfb-11eb-95fb-4b4b1617767e',
    bedName: 'Mahesh',
    room: {
      assetId: '6db4c690-d53c-11eb-b5be-9d10abbc879d',
      assetName: 'QA Room',
      assetType: 'ROOM',
      deviceCount: null,
      parent: {
        assetId: '606dba50-d53c-11eb-b5be-9d10abbc879d',
        assetName: 'QA Floor',
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
        deviceId: 'd1f35630-26bb-11b2-8080-808080808080',
        serialNumber: '56609a0001022bab',
        keyId: null,
        status: 'STOP',
      },
    ],
    alert: null,
  },
]
const units = [
  {
    id: 81,
    unitId: '693c9963-bd32-4195-83c5-3df90f85a500',
    name: 'Demo ICCU2',
    description: null,
    customerAccountId: 2,
    summary: {
      roomsTotal: 1,
      bedsTotal: 1,
      devicesTotal: 1,
      devicesOnline: 0,
    },
    details: {
      beds: [
        {
          id: null,
          bedId: '1f5542e2-d958-11eb-aa22-42010a0a202c',
          bedName: 'Bed1',
          room: {
            assetId: '6db4c690-d53c-11eb-b5be-9d10abbc879d',
            assetName: 'QA Room',
            assetType: 'ROOM',
            deviceCount: null,
            parent: {
              assetId: '606dba50-d53c-11eb-b5be-9d10abbc879d',
              assetName: 'QA Floor',
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
            id: 55,
            patientId: '17bd4e0c-d0b6-4957-8de4-816b63434b57',
            firstName: 'Alex',
            lastName: 'K',
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
                value: 'BED_EXIT',
              },
            ],
            customerAccountId: null,
            unitId: '693c9963-bd32-4195-83c5-3df90f85a500',
            roomId: '25d2bc60-e44b-11eb-8883-4b4b1617767e',
            bedId: '1f5542e2-d958-11eb-aa22-42010a0a202c',
          },
          devices: [
            {
              id: null,
              deviceId: 'e83a7440-1eba-11b2-8080-808080808080',
              serialNumber: '9ab71a000100208c',
              keyId: null,
              status: 'STOP',
            },
          ],
          alert: null,
        },
      ],
    },
  },
  {
    id: 102,
    unitId: '81994dfc-56bc-4f38-9b5b-9d40da63dabb',
    name: 'env1-350',
    description: null,
    customerAccountId: 2,
    summary: {
      roomsTotal: 1,
      bedsTotal: 1,
      devicesTotal: 1,
      devicesOnline: 0,
    },
    details: {
      beds: [
        {
          id: null,
          bedId: 'eb7e1bc1-e5af-11eb-8883-4b4b1617767e',
          bedName: 'room1A',
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
          patient: null,
          devices: [
            {
              id: null,
              deviceId: '635cb430-1de9-11b2-8080-808080808080',
              serialNumber: 'fac82c124000032e',
              keyId: null,
              status: 'STOP',
            },
          ],
          alert: null,
        },
      ],
    },
  },
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
    id: 99,
    unitId: 'ff962638-7bfb-46f6-81a7-b3dfa3a19e4d',
    name: 'Test3',
    description: null,
    customerAccountId: 2,
    summary: {
      roomsTotal: 1,
      bedsTotal: 1,
      devicesTotal: 1,
      devicesOnline: 0,
    },
    details: {
      beds: [
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
              status: 'STOP',
            },
          ],
          alert: null,
        },
      ],
    },
  },
  {
    id: 98,
    unitId: '8087a3a5-617d-4cbe-a41c-cf4f8d245675',
    name: 'Unit224-QA',
    description: 'description6539149644',
    customerAccountId: 2,
    summary: {
      roomsTotal: 1,
      bedsTotal: 1,
      devicesTotal: 1,
      devicesOnline: 1,
    },
    details: {
      beds: [
        {
          id: null,
          bedId: '19f30421-e452-11eb-8883-4b4b1617767e',
          bedName: 'bed221',
          room: {
            assetId: '25d2bc60-e44b-11eb-8883-4b4b1617767e',
            assetName: 'room101',
            assetType: 'ROOM',
            deviceCount: null,
            parent: {
              assetId: '25c83510-e44b-11eb-8883-4b4b1617767e',
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
            id: 54,
            patientId: '766fdc7a-799d-4b41-ab63-d7fb30ae2691',
            firstName: 'test2',
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
            unitId: '8087a3a5-617d-4cbe-a41c-cf4f8d245675',
            roomId: '25d2bc60-e44b-11eb-8883-4b4b1617767e',
            bedId: '19f30421-e452-11eb-8883-4b4b1617767e',
          },
          devices: [
            {
              id: null,
              deviceId: 'd1b67440-26bb-11b2-8080-808080808080',
              serialNumber: '04174a0001009cf5',
              keyId: null,
              status: 'RUNNING',
            },
          ],
          alert: null,
        },
      ],
    },
  },
  {
    id: 96,
    unitId: 'd15aef3b-cfb2-4843-84c6-1fc65d6e8bdf',
    name: 'Unit287-QA',
    description: 'description2309229290',
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
      beds: [
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
          bedId: 'f76280c1-e3ac-11eb-8883-4b4b1617767e',
          bedName: 'room1-103',
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
            id: 50,
            patientId: 'f1a7ab70-70d2-4766-8277-3413688a9eb1',
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
            bedId: 'f76280c1-e3ac-11eb-8883-4b4b1617767e',
          },
          devices: [
            {
              id: null,
              deviceId: 'd1dbfda0-26bb-11b2-8080-808080808080',
              serialNumber: '018dda0001019288',
              keyId: null,
              status: 'RUNNING',
            },
          ],
          alert: {
            bedId: 'f76280c1-e3ac-11eb-8883-4b4b1617767e',
            patientId: 'f1a7ab70-70d2-4766-8277-3413688a9eb1',
            configId: 321,
            event: 'UNKNOWN',
            severity: 'Medium Risk',
            metric: null,
            duration: null,
            status: 1,
          },
        },
        {
          id: null,
          bedId: '0a7eedb1-e3ad-11eb-8883-4b4b1617767e',
          bedName: 'room1-104',
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
            id: 51,
            patientId: '70a8fb0a-f193-4d14-8ff8-aa75fe42fe67',
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
            bedId: '0a7eedb1-e3ad-11eb-8883-4b4b1617767e',
          },
          devices: [
            {
              id: null,
              deviceId: 'd1dd3620-26bb-11b2-8080-808080808080',
              serialNumber: '00d33a0001019a6d',
              keyId: null,
              status: 'RUNNING',
            },
          ],
          alert: {
            bedId: '0a7eedb1-e3ad-11eb-8883-4b4b1617767e',
            patientId: '70a8fb0a-f193-4d14-8ff8-aa75fe42fe67',
            configId: 326,
            event: 'UNKNOWN',
            severity: 'Medium Risk',
            metric: null,
            duration: null,
            status: 1,
          },
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
      ],
    },
  },
]

const intersectionObserverMock = (): Record<string, unknown> => ({
  observe: () => null,
  disconnect: () => null,
  unobserve: () => null,
})
const chooseOneBed = (): void => {
  fireEvent.click(screen.getByText('Select a building...'))
  fireEvent.click(screen.getByText('Dawnlight-Test-House'))
  fireEvent.click(screen.getByText('Select a floor...'))
  fireEvent.click(screen.getByText('QA Floor'))
  fireEvent.click(screen.getByText('Demo Eyecloud'))
}

window.IntersectionObserver = jest.fn().mockImplementation(intersectionObserverMock)

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      if (key.startsWith('units:')) return key.replace('units:', '')
      if (key.startsWith('common:')) return key.replace('common:', '')
    },
  }),
}))
jest.mock('@/hooks/useBuildings', () => ({
  useBuildings() {
    return {
      data: buildings,
      isLoading: false,
      isError: false,
    }
  },
}))
jest.mock('@/hooks/useBuilding', () => ({
  useBuilding() {
    return {
      data: building,
      isLoading: false,
      isError: false,
    }
  },
}))
jest.mock('@/hooks/useBeds', () => ({
  useBeds() {
    return {
      data: availableBeds,
      isLoading: false,
      isError: false,
    }
  },
}))
jest.mock('@/hooks/useUnits', () => ({
  useUnits() {
    return {
      data: units,
      isLoading: false,
      isError: false,
    }
  },
}))

describe('UnitDialog', () => {
  it('should display a message no longer available beds', () => {
    render(<UnitDialog isOpen={isOpen} onClose={onClose} />)
    screen.getByText((content) => content.includes('noBuildingOrFloorSelectedMessage'))
  })

  it('should validate with name limitation for 50 alphanumeric characters.', () => {
    const { getByLabelText } = render(<UnitDialog isOpen={isOpen} onClose={onClose} />)
    fireEvent.change(getByLabelText('Unit name'), {
      target: { value: 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz' },
    })
    expect(getByLabelText('Unit name').getAttribute('value').length).toBeLessThan(51)
  })

  it('should validate with blank name and No selected bed.', () => {
    render(<UnitDialog isOpen={isOpen} onClose={onClose} />)
    fireEvent.click(screen.getByText('Add'))
    screen.getByText('Error: Unit name is required. At least 1 bed must be selected.')
  })

  it('should validate with blank name', () => {
    render(<UnitDialog isOpen={isOpen} onClose={onClose} />)
    chooseOneBed()
    const error = (): HTMLElement => {
      return screen.getByText((content) => content.includes('noBuildingOrFloorSelectedMessage'))
    }
    expect(error).toThrow(
      "Unable to find an element with the text: content => content.includes('noBuildingOrFloorSelectedMessage'). This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible."
    )
    fireEvent.click(screen.getByText('Add'))
    screen.getByText('Error: Unit name is required.')
  })

  it('should validate with same name when add', async () => {
    const { getByLabelText } = render(<UnitDialog isOpen={isOpen} onClose={onClose} />)
    chooseOneBed()
    fireEvent.change(getByLabelText('Unit name'), {
      target: { value: units[0].name },
    })
    fireEvent.click(screen.getByText('Add'))
    await waitFor(() => {
      screen.getByText((content) => content.includes('unitNameAlreadyExist'))
    })
  })

  it('should assign a bed to a unit by choosing from a list', () => {
    render(<UnitDialog isOpen={isOpen} onClose={onClose} />)
    chooseOneBed()
    expect(screen.getByText('Demo Eyecloud')).toHaveAttribute('aria-checked', 'true')
  })

  it('should allow to select all and deselect all', () => {
    render(<UnitDialog isOpen={isOpen} onClose={onClose} />)
    chooseOneBed()
    fireEvent.click(screen.getByLabelText('Select all'))
    expect(screen.getByText('Demo Eyecloud')).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByText('Mahesh')).toHaveAttribute('aria-checked', 'true')
    fireEvent.click(screen.getByLabelText('Select all'))
    expect(screen.getByText('Demo Eyecloud').getAttribute('aria-checked')).toBeNull()
    expect(screen.getByText('Mahesh').getAttribute('aria-checked')).toBeNull()
  })

  it('should not validate with same name when update', () => {
    render(<UnitDialog isOpen={isOpen} onClose={onClose} unit={units[0]} />)
    fireEvent.click(screen.getByText('Update'))
    const error = (): HTMLElement => {
      return screen.getByText((content) => content.includes('unitNameAlreadyExist'))
    }
    expect(error).toThrow(
      "Unable to find an element with the text: content => content.includes('unitNameAlreadyExist'). This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible."
    )
  })
})
