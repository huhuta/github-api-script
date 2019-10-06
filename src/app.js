const axios = require('axios')
const camelcaseKeys = require('camelcase-keys')

const hub = axios.create({
  baseURL: 'https://api.github.com',
  headers: { Authorization: `token ${process.env.TOKEN}` }
})
hub.interceptors.response.use(
  (response) => {
    return camelcaseKeys(response.data, { deep: true })
  },
  (error) => {
    console.error(error)
    return Promise.reject(error)
  }
)

function filterKeys({ id, fullName }) {
  return { id, fullName }
}

async function listRepo() {
  const repos = await hub.get('/user/repos?type=owner')
  const activeRepos = repos.filter(({ archived }) => !archived)
  return activeRepos.map(filterKeys)
}

function deleteRepo({ fullName }) {
  hub.delete(`/repos/${fullName}`)
}

function archiveRepo({ fullName }) {
  hub.patch(`/repos/${fullName}`, { archived: true })
}

// eslint-disable-next-line no-unused-vars
async function organizeRepos(deleteList, archiveList) {
  const repos = await listRepo()
  const [deleteRepos, archiveRepos] = [deleteList, archiveList].map((list) => {
    return repos.filter(({ fullName }) =>
      list.find((keyword) => fullName.includes(keyword))
    )
  })
  archiveRepos.forEach(archiveRepo)
  deleteRepos.forEach(deleteRepo)
}

async function main() {}

main()
