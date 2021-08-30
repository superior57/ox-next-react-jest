import React from 'react'
import classNames from 'classnames'

export const BedLayout: React.FC<React.HTMLAttributes<HTMLUListElement>> = ({
  className,
  children,
  ...props
}) => (
  <ul
    className={classNames(
      'grid md:grid-cols-2 md:grid-rows-4 lg:grid-cols-7 lg:grid-rows-5 gap-3 p-0 m-3',
      className
    )}
    {...props}
  >
    {children}
  </ul>
)
