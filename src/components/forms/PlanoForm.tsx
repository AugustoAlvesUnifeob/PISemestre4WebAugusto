import type { FormProps, PlanoItem } from '../../types'
import { EntityForm } from './EntityForm'

// Formulario
export function PlanoForm({ onNavigate, onNotice, notice, item }: FormProps & { item?: PlanoItem }) {
  return (
    <EntityForm
      title={item ? 'Editar Plano' : 'Cadastrar Plano'}
      back="planos"
      endpoint={item ? `/plano/update/${item.idplano}` : '/plano/register'}
      onNavigate={onNavigate}
      onNotice={onNotice}
      notice={notice}
      initialValues={item}
      submitLabel={item ? 'Salvar alterações' : 'Cadastrar'}
      fields={[
        { label: 'Nome', name: 'descricao' },
        // os radios são obrigatórios, se não marcar Sim/Não o form não envia
        {
          label: 'Desconta',
          name: 'aplicadesconto',
          type: 'radio',
          options: [
            { label: 'Sim', value: 'true' },
            { label: 'Não', value: 'false' },
          ],
        },
        { label: 'Valor Desconto', name: 'valordesconto' },
        {
          label: 'Exonera',
          name: 'exonera',
          type: 'radio',
          options: [
            { label: 'Sim', value: 'true' },
            { label: 'Não', value: 'false' },
          ],
        },
      ]}
    />
  )
}
