import Link, { LinkProps } from 'next/link'

interface OptionalLinkProps extends Partial<LinkProps> {
  href?: string
}

export const OptionalLink: React.FC<OptionalLinkProps> = ({ href, children }) => {
  return href ? (
    <Link href={href} passHref>
      {children}
    </Link>
  ) : (
    <>{children}</>
  )
}
