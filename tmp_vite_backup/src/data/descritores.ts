export interface Descritor {
  codigo: string;
  nome: string;
  disciplina: 'matematica' | 'portugues';
  eixo: string;
  anos: number[];
}

export const descritores: Descritor[] = [
  // MATEMÁTICA — Números e Operações
  { codigo: 'D1',  nome: 'Reconhecer e utilizar relações entre números naturais', disciplina: 'matematica', eixo: 'Números e Operações', anos: [6,7,8,9] },
  { codigo: 'D2',  nome: 'Identificar padrões numéricos ou figurais em sequências', disciplina: 'matematica', eixo: 'Números e Operações', anos: [6,7,8,9] },
  { codigo: 'D3',  nome: 'Resolver problemas com números naturais', disciplina: 'matematica', eixo: 'Números e Operações', anos: [6,7] },
  { codigo: 'D4',  nome: 'Resolver problemas com números inteiros', disciplina: 'matematica', eixo: 'Números e Operações', anos: [7,8,9] },
  { codigo: 'D5',  nome: 'Resolver problemas com frações', disciplina: 'matematica', eixo: 'Números e Operações', anos: [6,7,8] },
  { codigo: 'D6',  nome: 'Resolver problemas com números decimais', disciplina: 'matematica', eixo: 'Números e Operações', anos: [6,7,8] },
  { codigo: 'D7',  nome: 'Resolver problemas de proporcionalidade direta e inversa', disciplina: 'matematica', eixo: 'Números e Operações', anos: [7,8,9] },
  { codigo: 'D8',  nome: 'Resolver problemas envolvendo porcentagem', disciplina: 'matematica', eixo: 'Números e Operações', anos: [7,8,9] },
  { codigo: 'D9',  nome: 'Resolver problemas com potências e raízes', disciplina: 'matematica', eixo: 'Números e Operações', anos: [8,9] },
  { codigo: 'D10', nome: 'Efetuar cálculos com números reais', disciplina: 'matematica', eixo: 'Números e Operações', anos: [9] },
  // MATEMÁTICA — Grandezas e Medidas
  { codigo: 'D11', nome: 'Resolver problemas com comprimento, massa e capacidade', disciplina: 'matematica', eixo: 'Grandezas e Medidas', anos: [6,7] },
  { codigo: 'D12', nome: 'Resolver problemas com área', disciplina: 'matematica', eixo: 'Grandezas e Medidas', anos: [7,8] },
  { codigo: 'D13', nome: 'Resolver problemas com volume', disciplina: 'matematica', eixo: 'Grandezas e Medidas', anos: [8,9] },
  { codigo: 'D14', nome: 'Resolver problemas com medidas de tempo', disciplina: 'matematica', eixo: 'Grandezas e Medidas', anos: [6,7,8] },
  { codigo: 'D15', nome: 'Resolver problemas com medidas de ângulos', disciplina: 'matematica', eixo: 'Grandezas e Medidas', anos: [7,8] },
  // MATEMÁTICA — Espaço e Forma
  { codigo: 'D16', nome: 'Identificar propriedades de triângulos e quadriláteros', disciplina: 'matematica', eixo: 'Espaço e Forma', anos: [6,7] },
  { codigo: 'D17', nome: 'Reconhecer figuras planas e espaciais', disciplina: 'matematica', eixo: 'Espaço e Forma', anos: [6,7,8] },
  { codigo: 'D18', nome: 'Resolver problemas com polígonos regulares', disciplina: 'matematica', eixo: 'Espaço e Forma', anos: [7,8] },
  { codigo: 'D19', nome: 'Reconhecer e aplicar transformações geométricas', disciplina: 'matematica', eixo: 'Espaço e Forma', anos: [7,8] },
  { codigo: 'D20', nome: 'Aplicar o Teorema de Pitágoras', disciplina: 'matematica', eixo: 'Espaço e Forma', anos: [8,9] },
  // MATEMÁTICA — Álgebra
  { codigo: 'D25', nome: 'Resolver problemas com porcentagem e representação decimal', disciplina: 'matematica', eixo: 'Álgebra', anos: [7,8,9] },
  { codigo: 'D29', nome: 'Resolver problemas com razão e proporção', disciplina: 'matematica', eixo: 'Álgebra', anos: [7,8,9] },
  { codigo: 'D36', nome: 'Resolver e elaborar problemas com equações do 1º grau', disciplina: 'matematica', eixo: 'Álgebra', anos: [7,8,9] },
  { codigo: 'D37', nome: 'Resolver sistemas de equações do 1º grau', disciplina: 'matematica', eixo: 'Álgebra', anos: [8,9] },
  { codigo: 'D38', nome: 'Reconhecer e interpretar gráficos de funções', disciplina: 'matematica', eixo: 'Álgebra', anos: [8,9] },
  // MATEMÁTICA — Tratamento da Informação
  { codigo: 'D33', nome: 'Ler e interpretar tabelas e gráficos', disciplina: 'matematica', eixo: 'Tratamento da Informação', anos: [6,7,8,9] },
  { codigo: 'D34', nome: 'Resolver problemas envolvendo média aritmética', disciplina: 'matematica', eixo: 'Tratamento da Informação', anos: [7,8,9] },
  { codigo: 'D35', nome: 'Calcular probabilidade de eventos simples', disciplina: 'matematica', eixo: 'Tratamento da Informação', anos: [8,9] },
  // PORTUGUÊS — Procedimentos de Leitura
  { codigo: 'D1',  nome: 'Localizar informações explícitas em um texto', disciplina: 'portugues', eixo: 'Procedimentos de Leitura', anos: [6,7,8,9] },
  { codigo: 'D3',  nome: 'Inferir o sentido de uma palavra ou expressão', disciplina: 'portugues', eixo: 'Procedimentos de Leitura', anos: [6,7,8,9] },
  { codigo: 'D4',  nome: 'Inferir uma informação implícita em um texto', disciplina: 'portugues', eixo: 'Procedimentos de Leitura', anos: [6,7,8,9] },
  { codigo: 'D5',  nome: 'Interpretar texto com auxílio de material gráfico', disciplina: 'portugues', eixo: 'Procedimentos de Leitura', anos: [6,7,8,9] },
  { codigo: 'D6',  nome: 'Identificar o tema de um texto', disciplina: 'portugues', eixo: 'Procedimentos de Leitura', anos: [6,7,8,9] },
  // PORTUGUÊS — Implicações do Suporte e Gênero
  { codigo: 'D8',  nome: 'Estabelecer relação entre tese e argumentos', disciplina: 'portugues', eixo: 'Implicações do Suporte e Gênero', anos: [8,9] },
  { codigo: 'D9',  nome: 'Diferenciar um fato de uma opinião', disciplina: 'portugues', eixo: 'Implicações do Suporte e Gênero', anos: [7,8,9] },
  // PORTUGUÊS — Relação entre Textos
  { codigo: 'D10', nome: 'Identificar marcas linguísticas da ironia e humor', disciplina: 'portugues', eixo: 'Relação entre Textos', anos: [8,9] },
  { codigo: 'D11', nome: 'Reconhecer o efeito de sentido de recursos gráficos', disciplina: 'portugues', eixo: 'Relação entre Textos', anos: [6,7,8,9] },
  // PORTUGUÊS — Coerência e Coesão
  { codigo: 'D12', nome: 'Estabelecer relações lógico-discursivas (causa, consequência)', disciplina: 'portugues', eixo: 'Coerência e Coesão', anos: [7,8,9] },
  { codigo: 'D13', nome: 'Identificar efeito de sentido decorrente da pontuação', disciplina: 'portugues', eixo: 'Coerência e Coesão', anos: [7,8,9] },
  { codigo: 'D14', nome: 'Identificar efeito de sentido de conectivos e operadores argumentativos', disciplina: 'portugues', eixo: 'Coerência e Coesão', anos: [8,9] },
];
