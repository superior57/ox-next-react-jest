import PatientProfile from '@/containers/PatientProfile/PatientProfile'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export const getServerSideProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'patient'])),
    },
  }
}

export default PatientProfile
