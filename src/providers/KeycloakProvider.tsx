import { KeycloakInstance } from 'keycloak-js'
import { createContext, useContext, useEffect, useState } from 'react'

export const KeycloakContext = createContext<KeycloakInstance>(null)

export const KeycloakProvider: React.FC = ({ children }) => {
  const [keycloakInstance, setKeycloakInstance] = useState<KeycloakInstance>(null)

  useEffect(() => {
    const authenticate = async (): Promise<void> => {
      const module = await import('keycloak-js')
      const Keycloak = module.default

      if (!keycloakInstance) {
        const keycloak = Keycloak({
          clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
          realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM,
          url: process.env.NEXT_PUBLIC_KEYCLOAK_BASE_URL,
        })

        await keycloak.init({ onLoad: 'login-required' })
        await keycloak.loadUserProfile()

        setKeycloakInstance(keycloak)
      }
    }

    authenticate()
  }, [keycloakInstance])

  return <KeycloakContext.Provider value={keycloakInstance}>{children}</KeycloakContext.Provider>
}

export const useKeycloak = (): KeycloakInstance => useContext<KeycloakInstance>(KeycloakContext)
