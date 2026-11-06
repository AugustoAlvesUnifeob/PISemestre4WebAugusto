import type { FormProps, ServicoItem } from '../../types'
import { EntityForm } from './EntityForm'

export function ServicoForm({ onNavigate, onNotice, notice, item }: FormProps & { item?: ServicoItem }) {
  return (
    <EntityForm
      title={item ? 'Editar Serviço' : 'Cadastrar Serviço'}
      back="servicos"
      endpoint={item ? `/servicos/update/${encodeURIComponent(item.idservico)}` : '/servicos/register'}
      onNavigate={onNavigate}
      onNotice={onNotice}
      notice={notice}
      initialValues={item}
      submitLabel={item ? 'Salvar alterações' : 'Cadastrar'}
      fields={[
        { label: 'Nome', name: 'nome' },
        { label: 'Preço', name: 'preco', type: 'number' },
      ]}
    />
  )
}
