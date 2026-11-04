import type { Page } from '../types'

export function NotFoundPage({
  onNavigate,
}: {
  onNavigate: (page: Page) => void
}) {
  return (
    <div className="-m-6 flex min-h-screen items-center justify-center bg-[#a4c2aa] p-6 md:-m-10 md:p-10">
      <div className="w-full max-w-xl rounded-[10px] bg-white p-8 text-center shadow-[0_2px_8px_rgba(0,0,0,0.1)]">

        <h1 className="text-6xl font-bold text-[#4f7161]">
          404
        </h1>

        <h2 className="mt-4 text-2xl font-bold text-gray-800">
          Página não encontrada
        </h2>

        <p className="mt-3 text-gray-600">
          O endereço informado não existe ou não está disponível.
        </p>

        <button
          type="button"
          onClick={() => onNavigate('inicio')}
          className="mt-6 cursor-pointer rounded-lg bg-[#4f7161] px-5 py-3 font-semibold text-white transition hover:bg-[#3f5c4f]"
        >
          Voltar para o início
        </button>

      </div>
    </div>
  )
}