import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  CATEGORIES,
  CATEGORY_LABELS,
  PRIORITIES,
  PRIORITY_LABELS,
  STATUSES,
  STATUS_LABELS,
  type Category,
  type Priority,
  type Status,
  type TicketInput,
} from '../types/ticket'

// Like TicketInput, but category and priority can be empty while the user is still filling in the form
export interface TicketFormValues {
  title: string
  description: string
  category: Category | ''
  priority: Priority | ''
  status: Status
}

interface TicketFormProps {
  initialValues: TicketFormValues
  submitLabel: string
  submitting: boolean
  serverErrors: Record<string, string>
  formError: string | null
  cancelTo: string
  onSubmit: (input: TicketInput) => void
}

// Same rules and messages as the backend, so the user gets instant feedback
function validate(values: TicketFormValues): Record<string, string> {
  const errors: Record<string, string> = {}

  const title = values.title.trim()
  if (!title) {
    errors.title = 'Title is required'
  } else if (title.length < 3 || title.length > 100) {
    errors.title = 'Title must be between 3 and 100 characters'
  }

  const description = values.description.trim()
  if (!description) {
    errors.description = 'Description is required'
  } else if (description.length > 2000) {
    errors.description = 'Description must be at most 2000 characters'
  }

  if (!values.category) errors.category = 'Category is required'
  if (!values.priority) errors.priority = 'Priority is required'

  return errors
}

function TicketForm({
  initialValues,
  submitLabel,
  submitting,
  serverErrors,
  formError,
  cancelTo,
  onSubmit,
}: TicketFormProps) {
  const [values, setValues] = useState<TicketFormValues>(initialValues)
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({})

  // Messages from our own check take priority over messages from the backend
  const errors = { ...serverErrors, ...clientErrors }

  function update<K extends keyof TicketFormValues>(field: K, value: TicketFormValues[K]) {
    setValues((previous) => ({ ...previous, [field]: value }))
    // Clear the message for a field as soon as the user edits it
    setClientErrors((previous) => {
      const next = { ...previous }
      delete next[field]
      return next
    })
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const found = validate(values)
    setClientErrors(found)
    if (Object.keys(found).length > 0) return

    onSubmit({
      title: values.title.trim(),
      description: values.description.trim(),
      category: values.category as Category,
      priority: values.priority as Priority,
      status: values.status,
    })
  }

  return (
    <form className="ticket-form" onSubmit={handleSubmit} noValidate>
      {formError && (
        <div className="error-message" role="alert">
          <p>{formError}</p>
        </div>
      )}

      <div className="form-field">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={values.title}
          onChange={(event) => update('title', event.target.value)}
          aria-invalid={errors.title ? true : undefined}
          aria-describedby={errors.title ? 'title-error' : undefined}
        />
        {errors.title && (
          <p className="field-error" id="title-error">
            {errors.title}
          </p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          rows={5}
          value={values.description}
          onChange={(event) => update('description', event.target.value)}
          aria-invalid={errors.description ? true : undefined}
          aria-describedby={errors.description ? 'description-error' : undefined}
        />
        {errors.description && (
          <p className="field-error" id="description-error">
            {errors.description}
          </p>
        )}
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={values.category}
            onChange={(event) => update('category', event.target.value as Category | '')}
            aria-invalid={errors.category ? true : undefined}
            aria-describedby={errors.category ? 'category-error' : undefined}
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {CATEGORY_LABELS[category]}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="field-error" id="category-error">
              {errors.category}
            </p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            value={values.priority}
            onChange={(event) => update('priority', event.target.value as Priority | '')}
            aria-invalid={errors.priority ? true : undefined}
            aria-describedby={errors.priority ? 'priority-error' : undefined}
          >
            <option value="">Select a priority</option>
            {PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {PRIORITY_LABELS[priority]}
              </option>
            ))}
          </select>
          {errors.priority && (
            <p className="field-error" id="priority-error">
              {errors.priority}
            </p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={values.status}
            onChange={(event) => update('status', event.target.value as Status)}
          >
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Saving...' : submitLabel}
        </button>
        <Link to={cancelTo} className="btn">
          Cancel
        </Link>
      </div>
    </form>
  )
}

export default TicketForm