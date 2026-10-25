import type { FormProps, RecordItem } from '../../types'
import { EntityForm } from './EntityForm'

export function ProfessionalForm({
  onNavigate, onNotice, notice, item, embedded, onSaved, onCancel,
}: FormProps & {
  item?: RecordItem
  embedded?: boolean
  onSaved?: (values: Record<string, string>) => void
  onCancel?: () => void
}) {
  return (
    <EntityForm
      title={item ? 'Editar Profissional' : 'Cadastrar Profissional'}
      back="profissionais"
      endpoint={item ? `/doutores/update/${item.iddoutor}` : '/doutores/register'}
      onNavigate={onNavigate}
      onNotice={onNotice}
      notice={notice}
      embedded={embedded}
      onSaved={onSaved}
      onCancel={onCancel}
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