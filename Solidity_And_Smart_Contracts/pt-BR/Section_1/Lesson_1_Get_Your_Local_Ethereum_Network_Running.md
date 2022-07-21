✅ Configure seu ambiente para começar a trabalhar com blockchain
-------------------------------------------------- -

Antes de qualquer coisa, precisamos fazer com que nossa rede local Ethereum funcione. É assim que podemos compilar e testar o código do nosso contrato inteligente! Você sabe como você precisa criar um ambiente local para trabalhar nele? Mesma coisa aqui!

Por enquanto, tudo o que você precisa saber é que um contrato inteligente é um pedaço de código que vive na blockchain. A blockchain é um local público onde qualquer pessoa pode ler e gravar dados com segurança por uma taxa. Pense nisso como AWS ou Heroku, exceto que não há um dono real!

Então, neste caso, queremos que as pessoas façam 👋 para nós. De forma geral:

1\. **Vamos escrever um contrato inteligente.** Esse contrato tem toda a lógica de como os 👋 s são tratados. Isso é como o código do seu servidor.

2\. **Nosso contrato inteligente será implantado na blockchain.** Dessa forma, qualquer pessoa no mundo poderá acessar e executar nosso contrato inteligente (se dermos permissão para isso). Então, praticamente como um servidor :).

3\. **Vamos construir um site cliente** que permitirá que as pessoas interajam facilmente com nosso contrato inteligente na blockchain.

Explicarei algumas coisas em profundidade conforme necessário (por exemplo, como a mineração funciona, como os contratos inteligentes são compilados e executados etc.) *mas por enquanto vamos nos concentrar apenas em fazer as coisas funcionarem*.

Se você tiver algum problema aqui, basta enviar uma mensagem no Discord em `#section-1-help`.

✨ A magia do Hardhat
-----------------------

1\. Vamos usar muito uma ferramenta chamada Hardhat. Isso nos permitirá criar facilmente uma rede Ethereum local e nos fornecer ETH de teste falso e contas de teste falsas para trabalhar. Lembre-se, é como um servidor local, exceto que o "servidor" é a blockchain.

2\. Compile os contratos inteligentes rapidamente e teste-os em nossa blockchain local.

Primeiro você precisará obter o node/npm. Se você não tiver, vá [aqui](https://hardhat.org/tutorial/setting-up-the-environment.html).

Em seguida, vamos para o terminal (o Git Bash não funcionará). Vá em frente e execute `cd` para o diretório em que você deseja trabalhar. Quando estiver lá, execute estes comandos:

```bash
mkdir my-wave-portal
cd my-wave-portal
npm init -y
npm install --save-dev hardhat
```

👏 Comece o projeto de exemplo
---------------------------

Legal, agora devemos ter o Hardhat. Vamos começar um projeto de exemplo.

Execute:

```bash
npx hardhat
```

*Observação: se você tiver o yarn instalado junto com o npm, poderá receber erros como `npm ERR! não foi possível determinar o executável a ser executado`. Neste caso, você pode fazer `yarn add hardhat`.*

Escolha a opção para criar um projeto de exemplo. Diga sim a tudo.

O projeto de exemplo solicitará que você instale o hardhat-waffle e o hardhat-ethers. Essas são outras "guloseimas" que usaremos mais tarde :).

Vá em frente e instale essas outras dependências caso não tenha feito isso automaticamente.

```bash
npm install --save-dev @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers
```

Finalmente, execute `npx hardhat accounts`, o que deverá imprimir um monte de strings que se parecem com:

`0xa0Ee7A142d267C1f36714E4a8F75612F20a79720`

Estes são os endereços Ethereum que o Hardhat gerou para simularmos usuários reais na blockchain. Isso vai nos ajudar mais tarde no projeto, quando quisermos simular usuários nos mandando 👋!

🌟 Execute
---------

Para ter certeza de que tudo está funcionando, execute:

```bash
 npx hardhat compile
```

Então execute:

```bash
npx hardhat test
```

Você deve ver algo assim:

![](https://i.imgur.com/rjPvls0.png)

Vamos fazer uma pequena limpeza.

Vá em frente e abra o código do projeto em seu editor de código favorito. Eu gosto mais do VSCode! Queremos excluir todo o código inicial inútil gerado para nós. Não precisaremos de nada disso. Somos profissionais ;)!

Vá em frente e exclua o arquivo `sample-test.js` em `test`. Além disso, exclua `sample-script.js` em `scripts`. Em seguida, exclua `Greeter.sol` em `contracts`. Não exclua as pastas!

🚨 Antes de clicar em "Próxima lição"
--------------------------------------------

*Nota: se você não fizer isso, Farza ficará muito triste :(.*

Vá para #progress e poste uma captura de tela do **seu** terminal mostrando a saída do teste! Você acabou de executar um contrato inteligente, isso é um grande negócio! Mostre-o :).

PS: Se você **não** tiver acesso ao #progress, certifique-se de vincular seu Discord, junte-se ao Discord [aqui](https://hardhat.org/discord), nos chame em #general que te ajudaremos a ter acesso aos canais certos!