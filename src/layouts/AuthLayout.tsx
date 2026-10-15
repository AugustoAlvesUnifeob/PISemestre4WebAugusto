import type { FormEvent, ReactNode } from 'react'
import { Assets } from '../components/AssetsClass'

export function AuthLayout({
  title,
  onSubmit,
  children,
  notice,
}: {
  title: string
  onSubmit: (event: FormEvent) => void
  children: ReactNode
  notice: string
}) {
  // children permite reutilizar a mesma estrutura visual para login e cadastro.
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <div className="relative min-h-[190px] w-full overflow-hidden bg-[#64866f] md:min-h-screen md:w-1/2">
        <img
          className="absolute inset-0 h-full w-full object-contain object-bottom"
          src={Assets.Imagens.people}
          alt="Pacientes e profissional em uma clínica"
        />
      </div>
      <div className="relative flex min-h-[calc(100vh-190px)] w-full items-center justify-center bg-[#e8eee7] px-6 py-10 md:min-h-screen md:w-1/2 md:px-12">
        <div className="w-full max-w-[420px]">
          <h1 className="mb-12 text-center text-5xl font-extrabold text-[#5c967f] drop-shadow-[3px_6px_3px_rgba(45,71,57,0.28)] md:mb-16 md:text-6xl">
            EasyClinic
          </h1>
          {title !== 'EasyClinic' && <h2 className="mb-6 text-center text-2xl font-bold text-[#4f7161]">{title}</h2>}
          {notice && <p className="mb-4 text-center text-sm text-[#3f5c4f]" role="status">{notice}</p>}
          <form className={title === 'EasyClinic' ? 'space-y-7' : 'space-y-4'} onSubmit={onSubmit}>{children}</form>
        </div>
      </div>
    </div>
  )
}
