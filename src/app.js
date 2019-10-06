const axios = require('axios')
const camelcaseKeys = require('camelcase-keys')

const hub = axios.create({
  baseURL: 'https://api.github.com',
  headers: { Authorization: `token ${process.env.TOKEN}` }
})
hub.interceptors.response.use((response) => {
  return camelcaseKeys(response.data, { deep: true })
})

function filterKeys({ id, fullName }) {
  return { id, fullName }
}

async function listRepo() {
  const repos = await hub.get('/user/repos?type=owner')
  const activeRepos = repos.filter(({ archived }) => !archived)
  return activeRepos.map(filterKeys)
}

function deleteRepo(repo) {
  hub.delete(`/repos/huhuta/${repo}`)
}

function archiveRepo(repo) {
  hub.patch(`/repos/huhuta/${repo}`, { archived: true })
}

async function main() {
  const repos = await listRepo()
  console.log(repos)
}

main()
