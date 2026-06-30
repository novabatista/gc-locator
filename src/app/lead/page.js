import database from '@/service/database/gcs'
import LeadForm from '@/app/lead/LeadForm'

export const dynamic = 'force-dynamic'

export default async function PageLead() {
  const gcs = await database.all()
  const gcsList = gcs.map(gc => ({
    id: gc.id,
    name: gc.name,
    contacts: gc.contacts,
  }))

  return <LeadForm gcsList={gcsList} />
}
