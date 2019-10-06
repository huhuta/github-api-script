/* eslint-disable no-unused-vars */
const axios = require('axios')
const camelcaseKeys = require('camelcase-keys')
const snakecaseKeys = require('snakecase-keys')

const hub = axios.create({
  baseURL: 'https://api.github.com',
  headers: { Authorization: `token ${process.env.TOKEN}` }
})
// hub.interceptors.request.use((config) => {
//   console.log(config)
//   return config
// console.log(snakecaseKeys(request.data))
// return { ...request, data: snakecaseKeys(config.data) }
// })
hub.interceptors.response.use(
  (response) => {
    return camelcaseKeys(response.data, { deep: true })
  },
  (error) => {
    // eslint-disable-next-line no-console
    console.error(error)
    return Promise.reject(error)
  }
)

function filterKeys({ id, fullName }) {
  return { id, fullName }
}

async function listRepo(type = 'all') {
  const repos = await hub.get(`/user/repos?type=${type}`)
  const activeRepos = repos.filter(({ archived }) => !archived)
  return activeRepos.map(filterKeys)
}

function deleteRepo({ fullName }) {
  hub.delete(`/repos/${fullName}`)
}

function archiveRepo({ fullName }) {
  hub.patch(`/repos/${fullName}`, { archived: true })
}

function findRepos(list, repos) {
  return list.map((keyword) =>
    repos.find(({ fullName }) => fullName.includes(keyword))
  )
}

async function operate(list, operation) {
  const repos = await listRepo()
  const matched = findRepos(list, repos)
  matched.forEach(operation)
}

function main() {}

main()
