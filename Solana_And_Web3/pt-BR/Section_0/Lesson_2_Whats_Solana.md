Vamos gastar muito tempo mergulhando em Solana neste projeto e você terá muito tempo para aprender sobre o que diabos Solana é **realmente construindo** sobre ela.

Não se preocupe - vamos chegar em um monte de coisas como Solana tem baixas taxas de gás, como é muito rápido, etc.

Eu **não** quero que gastemos muito tempo em teoria aqui.

A última coisa que eu quero que você faça é descer à toca do coelho da blockchain e começar a assistir a toneladas de vídeos aleatórios do YT ou postagens da Wikipedia. Eu acho que fazer essas coisas é bom, _mas apenas termine este projeto primeiro_. Então desça à toca do coelho!

Eu prometo que toda a sua pesquisa fará muito mais sentido quando você realmente enviar este projeto.

Eu acho que é valioso ter uma compreensão básica de alguns dos conceitos e obter uma imagem de alto nível de como as coisas estão funcionando na Solana! Então, vamos fazer isso :).

### 👩‍💻 Programas

Em Solana, escrevemos "programas Solana".

_Nota: isso é como um contrato inteligente se você conhece o Ethereum!_

Um programa Solana é apenas um pedaço de código que vive no blockchain. O blockchain é um lugar onde qualquer pessoa pode executar código por uma taxa. Você pode pensar no blockchain como AWS ou Heroku. Mas, em vez de serem administradas por uma grande corporação, essas redes são administradas por "mineradores". No mundo de Solana nós os chamamos de "validadores".

### 🏦 Contas

Em Solana, os programas são "stateless" (isto é, 'sem estado'). **Isso é muito diferente do Ethereum.** No Ethereum, você escreve "contratos inteligentes" e os contratos mantêm um estado onde você pode armazenar dados sobre variáveis ​​diretamente nos contratos.

Em Solana, isso funciona da seguinte forma: os usuários têm "contas" e os programas Solana podem interagir com as "contas" dos próprios usuários. Um usuário pode possuir milhares de contas. A maneira mais fácil de pensar em uma conta é como um arquivo. Os usuários podem ter muitos arquivos diferentes. Os desenvolvedores podem escrever programas que podem se comunicar com esses arquivos.

_O programa em si não armazena os dados de um usuário. O programa apenas conversa com "contas" que guardam os dados do usuário._

Essa é praticamente toda a teoria que realmente precisamos saber agora! Se ainda não fizer sentido, não se preocupe! Também levei um tempo para entender isso. Acho que faz mais sentido quando pulamos pro código.

### 👀 "Devo usar Solana ou Ethereum?"

Hmmmm. Esta é uma pergunta difícil. Também pode ser a pergunta errada. Desculpe, eu sei que não é a resposta que você quer, mas a resposta real é - _depende._

Por exemplo - hoje, não discutimos sobre qual _linguagem de servidor backend_ é a **melhor**.

Nós apenas escolhemos aquela com a qual nos sentimos mais confortáveis ​​ou aquela que faz mais sentido para nosso caso de uso. Por exemplo, se a velocidade é seu objetivo, escrever seu back-end em Go pode fazer sentido. Se você quer apenas tirar algo do chão, algo como Node ou Ruby pode ser melhor.

É basicamente assim que devemos olhar para diferentes blockchains. Cada uma tem suas próprias prós e contras e você deve escolher aquela que se adapta ao seu caso de uso ou nível de conforto. Solana é conhecida como a blockchain super rápida e de baixo custo de gás - e neste projeto vamos mexer com ele para que você possa ter uma ideia de como é! **Crie sua própria opinião!!**

### ⛓ Futuro da cross chain

Cada blockchain tem seus próprios prós e contras. Eu não acho que nenhuma das grandes blockchains seja "a melhor". E nós **não** **precisamos** ter apenas uma para ser a melhor. A concorrência é boa. Um mundo onde _apenas_ a Apple fabrica smartphones seria uma droga. Um mundo onde apenas Krispy Kreme fazia donuts seria uma droga. Precisamos de muitas pessoas impulsionando a indústria à sua maneira.

_Esta é apenas uma opinião pessoal_, mas acho que estamos nos movendo rapidamente para um mundo onde teremos muitas blockchains diferentes (já acontecendo agora). Isso é realmente uma coisa boa. Em vez de uma blockchain ser uma vencedora clara, temos muitas chains diferentes, cada uma com suas próprias especialidades.

**Mas teremos [pontes](https://wiki.polkadot.network/docs/learn-bridges) que permitem que diferentes redes conversem entre si.**

Isso significa que você pode implantar seu programa em Solana e fazer com que ele se comunique com um contrato em uma blockchain diferente como Ethereum, Avalanche, Polygon, etc. Por exemplo, você pode comprar um NFT no Ethereum e depois movê-lo para Solana, se quiser. Ou talvez você possa ter uma ponte que permita mover facilmente tokens da rede Solana para a rede Ethereum.

O que seria **horrível** é se tivéssemos mais de 100 redes diferentes e **nenhuma** delas pudesse conversar umas com as outras. Então, cada rede se torna um jardim murado onde a transferência de dados entre redes é quase impossível. Os usuários perdem a liberdade de escolha.

As pontes estão se tornando mais populares. Sinta-se à vontade para ler [este](https://medium.com/1kxnetwork/blockchain-bridges-5db6afac44f8) post sempre que quiser! Mas, por enquanto, vamos construir.
