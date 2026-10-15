import { STATUS_LABELS, type Status } from '../types/ticket'

interface StatusBadgeProps {
    status: Status
}

function StatusBadge({ status }: StatusBadgeProps) {
    // IN_PROGRESS becomes "in-progress" so it works as a CSS class name
    const cssName = status.toLowerCase().replace('_', '-')

    return <span className={`badge badge-status-${cssName}`}>{STATUS_LABELS[status]}</span>
}

export default StatusBadge