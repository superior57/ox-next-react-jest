import { BedStatusText } from '@/components/BedStatusText'
import { useUnits } from '@/hooks/useUnits'
import {
  getBeds,
  getBedStatus,
  getBedStatusById,
  getUnitById,
  isHighFallRisk,
} from '@/selectors/selectors'
import { Bed } from '@/components/Bed'
import { BedLayout } from '@/components/BedLayout'
import {
  ArrowIcon,
  AssistanceIcon,
  BedExitIcon,
  FallIcon,
  Header,
  IconLink,
  Layout,
  LinearProgress,
  Logo,
  OfflineIcon,
  typographyStyles,
} from '@dawnlight/ui-web'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { BedStatus, definitions, WSBedMapping } from '@/types'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { flattenQueryString, isWSEventMessage, isWSInitMessage, isWSMessage } from '@/lib/utils'
import classNames from 'classnames'
import { useKeycloak } from '@/providers/KeycloakProvider'
import { useWsTicket } from '@/hooks/useWsTicket'

export const Status: React.FC<{ status: BedStatus }> = ({ status }) => {
  let icon: JSX.Element

  switch (status) {
    case 'Offline':
      icon = <OfflineIcon className="text-2xl text-warning" />
      break
    case 'Still':
    case 'Restless':
    case 'LikelyBedExit':
      icon = <>--</>
      break
    case 'BedExit':
      icon = <BedExitIcon className="text-2xl" />
      break
    case 'Fall':
      icon = <FallIcon className="text-2xl" />
      break
    case 'MultiplePeople':
      icon = <AssistanceIcon className="text-2xl text-body1" />
      break
    default:
      break
  }

  return (
    <div className="flex items-center justify-center">
      {icon && (
        <span data-testid={status} className="flex items-center justify-center mr-3">
          {icon}
        </span>
      )}
      <BedStatusText status={status} />
    </div>
  )
}

const sortBeds = (beds: definitions['ArrayOfBeds']): definitions['ArrayOfBeds'] => {
  if (!Array.isArray(beds)) {
    return beds
  }

  return beds.sort((bedA, bedB) => {
    const sortTermA = `${bedA.room?.assetName || ''} ${bedA.bedName || ''}`
    const sortTermB = `${bedB.room?.assetName || ''} ${bedB.bedName || ''}`

    if (sortTermA === sortTermB) {
      return 0
    }

    return sortTermA > sortTermB ? 1 : -1
  })
}

interface Bed {
  readonly patientId: string
  readonly patientName: string
  readonly bedName: string
  readonly bedId: string
  readonly status: BedStatus
  readonly isHighRisk: boolean
}

const Beds: React.FC = () => {
  const { t } = useTranslation(['common', 'units'])
  const router = useRouter()
  const keycloak = useKeycloak()

  const socketRef = useRef<WebSocket>(null)
  const [unit, setUnit] = useState<definitions['Unit']>()
  const [beds, setBeds] = useState<definitions['ArrayOfBeds']>()
  const [bedState, setBedState] = useState<WSBedMapping>()
  const [isWSLoading, setIsWSLoading] = useState<boolean>(true)

  const { data: wsTicket, isError: wsTicketIsError } = useWsTicket(keycloak?.token)

  const {
    data: units,
    isError: unitsIsError,
    isLoading: unitsIsLoading,
  } = useUnits(keycloak?.token)

  useEffect(() => {
    if (unitsIsError) {
      toast.error(t('units:unitsFetchError'))
    }
    if (wsTicketIsError) {
      toast.error(t('common:wsTicketFetchError'))
    }
  }, [unitsIsError, wsTicketIsError, t])

  useEffect(() => {
    if (router.isReady && Array.isArray(units) && units.length > 0) {
      const unitId = flattenQueryString(router.query.unitId)

      const unit = getUnitById(unitId, units)
      const beds = getBeds(unit)

      setUnit(unit)
      setBeds(beds)
    }
  }, [router, units])

  // realtime data handled through websockets here
  useEffect(() => {
    if (!wsTicket || !unit || !unit.unitId) {
      return
    }

    if (socketRef.current) {
      socketRef.current.close()
    }

    socketRef.current = new WebSocket(
      `${process.env.NEXT_PUBLIC_WEBSOCKET_BASE_URL}/unit/${unit.unitId}/beds/1/35?ws-ticket=${wsTicket}`
    )

    const onMessage = (event: MessageEvent): void => {
      try {
        const message = JSON.parse(event.data)
        if (isWSMessage(message)) {
          if (isWSInitMessage(message)) {
            setBedState(message.beds.reduce((prev, curr) => ({ ...prev, [curr.bedId]: curr }), {}))
            setIsWSLoading(false)
          } else if (isWSEventMessage(message)) {
            setBedState((prevBedState) => ({
              ...prevBedState,
              [message.bedId]: {
                ...prevBedState[message.bedId],
                alert: message,
              },
            }))
          }
        }
      } catch (error) {
        toast.error(error.message)
      }
    }

    socketRef.current.addEventListener('message', onMessage)

    return () => {
      socketRef.current.removeEventListener('message', onMessage)
      socketRef.current.close()
    }
  }, [unit, wsTicket])

  const sortedBeds = sortBeds(beds)

  return unitsIsLoading ? (
    <div className="flex items-center justify-around h-full">
      <LinearProgress />
    </div>
  ) : (
    <>
      <Head>
        <title>{t('common:Beds - DawnLight')}</title>
      </Head>
      <Layout>
        <Header className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/units" passHref>
              <IconLink label="Back">
                <ArrowIcon />
              </IconLink>
            </Link>
            <h1 className={classNames(typographyStyles.h1, 'ml-6')}>{unit && unit.name}</h1>
          </div>
          <Logo className="text-brand opacity-50" />
        </Header>
        <main className="grid">
          <BedLayout>
            {Array.isArray(sortedBeds) &&
              sortedBeds.map((bed) => {
                const { bedId, bedName, patient } = bed
                const bedStatus = isWSLoading
                  ? getBedStatus(bed)
                  : getBedStatusById(bedId, bedState)

                return (
                  <li key={bedId}>
                    <Link
                      href={`/units/${unit.unitId}/beds/${bedId}/${
                        bedStatus === 'Unassigned' ? 'add-patient' : 'profile'
                      }`}
                      passHref
                    >
                      <Bed
                        bedName={`${bedName}`}
                        variant={bedStatus}
                        isHighRisk={patient ? isHighFallRisk(patient) : false}
                      >
                        <Status status={bedStatus} />
                      </Bed>
                    </Link>
                  </li>
                )
              })}
          </BedLayout>
        </main>
      </Layout>
    </>
  )
}

export default Beds
