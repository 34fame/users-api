const axios = require('axios')

axios.defaults.baseURL = 'http://localhost:5001/fame-users-api/us-central1/api'
axios.defaults.headers.get['Accept'] = 'application/json'
axios.defaults.headers.post['Content-Type'] = 'application/json'

module.exports = axios
