import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Loader2, X } from 'lucide-react'

import { extractErrorMessage } from '@/api/client'
import {
  useCreateAddress,
  useUpdateAddress,
} from '@/modules/account/hooks/use-addresses'
import type { Address } from '@/modules/account/types/account.types'

type Props = {
  open: boolean
  editing: Address | null
  onClose: () => void
}

const inputClasses =
  'w-full border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none'

const defaults = {
  label: '',
  fullName: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
  isDefault: false,
}

export function AddressFormDialog({ open, editing, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [fields, setFields] = useState(defaults)

  const createMutation = useCreateAddress()
  const updateMutation = useUpdateAddress()
  const isPending = createMutation.isPending || updateMutation.isPending
  const error = createMutation.error ?? updateMutation.error

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) {
      dialog.showModal()
      setFields(
        editing
          ? {
              label: editing.label ?? '',
              fullName: editing.fullName,
              phone: editing.phone ?? '',
              line1: editing.line1,
              line2: editing.line2 ?? '',
              city: editing.city,
              state: editing.state ?? '',
              postalCode: editing.postalCode,
              country: editing.country,
              isDefault: editing.isDefault,
            }
          : defaults,
      )
      createMutation.reset()
      updateMutation.reset()
    }

    if (!open && dialog.open) {
      dialog.close()
    }
  }, [open, editing, createMutation, updateMutation])

  const update = <K extends keyof typeof fields>(key: K, value: (typeof fields)[K]) => {
    setFields((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const payload = {
      fullName: fields.fullName.trim(),
      line1: fields.line1.trim(),
      city: fields.city.trim(),
      postalCode: fields.postalCode.trim(),
      country: fields.country.trim(),
      isDefault: fields.isDefault,
      ...(fields.label.trim() ? { label: fields.label.trim() } : {}),
      ...(fields.phone.trim() ? { phone: fields.phone.trim() } : {}),
      ...(fields.line2.trim() ? { line2: fields.line2.trim() } : {}),
      ...(fields.state.trim() ? { state: fields.state.trim() } : {}),
    }

    if (editing) {
      updateMutation.mutate(
        { id: editing.id, input: payload },
        { onSuccess: onClose },
      )
    } else {
      createMutation.mutate(payload, { onSuccess: onClose })
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 m-auto h-fit w-fit max-w-[90vw] border border-neutral-200 bg-white p-0 text-neutral-900 backdrop:bg-neutral-900/40"
      onClose={onClose}
    >
      <form className="flex w-[min(36rem,92vw)] flex-col gap-4 p-6" onSubmit={handleSubmit}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Addresses</p>
            <h2 className="mt-1 text-lg font-semibold">
              {editing ? 'Edit address' : 'Add address'}
            </h2>
          </div>
          <button
            aria-label="Close"
            className="rounded-full p-1 text-neutral-500 transition hover:bg-neutral-100"
            onClick={onClose}
            type="button"
          >
            <X className="size-4" strokeWidth={1.5} />
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Label" htmlFor="addr-label" hint="Home, Office…">
            <input
              className={inputClasses}
              id="addr-label"
              maxLength={40}
              onChange={(event) => update('label', event.target.value)}
              placeholder="Home"
              type="text"
              value={fields.label}
            />
          </Field>

          <Field label="Full name" htmlFor="addr-full-name" required>
            <input
              className={inputClasses}
              id="addr-full-name"
              maxLength={120}
              minLength={2}
              onChange={(event) => update('fullName', event.target.value)}
              required
              type="text"
              value={fields.fullName}
            />
          </Field>

          <Field label="Phone" htmlFor="addr-phone">
            <input
              className={inputClasses}
              id="addr-phone"
              maxLength={30}
              onChange={(event) => update('phone', event.target.value)}
              type="tel"
              value={fields.phone}
            />
          </Field>
        </div>

        <Field label="Address line 1" htmlFor="addr-line1" required>
          <input
            className={inputClasses}
            id="addr-line1"
            maxLength={200}
            minLength={2}
            onChange={(event) => update('line1', event.target.value)}
            required
            type="text"
            value={fields.line1}
          />
        </Field>

        <Field label="Address line 2" htmlFor="addr-line2">
          <input
            className={inputClasses}
            id="addr-line2"
            maxLength={200}
            onChange={(event) => update('line2', event.target.value)}
            placeholder="Apt, suite, etc."
            type="text"
            value={fields.line2}
          />
        </Field>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="City" htmlFor="addr-city" required>
            <input
              className={inputClasses}
              id="addr-city"
              maxLength={80}
              minLength={2}
              onChange={(event) => update('city', event.target.value)}
              required
              type="text"
              value={fields.city}
            />
          </Field>

          <Field label="State / region" htmlFor="addr-state">
            <input
              className={inputClasses}
              id="addr-state"
              maxLength={80}
              onChange={(event) => update('state', event.target.value)}
              type="text"
              value={fields.state}
            />
          </Field>

          <Field label="Postal code" htmlFor="addr-postal-code" required>
            <input
              className={inputClasses}
              id="addr-postal-code"
              maxLength={20}
              minLength={2}
              onChange={(event) => update('postalCode', event.target.value)}
              required
              type="text"
              value={fields.postalCode}
            />
          </Field>

          <Field label="Country" htmlFor="addr-country" required>
            <input
              className={inputClasses}
              id="addr-country"
              maxLength={80}
              minLength={2}
              onChange={(event) => update('country', event.target.value)}
              required
              type="text"
              value={fields.country}
            />
          </Field>
        </div>

        <label className="inline-flex items-center gap-2 text-sm text-neutral-700">
          <input
            checked={fields.isDefault}
            className="size-4 border-neutral-300 text-neutral-900 focus:ring-neutral-900"
            onChange={(event) => update('isDefault', event.target.checked)}
            type="checkbox"
          />
          Use as default address
        </label>

        {error ? (
          <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {extractErrorMessage(error, 'Unable to save address')}
          </p>
        ) : null}

        <div className="flex justify-end gap-2">
          <button
            className="border border-neutral-300 px-5 py-2.5 text-sm font-semibold uppercase tracking-widest text-neutral-900 transition hover:border-neutral-900"
            disabled={isPending}
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="inline-flex items-center gap-2 bg-neutral-900 px-5 py-2.5 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isPending}
            type="submit"
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" strokeWidth={1.5} />
                Saving…
              </>
            ) : editing ? 'Save changes' : 'Add address'}
          </button>
        </div>
      </form>
    </dialog>
  )
}

type FieldProps = {
  label: string
  htmlFor: string
  required?: boolean
  hint?: string
  children: React.ReactNode
}

function Field({ label, htmlFor, required, hint, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs uppercase tracking-[0.3em] text-neutral-500" htmlFor={htmlFor}>
        {label}
        {required ? <span className="ml-1 text-neutral-400">*</span> : null}
      </label>
      {children}
      {hint ? <p className="text-xs text-neutral-400">{hint}</p> : null}
    </div>
  )
}
