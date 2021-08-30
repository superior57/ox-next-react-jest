import {
  ArrowIcon,
  BedExitIcon,
  Chip,
  DetailLayout,
  DetailMain,
  DetailNav,
  DetailNavLink,
  DetailNavList,
  FallIcon,
  Header,
  HighRiskIcon,
  IconLink,
  Layout,
  NotebookIcon,
  Number,
  ProfileIcon,
  typographyStyles,
} from '@dawnlight/ui-web'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { OptionalLink } from '../OptionalLink'
import { isHighFallRisk } from '@/selectors/selectors'
import { Global, css } from '@emotion/react'
import { useTranslation } from 'react-i18next'
import { BedStatus, definitions } from '@/types'
import { flattenQueryString, isWSEventMessage, isWSMessage } from '@/lib/utils'
import { toast } from 'react-toastify'
import { useWsTicket } from '@/hooks/useWsTicket'
import { useKeycloak } from '@/providers/KeycloakProvider'
import { SexText } from '../SexText'

export interface PatientLayoutProps {
  readonly selectedItem: 'activity' | 'alert' | 'profile'
  readonly bedName: string
  readonly patient: definitions['Patient']
  readonly initialBedStatus?: BedStatus
  readonly children?: React.ReactNode
}

export const PatientLayout: React.FC<PatientLayoutProps> = ({
  patient,
  bedName = '',
  initialBedStatus = 'Loading',
  selectedItem,
  children,
}) => {
  const { t } = useTranslation(['common', 'patient'])
  const router = useRouter()
  const keycloak = useKeycloak()

  const [unitId, setUnitId] = useState<definitions['Unit']['unitId']>()
  const [bedId, setBedId] = useState<definitions['Bed']['bedId']>()
  const [bedStatus, setBedStatus] = useState<BedStatus>(initialBedStatus)
  const [isLoading, setIsLoading] = useState<boolean>()

  const socketRef = useRef<WebSocket>(null)

  const { data: wsTicket, isError: wsTicketIsError } = useWsTicket(keycloak?.token)

  useEffect(() => {
    if (wsTicketIsError) {
      toast.error(t('common:wsTicketFetchError'))
    }
  }, [wsTicketIsError, t])

  useEffect(() => {
    const unitId = flattenQueryString(router.query.unitId)
    const bedId = flattenQueryString(router.query.bedId)

    setUnitId(unitId)
    setBedId(bedId)
    setIsLoading(false)
  }, [router])

  useEffect(() => {
    if (!patient || !wsTicket) {
      return
    }

    if (socketRef.current) {
      socketRef.current.close()
    }

    socketRef.current = new WebSocket(
      `${process.env.NEXT_PUBLIC_WEBSOCKET_BASE_URL}/patient/${patient.patientId}?ws-ticket=${wsTicket}`
    )

    const onMessage = (event: MessageEvent): void => {
      try {
        const message = JSON.parse(event.data)
        if (isWSMessage(message)) {
          if (isWSEventMessage(message)) {
            setBedStatus(message.event as BedStatus)
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
  }, [patient, wsTicket])

  const isEmptyBed = patient == null
  const hrefBase = unitId && bedId ? `/units/${unitId}/beds/${bedId}` : ''
  const patientName = patient ? `${patient.firstName} ${patient.lastName}` : ''
  const patientAge = patient && patient.age ? t('patient:ageText', { age: patient.age }) : ''
  const patientIsHighFallRisk = patient ? isHighFallRisk(patient) : false

  return (
    <Layout>
      <Head>
        <title>{t('common:Patient - DawnLight')}</title>
      </Head>
      <Global
        styles={css`
          html,
          body {
            background: #1d1a1a;
          }
        `}
      />
      <Header className="flex items-center">
        <Link href={`/units/${unitId}`} passHref={!isLoading}>
          <IconLink label="Back">
            <ArrowIcon />
          </IconLink>
        </Link>
        <div className="w-full flex justify-between items-center ml-6">
          {!isLoading && (
            <>
              <div className="flex gap-x-6 items-center">
                {bedName && (
                  <Chip color="primary" variant="compact" className="px-3 py-2">
                    <Number className={typographyStyles.h1}>{bedName}</Number>
                  </Chip>
                )}
                <h1 className={typographyStyles.h1}>{patientName}</h1>
                <div>
                  {patientAge} <SexText sex={patient?.sex} />
                </div>
              </div>
              <div className="ml-6">
                {patientIsHighFallRisk && (
                  <Chip className="flex-0">
                    <HighRiskIcon className="mr-3" /> {t('common:High Fall Risk').toUpperCase()}
                  </Chip>
                )}
                {bedStatus === 'Fall' ? (
                  <Chip color="critical" className="ml-3 animate-fall">
                    <FallIcon className="mr-3" /> {t('common:Fall')}
                  </Chip>
                ) : bedStatus === 'BedExit' ? (
                  <Chip color="warning" className="ml-3 animate-bedExit">
                    <BedExitIcon className="mr-3" /> {t('common:Bed exit')}
                  </Chip>
                ) : null}
              </div>
            </>
          )}
        </div>
      </Header>
      <DetailLayout>
        <DetailNav>
          <DetailNavList>
            <OptionalLink href={`${hrefBase}/profile`}>
              <DetailNavLink selected={selectedItem === 'profile'}>
                <ProfileIcon style={{ fontSize: '48px' }} />
                {t('patient:Patient Profile')}
              </DetailNavLink>
            </OptionalLink>
            <OptionalLink href={isEmptyBed ? null : `${hrefBase}/events`}>
              <DetailNavLink disabled={isEmptyBed} selected={selectedItem === 'alert'}>
                <NotebookIcon style={{ fontSize: '48px' }} />
                {t('patient:Event History')}
              </DetailNavLink>
            </OptionalLink>
          </DetailNavList>
        </DetailNav>
        <DetailMain className="m-3">{children}</DetailMain>
      </DetailLayout>
    </Layout>
  )
}
