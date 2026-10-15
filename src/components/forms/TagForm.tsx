import type { FormProps, TagItem } from '../../types'
import { EntityForm } from './EntityForm'

export function TagForm({ onNavigate, onNotice, notice, item }: FormProps & { item?: TagItem }) {
  return (
    <EntityForm
      title={item ? 'Editar Tag' : 'Cadastrar Tag'}
      back="tags"
      endpoint={item ? `/tag/update/${item.idtag}` : '/tag/register'}
      onNavigate={onNavigate}
      onNotice={onNotice}
      notice={notice}
      initialValues={item}
      submitLabel={item ? 'Salvar alterações' : 'Cadastrar'}
      fields={[{ label: 'Nome da Tag', name: 'descricao' }]}
    />
  )
}
