import { BedStatus } from '@/types'
import { useTranslation } from 'next-i18next'

interface StatusProps {
  readonly status: BedStatus
}

export const BedStatusText: React.FC<StatusProps> = ({ status }) => {
  let statusText: string

  const { t } = useTranslation('common')

  switch (status) {
    case 'Loading':
      statusText = ''
      break
    case 'Unassigned':
      statusText = t('Unassigned')
      break
    case 'Offline':
      statusText = t('Offline')
      break
    case 'Still':
      statusText = t('Still')
      break
    case 'Restless':
      statusText = t('Restless')
      break
    case 'LikelyBedExit':
      statusText = t('Likely bed exit')
      break
    case 'BedExit':
      statusText = t('Bed exit')
      break
    case 'Fall':
      statusText = t('Fall')
      break
    case 'MultiplePeople':
      statusText = t('Multiple people')
      break
    default:
      statusText = t('Unknown')
      break
  }

  return <span className="capitalize">{statusText}</span>
}
