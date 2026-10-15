import { useState } from 'react'
import type { FormEvent } from 'react'
import type { FormProps } from '../types'
import { post, messageFrom } from '../services/api'
import { AuthLayout } from '../layouts/AuthLayout'
import { Field } from '../components/common/Field'

export function Register({ onNavigate, onNotice, notice }: FormProps) {
  const [values, setValues] = useState({
    nomeClinica: '',
    cnpj: '',
    usuario: '',
    email: '',
    senha: '',
    confirmarSenha: '',
  })
  // Atualiza somente o campo alterado, preservando os demais campos do objeto.
  const update = (key: keyof typeof values) => (value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (values.senha !== values.confirmarSenha)
      return onNotice('As senhas não coincidem!')
    try {
      const clinicResponse = await post('/clinicas/register', {
        nome: values.nomeClinica,
        cnpj: values.cnpj,
      })
      if (!clinicResponse.ok)
        throw new Error(`Erro na Clínica: ${messageFrom(clinicResponse.data)}`)
      const userResponse = await post('/users/register', {
        usuario: values.usuario,
        email: values.email,
        senha: values.senha,
        tipo: 1,
        clinica_cnpj: values.cnpj,
      })
      if (!userResponse.ok)
        throw new Error(`Erro no Usuário: ${messageFrom(userResponse.data)}`)
      onNotice('Clínica e Usuário cadastrados com sucesso!')
      onNavigate('login')
    } catch (error) {
      onNotice(
        error instanceof Error ? error.message : 'Erro ao realizar cadastro.',
      )
    }
  }

  return (
    <AuthLayout title="Criar Acesso" onSubmit={submit} notice={notice}>
      <h3 className="pt-2 text-lg font-semibold text-[#4f7161]">Informações da Clínica</h3>
      <Field
        label="Nome da Clínica"
        value={values.nomeClinica}
        onChange={update('nomeClinica')}
      />
      <Field label="CNPJ" value={values.cnpj} onChange={update('cnpj')} />
      <h3 className="pt-2 text-lg font-semibold text-[#4f7161]">Usuário Master</h3>
      <Field
        label="Usuário"
        value={values.usuario}
        onChange={update('usuario')}
      />
      <Field
        label="E-mail"
        type="email"
        value={values.email}
        onChange={update('email')}
      />
      <Field
        label="Senha"
        type="password"
        value={values.senha}
        onChange={update('senha')}
      />
      <Field
        label="Confirmar Senha"
        type="password"
        value={values.confirmarSenha}
        onChange={update('confirmarSenha')}
      />
      <button className="w-full rounded-lg bg-[#4f7161] px-3 py-3 text-[15px] text-white transition hover:bg-[#3f5c4f]" type="submit">Cadastrar</button>
      <div className="mt-5 text-center">
        <p className="text-sm text-gray-600">
          Já possui conta?{' '}
          <a className="font-bold text-[#4f7161] hover:underline" href="#login" onClick={() => onNavigate('login')}>
            Fazer login
          </a>
        </p>
      </div>
    </AuthLayout>
  )
}
