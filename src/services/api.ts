export const API_URL = 'http://localhost:5000'

export async function post(path: string, body: object) {
  // Centraliza a configuração comum das requisições POST feitas pelos formulários.
  const response = await fetchWithToken(`${API_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...tokenHeader(),
    },
    body: JSON.stringify(body),
  })
  return { ok: response.ok, data: await readResponse(response) }
}

export async function downloadDocumentPdf(path: string, body: object) {
  const response = await fetchWithToken(`${API_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...tokenHeader(),
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const data = await readResponse(response)
    throw new Error(messageFrom(data))
  }
  if (!response.headers.get('Content-Type')?.includes('application/pdf')) {
    throw new Error('O servidor não retornou um arquivo PDF válido.')
  }

  const blob = await response.blob()
  const filename = `${path.split('/').filter(Boolean).pop() || 'documento'}.pdf`
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.append(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function tokenHeader(): Record<string, string> {
  const token = localStorage.getItem('@App:token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export function fetchWithToken(input: RequestInfo | URL, init: RequestInit = {}) {
  return fetch(input, {
    ...init,
    headers: { ...tokenHeader(), ...init.headers },
  })
}

export async function readResponse(response: Response) {
  const text = await response.text()
  if (!text) return {}
  try {
    return JSON.parse(text)
  } catch {
    return { message: text }
  }
}

export function messageFrom(data: { message?: string; errors?: { msg?: string }[] }) {
  if (data.errors?.[0]?.msg) return data.errors[0].msg
  if (typeof data.message === 'string') return data.message
  if (data.message) return JSON.stringify(data.message)
  return JSON.stringify(data)
}
