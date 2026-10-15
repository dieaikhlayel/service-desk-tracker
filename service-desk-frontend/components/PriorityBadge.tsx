import { PRIORITY_LABELS, type Priority } from '../types/ticket'

interface PriorityBadgeProps {
    priority: Priority
}

function PriorityBadge({ priority }: PriorityBadgeProps) {
    return (
        <span className={`badge badge-priority-${priority.toLowerCase()}`}>
            {PRIORITY_LABELS[priority]}
        </span>
    )
}

export default PriorityBadge