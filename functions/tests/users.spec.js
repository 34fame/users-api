const axios = require('./initAxios')
const { ownerApiKey, ownerOrgId } = require('./initTest')
const wait = require('../lib/wait')

const collection = 'users'
let orgId, apiKey, userId

describe('User Test Suite', () => {
   beforeAll(async () => {
      const response = await axios.post(`/tenants`, {
         name: 'Road Runner',
         email: 'rr@acme.local',
         organization: 'ACME Corp',
      })
      orgId = response.data.orgId
      apiKey = response.data.apiKey
      await wait(1)
   })

   afterAll(async () => {
      await axios({
         url: `/tenants/${orgId}`,
         method: 'DELETE',
         headers: {
            'x-org-id': ownerOrgId,
            'x-api-key': ownerApiKey,
         },
      })
   })

   it('Get all tenant users expecting 0', async () => {
      let response
      try {
         response = await axios({
            method: 'GET',
            url: `/${collection}`,
            headers: {
               'x-org-id': orgId,
               'x-api-key': apiKey,
            },
         })
      } catch (error) {
         console.log('error', error.message)
      } finally {
         expect(response.status).toBe(200)
         expect(response.data).toBeTruthy()
         expect(response.data.length).toEqual(0)
      }
   })

   it('Create a new user for ACME', async () => {
      const response = await axios({
         method: 'POST',
         url: `/${collection}`,
         headers: {
            'x-org-id': orgId,
            'x-api-key': apiKey,
         },
         data: {
            name: 'Yosemity Sam',
            email: 'sam@acme.org',
         },
      })
      userId = response.data.userId
      expect(response.status).toBe(201)
      expect(response.data).toBeTruthy()
      expect(response.data.userId).toBeTruthy()
      await wait()
   })

   it('Get all tenant users expecting 1', async () => {
      let response
      try {
         response = await axios({
            method: 'GET',
            url: `/${collection}`,
            headers: {
               'x-org-id': orgId,
               'x-api-key': apiKey,
            },
         })
      } catch (error) {
         console.log('error', error.message)
      } finally {
         expect(response.status).toBe(200)
         expect(response.data).toBeTruthy()
         expect(response.data.length).toEqual(1)
      }
   })

   it('Update user for ACME', async () => {
      const response = await axios({
         method: 'PUT',
         url: `/${collection}/${userId}`,
         headers: {
            'x-org-id': orgId,
            'x-api-key': apiKey,
         },
         data: {
            birthdate: '08-08-1972',
         },
      })
      expect(response.status).toBe(200)
      expect(response.data).toBeTruthy()
      expect(response.data.birthdate).toBeTruthy()
      await wait()
   })

   it('Delete user for ACME', async () => {
      const response = await axios({
         method: 'DELETE',
         url: `/${collection}/${userId}`,
         headers: {
            'x-org-id': orgId,
            'x-api-key': apiKey,
         },
      })
      expect(response.status).toBe(204)
      await wait()
   })
})
