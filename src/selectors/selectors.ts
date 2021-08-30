import get from 'lodash/get'
import { ALERT_SENSITIVITY_TAG, fallRisk, FALL_RISK_TAG } from '@/lib/constants'
import { AlertSensitivity, BedStatus, definitions, FallRisk, WSBedMapping } from '@/types'
import { eventToBedStatus } from '@/lib/utils'

export const getUnitById = (
  unitId: definitions['Unit']['unitId'],
  units: definitions['ArrayOfUnits']
): definitions['Unit'] => units.find((unit) => unit.unitId === unitId)

export const getBedById = (
  bedId: definitions['Bed']['bedId'],
  beds: definitions['ArrayOfBeds']
): definitions['Bed'] => beds.find((bed) => bed.bedId === bedId)

export const getBeds = (unit: definitions['Unit']): definitions['ArrayOfBeds'] =>
  unit?.details?.beds

export const getBedStatusById = (
  bedId: definitions['Bed']['bedId'],
  bedState: WSBedMapping
): BedStatus => {
  const bed = get<WSBedMapping, string, null>(bedState, bedId, null)
  return getBedStatus(bed)
}

export const getBedStatus = (bed: definitions['Bed']): BedStatus => {
  if (bed == null) {
    return 'Loading'
  }

  if (bed.patient == null) {
    return 'Unassigned'
  }

  if (Array.isArray(bed.devices) && bed.devices.length > 0 && bed.devices[0].status !== 'RUNNING') {
    return 'Offline'
  }

  const event = bed.alert?.event
  if (event) {
    return eventToBedStatus(event)
  }

  return 'Unknown'
}

export const isHighFallRisk = (patient: definitions['Patient']): boolean =>
  patient?.tags?.some(({ key, value }) => key === FALL_RISK_TAG && value === fallRisk.HIGH)

export const getFallRisk = (patient: definitions['Patient']): FallRisk =>
  patient?.tags?.find(({ key }) => key === FALL_RISK_TAG)?.value as FallRisk

export const getAlertSensitivity = (patient: definitions['Patient']): AlertSensitivity =>
  patient?.tags?.find(({ key }) => key === ALERT_SENSITIVITY_TAG)?.value as AlertSensitivity
