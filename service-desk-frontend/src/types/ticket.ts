export type Status = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED'
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH'
export type Category = 'HARDWARE' | 'SOFTWARE' | 'NETWORK' | 'ACCOUNT_ACCESS' | 'OTHER'

// What the backend returns
export interface Ticket {
    id: number
    title: string
    description: string
    category: Category
    priority: Priority
    status: Status
    createdAt: string
}

// What we send when creating or editing a ticket
export interface TicketInput {
    title: string
    description: string
    category: Category
    priority: Priority
    status: Status
}

// Dashboard counts
export interface TicketSummary {
    total: number
    open: number
    inProgress: number
    resolved: number
}

// Search and filter values. An empty string means "no filter".
export interface TicketFilters {
    status: Status | ''
    priority: Priority | ''
    search: string
}

export const EMPTY_FILTERS: TicketFilters = { status: '', priority: '', search: '' }

// Lists used for dropdowns
export const STATUSES: Status[] = ['OPEN', 'IN_PROGRESS', 'RESOLVED']
export const PRIORITIES: Priority[] = ['LOW', 'MEDIUM', 'HIGH']
export const CATEGORIES: Category[] = ['HARDWARE', 'SOFTWARE', 'NETWORK', 'ACCOUNT_ACCESS', 'OTHER']

// Readable labels for the screen
export const STATUS_LABELS: Record<Status, string> = {
    OPEN: 'Open',
    IN_PROGRESS: 'In Progress',
    RESOLVED: 'Resolved',
}

export const PRIORITY_LABELS: Record<Priority, string> = {
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High',
}

export const CATEGORY_LABELS: Record<Category, string> = {
    HARDWARE: 'Hardware',
    SOFTWARE: 'Software',
    NETWORK: 'Network',
    ACCOUNT_ACCESS: 'Account Access',
    OTHER: 'Other',
}