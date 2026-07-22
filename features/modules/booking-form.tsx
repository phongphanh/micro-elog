"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronLeft } from "lucide-react"
import { type Resolver, useForm } from "react-hook-form"
import { toast } from "sonner"

import { ConfirmDialog, type ConfirmState } from "@/components/shared/confirm-dialog"
import { FileUploader } from "@/components/shared/file-uploader"
import { PageHeader } from "@/components/shared/page-header"
import { Panel } from "@/components/shared/panel"
import { Button } from "@/components/ui/button"
import { Field, FormGrid, inputClass } from "@/features/modules/form-fields"
import { ports } from "@/lib/elog/constants"
import { bookingSchema, type BookingFormValues } from "@/lib/elog/schemas"
import type { DataRecord } from "@/lib/elog/types"
import { cn } from "@/lib/utils"

export function BookingForm({ record, onBack }: { record?: DataRecord; onBack: () => void }) {
  const [confirm, setConfirm] = React.useState<ConfirmState | null>(null)
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema as never) as Resolver<BookingFormValues>,
    defaultValues: {
      customer: String(record?.customer ?? "An Phat Export"),
      bookingType: String(record?.bookingType ?? "FCL"),
      shipmentType: "Ocean",
      originPort: String(record?.origin ?? "Cat Lai Terminal"),
      destinationPort: String(record?.destination ?? "Singapore Port"),
      pickupLocation: "Binh Duong ICD",
      deliveryLocation: "Singapore Distribution Hub",
      expectedDepartureDate: "2026-07-28",
      expectedArrivalDate: "2026-08-02",
      cargoDescription: String(record?.cargo ?? "Consumer electronics and packed cartons"),
      cargoWeight: 18400,
      cargoVolume: 62,
      containerType: "40HC",
      numberOfContainers: 2,
      specialInstructions: "Keep documents ready for customs pre-clearance.",
    },
  })

  function submit(values: BookingFormValues, intent: "draft" | "submit") {
    setConfirm({
      title: intent === "draft" ? "Save booking draft?" : "Submit booking for review?",
      body: `${values.customer} booking from ${values.originPort} to ${values.destinationPort} will be ${intent === "draft" ? "saved as Draft" : "submitted to Operations"}.`,
      onConfirm: () => {
        toast.success(intent === "draft" ? "Booking draft saved" : "Booking submitted for review")
        onBack()
      },
    })
  }

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit((values) => submit(values, "submit"))}>
      <PageHeader
        title={record ? `Edit ${record.title}` : "Create Booking"}
        description="Validated booking workflow with cargo, route, container and document sections."
        action={<Button variant="outline" type="button" onClick={onBack}><ChevronLeft /> Back</Button>}
      />
      <Panel title="Customer & Route">
        <FormGrid>
          <Field label="Customer" error={form.formState.errors.customer?.message}><input {...form.register("customer")} className={inputClass} /></Field>
          <Field label="Booking Type" error={form.formState.errors.bookingType?.message}><select {...form.register("bookingType")} className={inputClass}><option>FCL</option><option>LCL</option><option>Air</option><option>Trucking</option><option>Customs</option></select></Field>
          <Field label="Shipment Type" error={form.formState.errors.shipmentType?.message}><select {...form.register("shipmentType")} className={inputClass}><option>Ocean</option><option>Air</option><option>Road</option><option>Multimodal</option></select></Field>
          <Field label="Origin Port" error={form.formState.errors.originPort?.message}><select {...form.register("originPort")} className={inputClass}>{ports.map((port) => <option key={port}>{port}</option>)}</select></Field>
          <Field label="Destination Port" error={form.formState.errors.destinationPort?.message}><select {...form.register("destinationPort")} className={inputClass}>{ports.map((port) => <option key={port}>{port}</option>)}</select></Field>
          <Field label="Pickup Location" error={form.formState.errors.pickupLocation?.message}><input {...form.register("pickupLocation")} className={inputClass} /></Field>
          <Field label="Delivery Location" error={form.formState.errors.deliveryLocation?.message}><input {...form.register("deliveryLocation")} className={inputClass} /></Field>
          <Field label="Expected Departure" error={form.formState.errors.expectedDepartureDate?.message}><input type="date" {...form.register("expectedDepartureDate")} className={inputClass} /></Field>
          <Field label="Expected Arrival" error={form.formState.errors.expectedArrivalDate?.message}><input type="date" {...form.register("expectedArrivalDate")} className={inputClass} /></Field>
        </FormGrid>
      </Panel>
      <Panel title="Cargo & Containers">
        <FormGrid>
          <Field label="Cargo Description" error={form.formState.errors.cargoDescription?.message} wide><textarea {...form.register("cargoDescription")} className={cn(inputClass, "min-h-24 py-2")} /></Field>
          <Field label="Cargo Weight (kg)" error={form.formState.errors.cargoWeight?.message}><input type="number" {...form.register("cargoWeight")} className={inputClass} /></Field>
          <Field label="Cargo Volume (CBM)" error={form.formState.errors.cargoVolume?.message}><input type="number" {...form.register("cargoVolume")} className={inputClass} /></Field>
          <Field label="Container Type" error={form.formState.errors.containerType?.message}><select {...form.register("containerType")} className={inputClass}><option>20GP</option><option>40GP</option><option>40HC</option><option>45R1 Reefer</option></select></Field>
          <Field label="Number of Containers" error={form.formState.errors.numberOfContainers?.message}><input type="number" {...form.register("numberOfContainers")} className={inputClass} /></Field>
          <Field label="Special Instructions" error={form.formState.errors.specialInstructions?.message} wide><textarea {...form.register("specialInstructions")} className={cn(inputClass, "min-h-24 py-2")} /></Field>
        </FormGrid>
      </Panel>
      <Panel title="Attached Documents">
        <FileUploader />
      </Panel>
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onBack}>Cancel</Button>
        <Button type="button" variant="secondary" onClick={form.handleSubmit((values) => submit(values, "draft"))}>Save Draft</Button>
        <Button type="submit">Submit Booking</Button>
      </div>
      <ConfirmDialog state={confirm} onClose={() => setConfirm(null)} />
    </form>
  )
}
