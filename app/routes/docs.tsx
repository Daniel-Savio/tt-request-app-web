import { Link } from "react-router";

export default function Docs() {
  return (
    <div className="prose prose-invert p-4">
      <h1>Como criar uma requisição</h1>
      <p>
        Para criar uma nova requisição, siga os passos abaixo:
      </p>
      <ol>
        <li>
          Acesse a página inicial <Link to="/">clicando aqui</Link>.
        </li>
        <li>
          Clique no botão "Nova requisição".
        </li>
        <li>
          Preencha o formulário com as informações solicitadas.
        </li>
        <li>
          Clique no botão "Revisar PDF" para gerar o relatório da requisição.
        </li>
      </ol>
    </div>
  );
}
