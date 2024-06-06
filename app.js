import tabela2024 from './tabela.js'; // importando os dados desejados
import express from 'express'; /** importando as funcionalidades do framework express (é um conjunto de bibliotecas utilizadas para criar uma base, sendo um facilitador no desenvolvimento da aplicação) */

//Para instalar o express:  no terminal, rode o comando -> npm install express

const app = express(); // A variavel app está chamando o express, logo, iniciando o servidor da aplicação (app)

//Para iniciar o backend:  no terminal, rode o comando -> node --watch .\app.js 

app.get('/', (requisicao, resposta) => { //pegar - entregar 
  resposta.status(200).send(tabela2024); //enviar todos os dados com status de sucesso 
}); // '/'-> rota principal 

app.get ('/:sigla', (requisicao, resposta) => {
  const siglaInformada = requisicao.params.sigla.toUpperCase(); // Pega o parametro da requisição (sigla) e transforma o conteudo em maiusculo, para ser igual ao dado e conseguir linkar
  const time = tabela2024.find(infoTime => infoTime.sigla === siglaInformada); // Encontra o objeto na tabela2024 pela sigla presente nela e fazendo uma validação com a sigla informada na requisição 
  
  if (!time){ //undefined é igual a false quando exigimos comportamento de boolean 
  // time === undefined, logo, if é false
  // !time (note time) é o inverso, logo time que era false, vira verdadeiro


    resposta.status(404).send(
      'Não existe na série A do Brasileirão um time com a sigla informada!'
    );
    return; //Para parar a execução do comando caso o IF ocorra 
  };
  
  resposta.status(200).send(time); // Retorna apenas o objeto com a sigla informada na requisição 
});

app.listen(300/** porta */, () => console.log('servidor rodando com sucesso')/**Arrow Function */);
