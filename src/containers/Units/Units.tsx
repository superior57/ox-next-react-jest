import { UnitDialog } from '@/components/UnitDialog'
import { mutateLocalUnits, revalidateUnits, useUnits } from '@/hooks/useUnits'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import classNames from 'classnames'
import { useTranslation } from 'next-i18next'
import Head from 'next/head'
import {
  Button,
  Card,
  Header,
  Layout,
  ProfileIcon,
  AddIcon,
  IconButton,
  Popover,
  PopoverButton,
  PopoverPanel,
  SignOutIcon,
  OfflineIcon,
  VerticalEllipsisIcon,
  Dropdown,
  DropdownItem,
  DialogConfirmation,
  typographyStyles,
  LinearProgress,
  Logo,
  Overlay,
} from '@dawnlight/ui-web'
import { useCustomerAccount } from '@/hooks/useCustomerAccount'
import { definitions } from '@/types'
import { deleteUnit } from '@/requests/deleteUnit'
import { useKeycloak } from '@/providers/KeycloakProvider'

const TableRow: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({ children, ...props }) => (
  <span role="row" className="grid grid-cols-3 p-6 mr-12" {...props}>
    {children}
  </span>
)

const TableHeaderCell: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({
  className,
  children,
  ...props
}) => (
  <span
    role="columnheader"
    className={classNames('font-bold text-base text-body2', className)}
    {...props}
  >
    {children}
  </span>
)

const Units: React.FC = () => {
  const { t } = useTranslation(['common', 'units'])
  const keycloak = useKeycloak()
  const [removeUnitId, setRemoveUnitId] = useState<definitions['Unit']['unitId']>()
  const [editUnit, setEditUnit] = useState<definitions['Unit']>()
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false)
  const [isRemoveUnitOpen, setIsRemoveUnitOpen] = useState(false)
  const [showOverlay, setShowOverlay] = useState<boolean>()

  const {
    data: units,
    isLoading: unitsIsLoading,
    isError: unitsIsError,
  } = useUnits(keycloak?.token)
  const {
    data: customerAccount,
    isLoading: caIsLoading,
    isError: caIsError,
  } = useCustomerAccount(keycloak?.token)

  useEffect(() => {
    if (unitsIsError) {
      toast.error(t('units:unitsFetchError'))
    }
    if (caIsError) {
      toast.error(t('units:customerAccountFetchError'))
    }
  }, [unitsIsError, caIsError, t])

  const handleUnitRemoval = async (unitId: definitions['Unit']['unitId']): Promise<void> => {
    setShowOverlay(true)
    try {
      mutateLocalUnits(
        units.filter((unit) => unit.unitId !== unitId),
        keycloak?.token
      )
      await deleteUnit(unitId, keycloak?.token)
      revalidateUnits(keycloak?.token)
    } catch (error) {
      toast.error(error.message)
    }
    setIsRemoveUnitOpen(false)
    setShowOverlay(false)
  }

  const verticalEllipsisButton = (
    <IconButton
      label="More options"
      className="opacity-0 group-hover:opacity-100 group-focustailwind:opacity-100 focus:opacity-100 w-12 h-full focus:outline-none focus:ring"
    >
      <VerticalEllipsisIcon />
    </IconButton>
  )

  return unitsIsLoading || caIsLoading ? (
    <div className="flex items-center justify-around h-full">
      <LinearProgress />
    </div>
  ) : (
    <Layout>
      <Head>
        <title>{t('units:Units - DawnLight')}</title>
      </Head>
      <Overlay isOpen={showOverlay} />
      <Header className="flex justify-between items-center">
        {customerAccount && <h1 className={typographyStyles.h1}>{customerAccount.name}</h1>}
        <div className="flex items-center">
          <Popover>
            <PopoverButton
              aria-label="Profile"
              className="text-brand"
              as={IconButton}
              variant="filled"
              label="Profile"
            >
              <ProfileIcon />
            </PopoverButton>
            <PopoverPanel className="right-0 w-80">
              <Card className="flex flex-col gap-y-2 inverse">
                <h1 className={classNames('mb-1', typographyStyles.modalH1)}>
                  {t('common:User profile')}
                </h1>
                {keycloak?.profile?.firstName && keycloak?.profile?.lastName && (
                  <span
                    className={typographyStyles.modalBody1}
                  >{`${keycloak?.profile?.firstName} ${keycloak?.profile?.lastName}`}</span>
                )}
                {keycloak?.profile?.email && (
                  <span className={typographyStyles.modalBody1}>{keycloak?.profile?.email}</span>
                )}
                <Button
                  onClick={() => keycloak.login({ action: 'UPDATE_PASSWORD' })}
                  variant="outlined"
                  color="inverseSubtle"
                  className="my-3 text-center w-full"
                >
                  {t('common:Update password')}
                </Button>
                <div className="border-t border-inverseDivider pt-3">
                  <Button onClick={() => keycloak.logout()} className="py-1">
                    <SignOutIcon /> {t('common:Sign Out')}
                  </Button>
                </div>
              </Card>
            </PopoverPanel>
          </Popover>
          <Logo className="text-brand opacity-50 ml-3" />
        </div>
      </Header>
      <main>
        <div className="flex justify-end items-center pt-6 pr-6">
          <Button variant="filled" color="accent" onClick={() => setIsUnitModalOpen(true)}>
            <AddIcon />
            {t('units:Add Unit')}
          </Button>
        </div>
        <div role="table" className="w-5/6 m-auto">
          <div role="rowgroup" className="uppercase">
            <TableRow>
              <TableHeaderCell>{t('units:Department name')}</TableHeaderCell>
              <TableHeaderCell>{t('units:Total beds')}</TableHeaderCell>
              <TableHeaderCell className="flex items-center">
                <OfflineIcon className="mr-2 text-warning text-xl" />
                <span>{t('units:Offline Devices')}</span>
              </TableHeaderCell>
            </TableRow>
          </div>
          <div role="rowgroup" className="grid gap-y-1">
            {Array.isArray(units) &&
              (units.length === 0 ? (
                <div className="flex flex-col justify-around items-center mt-20">
                  <div className={classNames(typographyStyles.h3, 'text-brand my-3')}>
                    {t('units:No units')}
                  </div>
                  <Button color="accent" onClick={() => setIsUnitModalOpen(true)} className="p-6">
                    <AddIcon />
                    {t('units:Add Units')}
                  </Button>
                </div>
              ) : (
                units.map((unit) => {
                  const { unitId, name, summary } = unit
                  return (
                    <div
                      className="group flex bg-primary hover:bg-secondary focus:bg-secondary items-center"
                      key={unitId}
                    >
                      <Link href={`/units/${unitId}`} passHref>
                        <a role="row" className="flex-1 flex p-6 focus:outline-none focus:ring">
                          <span className="flex-1" role="cell">
                            {name}
                          </span>
                          <span className="flex-1" role="cell">
                            {summary.bedsTotal}
                          </span>
                          <span className="flex-1" role="cell">
                            {summary.devicesTotal - summary.devicesOnline}
                          </span>
                        </a>
                      </Link>
                      <Dropdown button={verticalEllipsisButton}>
                        <DropdownItem>
                          {({ active, disabled }) => (
                            <Button
                              disabled={disabled}
                              color="inverseSubtle"
                              className={classNames('p-3 rounded-t-sm', {
                                'bg-accent text-link': active,
                              })}
                              onClick={() => {
                                setEditUnit(unit)
                                setIsUnitModalOpen(true)
                              }}
                            >
                              {t('common:Edit')}
                            </Button>
                          )}
                        </DropdownItem>
                        <DropdownItem>
                          {({ active, disabled }) => (
                            <Button
                              disabled={disabled}
                              color="inverseSubtle"
                              className={classNames('p-3 rounded-b-sm', {
                                'bg-accent text-link': active,
                              })}
                              onClick={() => {
                                setRemoveUnitId(unit.unitId)
                                setIsRemoveUnitOpen(true)
                              }}
                            >
                              {t('common:Remove')}
                            </Button>
                          )}
                        </DropdownItem>
                      </Dropdown>
                    </div>
                  )
                })
              ))}
          </div>
        </div>
      </main>
      <UnitDialog
        isOpen={isUnitModalOpen}
        onClose={(isOpen) => {
          setEditUnit(null)
          setIsUnitModalOpen(isOpen)
        }}
        unit={editUnit}
      />
      <DialogConfirmation
        isOpen={isRemoveUnitOpen}
        onClose={(isOpen) => {
          setRemoveUnitId(null)
          setIsRemoveUnitOpen(isOpen)
        }}
        onConfirm={() => handleUnitRemoval(removeUnitId)}
      >
        {{
          titleText: t('units:removeDialogTitle'),
          subtitleText: t('units:removeDialogSubtitle'),
          cancelText: t('common:Cancel'),
          confirmationText: t('common:Remove'),
        }}
      </DialogConfirmation>
    </Layout>
  )
}

export default Units
