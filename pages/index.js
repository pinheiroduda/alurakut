import React from 'react'
import nookies from 'nookies'
import jsonwebtoken from 'jsonwebtoken'
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

// usada dessa forma para retornar componentes no formato de função, retira a necessidade de importarmos o componente (ex: import React, {Component})
export default function Home(props) {
  const randomUser = props.githubUser
  const [communities, setCommunities] = React.useState([])
  const favoritePeople = [
    'juunegreiros',
    'omariosouto',
    'lucasmontano',
    'rafaballerini',
    'peas',
    'emilioheinz'
  ]

  const [followers, setFollowers] = React.useState([])
  // 0 -Pegar o array de dados do github
  React.useEffect(function () {
    // GET
    fetch('https://api.github.com/users/pinheiroduda/followers')
      .then(function (serverAnswer) {
        return serverAnswer.json()
      })
      .then(function (completeAnswer) {
        setFollowers(completeAnswer)
      })

    // API GraphQL
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        Authorization: 'c6f6d14b73f3510276a0da6ad95550',
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        query: `query {
          allCommunities {
            title
            id
            imageUrl
            creatorSlug
          }
        }`
      })
    })
      .then(response => response.json()) // Pega o retorno do response.json() e já retorna, se abrisse {} teria que especificar um return depois
      .then(completeAnswer => {
        const datoCommunities = completeAnswer.data.allCommunities
        console.log(datoCommunities)
        setCommunities(datoCommunities)
      })
  }, [])

  console.log('seguidores antes do return', followers)

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
            <h1 className="title"> Bem vindo(a) </h1>

            <OrkutNostalgicIconSet />
          </Box>

          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form
              onSubmit={function handleCreateCommunity(e) {
                e.preventDefault()
                const dadosDoForm = new FormData(e.target)

                console.log('Campo: ', dadosDoForm.get('title'))
                console.log('Campo: ', dadosDoForm.get('image'))

                const community = {
                  title: dadosDoForm.get('title'),
                  imageUrl: dadosDoForm.get('image'),
                  creatorSlug: randomUser
                }

                fetch('/api/communities', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(community)
                }).then(async response => {
                  const data = response.json()
                  console.log(data.cratedRecord)
                  const community = data.cratedRecord
                  const updatedCommunities = [...communities, community]
                  setCommunities(updatedCommunities)
                })
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
          <ProfileRelationsBox title="Seguidores" items={followers} />

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle"> Comunidades ({communities.length})</h2>

            <ul>
              {communities.map(itemAtual => {
                return (
                  <li key={itemAtual.id}>
                    <a href={`/communities/${itemAtual.id}`}>
                      <img src={itemAtual.imageUrl} />
                      <span>{itemAtual.title}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Pessoas da comunidade ({favoritePeople.length})
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

export async function getServerSideProps(context) {
  const cookies = nookies.get(context)
  const token = cookies.USER_TOKEN

  const { isAuthenticated } = await fetch(
    'https://alurakut.vercel.app/api/auth',
    {
      headers: {
        Authorization: token
      }
    }
  ).then(answer => answer.json())

  console.log('isAuthenticated', isAuthenticated)

  if (!isAuthenticated) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }

  const { githubUser } = jsonwebtoken.decode(token)
  return {
    props: {
      githubUser
    } // will be passed to the page component as props
  }
}
