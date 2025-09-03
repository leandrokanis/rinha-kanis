export interface IPaymentPayload {
  correlationId: string
  amount: number
  requestedAt: string
}

export interface IPaymentResponse {
  message: string
}

export interface IServiceHealthResponse {
  failing: boolean
  minResponseTime: number
}
