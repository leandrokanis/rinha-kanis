import { http } from '../config/http'
import { PAYMENTS, SERVICE_HEALTH } from './endpoints'
import type { IPaymentPayload } from '../types/payments'

const paymentsApi = {
  create: async (payload: IPaymentPayload) => {
    const response = await http.post(PAYMENTS, payload)
    return response.body
  },

  serviceHealth: async () => {
    const response = await http.get(SERVICE_HEALTH)
    return response.body
  },

  findOne: async (id: string) => {
    const response = await http.get(`${PAYMENTS}/${id}`)
    return response.body
  },
}

export default paymentsApi
