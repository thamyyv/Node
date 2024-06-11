import tabela2024 from './tabela.js'; // importando os dados desejados
import express from 'express'; /** importando as funcionalidades do framework express (é um conjunto de bibliotecas utilizadas para criar uma base, sendo um facilitador no desenvolvimento da aplicação) */
import { modeloTime, modeloAtualizacaoTime } from './validacao.js';
//Para instalar o express:  no terminal, rode o comando -> npm install express

const app = express(); // A variavel app está chamando o express, logo, iniciando o servidor da aplicação (app)
app.use(express.json()); // para o express reconhecer as requisições que vão retornar como JSON

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

app.put('/:sigla', (req, res) => { //instalado o Insomnia e essa requisição significa alteração de informação
  const siglaInformada = req.params.sigla.toUpperCase(); //linha 16
  const timeSelecionado = tabela2024.find(t => t.sigla === siglaInformada); //linha 17

  if (!timeSelecionado){
    res.status(404).send('Não existe na série A do Brasileirão um time com a sigla informada!');
    return;
  }

  //rodado o comando -> npm install joi
  //o joi auxixlia a fazer validações dentro do modelo informado

  const { error } = modeloAtualizacaoTime.validate(req.body)//.error; Valida com o joi e pega o objeto "error" como nome da variavel
  if (error){
    res.status(400).send(error); //se tiver erro, envia ele para o usuario
    return;
  }
 
  const campos = Object.keys(req.body); //pega todos os campos que estão sendo alterados dentro da requisição como array
  for (let campo of campos){ //repetição para a variavel ter o valor do campo 
  timeSelecionado[campo] = req.body[campo]; // vari passar campo por campo que foi enviado na requisiçãoe  atualizar no objeto do Time Selecionado
  }
  res.status(200).send(timeSelecionado); //atualiza o objeto do time selecionado
}) 

app.post('/', (req, res) =>{ //metodo que cria um novo time
  const novoTime = req.body; //pega o corpo inteiro da requisição

  const { error} = modeloTime.validate(novoTime); //valida se o novo time tem todas as informação da validação
  if (error){
    res.status(400).send(error); //se tiver erro, envia ele para o usuario
    return;
  }

  tabela2024.push(novoTime); //metodo que permite adicionar uma nova informação no final da lista
  res.status(200).send(novoTime);
})

app.delete('/:sigla', (req, res) => {
  const siglaInformada = req.params.sigla.toUpperCase(); //linha 16
  const indexTimeSelecionado = tabela2024.findIndex(t => t.sigla === siglaInformada); //Em vez de pegar o obejto informaod, pega a posição dele no array

  if (indexTimeSelecionado === -1){ //se o time não for emcontrado, terá um indice normal, se não, ficará -1
    res.status(404).send('Não existe na série A do Brasileirão um time com a sigla informada!');
    return;
  }

  const timeRemovido = tabela2024.splice(indexTimeSelecionado, 1);//permite remover elemento de um array

  res.status(200).send(timeRemovido)//retorna com o time que foi removido a partir do inde informado
})

app.listen(300, () => console.log('servidor rodando com sucesso')); //verificar se o servidor está rodando
