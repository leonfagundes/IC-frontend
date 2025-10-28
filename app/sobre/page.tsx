export default function SobrePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Sobre o Projeto</h1>
          <p className="text-lg text-muted-foreground">
            Informações sobre o desenvolvimento e objetivos deste projeto.
          </p>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Descrição</h2>
            <p className="text-muted-foreground">
              Este projeto foi desenvolvido utilizando Next.js 16 com React 19 e shadcn/ui 
              para criar uma interface moderna e responsiva. O objetivo é fornecer uma base 
              sólida para o desenvolvimento de aplicações web.
            </p>
          </section>

          <section className="space-y-4 pt-6">
            <h2 className="text-2xl font-semibold">Tecnologias Utilizadas</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Next.js 16 - Framework React para produção</li>
              <li>• React 19 - Biblioteca JavaScript para construção de interfaces</li>
              <li>• TypeScript - Superset JavaScript com tipagem estática</li>
              <li>• Tailwind CSS 4 - Framework CSS utility-first</li>
              <li>• shadcn/ui - Componentes reutilizáveis e acessíveis</li>
              <li>• Lucide React - Ícones modernos e elegantes</li>
            </ul>
          </section>

          <section className="space-y-4 pt-6">
            <h2 className="text-2xl font-semibold">Objetivos</h2>
            <p className="text-muted-foreground">
              Criar uma aplicação escalável, mantível e com excelente experiência de usuário, 
              seguindo as melhores práticas de desenvolvimento web moderno.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
