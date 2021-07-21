import React, { useEffect } from 'react'
import nookies from 'nookies'
import jsonwebtoken from 'jsonwebtoken'
import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import {
  AlurakutMenu,
  AlurakutProfileSidebarMenuDefault,
  OrkutNostalgicIconSet
} from '../src/lib/AlurakutCommons'
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations'

function ProfileSidebar(props) {
  console.log(props)
  return (
    <Box as="aside">
      <img
        src={`https://github.com/${props.githubUser}.png`}
        style={{ borderRadius: '8px' }}
      />
      <hr />
      <p>
        <a className="boxLink" href="https://github.com/${props.githubUser}">
          @{props.githubUser}
        </a>
      </p>
      <hr />
      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

function ProfileRelationsBox(props) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {props.title} ({props.items.length})
      </h2>
      <ul>
        {props.items.slice(0, 6).map(itemAtual => {
          return (
            <li key={itemAtual.id}>
              <a
                href={`https://github.com/${itemAtual.title}`}
                key={itemAtual.id}
              >
                <img src={`${itemAtual.avatarUrl}`}></img>
                <span>{itemAtual.title}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </ProfileRelationsBoxWrapper>
  )
}

// usada dessa forma para retornar componentes no formato de função, retira a necessidade de importarmos o componente (ex: import React, {Component})
export default function Home(props) {
  const githubUser = props.githubUser
  const [communities, setCommunities] = React.useState([])
  const [followers, setFollowers] = React.useState([])
  const [following, setFollowing] = React.useState([])

  // 0 -Pegar o array de dados do github
  React.useEffect(() => {
    if (githubUser) {
      fetch(`https://api.github.com/users/${githubUser}/followers`)
        .then(response => response.json())
        .then(datas => {
          const followersArray = datas.map(data => {
            return {
              title: data.login,
              avatarUrl: data.avatar_url,
              id: data.id
            }
          })
          setFollowers(followersArray)
        })
    }

    if (githubUser) {
      fetch(`https://api.github.com/users/${githubUser}/following`)
        .then(response => response.json())
        .then(datas => {
          const followingArray = datas.map(data => {
            return {
              title: data.login,
              avatarUrl: data.avatar_url,
              id: data.id
            }
          })
          setFollowing(followingArray)
        })
    }

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
          <ProfileSidebar githubUser={githubUser} />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title"> Bem vindo(a), {githubUser} </h1>

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
                  creatorSlug: githubUser
                }

                fetch('/api/communities', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(community)
                }).then(async response => {
                  const data = await response.json()
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

          <ProfileRelationsBox title="Seguindo" items={following} />

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
        </div>
      </MainGrid>
    </>
  )
}

export async function getServerSideProps(context) {
  const token = nookies.get(context)?.USER_TOKEN

  const { isAuthenticated } = await fetch(
    'https://alurakut.vercel.app/api/auth',
    {
      headers: {
        Authorization: token
      }
    }
  ).then(response => response.json())

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
