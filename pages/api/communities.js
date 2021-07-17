export default async function requestReceiver(request, response) {
  const TOKEN = 'f57475ad409d1100dcacda411144ae'
  console.lod(TOKEN)
  response.json({
    data: 'Algum dado qualquer'
  })
}
