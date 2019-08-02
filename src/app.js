/* eslint-disable camelcase */
const axios = require('axios')

const hub = axios.create({
  baseURL: 'https://api.github.com',
  headers: { Authorization: `token ${process.env.TOKEN}` }
})
hub.interceptors.response.use((response) => response.data)

async function listRepo() {
  const repos = await hub.get('/user/repos?type=owner')
  const activeRepos = repos.filter(({ archived }) => !archived)
  const repoFullnames = activeRepos.map(({ id, full_name }) => ({
    id,
    full_name
  }))
  console.log(repoFullnames)
}

function deleteRepo(repo) {
  hub.delete(`/repos/huhuta/${repo}`)
}

function archiveRepo(repo) {
  hub.patch(`/repos/huhuta/${repo}`, { archived: true })
}
