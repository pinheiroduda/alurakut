import React from 'react'
import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import {
  AlurakutMenu,
  AlurakutProfileSidebarMenuDefault,
  OrkutNostalgicIconSet
} from '../src/lib/AlurakutCommuns'
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations'

function ProfileSidebar(properties) {
  return (
    <Box as="aside">
      <img
        src={`https://github.com/${properties.githubUser}.png`}
        style={{ borderRadius: '8px' }}
      />
      <hr />

      <p>
        <a
          className="boxLink"
          href="https://github.com/${properties.githubUser}"
        >
          @{properties.githubUser}
        </a>
      </p>

      <hr />
      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

function ProfileRelationsBox(properties) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {properties.title} ({properties.items.length})
      </h2>
      <ul>
        {/* {seguidores.map((itemAtual) => {
          return (
            <li key={itemAtual}>
              <a href={`https://github.com/${itemAtual}.png`}>
                <img src={itemAtual.image} />
                <span>{itemAtual.title}</span>
              </a>
            </li>
          )
        })} */}
      </ul>
    </ProfileRelationsBoxWrapper>
  )
}

export default function Home() {
  const randomUser = 'pinheiroduda'
  const [comunities, setComunities] = React.useState([
    {
      id: '123456789',
      title: 'Eu odeio acordar cedo',
      image: 'https://alurakut.vercel.app/capa-comunidade-01.jpg'
    }
  ])
  const favoritePeople = [
    'juunegreiros',
    'omariosouto',
    'maykbrito',
    'rafaballerini',
    'peas',
    'emilioheinz'
  ]

  const [followers, setFollowers] = React.useState([])
  // 0 -Pegar o array de dados do github
  React.useEffect(function () {
    fetch('https://api.github.com/users/pinheiroduda/followers')
      .then(function (serverAnswer) {
        return serverAnswer.json()
      })
      .then(function (completeAnswer) {
        console.log(completeAnswer)
      })
  }, [])

  // 1 - Criar um box que vai ter um map, baseado nos itens do array que pegamos do Github

  return (
    <>
      <AlurakutMenu />
      <MainGrid>
        {/* <Box style="grid-area: profileArea;"> */}
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={randomUser} />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">Welcome</h1>

            <OrkutNostalgicIconSet />
          </Box>

          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form
              onSubmit={function handleCreateComunity(e) {
                e.preventDefault()
                const dadosDoForm = new FormData(e.target)

                console.log('Campo: ', dadosDoForm.get('title'))
                console.log('Campo: ', dadosDoForm.get('image'))

                const comunity = {
                  id: new Date().toISOString(),
                  title: dadosDoForm.get('title'),
                  image: dadosDoForm.get('image')
                }
                const updatedComunities = [...comunities, comunity]
                setComunities(updatedComunities)
              }}
            >
              <div>
                <input
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  type="text"
                />
              </div>
              <div>
                <input
                  placeholder="Coloque uma URL para usarmos de capa"
                  name="image"
                  aria-label="Coloque uma URL para usarmos de capa"
                />
              </div>

              <button>Criar comunidade</button>
            </form>
          </Box>
        </div>
        <div
          className="profileRelationsArea"
          style={{ gridArea: 'profileRelationsArea' }}
        >
          <ProfileRelationsBox title="Followers" items={followers} />

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">Comunities ({comunities.length})</h2>

            <ul>
              {comunities.map(itemAtual => {
                return (
                  <li key={itemAtual.id}>
                    <a href={`/users/${itemAtual.title}`}>
                      <img src={itemAtual.image} />
                      <span>{itemAtual.title}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Comunity People ({favoritePeople.length})
            </h2>

            <ul>
              {favoritePeople.map(itemAtual => {
                return (
                  <li key={itemAtual}>
                    <a href={`/users/${itemAtual}`}>
                      <img src={`https://github.com/${itemAtual}.png`} />
                      <span>{itemAtual}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  )
}
