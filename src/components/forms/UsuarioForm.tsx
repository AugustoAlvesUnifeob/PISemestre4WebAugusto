import type { FormProps } from '../../types'
import { EntityForm } from './EntityForm'

export function UsuarioForm({ onNavigate, onNotice, notice }: FormProps) {
  return (
    <EntityForm
      title="Cadastrar usuário"
      back="inicio"
      endpoint="/users/register-user"
      onNavigate={onNavigate}
      onNotice={onNotice}
      notice={notice}
      fields={[
        { label: 'Nome', name: 'usuario' },
        { label: 'E-mail', name: 'email', type: 'email' },
        { label: 'Senha', name: 'senha', type: 'password' },
        {
          label: 'Tipo de usuário',
          name: 'tipo',
          type: 'select',
          options: [
            { label: 'Selecione um tipo', value: '' },
            { label: 'Usuário padrão', value: '0' },
            { label: 'Administrador', value: '1' },
          ],
        },
      ]}
    />
  )
}
