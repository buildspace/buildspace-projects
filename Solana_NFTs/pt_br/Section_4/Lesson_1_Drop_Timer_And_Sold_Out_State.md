### ⏳ Construindo o temporizador do drop

Temos uma configuração incrível para fazer o drop de alguns NFTs bem legais em uma determinada data. A única coisa que está faltando agora é uma maneira legal de mostrar às pessoas que um drop vai acontecer em breve! Então vamos em frente, adicionando um cronômetro de contagem regressiva

Neste momento, nosso "drop" já aconteceu, pois marcamos a data para um momento no passado. Sinta-se à vontade para alterar a data para algum momento no futuro no arquivo config.json e para aplicá-la usando o comando `update_candy_machine`.

```
​​ts-node ~/metaplex/js/packages/cli/src/candy-machine-v2-cli.ts update_candy_machine -e devnet  -k ~/.config/solana/devnet.json -cp config.json
```

Lembre-se de uma lição anterior: se em algum momento você encontrar um erro parecido com este:


```
/Users/flynn/metaplex/js/packages/cli/src/candy-machine-cli.ts:53
      return fs.readdirSync(`${val}`).map(file => path.join(val, file));
                      ^
TypeError: Cannot read property 'candyMachineAddress' of undefined
    at /Users/flynn/metaplex/js/packages/cli/src/candy-machine-cli.ts:649:53
    at step (/Users/flynn/metaplex/js/packages/cli/src/candy-machine-cli.ts:53:23)
    at Object.next (/Users/flynn/metaplex/js/packages/cli/src/candy-machine-cli.ts:34:53)
    at fulfilled (/Users/flynn/metaplex/js/packages/cli/src/candy-machine-cli.ts:25:58)
    at processTicksAndRejections (node:internal/process/task_queues:96:5)
```

Então significa que o comando não pode acessar a pasta .cache, onde estão os dados importantes da sua Candy Machine e NFTs. Portanto, se você receber esse erro, tenha 100% de certeza de que está executando os comandos da Candy Machine no mesmo diretório onde estão as pastas .cache e assets.

Este temporizador precisa fazer algumas coisas:

1. Ele só será mostrado se a data atual for anterior à data do drop que configuramos;
2. Deve ter um temporizador de estilo "contagem regressiva" que faça uma contagem regressiva por segundo.

Há muitas maneiras de fazer isso, mas para manter nosso aplicativo um pouco mais limpo, criaremos um componente diferente que lidará com o estado e a lógica do nosso temporizador. Você já deve ver uma pasta `CountdownTimer` com um arquivo `CountdownTimer.css` dentro dela. Para começar, crie um arquivo `index.js` dentro dessa pasta e adicione o seguinte código:


```jsx
import React, { useEffect, useState } from 'react';
import './CountdownTimer.css';

const CountdownTimer = ({ dropDate }) => {
  // Estado
  const [timerString, setTimerString] = useState('');

  return (
    <div className="timer-container">
      <p className="timer-header">Candy Drop Iniciando Em</p>
      {timerString && <p className="timer-value">{`⏰ ${timerString}`}</p>}
    </div>
  );
};

export default CountdownTimer;
```


​

Estamos configurando um componente React bem simples que manterá algum estado e receberá uma `dropDate` (data do drop).

Massa! Antes de prosseguirmos, vamos importar o componente `app/src/CandyMachine/index.js`. Sinta-se à vontade para colocá-lo em qualquer lugar no topo do arquivo:


```jsx
import CountdownTimer from '../CountdownTimer';
```


A partir daqui, podemos configurar nossa lógica para lidar com quando mostrar esse cronômetro de contagem regressiva.

No nosso caso, só queremos mostrar esse componente se a data atual for **anterior** à data do drop. **Caso contrário**, iremos em frente e mostraremos a data e hora do drop.

Agora que descobrimos isso, vamos escrever um pouco de código na parte inferior do arquivo `app/src/CandyMachine/index.js`.


```jsx
// Crie a função de renderização
const renderDropTimer = () => {
  // Obtenha a data atual e dropDate em um objeto JavaScript Date
  const currentDate = new Date();
  const dropDate = new Date(candyMachine.state.goLiveData * 1000);

  // Se currentDate for anterior à dropDate, renderize nosso componente Countdown
  if (currentDate < dropDate) {
    console.log('Anterior à data do drop!!');
    // Não se esqueça de retornar o seu dropDate!
    return <CountdownTimer dropDate={dropDate} />;
  }

  // Caso contrário, vamos apenas retornar a data do drop atual
  return <p>{`Data do Drop: ${candyMachine.state.goLiveDateTimeString}`}</p>;
};

return (
  candyMachine.state && (
    <div className="machine-container">
      {/* Adicione isso no início do nosso componente */}
      {renderDropTimer()}
      <p>{`Itens Cunhados: ${candyMachine.state.itemsRedeemed} / ${candyMachine.state.itemsAvailable}`}</p>
      <button
        className="cta-button mint-button"
        onClick={mintToken}
      >
        Cunhar NFT
      </button>
      {mints.length > 0 && renderMintedItems()}
      {isLoadingMints && <p>CARREGANDO CUNHAGENS...</p>}
    </div>
  )
);
```


Estamos apenas usando uma renderização condicional básica e chamando-a em nossa função de renderização dos componentes. Atualize rapidamente sua página e veja o que aparece!

*Observação: se você precisar mexer com datas diferentes, não esqueça que você pode usar o comando da CLI `update_candy_machine` para mudar isso para o que você quiser!*

Ótimo. Agora podemos voltar ao componente `CountdownTimer` para fazer o restante da configuração lógica. Queremos ver a contagem regressiva do temporizador em tempo real. Vamos usar um pouco de JavaScript para conseguir isso, mas não se preocupe, a lógica é super direta.


```jsx
// Nosso useEffect será executado no carregamento do componente
useEffect(() => {
  console.log('Configurando o intervalo...');

  // Use setInterval para executar este pedaço de código a cada segundo
  const interval = setInterval(() => {
    const currentDate = new Date().getTime();
    const distance = dropDate - currentDate;

    // Aqui é tão fácil quanto fazer algumas contas de tempo para obter as diferentes propriedades
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Temos nosso output desejado, defina-o no estado!
    setTimerString(`${days}d ${hours}h ${minutes}m ${seconds}s`);

    // Se a nossa distância passar de zero isso significa que é hora do drop!
    if (distance < 0) {
      console.log('Limpando o intervalo...');
      clearInterval(interval);
    }
  }, 1000);

  // Sempre que nosso componente for desmontado, vamos limpar nosso intervalo
  return () => {
    if (interval) {
      clearInterval(interval);
    }
  };
}, []);
```


Sinta-se à vontade para copiar e colar todas essas coisas de tempo (risos). Eu raramente entendo, pois quase sempre copio e colo do StackOverflow hehe.

Então é isso!!

Você tem um cronômetro de contagem regressiva bem simples, para que seus fãs saibam quando voltar para cunhar um de seus NFTs.

![https://camo.githubusercontent.com/97aa642ab69ccd0b9eeb7ce92b443159d8327a0bfa6e6fa591913db635a9db98/68747470733a2f2f692e696d6775722e636f6d2f4f494e696d72722e706e67](https://camo.githubusercontent.com/97aa642ab69ccd0b9eeb7ce92b443159d8327a0bfa6e6fa591913db635a9db98/68747470733a2f2f692e696d6775722e636f6d2f4f494e696d72722e706e67)

📭 Construindo seu estado "Esgotado"

Uma última coisa que poderia ser uma adição bem legal (e que também é fácil de fazer) é mostrar um estado "Esgotado" quando sua máquina ficar sem NFTs para cunhar!

Lembre-se - seu drop tem apenas um número definido de NFTs disponíveis.

Podemos descobrir isso verificando duas propriedades - `itemsRedeemed` e `itemsAvailable` em nossa propriedade `candyMachine.state`! Além disso, vamos adicionar um recurso que mostrará nosso botão de cunhagem apenas quando tivermos itens para cunhar e a data do drop do NFT for atingida!

Esse processo vai ser bem fácil de fazer! Vamos para o nosso componente `CandyMachine` e então seguimos para a função de renderização dos componentes. Adicione o seguinte:


```jsx
return (
  candyMachine && candyMachine.state && (
    <div className="machine-container">
      {renderDropTimer()}
      <p>{`Itens Cunhados: ${candyMachine.state.itemsRedeemed} / ${candyMachine.state.itemsAvailable}`}</p>
        {/* Verifique se essas propriedades são iguais! */}
        {candyMachine.state.itemsRedeemed === candyMachine.state.itemsAvailable ? (
          <p className="sub-text">Esgotado!🙊</p>
        ) : (
          <button
            className="cta-button mint-button"
            onClick={mintToken}
          >
            Cunhar NFT
          </button>
        )}
    </div>
  )
);
```


![https://camo.githubusercontent.com/99aaadeed4fc792387c035d5a20ccea8de27e9707553ea227803f092003b4527/68747470733a2f2f692e696d6775722e636f6d2f6659457a6f65672e706e67](https://camo.githubusercontent.com/99aaadeed4fc792387c035d5a20ccea8de27e9707553ea227803f092003b4527/68747470733a2f2f692e696d6775722e636f6d2f6659457a6f65672e706e67)

Está ficando bem Legal!!


### 🎨 A Magia do CSS

Gaste um tempo apenas limpando o CSS e fazendo com que as coisas fiquem com uma aparência melhor. Adicione sua própria arte. Não use a arte que deixei no código. E agora finalizamos com toda a lógica da nossa Candy Machine :)!


### 🚨 Relatório de progresso

Por favor faça isso, senão o Farza vai ficar triste :(

Em `#progress`, poste uma captura de tela do seu aplicativo da web!
