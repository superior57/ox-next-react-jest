import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export const getServerSideProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'patient'])),
    },
  }
}

const RedirectPage: React.FC = () => {
  const router = useRouter()
  const { bedId, unitId } = router.query

  useEffect(() => {
    router.push(`/units/${unitId}/beds/${bedId}/profile`)
  })

  return <></>
}

export default RedirectPage
