import { definitions } from '@/types'
import { useTranslation } from 'next-i18next'

export const SexText: React.FC<{ sex: definitions['Patient']['sex'] }> = ({ sex }) => {
  const { t } = useTranslation('patient')
  switch (sex) {
    case 'female':
      return <>{t('Female')}</>
    case 'male':
      return <>{t('Male')}</>
    default:
      return <></>
  }
}
