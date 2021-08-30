import { PatientLayout } from '@/components/PatientLayout'
import { useRouter } from 'next/router'
import { Card, LinearProgress, typographyStyles } from '@dawnlight/ui-web'
import { format } from 'date-fns'
import classNames from 'classnames'
import { useAlerts } from '@/hooks/useAlerts'
import { eventToBedStatus, flattenQueryString } from '@/lib/utils'
import { BedStatusText } from '@/components/BedStatusText'
import { getBedById, getBeds, getBedStatus, getUnitById } from '@/selectors/selectors'
import { useUnits } from '@/hooks/useUnits'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useTranslation } from 'next-i18next'
import { definitions } from '@/types'
import { useKeycloak } from '@/providers/KeycloakProvider'

const EventHistory: React.FC = () => {
  const { t } = useTranslation(['common', 'patient'])
  const router = useRouter()
  const keycloak = useKeycloak()
  const [bed, setBed] = useState<definitions['Bed']>()
  const [patient, setPatient] = useState<definitions['Patient']>()
  const { data: units, isError: unitsError, isLoading: unitsLoading } = useUnits(keycloak?.token)
  const {
    data: alerts,
    isError: alertsError,
    isLoading: alertsLoading,
  } = useAlerts(patient?.patientId, keycloak?.token)

  useEffect(() => {
    if (unitsError) {
      toast.error(t('patient:loadUnitsError'))
    }
    if (alertsError) {
      toast.error(t('patient:loadEventsError'))
    }
  }, [unitsError, alertsError, t])

  useEffect(() => {
    if (router.isReady && Array.isArray(units) && units.length > 0) {
      const unitId = flattenQueryString(router.query.unitId)
      const bedId = flattenQueryString(router.query.bedId)
      const unit = getUnitById(unitId, units)
      const beds = getBeds(unit)

      const bed = getBedById(bedId, beds)

      setBed(bed)
      setPatient(bed.patient)
    }
  }, [router, units])

  useEffect(() => {
    if (patient) {
      setPatient(patient)
    }
  }, [patient])

  const bedName = bed ? bed.bedName : ''
  const bedStatus = bed ? getBedStatus(bed) : null

  // TODO: Use react-virtualized for this list (it could potentially become very long)

  return (
    <PatientLayout
      selectedItem="alert"
      patient={patient}
      bedName={bedName}
      initialBedStatus={bedStatus}
    >
      <Card color="dark">
        <h2 className={classNames(typographyStyles.h2, 'mb-8')}>{t('patient:Event History')}</h2>
        {unitsLoading || alertsLoading ? (
          <div className="flex items-center justify-around h-60">
            <LinearProgress />
          </div>
        ) : (
          <table
            className="table-fixed border-collapse w-full p-6"
            style={{ borderSpacing: '0 4px' }}
          >
            <thead className="text-left text-body2 uppercase">
              <tr>
                <th className="p-6">{t('patient:Name')}</th>
                <th className="p-6">{t('patient:Timestamp')}</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(alerts) && alerts.length === 0 && (
                <tr>
                  <td
                    colSpan={2}
                    className={classNames(typographyStyles.h3, 'text-brand my-3 text-center py-12')}
                  >
                    {t('patient:No events')}
                  </td>
                </tr>
              )}
              {Array.isArray(alerts) &&
                alerts.map((alert) => (
                  <tr key={alert?.alertConfig?.id} className="bg-darker">
                    <td className="p-6">
                      <BedStatusText status={eventToBedStatus(alert.detail.activity)} />
                    </td>
                    <td className="p-6">{format(parseInt(alert.createdAt), 'M/d/y • h:m aaa')}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </Card>
    </PatientLayout>
  )
}

export default EventHistory
