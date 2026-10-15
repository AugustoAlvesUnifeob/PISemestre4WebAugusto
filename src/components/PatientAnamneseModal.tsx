import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { RecordItem, PatientAnamnese } from '../types'
import { API_URL, fetchWithToken, readResponse, messageFrom, post } from '../services/api'

export function PatientAnamneseModal({
  patient,
  onClose,
  onSaved,
}: {
  patient: RecordItem
  onClose: () => void
  onSaved: (wasUpdated: boolean) => void
}) {
  const patientId = patient.idpaciente ?? patient.idpacientes
  const [anamnese, setAnamnese] = useState<PatientAnamnese | null>(null)
  const [loading, setLoading] = useState(true)
  const [values, setValues] = useState({
    queixas: '',
    historicoatual: '',
    doencaspreexistentes: '',
    medicamentos: '',
    alergias: '',
    cirurgiasanteriores: '',
    historicofamiliar: '',
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let active = true

    async function loadAnamnese() {
      if (!patientId) {
        setError('Não foi possível identificar o paciente.')
        setLoading(false)
        return
      }

      try {
        const response = await fetchWithToken(
          `${API_URL}/anaminese/paciente/${patientId}`,
        )
        const data = await readResponse(response)
        if (!response.ok) throw new Error(messageFrom(data))
        if (!active) return

        const savedAnamnese = data.anaminese as PatientAnamnese | null
        setAnamnese(savedAnamnese)
        if (savedAnamnese) {
          setValues({
            queixas: savedAnamnese.queixas ?? '',
            historicoatual: savedAnamnese.historicoatual ?? '',
            doencaspreexistentes: savedAnamnese.doencaspreexistentes ?? '',
            medicamentos: savedAnamnese.medicamentos ?? '',
            alergias: savedAnamnese.alergias ?? '',
            cirurgiasanteriores: savedAnamnese.cirurgiasanteriores ?? '',
            historicofamiliar: savedAnamnese.historicofamiliar ?? '',
          })
        }
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Não foi possível carregar a anamnese.',
          )
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    loadAnamnese()
    return () => {
      active = false
    }
  }, [patientId])

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (loading) return
    if (!Object.values(values).some((value) => value.trim())) {
      setError('Preencha ao menos um campo da anamnese.')
      return
    }

    if (!patientId) {
      setError('Não foi possível identificar o paciente.')
      return
    }

    setSaving(true)
    setError('')
    try {
      const response = anamnese
        ? await post(`/anaminese/update/${anamnese.idanaminese}`, values)
        : await post('/anaminese/register', {
            ...values,
            pacientes_idpacientes: patientId,
          })
      if (!response.ok) throw new Error(messageFrom(response.data))
      onSaved(Boolean(anamnese))
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'Não foi possível cadastrar a anamnese.',
      )
    } finally {
      setSaving(false)
    }
  }

  const fields: { name: keyof typeof values; label: string }[] = [
    { name: 'queixas', label: 'Queixas' },
    { name: 'historicoatual', label: 'Histórico atual' },
    { name: 'doencaspreexistentes', label: 'Doenças preexistentes' },
    { name: 'medicamentos', label: 'Medicamentos' },
    { name: 'alergias', label: 'Alergias' },
    { name: 'cirurgiasanteriores', label: 'Cirurgias anteriores' },
    { name: 'historicofamiliar', label: 'Histórico familiar' },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        aria-labelledby="anamnese-modal-title"
        aria-modal="true"
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <h2 id="anamnese-modal-title" className="mb-1 text-xl font-bold text-[#4f7161]">
          {anamnese ? 'Editar anamnese' : 'Nova anamnese'}
        </h2>
        <p className="mb-5 text-sm text-gray-600">Paciente: {patient.nome}</p>
        <form className="space-y-4" onSubmit={submit}>
          {loading ? (
            <p className="py-6 text-center text-gray-600">Carregando anamnese...</p>
          ) : (
            fields.map(({ name, label }) => (
              <label className="block space-y-1" key={name}>
                <span className="text-sm text-gray-600">{label}</span>
                <textarea
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#4f7161] focus:outline-none focus:ring-2 focus:ring-[#4f7161]/20"
                  maxLength={255}
                  rows={2}
                  value={values[name]}
                  onChange={(event) =>
                    setValues((current) => ({
                      ...current,
                      [name]: event.target.value,
                    }))
                  }
                />
              </label>
            ))
          )}
          {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <button
              className="rounded-lg border border-[#4f7161] px-4 py-2 text-[#4f7161] transition hover:bg-[#edf4f0]"
              disabled={saving}
              onClick={onClose}
              type="button"
            >
              Cancelar
            </button>
            <button
              className="rounded-lg bg-[#4f7161] px-4 py-2 font-semibold text-white transition hover:bg-[#3f5c4f] disabled:opacity-60"
              disabled={saving || loading || Boolean(error)}
              type="submit"
            >
              {saving
                ? 'Salvando...'
                : anamnese
                  ? 'Salvar alterações'
                  : 'Salvar anamnese'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
