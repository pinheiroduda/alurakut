import { SiteClient } from 'datocms-client'

export default async function requestReceiver(request, response) {
  if (request.method == 'POST') {
    const TOKEN = 'f57475ad409d1100dcacda411144ae'
    const client = new SiteClient(TOKEN)

    // Validar os dados antes de sair cadastrando//
    const cratedRecord = await client.items.create({
      itemType: '972036', //todo o resto que será adicionado em seguida, dentro desse {}, são os dados que ele espera receber sobre a comunidade que desejamos criar
      ...request.body
      //title: 'Comunidade Teste',
      //imageUrl: 'https://github.com/pinheiroduda'
      //creatorSlug: 'pinheiroduda'
    })

    console.log(TOKEN)
    response.json({
      data: 'Algum dado qualquer',
      cratedRecord: cratedRecord
    })
    return
  }
}
