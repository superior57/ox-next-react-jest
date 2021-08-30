export const FALL_RISK_TAG = 'fall_risk'
export const ALERT_SENSITIVITY_TAG = 'alert_sensitivity'

export const fallRisk = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
}

export const fallRiskText = {
  [fallRisk.LOW]: 'patient:Low',
  [fallRisk.MEDIUM]: 'patient:Medium',
  [fallRisk.HIGH]: 'patient:High',
}

export const alertSensitivity = {
  RESTLESS: 'RESTLESS',
  LIKELY_BED_EXIT: 'LIKELY_BED_EXIT',
  BED_EXIT: 'BED_EXIT',
  FALL: 'FALL',
}

export const alertSensitivityText = {
  [alertSensitivity.RESTLESS]: 'patient:Restless',
  [alertSensitivity.LIKELY_BED_EXIT]: 'patient:Likely Bed Exit',
  [alertSensitivity.BED_EXIT]: 'patient:Bed Exit',
  [alertSensitivity.FALL]: 'patient:Fall',
}
