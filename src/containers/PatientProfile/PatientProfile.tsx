/* eslint-disable @typescript-eslint/no-explicit-any */
import { PatientLayout } from '@/components/PatientLayout'
import { mutateLocalUnits, revalidateUnits, useUnits } from '@/hooks/useUnits'
import { firstItemIfArray, flattenQueryString, stringIsNullOrEmpty } from '@/lib/utils'
import { deletePatient } from '@/requests/deletePatient'
import { postPatient } from '@/requests/postPatient'
import { updatePatient } from '@/requests/updatePatient'
import {
  getBedById,
  getBeds,
  getUnitById,
  getFallRisk,
  getAlertSensitivity,
  getBedStatus,
} from '@/selectors/selectors'
import { definitions, Option } from '@/types'
import {
  Button,
  Card,
  CloseIcon,
  DialogConfirmation,
  FormControl,
  Label,
  LinearProgress,
  RadioButton,
  Select,
  SelectOption,
  TextArea,
  TextField,
  typographyStyles,
  Overlay,
} from '@dawnlight/ui-web'
import { formatDistanceToNow, format, isValid, parseISO } from 'date-fns'
import { useRouter } from 'next/router'
import { ChangeEventHandler, useEffect, useState } from 'react'
import classNames from 'classnames'
import { useTranslation } from 'next-i18next'
import { toast } from 'react-toastify'
import {
  alertSensitivity,
  alertSensitivityText,
  ALERT_SENSITIVITY_TAG,
  fallRisk,
  fallRiskText,
  FALL_RISK_TAG,
} from '@/lib/constants'
import { useWarnIfUnsavedChanges } from '@/hooks/useWarnIfUnsavedChanges'
import { revalidatePatientAnnotations, usePatientAnnotations } from '@/hooks/usePatientAnnotations'
import { postPatientAnnotation } from '@/requests/postPatientAnnotation'
import { updatePatientTag } from './util'
import { useKeycloak } from '@/providers/KeycloakProvider'

type PatientForm = definitions['Patient'] & {
  clinicalNotes?: definitions['PatientAnnotation']
}

const PatientProfile: React.FC = () => {
  const { t } = useTranslation(['common', 'patient'])
  const router = useRouter()

  const [unit, setUnit] = useState<definitions['Unit']>()
  const [bed, setBed] = useState<definitions['Bed']>()
  const [patient, setPatient] = useState<definitions['Patient']>()
  const [patientAnnotation, setPatientAnnotation] = useState<definitions['PatientAnnotation']>()
  const [isRemovePatientOpen, setIsRemovePatientOpen] = useState(false)
  const [isTransferPatientOpen, setIsTransferPatientOpen] = useState(false)
  const [isOverlayOpen, setIsOverlayOpen] = useState(false)

  // the form state is separate from the patient state because we don't want to re-render
  // the patient info until the user has submitted the form
  const [patientForm, setPatientForm] = useState<PatientForm>()
  const [clinicalNotesForm, setClinicalNotesForm] = useState<string>('')

  const [unitErrorMessage, setUnitErrorMessage] = useState<string>('')
  const [bedErrorMessage, setBedErrorMessage] = useState<string>('')
  const [dobErrorMessage, setDobErrorMessage] = useState<string>('')
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false)
  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false)
  const [unitOptions, setUnitOption] = useState<Option[]>([])
  const [bedOptions, setBedOptions] = useState<Option[]>([])

  const keycloak = useKeycloak()

  const {
    data: patientAnnotations,
    isError: patientAnnotationsIsError,
    isLoading: patientAnnotationsIsLoading,
  } = usePatientAnnotations(patient?.patientId, keycloak?.token)

  const {
    data: units,
    isError: unitsIsError,
    isLoading: unitsIsLoading,
  } = useUnits(keycloak?.token)

  const unsavedChangesWarningText = t('common:unsavedChangesWarningText')

  useWarnIfUnsavedChanges(unsavedChanges, unsavedChangesWarningText)

  // handle data fetch error
  useEffect(() => {
    if (unitsIsError) {
      toast.error(t('patient:loadUnitsError'))
    }
    if (patientAnnotationsIsError) {
      toast.error(t('patient:loadPatientAnnotationsError'))
    }
  }, [unitsIsError, patientAnnotationsIsError, t])

  // set unit, bed, and patient data when router and units are ready
  useEffect(() => {
    if (router.isReady && Array.isArray(units) && units.length > 0) {
      const unitId = flattenQueryString(router.query.unitId)
      const bedId = flattenQueryString(router.query.bedId)
      const unit = getUnitById(unitId, units)
      const beds = getBeds(unit)
      const bed = getBedById(bedId, beds)

      setUnit(unit)

      setBed(bed)

      // patient may be null if bed is unassigned, always check for it before accessing
      setPatient(bed.patient)
    }
  }, [router, units])

  // set unit select options
  useEffect(() => {
    if (units) {
      setUnitOption([
        {
          label: t('patient:Select a unit'),
          value: '',
        },
        ...units.map(({ name, unitId }) => ({
          label: name,
          value: unitId,
        })),
      ])
    }
  }, [units, t])

  // bed select options
  useEffect(() => {
    const defaultBedOption = { label: t('patient:Select a bed'), value: '' }
    if (patientForm?.unitId && Array.isArray(units) && units.length > 0) {
      const unit = getUnitById(patientForm.unitId, units)
      const beds = getBeds(unit)
      if (Array.isArray(beds) && beds.length > 0) {
        setBedOptions([
          defaultBedOption,
          ...beds
            .filter((bed) => bed.bedId === patient?.bedId || bed.patient == null)
            .map((bed) => ({
              label: bed.bedName,
              value: bed.bedId,
            })),
        ])
      }
    } else {
      setBedOptions([defaultBedOption])
    }
  }, [patient, patientForm, units, t])

  // set initial patient annotation when loaded
  useEffect(() => {
    if (patientAnnotations) {
      setPatientAnnotation(firstItemIfArray<definitions['PatientAnnotation']>(patientAnnotations))
    }
  }, [patientAnnotations])

  // set patient annotation to the clinical notes form when loaded
  useEffect(() => {
    if (patientAnnotation) {
      setClinicalNotesForm(patientAnnotation.annotation)
    }
  }, [patientAnnotation])

  useEffect(() => {
    if (!bed || !unit) {
      return
    }

    let dateOfBirth = ''

    if (patient?.dateOfBirth) {
      const tzDate = new Date(patient?.dateOfBirth)
      const utcDate = new Date(tzDate.getUTCFullYear(), tzDate.getUTCMonth(), tzDate.getUTCDate())
      dateOfBirth = format(utcDate, 'MM-dd-yyyy')
    }

    setPatientForm({
      // patientId is not part of the form but we set it to let the form know if patient exists
      patientId: patient?.patientId,
      firstName: patient?.firstName || '',
      lastName: patient?.lastName || '',
      dateOfBirth,
      sex: patient?.sex || '',
      unitId: patient?.unitId || unit?.unitId || '',
      bedId: patient?.bedId || bed?.bedId || '',
      roomId: patient?.roomId || bed?.room?.assetId || '',
      healthSummary: {
        primaryDoctor: patient?.healthSummary?.primaryDoctor || '',
        primaryNurse: patient?.healthSummary?.primaryNurse || '',
      },
      tags: [
        { key: FALL_RISK_TAG, value: getFallRisk(patient) || fallRisk.MEDIUM },
        {
          key: ALERT_SENSITIVITY_TAG,
          value: getAlertSensitivity(patient) || alertSensitivity.BED_EXIT,
        },
      ],
    })
  }, [patient, unit, bed])

  const patientId = patient != null ? patient.patientId : null
  const bedName = bed ? bed.bedName : ''
  const bedStatus = bed ? getBedStatus(bed) : null
  const backUrl = unit ? `/units/${unit.unitId}` : '/units'

  const sexValues = [
    { label: t('patient:Select a sex'), value: '' },
    { label: t('patient:Male'), value: 'male' },
    { label: t('patient:Female'), value: 'female' },
  ]

  const alertDescription = (alert: string): string => {
    switch (alert) {
      case alertSensitivity.RESTLESS:
        return t('patient:Noticeable movement in bed')
      case alertSensitivity.LIKELY_BED_EXIT:
        return t('patient:Sitting up / Moving towards the edge of the bed')
      case alertSensitivity.BED_EXIT:
        return t('patient:Sitting with legs hanging / Standing / Walking')
      case alertSensitivity.FALL:
        return t('patient:Failing / Lying on floor')
    }
  }

  const handleFormChange = (patientForm: PatientForm): void => {
    setUnsavedChanges(true)
    setPatientForm(patientForm)
  }

  const handleClinicalNotesChange = (clinicalNotes: string): void => {
    setUnsavedChanges(true)
    setClinicalNotesForm(clinicalNotes)
  }

  const handleFallRiskChange: ChangeEventHandler<HTMLInputElement> = (e) =>
    handleFormChange(updatePatientTag(patientForm, FALL_RISK_TAG, e.target.value))

  const handleAlertSensitivityChange: ChangeEventHandler<HTMLInputElement> = (e) =>
    handleFormChange(updatePatientTag(patientForm, ALERT_SENSITIVITY_TAG, e.target.value))

  const handleRemovePatient = async (): Promise<void> => {
    setIsOverlayOpen(true)
    try {
      await deletePatient(patientId, keycloak?.token)
      mutateLocalUnits(
        [
          ...units.filter(({ unitId }) => unitId !== unit.unitId),
          {
            ...unit,
            details: {
              ...unit.details,
              beds: [
                ...unit.details.beds.filter(({ bedId }) => bedId === bed.bedId),
                {
                  ...bed,
                  patient: null,
                },
              ],
            },
          },
        ],
        keycloak?.token
      )
      router.push(backUrl)
    } catch (error) {
      toast.error(error.message)
    }
    setIsOverlayOpen(false)
  }

  const handleSavePatient = async (): Promise<void> => {
    setUnitErrorMessage('')
    setBedErrorMessage('')
    setDobErrorMessage('')

    let hasError = false

    // validate
    if (!patientForm.unitId) {
      setUnitErrorMessage(t('patient:Required'))
      hasError = true
    }
    if (!patientForm.bedId) {
      setBedErrorMessage(t('patient:Required'))
      hasError = true
    }

    let submitPatientForm = { ...patientForm }

    if (patientForm.dateOfBirth) {
      // convert date of birth to yyyy/MM/dd
      const dateVals = patientForm.dateOfBirth.split('-').map((item) => item.trim())
      const dateOfBirth =
        dateVals.length === 3 ? `${dateVals[2]}-${dateVals[0]}-${dateVals[1]}` : null

      if (dateOfBirth && !isValid(parseISO(dateOfBirth))) {
        setDobErrorMessage(t('patient:Invalid date of birth'))
        hasError = true
      } else {
        submitPatientForm = {
          ...patientForm,
          dateOfBirth: dateOfBirth.replace(/-/g, '/'),
        }
      }
    }

    if (hasError) {
      setIsTransferPatientOpen(false)
      return
    }

    // disable this since we don't need to warn for unsaved changes while saving
    setUnsavedChanges(false)

    setIsOverlayOpen(true)

    try {
      if (patientId === null) {
        const patientResponse = await postPatient(submitPatientForm, keycloak?.token)
        revalidateUnits(keycloak?.token)

        if (patientResponse && clinicalNotesForm) {
          await postPatientAnnotation(
            {
              patientId: patientResponse.patientId,
              annotation: clinicalNotesForm,
              annotator: keycloak.profile.username,
            },
            keycloak?.token
          )
          revalidatePatientAnnotations(patientId, keycloak?.token)
        }

        router.push(backUrl)
      } else {
        await updatePatient(patientId, submitPatientForm, keycloak?.token)
        revalidateUnits(keycloak?.token)

        if (
          clinicalNotesForm !== '' &&
          (patientAnnotation == null || clinicalNotesForm != patientAnnotation.annotation)
        ) {
          await postPatientAnnotation(
            {
              patientId,
              annotation: clinicalNotesForm,
              annotator: keycloak.profile.username,
            },
            keycloak?.token
          )
          revalidatePatientAnnotations(patientId, keycloak?.token)
        }

        if (patientForm.bedId !== patient.bedId) {
          router.push(backUrl)
        }

        setShowSuccessMessage(true)
        setIsTransferPatientOpen(false)
      }
      // post patient bed assoc
    } catch (error) {
      toast.error(error.message)
    }

    setIsOverlayOpen(false)
  }

  return (
    <>
      <PatientLayout
        selectedItem="profile"
        patient={patient}
        bedName={bedName}
        initialBedStatus={bedStatus}
      >
        {unitsIsLoading ? (
          <div className="flex items-center justify-around h-60">
            <LinearProgress />
          </div>
        ) : (
          <>
            <Overlay isOpen={isOverlayOpen} />
            <Card color="dark">
              <div className="flex justify-between mb-8">
                <h2 className={typographyStyles.h2}>{t('patient:Patient Profile')}</h2>
                {patient != null && (
                  <>
                    <Button
                      variant="outlined"
                      color="subtle"
                      className="flex items-center"
                      onClick={() => setIsRemovePatientOpen(true)}
                    >
                      <CloseIcon className="mr-1" />
                      {t('patient:Remove Patient')}
                    </Button>
                    <DialogConfirmation
                      isOpen={isRemovePatientOpen}
                      onClose={(isOpen) => setIsRemovePatientOpen(isOpen)}
                      onConfirm={handleRemovePatient}
                    >
                      {{
                        titleText: t('patient:removePatientDialogTitle'),
                        subtitleText: t('patient:removePatientDialogSubtitle'),
                        cancelText: t('common:Cancel'),
                        confirmationText: t('common:Remove'),
                      }}
                    </DialogConfirmation>
                  </>
                )}
              </div>
              {patientForm && (
                <div className="grid grid-cols-4 gap-x-8">
                  <div className="flex flex-col gap-y-3">
                    <FormControl>
                      <Label htmlFor="firstName">{t('patient:First name')}</Label>
                      <TextField
                        id="firstName"
                        value={patientForm.firstName}
                        onChange={(e) =>
                          handleFormChange({ ...patientForm, firstName: e.target.value })
                        }
                      />
                    </FormControl>
                    <FormControl>
                      <Label htmlFor="lastName">{t('patient:Last name')}</Label>
                      <TextField
                        id="lastName"
                        value={patientForm.lastName}
                        onChange={(e) =>
                          handleFormChange({ ...patientForm, lastName: e.target.value })
                        }
                      />
                    </FormControl>
                    <FormControl>
                      <Label htmlFor="sex">{t('patient:Sex')}</Label>
                      <Select
                        id="sex"
                        value={patientForm.sex}
                        displayText={
                          sexValues.find(({ value }) => value === patientForm.sex)?.label
                        }
                        onChange={(value) => handleFormChange({ ...patientForm, sex: value })}
                      >
                        {sexValues.map(({ value, label }) => (
                          <SelectOption key={value} value={value}>
                            {label}
                          </SelectOption>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl>
                      <Label
                        htmlFor="dateOfBirth"
                        className={classNames({ 'text-error': dobErrorMessage })}
                      >{`${t('patient:Date of birth')} ${dobErrorMessage}`}</Label>
                      <TextField
                        id="dateOfBirth"
                        value={patientForm.dateOfBirth}
                        placeholder="MM-DD-YYYY"
                        mask="99-99-9999"
                        onChange={(e) =>
                          handleFormChange({ ...patientForm, dateOfBirth: e.target.value })
                        }
                      />
                    </FormControl>
                  </div>
                  <div className="flex flex-col gap-y-3">
                    <FormControl>
                      <Label
                        htmlFor="unit"
                        className={classNames({ 'text-error': unitErrorMessage })}
                      >
                        {`${t('patient:Unit')} * ${unitErrorMessage}`}
                      </Label>
                      <Select
                        id="unit"
                        value={patientForm.unitId}
                        displayText={
                          unitOptions.find(({ value }) => value === patientForm.unitId)?.label
                        }
                        onChange={(value) =>
                          handleFormChange({ ...patientForm, unitId: value, bedId: '' })
                        }
                        disabled={stringIsNullOrEmpty(patientForm.patientId)}
                      >
                        {unitOptions.map(({ value, label }) => (
                          <SelectOption key={value} value={value}>
                            {label}
                          </SelectOption>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl>
                      <Label
                        htmlFor="Bed"
                        className={classNames({ 'text-error': bedErrorMessage })}
                      >
                        {`${t('patient:Bed')} * ${bedErrorMessage}`}
                      </Label>
                      <Select
                        id="Bed"
                        value={patientForm.bedId}
                        displayText={
                          bedOptions.find(({ value }) => value === patientForm.bedId)?.label
                        }
                        onChange={(value) => handleFormChange({ ...patientForm, bedId: value })}
                        disabled={stringIsNullOrEmpty(patientForm.patientId)}
                      >
                        {bedOptions.map(({ value, label }) => (
                          <SelectOption key={value} value={value}>
                            {label}
                          </SelectOption>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl>
                      <Label htmlFor="primaryNurse">{t('patient:Primary Nurse')}</Label>
                      <TextField
                        id="primaryNurse"
                        value={patientForm.healthSummary?.primaryNurse}
                        onChange={(e) =>
                          handleFormChange({
                            ...patientForm,
                            healthSummary: patientForm.healthSummary
                              ? {
                                  ...patientForm.healthSummary,
                                  primaryNurse: e.target.value,
                                }
                              : {
                                  primaryNurse: e.target.value,
                                },
                          })
                        }
                      />
                    </FormControl>
                    <FormControl>
                      <Label htmlFor="primaryDoctor">{t('patient:Primary Doctor')}</Label>
                      <TextField
                        id="primaryDoctor"
                        value={patientForm.healthSummary?.primaryDoctor}
                        onChange={(e) =>
                          handleFormChange({
                            ...patientForm,
                            healthSummary: patientForm.healthSummary
                              ? {
                                  ...patientForm.healthSummary,
                                  primaryDoctor: e.target.value,
                                }
                              : {
                                  primaryDoctor: e.target.value,
                                },
                          })
                        }
                      />
                    </FormControl>
                  </div>
                  <div className="flex flex-col h-100 gap-y-3">
                    <FormControl className="flex-1">
                      <Label htmlFor="clinical-notes">{t('patient:Clinical notes')}</Label>
                      <TextArea
                        id="clinical-notes"
                        placeholder={
                          patient && patientAnnotationsIsLoading
                            ? t('common:Loading')
                            : t('patient:patientAnnotationPlaceholder')
                        }
                        style={{ height: '228px' }}
                        value={clinicalNotesForm}
                        disabled={patient && patientAnnotationsIsLoading}
                        bottomText={
                          patientAnnotation?.annotation
                            ? t('patient:Last updated', {
                                date: formatDistanceToNow(patientAnnotation?.createdAt),
                                user: patientAnnotation?.annotator,
                              })
                            : ''
                        }
                        onChange={(e) => handleClinicalNotesChange(e.target.value)}
                      />
                    </FormControl>
                  </div>
                  <div>
                    <fieldset className="mb-8">
                      <legend className="w-full">
                        <h3 className={typographyStyles.h3}>{t('patient:Fall Risk')}</h3>
                      </legend>
                      <div
                        role="radiogroup"
                        aria-label="Fall Risk"
                        className="flex flex-col gap-y-2 p-2"
                      >
                        {Object.entries(fallRisk).map(([, fallRiskValue]) => (
                          <Label
                            className="items-center"
                            key={fallRiskValue}
                            control={
                              <RadioButton
                                name="fallRisk"
                                value={fallRiskValue}
                                checked={getFallRisk(patientForm) === fallRiskValue}
                                onChange={handleFallRiskChange}
                              />
                            }
                          >
                            {t(fallRiskText[fallRiskValue] as any)}
                          </Label>
                        ))}
                      </div>
                    </fieldset>
                    <fieldset>
                      <legend className="w-full">
                        <h3 id="sensitivity" className={typographyStyles.h3}>
                          {t('patient:Alert Sensitivity')}
                        </h3>
                      </legend>
                      <div
                        role="radiogroup"
                        aria-labelledby="sensitivity"
                        className="flex flex-col gap-y-2 p-2"
                      >
                        {Object.entries(alertSensitivity).map(([, alertValue]) => (
                          <Label
                            key={alertValue}
                            control={
                              <RadioButton
                                name="alert-sensitivity"
                                value={alertValue}
                                checked={getAlertSensitivity(patientForm) === alertValue}
                                onChange={handleAlertSensitivityChange}
                              />
                            }
                          >
                            <div>
                              {t(alertSensitivityText[alertValue] as any)}
                              <p className="text-dimmed2">{alertDescription(alertValue)}</p>
                            </div>
                          </Label>
                        ))}
                      </div>
                    </fieldset>
                  </div>
                </div>
              )}
            </Card>
            <div className="flex mt-6 gap-x-2 justify-end items-center">
              {showSuccessMessage && (
                <div className="text-success mr-6">{t('patient:Successfully updated!')}</div>
              )}
              {patient == null && (
                <Button
                  variant="outlined"
                  width="fixed"
                  color="subtle"
                  onClick={() => router.push(backUrl)}
                >
                  {t('common:Cancel')}
                </Button>
              )}
              <Button
                disabled={!unsavedChanges}
                variant="filled"
                color="accent"
                width="fixed"
                onClick={() =>
                  patientForm?.bedId !== patient?.bedId
                    ? setIsTransferPatientOpen(true)
                    : handleSavePatient()
                }
              >
                {t('common:Save')}
              </Button>
              <DialogConfirmation
                isOpen={isTransferPatientOpen}
                onClose={(isOpen) => setIsTransferPatientOpen(isOpen)}
                onConfirm={handleSavePatient}
              >
                {{
                  titleText: '',
                  subtitleText: t('patient:transferPatientToANewRoom'),
                  cancelText: t('common:Cancel'),
                  confirmationText: t('common:Save'),
                }}
              </DialogConfirmation>
            </div>
          </>
        )}
      </PatientLayout>
    </>
  )
}

export default PatientProfile
