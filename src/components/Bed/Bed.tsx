import React from 'react'
import { HighRiskIcon, Chip, ChipColor, Number, Tooltip } from '@dawnlight/ui-web'
import classNames from 'classnames'
import { BedStatus } from '@/types'

export interface BedProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  readonly bedName: string
  readonly variant?: BedStatus
  readonly isHighRisk?: boolean
}

export const Bed: React.FC<BedProps> = React.forwardRef<HTMLAnchorElement, BedProps>(
  ({ bedName, variant, isHighRisk, children, ...props }, ref) => {
    let bgClasses = ''

    switch (variant) {
      case 'Unassigned':
        bgClasses = 'hover:border-secondary cursor-copy'
        break
      case 'BedExit':
        bgClasses = 'bg-warning animate-bedExit hover:bg-warningDarker'
        break
      case 'Fall':
        bgClasses = 'bg-critical animate-fall hover:bg-criticalDarker'
        break
      default:
        // offline, still, restless, likely-bed-exit, assistance-bed-exit, assistance-fall
        bgClasses = 'bg-primary hover:bg-secondary'
        break
    }

    let chipColor: ChipColor
    switch (variant) {
      case 'LikelyBedExit':
        chipColor = 'warning'
        break
      default:
        chipColor = 'darker'
        break
    }

    return (
      <a
        className={`flex flex-col rounded transition-all px-2 py-1 h-full border border-transparent focus:outline-none focus:ring ${bgClasses}`}
        ref={ref}
        {...props}
      >
        <div className="flex self-stretch justify-between items-center">
          <Chip variant="compact" rounded="m" color={chipColor} className="mb-1 mr-1">
            <Number className="text-2xl">{bedName}</Number>
          </Chip>
          {isHighRisk && (
            <Tooltip title="High fall risk">
              <div
                data-testid="highRiskSection"
                className="flex items-center uppercase font-bold text-right"
              >
                <HighRiskIcon className="ml-1" />
              </div>
            </Tooltip>
          )}
        </div>
        <div
          className={classNames(
            'justify-around border-t border-divider text-xl flex items-center py-3 flex-1',
            {
              'text-dimmed2': variant === 'Unassigned',
              'text-dimmed1': variant === 'Still' || variant === 'Offline',
              'text-body1': variant === 'BedExit' || variant === 'Fall',
              'text-warningLighter': variant === 'Restless',
              'text-warning': variant === 'LikelyBedExit',
              'justify-around': variant === 'Unassigned',
            }
          )}
        >
          {children}
        </div>
      </a>
    )
  }
)

Bed.displayName = 'Bed'
