import EventHistory from '@/containers/EventHistory/EventHistory'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export const getServerSideProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'patient'])),
    },
  }
}

export default EventHistory
