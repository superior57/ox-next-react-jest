import React, { ReactElement } from 'react'
import { render, RenderOptions, RenderResult } from '@testing-library/react'
// import theme from 'src/lib/theme'
// import { ThemeProvider } from '@material-ui/styles'

const AllTheProviders: React.FC = ({ children }) => {
  // return <ThemeProvider theme={theme}>{children}</ThemeProvider>
  return <>{children}</>
}

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'queries'>): RenderResult =>
  render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'

export { customRender as render }
