import { SiteClient } from 'datocms-client'

export default async function requestReceiver(request, response) {
  const TOKEN = 'f57475ad409d1100dcacda411144ae'
  const client = new SiteClient(TOKEN)

  console.lod(TOKEN)
  response.json({
    data: 'Algum dado qualquer'
  })
}
