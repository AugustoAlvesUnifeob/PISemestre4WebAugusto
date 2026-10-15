import type { FormProps, RecordItem } from '../../types'
import { EntityForm } from './EntityForm'

export function ProfessionalForm({ onNavigate, onNotice, notice, item }: FormProps & { item?: RecordItem }) {
  return (
    <EntityForm
      title={item ? 'Editar Profissional' : 'Cadastrar Profissional'}
      back="profissionais"
      endpoint={item ? `/doutores/update/${item.iddoutor}` : '/doutores/register'}
      onNavigate={onNavigate}
      onNotice={onNotice}
      notice={notice}
      initialValues={item}
      submitLabel={item ? 'Salvar alterações' : 'Cadastrar'}
      fields={[
        { label: 'Nome', name: 'nome' },
        { label: 'Especialidade', name: 'especialidade' },
        { label: 'Documento/CRM', name: 'documento' },
      ]}
    />
  )
}
