import { request, Client } from 'undici'

const client = new Client('http://localhost')

const http = {
  async get(url: string, options?: any) {
    return request(url, {
      method: 'GET',
      ...options,
    })
  },

  async post(url: string, body?: any, options?: any) {
    return request(url, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })
  },

  async put(url: string, body?: any, options?: any) {
    return request(url, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })
  },

  async delete(url: string, options?: any) {
    return request(url, {
      method: 'DELETE',
      ...options,
    })
  },

  async patch(url: string, body?: any, options?: any) {
    return request(url, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })
  },
}

export { http, client }
