import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'

import { extractErrorMessage } from '@/api/client'
import { usePageTitle } from '@/hooks/use-page-title'
import { AddressFormDialog } from '@/modules/account/components/address-form-dialog'
import { useAddresses, useDeleteAddress } from '@/modules/account/hooks/use-addresses'
import type { Address } from '@/modules/account/types/account.types'

export default function AccountAddressesPage() {
  usePageTitle('Addresses')

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Address | null>(null)

  const query = useAddresses()
  const deleteMutation = useDeleteAddress()

  const addresses = query.data?.addresses ?? []

  const openNew = () => {
    setEditing(null)
    setDialogOpen(true)
  }

  const openEdit = (address: Address) => {
    setEditing(address)
    setDialogOpen(true)
  }

  const handleDelete = (address: Address) => {
    if (!window.confirm(`Delete address${address.label ? ` "${address.label}"` : ''}?`)) return
    deleteMutation.mutate(address.id)
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.4em] text-neutral-500">
            Addresses
          </p>
          <h1 className="mt-1 font-serif text-3xl font-normal tracking-tight text-neutral-900">
            Shipping addresses
          </h1>
        </div>
        <button
          className="inline-flex items-center gap-2 bg-neutral-900 px-5 py-2.5 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-neutral-800"
          onClick={openNew}
          type="button"
        >
          <Plus className="size-4" strokeWidth={1.5} />
          Add address
        </button>
      </div>

      {query.isLoading ? (
        <p className="text-sm text-neutral-500">Loading…</p>
      ) : query.isError ? (
        <p className="border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {extractErrorMessage(query.error, 'Failed to load addresses')}
        </p>
      ) : addresses.length === 0 ? (
        <div className="flex min-h-40 items-center justify-center border border-dashed border-neutral-200 bg-neutral-50 p-8 text-center">
          <p className="text-sm text-neutral-500">No addresses yet. Add one to speed up checkout.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <article
              key={address.id}
              className="flex flex-col gap-3 border border-neutral-200 bg-white p-5"
            >
              <header className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
                    {address.label ?? 'Address'}
                  </p>
                  <p className="mt-1 font-medium text-neutral-900">{address.fullName}</p>
                </div>
                {address.isDefault ? (
                  <span className="bg-neutral-900 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white">
                    Default
                  </span>
                ) : null}
              </header>

              <address className="not-italic text-sm leading-6 text-neutral-700">
                {address.line1}
                {address.line2 ? <><br />{address.line2}</> : null}
                <br />
                {address.city}
                {address.state ? `, ${address.state}` : ''} {address.postalCode}
                <br />
                {address.country}
                {address.phone ? (
                  <>
                    <br />
                    <span className="text-neutral-500">{address.phone}</span>
                  </>
                ) : null}
              </address>

              <div className="mt-auto flex items-center gap-2 border-t border-neutral-100 pt-3">
                <button
                  className="inline-flex items-center gap-1 text-xs uppercase tracking-widest text-neutral-700 hover:text-neutral-900"
                  onClick={() => openEdit(address)}
                  type="button"
                >
                  <Pencil className="size-3.5" strokeWidth={1.5} />
                  Edit
                </button>
                <button
                  className="ml-auto inline-flex items-center gap-1 text-xs uppercase tracking-widest text-neutral-500 hover:text-red-600"
                  disabled={deleteMutation.isPending}
                  onClick={() => handleDelete(address)}
                  type="button"
                >
                  <Trash2 className="size-3.5" strokeWidth={1.5} />
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <AddressFormDialog
        editing={editing}
        onClose={() => setDialogOpen(false)}
        open={dialogOpen}
      />
    </div>
  )
}
