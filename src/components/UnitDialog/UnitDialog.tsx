import { definitions, Option } from '@/types'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import {
  Button,
  Dialog,
  CloseIcon,
  FormControl,
  Label,
  TextField,
  Select,
  SelectOption,
  Checkbox,
  typographyStyles,
  Card,
  LinearProgress,
  Overlay,
} from '@dawnlight/ui-web'
import { useBuildings } from '@/hooks/useBuildings'
import { useBuilding } from '@/hooks/useBuilding'
import { arraysAreEqual, fromAssetToOption } from '@/lib/utils'
import { useTranslation } from 'next-i18next'
import { postUnit } from '@/requests/postUnit'
import { useBeds } from '@/hooks/useBeds'
import { revalidateUnits } from '@/hooks/useUnits'
import { postUnitBedAssociations } from '@/requests/postUnitBedAssociations'
import { useFloor } from '@/hooks/useFloor'
import { updateUnit } from '@/requests/updateUnit'
import { updateUnitBedAssociations } from '@/requests/updateUnitBedAssociations'
import { useKeycloak } from '@/providers/KeycloakProvider'
import { useUnits } from '@/hooks/useUnits'

interface SelectedBedsState {
  [key: string]: boolean
}

export interface UnitDialogProps {
  readonly isOpen: boolean
  readonly onClose: (value: boolean) => void
  readonly unit?: definitions['Unit']
}

export const UnitDialog: React.FC<UnitDialogProps> = ({ isOpen, onClose, unit }) => {
  const { t } = useTranslation(['common', 'units'])
  const keycloak = useKeycloak()

  const isEditing = unit != null
  const isEditingAndHasBeds = isEditing && unit.details.beds.length > 0

  const [errorMessages, setErrorMessages] = React.useState<string[]>([])

  const [selectedBuildingId, setSelectedBuildingId] =
    React.useState<definitions['Asset']['assetId']>('')
  const [selectedFloorId, setSelectedFloorId] = React.useState<definitions['Asset']['assetId']>('')
  const [unitName, setUnitName] = React.useState<definitions['Unit']['name']>('')
  const [selectedBeds, setSelectedBeds] = React.useState<SelectedBedsState>({})
  const [showOverlay, setShowOverlay] = React.useState<boolean>()

  // fetch buildings, floors, and beds for the dropdowns
  // we do multiple API calls because they don't return their children
  const {
    data: buildings,
    isLoading: buildingsIsLoading,
    isError: buildingsIsError,
  } = useBuildings(keycloak?.token)

  const {
    data: building,
    isLoading: buildingIsLoading,
    isError: buildingIsError,
  } = useBuilding(selectedBuildingId, keycloak?.token)

  const { data: units, isLoading: unitLoading, isError: unitIsError } = useUnits(keycloak?.token)

  const {
    data: availableBeds,
    isLoading: bedsIsLoading,
    isError: bedsIsError,
  } = useBeds(selectedFloorId, true, keycloak?.token)

  // fetch current unit floor: it tells us which building and floor this unit is assigned to if editing
  const {
    data: unitFloor,
    isLoading: unitFloorIsLoading,
    isError: unitFloorIsError,
  } = useFloor(
    isEditingAndHasBeds ? unit.details.beds[0].room.parent.assetId : null,
    keycloak?.token
  )

  useEffect(() => {
    if (buildingsIsError) {
      toast.error(t('units:buildingsFetchError'))
    }
    if (buildingIsError) {
      toast.error(t('units:buildingFetchError'))
    }
    if (bedsIsError) {
      toast.error(t('units:bedsFetchError'))
    }
    if (unitFloorIsError) {
      toast.error(t('units:unitFloorFetchError'))
    }
  }, [buildingsIsError, buildingIsError, bedsIsError, unitFloorIsError, t])

  useEffect(() => {
    if (unitFloor) {
      setSelectedFloorId(unitFloor.assetId)
      setSelectedBuildingId(unitFloor.parent.assetId)
    } else {
      setSelectedFloorId('')
      setSelectedBuildingId('')
    }
  }, [unitFloor])

  useEffect(() => {
    if (isEditingAndHasBeds) {
      setSelectedBeds(
        unit.details.beds.reduce<{ [key: string]: boolean }>((acc, { bedId }) => {
          acc[bedId] = true
          return acc
        }, {})
      )
    } else {
      setSelectedBeds({})
    }
  }, [unit, isEditingAndHasBeds])

  useEffect(() => {
    if (unit && unit.name) {
      setUnitName(unit.name)
    } else {
      setUnitName('')
    }
  }, [unit])

  const totalSelectedBeds = Object.entries(selectedBeds).filter(
    ([, bedValue]) => bedValue === true
  ).length

  const buildingOptions: Option[] = Array.isArray(buildings)
    ? [
        { label: 'Select a building...', value: '' },
        ...buildings.map((building) => fromAssetToOption(building)),
      ]
    : [{ label: 'Loading...', value: '' }]

  const floorsForSelectedBuilding = building?.children || []
  const floorOptions: Option[] = [
    { label: 'Select a floor...', value: '' },
    ...floorsForSelectedBuilding.map((floor) => fromAssetToOption(floor)),
  ]

  // get all beds for a floor
  const currentBeds = unit?.details?.beds || []
  const bedOptions: Option[] = Array.isArray(availableBeds)
    ? [
        ...currentBeds.map((bed) => ({
          label: `${bed.bedName}`,
          value: bed.bedId,
        })),
        ...availableBeds.map((bed) => ({
          label: `${bed.bedName}`,
          value: bed.bedId,
        })),
      ]
    : []

  const handleSelectAll: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const checked = e.target.checked
    let newState = {}

    if (checked) {
      newState = bedOptions.reduce((acc, { value }) => {
        acc[value] = true
        return acc
      }, {})
    }

    setSelectedBeds(newState)
  }

  const handleClose: React.MouseEventHandler<HTMLButtonElement> = () => {
    setErrorMessages([])
    setSelectedBeds({})
    setSelectedBuildingId('')
    setSelectedFloorId('')
    setUnitName('')
    onClose(false)
  }

  const handleSave: React.MouseEventHandler<HTMLButtonElement> = async () => {
    setErrorMessages([])
    let errorCount = 0

    // validate
    if (unitName === '') {
      errorCount += 1
      setErrorMessages((prev) => [...prev, 'Unit name is required.'])
    }

    if (Object.entries(selectedBeds).filter(([, value]) => value).length === 0) {
      errorCount += 1
      setErrorMessages((prev) => [...prev, 'At least 1 bed must be selected.'])
    }

    if (errorCount > 0) {
      return
    }

    if (!unitLoading && !unitIsError && units) {
      if (units.map((unit) => unit.name).includes(unitName)) {
        errorCount += 1
        setErrorMessages((prev) => [...prev, t('units:unitNameAlreadyExist')])
      }
    }

    setShowOverlay(true)

    try {
      if (isEditing) {
        if (unitName != unit.name) {
          await updateUnit(unit.unitId, { name: unitName }, keycloak?.token)
        }

        const bedIds = unit.details.beds.map((bed) => bed.bedId)
        const selectedBedIds = Object.entries(selectedBeds)
          .filter(([, value]) => value)
          .map(([key]) => key)

        if (!arraysAreEqual(bedIds, selectedBedIds)) {
          await updateUnitBedAssociations(unit.unitId, selectedBedIds, keycloak?.token)
        }
      } else {
        const { unitId: newUnitId } = await postUnit(unitName, keycloak?.token)
        const unitBedAssociations = Object.entries(selectedBeds)
          .filter(([, val]) => val)
          .map(([key]) => ({ unitId: newUnitId, bedId: key }))

        await postUnitBedAssociations(unitBedAssociations, keycloak?.token)
      }
      revalidateUnits(keycloak?.token)
      onClose(false)
    } catch (error) {
      toast.error(error.message)
    }

    setShowOverlay(false)
  }
  console.log('console => ', errorMessages)
  return (
    <>
      <Overlay isOpen={showOverlay} />
      <Dialog isOpen={isOpen} onClose={onClose} showOverlay={true}>
        <Card className="relative w-2/3">
          <h1 className={typographyStyles.modalH1}>
            {isEditing ? t('units:Edit Unit') : t('units:Add Unit')}
          </h1>
          <div className="flex gap-x-4">
            <FormControl className="flex-1">
              <Label htmlFor="unitName">
                <span className={typographyStyles.modalH2}>{t('units:Unit name')}</span>
              </Label>
              <TextField
                id="unitName"
                color="light"
                value={unitName}
                onChange={(e) => setUnitName(e.target.value)}
              />
            </FormControl>
            <FormControl className="flex-1">
              <Label htmlFor="building">
                <span className={typographyStyles.modalH2}>{t('units:Select a building')}</span>
              </Label>
              <Select
                id="building"
                value={selectedBuildingId}
                onChange={(value) => {
                  setSelectedBeds({})
                  setSelectedFloorId('')
                  setSelectedBuildingId(value)
                }}
                color="light"
                disabled={buildingsIsLoading || (isEditingAndHasBeds && unitFloorIsLoading)}
                displayText={
                  buildingOptions.find(({ value }) => value === selectedBuildingId)?.label
                }
              >
                {buildingOptions.map((buildingValue) => (
                  <SelectOption key={buildingValue.value} value={buildingValue.value}>
                    {buildingValue.label}
                  </SelectOption>
                ))}
              </Select>
            </FormControl>
            <FormControl className="flex-1">
              <Label htmlFor="floor">
                <span className={typographyStyles.modalH2}>{t('units:Select a floor')}</span>
              </Label>
              <Select
                id="floor"
                value={selectedFloorId}
                onChange={(value) => {
                  if (value !== selectedFloorId) {
                    setSelectedBeds({})
                    setSelectedFloorId(value)
                  }
                }}
                color="light"
                displayText={floorOptions.find(({ value }) => value === selectedFloorId)?.label}
                disabled={
                  !selectedBuildingId ||
                  buildingsIsLoading ||
                  (isEditingAndHasBeds && unitFloorIsLoading)
                }
              >
                {floorOptions.map((floorValue) => (
                  <SelectOption key={floorValue.value} value={floorValue.value}>
                    {floorValue.label}
                  </SelectOption>
                ))}
              </Select>
            </FormControl>
          </div>
          <fieldset>
            <div className="flex justify-between items-center my-3">
              <legend className={typographyStyles.modalH2}>
                {t('units:Beds in this unit', {
                  countSelectedBeds: totalSelectedBeds,
                  countTotalBeds: bedOptions.length,
                })}
              </legend>
              <Label
                control={<Checkbox name="selectAll" onChange={handleSelectAll} />}
                className="select-none"
              >
                {t('units:Select all')}
              </Label>
            </div>
            <div className="relative h-44 overflow-y-auto grid grid-cols-9 auto-rows-min gap-3 p-1">
              {!selectedBuildingId || !selectedFloorId ? (
                <div className="absolute inset-0 flex items-center justify-around">
                  {t('units:noBuildingOrFloorSelectedMessage')}
                </div>
              ) : buildingsIsLoading || buildingIsLoading || bedsIsLoading ? (
                <div className="absolute inset-0 flex items-center justify-around">
                  <LinearProgress color="dark" />
                </div>
              ) : (
                bedOptions.map((bedOption) => (
                  <Button
                    key={bedOption.value}
                    variant="filled"
                    color={selectedBeds[bedOption.value] ? 'accent' : 'accentLight'}
                    aria-checked={selectedBeds[bedOption.value]}
                    onClick={() =>
                      setSelectedBeds((oldBeds) => ({
                        ...oldBeds,
                        [bedOption.value]: !selectedBeds[bedOption.value],
                      }))
                    }
                  >
                    {bedOption.label}
                  </Button>
                ))
              )}
            </div>
          </fieldset>
          <div className="w-full flex items-center justify-between mt-6">
            <div className="text-critical">
              {errorMessages.length > 0 ? `${t('common:Error')}: ${errorMessages.join(' ')}` : ''}
            </div>
            <div className="flex gap-x-4">
              <Button variant="outlined" color="inverseSubtle" onClick={handleClose}>
                {t('common:Cancel')}
              </Button>
              <Button variant="filled" color="accent" onClick={handleSave}>
                {isEditing ? t('common:Update') : t('common:Add')}
              </Button>
            </div>
          </div>
          <Button variant="bare" onClick={handleClose} className="absolute top-4 right-4">
            <CloseIcon />
          </Button>
        </Card>
      </Dialog>
    </>
  )
}
