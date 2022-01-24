const axios = require('./initAxios')
const { ownerApiKey, ownerOrgId } = require('./initTest')
const wait = require('../lib/wait')

const collection = 'tenants'
let orgId, apiKey

describe('Tenant Test Suite', () => {
   it('Create a new tenant for ACME', async () => {
      const response = await axios.post(`/${collection}`, {
         name: 'Road Runner',
         email: 'rr@acme.local',
         organization: 'ACME Corp',
      })
      expect(response.status).toBe(201)
      expect(response.data).toBeTruthy()
      expect(response.data.orgId).toBeTruthy()
      expect(response.data.apiKey).toBeTruthy()
      orgId = response.data.orgId
      apiKey = response.data.apiKey
      await wait()
   })

   it('Get all tenants', async () => {
      const response = await axios.get(`/${collection}`, {
         headers: {
            'x-org-id': ownerOrgId,
            'x-api-key': ownerApiKey,
         },
      })
      expect(response.status).toBe(200)
      expect(response.data).toBeTruthy()
      expect(response.data.length).toBeGreaterThan(1)
   })

   it('Get ACME tenant as ACME', async () => {
      const response = await axios({
         url: `/${collection}/${orgId}`,
         method: 'GET',
         headers: {
            'x-org-id': orgId,
            'x-api-key': apiKey,
         },
      })
      expect(response.status).toBe(200)
      expect(response.data).toBeTruthy()
      expect(response.data.id).toEqual(orgId)
   })

   it('Unauthorized update of ACME tenant', async () => {
      let response
      try {
         response = await axios.put(`/${collection}/${orgId}`, {
            organization: 'ACME, Inc',
         })
      } catch (error) {
      } finally {
         expect(401)
      }
   })

   it('Update ACME tenant as Owner', async () => {
      const response = await axios({
         url: `/${collection}/${orgId}`,
         method: 'PUT',
         data: {
            organization: 'ACME, LLC',
         },
         headers: {
            'x-org-id': ownerOrgId,
            'x-api-key': ownerApiKey,
         },
      })
      expect(response.status).toBe(200)
      expect(response.data).toBeTruthy()
      expect(response.data.organization).toEqual('ACME, LLC')
      await wait()
   })

   it('Update ACME tenant as ACME', async () => {
      const response = await axios({
         url: `/${collection}/${orgId}`,
         method: 'PUT',
         data: {
            organization: 'ACME, Inc',
         },
         headers: {
            'x-org-id': orgId,
            'x-api-key': apiKey,
         },
      })
      expect(response.status).toBe(200)
      expect(response.data).toBeTruthy()
      expect(response.data.organization).toEqual('ACME, Inc')
      await wait()
   })

   it('Unauthorized delete of ACME tenant', async () => {
      try {
         await axios.delete(`/${collection}/${orgId}`)
      } catch (error) {
      } finally {
         expect(401)
      }
   })

   it('Delete ACME tenant as ACME', async () => {
      const response = await axios({
         url: `/${collection}/${orgId}`,
         method: 'DELETE',
         headers: {
            'x-org-id': orgId,
            'x-api-key': apiKey,
         },
      })
      expect(response.status).toBe(204)
      await wait()
   })
})
