import { useEffect, useState } from 'react'
import type { FormProps, RecordItem, SelectOption } from '../../types'
import { API_URL, fetchWithToken, readResponse, messageFrom } from '../../services/api'
import { EntityForm } from './EntityForm'

export function PatientForm({ onNavigate, onNotice, notice, item }: FormProps & { item?: RecordItem }) {
  const [tags, setTags] = useState<SelectOption[]>([])
  const [planos, setPlanos] = useState<SelectOption[]>([])

  useEffect(() => {
    Promise.all([
      fetchWithToken(`${API_URL}/tag/listarByCNPJ`),
      fetchWithToken(`${API_URL}/plano/listarByCNPJ`),
    ])
      .then(async ([tagsResponse, planosResponse]) => {
        const tagsData = await readResponse(tagsResponse)
        const planosData = await readResponse(planosResponse)
        if (!tagsResponse.ok) throw new Error(messageFrom(tagsData))
        if (!planosResponse.ok) throw new Error(messageFrom(planosData))
        setTags(
          (tagsData.tags || []).map(
            (tag: { idtag: number; descricao: string }) => ({
              label: tag.descricao,
              value: String(tag.idtag),
            }),
          ),
        )
        setPlanos(
          (planosData.planos || []).map(
            (plano: { idplano: number; descricao: string }) => ({
              label: plano.descricao,
              value: String(plano.idplano),
            }),
          ),
        )
      })
      .catch((error) => {
        onNotice(
          error instanceof Error
            ? error.message
            : 'Não foi possível carregar tags e planos.',
        )
      })
  }, [onNotice])

  return (
    <EntityForm
      title={item ? 'Editar Paciente' : 'Cadastrar Paciente'}
      back="pacientes"
      endpoint={item ? `/pacientes/update/${item.idpaciente ?? item.idpacientes}` : '/pacientes/register'}
      onNavigate={onNavigate}
      onNotice={onNotice}
      notice={notice}
      initialValues={item}
      submitLabel={item ? 'Salvar alterações' : 'Cadastrar'}
      fields={[
        { label: 'Nome', name: 'nome' },
        { label: 'CPF', name: 'cpf' },
        { label: 'Telefone', name: 'telefone' },
        { label: 'E-mail', name: 'email', type: 'email' },
        { label: 'Complemento', name: 'complemento', type: 'textarea' },
        { label: 'Tags', name: 'tag_ids', type: 'multiselect', options: tags },
        {
          label: 'Plano',
          name: 'plano_idplano',
          type: 'select',
          options: [
            { label: 'Selecione um plano', value: '' },
            ...planos,
          ],
        },
      ]}
    />
  )
}
