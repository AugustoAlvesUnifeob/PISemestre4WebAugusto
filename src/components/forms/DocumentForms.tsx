import { useEffect, useState } from 'react'
import type { FormProps, Page, EntityFieldConfig, SelectOption, DocumentPatient, DocumentDoctor } from '../../types'
import { API_URL, fetchWithToken, readResponse, messageFrom } from '../../services/api'
import { EntityForm } from './EntityForm'

//documentos

function useDocumentOptions(onNotice: FormProps['onNotice']) {
  const [patients, setPatients] = useState<SelectOption[]>([])
  const [doctors, setDoctors] = useState<SelectOption[]>([])

  useEffect(() => {
    let isMounted = true

    async function loadOptions() {
      try {
        const [patientsResponse, doctorsResponse] = await Promise.all([
          fetchWithToken(`${API_URL}/pacientes/listarByCNPJ`),
          fetchWithToken(`${API_URL}/doutores/listarByCNPJ`),
        ])
        const [patientsData, doctorsData] = await Promise.all([
          readResponse(patientsResponse),
          readResponse(doctorsResponse),
        ])

        if (!patientsResponse.ok) throw new Error(messageFrom(patientsData))
        if (!doctorsResponse.ok) throw new Error(messageFrom(doctorsData))
        if (!Array.isArray(patientsData.pacientes) || !Array.isArray(doctorsData.doutores)) {
          throw new Error('A resposta da lista de pacientes ou doutores é inválida.')
        }

        if (isMounted) {
          setPatients(
            (patientsData.pacientes as DocumentPatient[]).map((patient) => ({
              label: patient.nome,
              value: String(patient.idpacientes),
            })),
          )
          setDoctors(
            (doctorsData.doutores as DocumentDoctor[]).map((doctor) => ({
              label: doctor.especialidade
                ? `${doctor.nome} — ${doctor.especialidade}`
                : doctor.nome,
              value: String(doctor.iddoutor),
            })),
          )
        }
      } catch (error) {
        if (isMounted) {
          onNotice(
            error instanceof Error
              ? error.message
              : 'Não foi possível carregar pacientes e doutores.',
          )
        }
      }
    }

    void loadOptions()
    return () => {
      isMounted = false
    }
  }, [onNotice])

  return { patients, doctors }
}

function DocumentForm({
  title,
  active,
  endpoint,
  extraFields,
  onNavigate,
  onNotice,
  notice,
}: FormProps & {
  title: string
  active: Extract<Page, 'receita' | 'atestado' | 'laudo'>
  endpoint: string
  extraFields: EntityFieldConfig[]
}) {
  const { patients, doctors } = useDocumentOptions(onNotice)

  return (
    <EntityForm
      title={title}
      back="inicio"
      active={active}
      endpoint={endpoint}
      downloadPdf
      onNavigate={onNavigate}
      onNotice={onNotice}
      notice={notice}
      submitLabel="Gerar"
      fields={[
        {
          label: 'Paciente',
          name: 'idpaciente',
          type: 'select',
          options: [
            { label: 'Selecione um paciente', value: '' },
            ...patients,
          ],
        },
        {
          label: 'Doutor',
          name: 'iddoutor',
          type: 'select',
          options: [
            { label: 'Selecione um doutor', value: '' },
            ...doctors,
          ],
        },
        ...extraFields,
      ]}
    />
  )
}

export function ReceitaForm(props: FormProps) {
  return (
    <DocumentForm
      {...props}
      title="Gerar Receita"
      active="receita"
      endpoint="/documentos/receita"
      extraFields={[{ label: 'Prescrição', name: 'prescricao', type: 'textarea' }]}
    />
  )
}

export function AtestadoForm(props: FormProps) {
  return (
    <DocumentForm
      {...props}
      title="Gerar Atestado"
      active="atestado"
      endpoint="/documentos/atestado"
      extraFields={[
        { label: 'Dias', name: 'dias', type: 'number' },
        { label: 'Complemento', name: 'complemento', type: 'textarea', optional: true },
      ]}
    />
  )
}

export function LaudoForm(props: FormProps) {
  return (
    <DocumentForm
      {...props}
      title="Gerar Laudo"
      active="laudo"
      endpoint="/documentos/laudo"
      extraFields={[{ label: 'Laudo', name: 'laudo', type: 'textarea' }]}
    />
  )
}
