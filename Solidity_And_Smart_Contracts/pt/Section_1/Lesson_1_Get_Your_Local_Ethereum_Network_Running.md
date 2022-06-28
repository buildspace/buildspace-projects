✅ Configure seu ambiente para começar a trabalhar com blockchain
---------------------------------------------------

Antes de qualquer coisa, precisamos colocar nossa rede Ethereum local para funcionar. É assim que vamos poder compilar e testar nosso código de contrato inteligente! Você sabe como é necessário criar um ambiente local para trabalhar com um código? Mesma coisa aqui!

Por enquanto, tudo que você precisa saber é que um contrato inteligente é um pedaço de código que vive na blockchain. A blockchain é um local público onde qualquer pessoa pode ler e gravar dados com segurança mediante o pagamento de uma taxa. Pense nisso como AWS ou Heroku, exceto que ninguém realmente é dono dela!

Portanto, neste caso, queremos que as pessoas nos 👋. O plano aqui é:

1\. **Vamos escrever um contrato inteligente.** Esse contrato tem toda a lógica em torno de como os 👋s serão tratados. É como o código do seu servidor.

2\. **Nosso contrato inteligente será implantado na blockchain.** Dessa forma, qualquer pessoa no mundo poderá acessar e executar nosso contrato inteligente (se dermos permissão para isso). Então, quase como um servidor :).

3\. **Vamos construir um site** que permitirá que as pessoas interajam facilmente com nosso contrato inteligente na blockchain.

Explicarei certas coisas em profundidade conforme necessário (por exemplo, como funciona a mineração, como os contratos inteligentes são compilados e executados, etc) *mas, por enquanto, vamos nos concentrar apenas em fazer as coisas funcionarem*.

Se você tiver qualquer problema aqui, apenas mande uma mensagem no Discord em `#section-1-help`.

✨ A magia do Hardhat
----------------------

1\. Vamos usar muito uma ferramenta chamada Hardhat. Isso nos permitirá facilmente criar uma rede Ethereum local e nos dar falsos ETH de teste e contas de falsas teste para trabalhar. Lembre-se, é como um servidor local, exceto que o "servidor" é o blockchain.

2\. Compile rapidamente contratos inteligentes e teste-os em nossa blockchain local.

Primeiro você vai precisar obter o node/npm. Se você não o fez, vá até [aqui](https://hardhat.org/tutorial/setting-up-the-environment.html).

Em seguida, vamos para o terminal (Git Bash não funcionará). Vá em frente e cd para o diretório em que deseja trabalhar. Quando estiver lá, execute estes comandos:

```bash
mkdir my-wave-portal
cd my-wave-portal
npm init -y
npm install --save-dev hardhat
```

👏 Comece o projeto de amostra
---------------------------

Legal, agora que devemos ter o Hardhat. Vamos começar um projeto de exemplo.

Execute:

```bash
npx hardhat
```

*Nota: se você tiver o yarn instalado junto com o npm, poderá obter erros como `npm ERR! could not determine executable to run`. Nesse caso, você pode fazer `yarn add hardhat`.*

Escolha a opção de criar um sample project. Diga sim a tudo.

O projeto de amostra solicitará que você instale o hardhat-waffle e o hardhat-ethers. Estas são outras coisas que usaremos mais tarde :).

Vá em frente e instale essas outras dependências apenas caso não tenham sido instaladas automaticamente.

```bash
npm install --save-dev @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers
```

Finalmente, execute `npx hardhat accounts` e isso deve imprimir um monte de strings que se parecem com isto:

`0xa0Ee7A142d267C1f36714E4a8F75612F20a79720`

Esses são os endereços Ethereum que o Hardhat gera para simular usuários reais na blockchain. Isso vai nos ajudar muito no projeto mais tarde, quando quisermos simular usuários se 👋 para nós!

🌟 Execute isso
---------

Para ter certeza de que tudo está funcionando, execute:

```bash
 npx hardhat compile
```
Depois execute:

```bash
npx hardhat test
```

Você deve ver algo assim:

![](https://i.imgur.com/rjPvls0.png)

Vamos fazer uma pequena limpeza.

Vá em frente e abra o código do projeto agora em seu editor de código favorito. Eu gosto mais do VSCode! Queremos excluir todo o código inicial desenecessário gerado para nós. Não precisamos de nada disso. Somos profissionais;)!

Vá em frente e exclua o arquivo `sample-test.js` em `test`. Além disso, exclua `sample-script.js` em `scripts`. Em seguida, exclua `Greeter.sol` em `contratos`. Não exclua as pastas!

🚨 Antes de clicar em "Próxima lição"
-------------------------------------------

*Nota: se você não fizer isso, Farza vai ficar muito triste :(.*

Vá para #progress e poste uma captura de tela do **seu** terminal mostrando o resultado do teste! Você acabou de assinar um contrato inteligente, isso é um grande negócio!! Mostre-o :).

PS: Se você **não** tem acesso a #progress, certifique-se de vincular seu Discord, junte-se ao Discord [aqui](https://discord.gg/mXDqs6Ubcc), entre em contato conosco em #general e nós te ajudaremos a obter acesso aos canais certos!