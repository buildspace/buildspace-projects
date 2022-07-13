## 💚 Mintar NFT pelo nosso site

Incrível. Nós conseguimos. Fizemos deploy do nosso site. Fizemos deploy do nosso contrato. Conectamos nossa carteira. **Agora nós precisamos chamar o nosso contrato através do web app** usando as credenciais que temos acesso com a MetaMask!

Então, lembre-se, nosso contrato tem a função `makeAnEpicNFT` o qual vai cunhar (mint) o NFT. Nós precisamos chamar essa função através do web app. Vá em frente e adicione a função a seguir abaixo da função `connectWallet`.

```javascript
const askContractToMintNft = async () => {
  const CONTRACT_ADDRESS = "INSIRA_O_ENDEREÇO_DO_CONTRATO_NA_REDE_RINKEBY";
  try {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicNft.abi,
        signer
      );
      console.log("Vai abrir a carteira agora para pagar o gás...");
      let nftTxn = await connectedContract.makeAnEpicNFT();
      console.log("Cunhando...espere por favor.");
      await nftTxn.wait();
      console.log(
        `Cunhado, veja a transação: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
      );
    } else {
      console.log("Objeto ethereum não existe!");
    }
  } catch (error) {
    console.log(error);
  }
};
```

Isso provavelmente vai dar alguns erros. Mas não se preocupe! Nós vamos consertar daqui a pouco. Vamos ver esse código um pouco.

```javascript
const provider = new ethers.providers.Web3Provider(ethereum);
const signer = provider.getSigner();
```

`ethers` é uma library que ajuda o nosso frontend a falar com o nosso contrato. Lembre-se de importar a lib no início usando `import { ethers } from "ethers";`.

Um "Provider" (provedor) é o que usamos para falar com os nodes do Ethereum. Lembra como nós estávamos usando o Alchemy para fazer **deploy**? Bom, nesse caso nós usamos os nodes que a Metamask provém no background para mandar/receber dados do nosso contrato já implantado.

[Aqui está](https://docs.ethers.io/v5/api/signer/#signers) um link explicando o que um signer é (linha 2).

```javascript
const connectedContract = new ethers.Contract(
  CONTRACT_ADDRESS,
  myEpicNft.abi,
  signer
);
```

Nós vamos passar por isso em um minuto. Só saiba que essa linha é o que atualmente **cria a conexão com o nosso contrato**. E precisa do endereço do contrato, algo chamado arquivo `abi` e um `signer`. Essas são as três coisas que sempre precisamos comunicar com contratos na blockchain.

Note como eu fixei `const CONTRACT_ADDRESS`? **Esteja certo de mudar essa variável para o endereço do contrato do último deploy que você fez**. Se você esqueceu ou o perdeu não se preocupe, só refaça o deploy do contrato e pegue um endereço novo :).

```javascript
console.log("Vai abrir a carteira agora para pagar o gás...");
let nftTxn = await connectedContract.makeAnEpicNFT();
console.log("Cunhando...espere por favor.");
await nftTxn.wait();
console.log(`Cunhado, veja a transação: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
```

O resto do código já deve fazer sentido. Parece com o código que fizemos deploy. Nós chamamos nosso contrato usando `makeAnEpicNFT`, esperamos ser minerada e linkamos com o URL Etherscan!

Finalmente, vamos querer chamar essa função quando alguém clicar o botão "Mint NFT".

```javascript
{currentAccount === ""
  ? renderNotConnectedContainer()
  : (
    /** Adiciona askContractToMintNFT Action para o evento onClick **/
    <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
      Cunhar NFT
    </button>
  )
}
```

## 📂 Arquivos ABI

**Fiz um pequeno vídeo aqui explicando tudo sobre ABI. Dê uma chance e assista, vou falar algumas coisas importantes.!**
[VEJA O VÍDEO](https://www.loom.com/share/6aa1031ea502453d9b9e77733e4cbd3b)

Então - quando você compilar seu contrato inteligente, o compilador cuspirá vários arquivos necessários que permitem interagir com o contrato. Você pode achar esses arquivos no diretório `artifacts` na raíz do repositório do seu projeto Solidity.

O arquivo ABI é algo que o nosso web app precisa para saber como se comunicar com o nosso contrato. Leia sobre isso [aqui](https://docs.soliditylang.org/en/v0.5.3/abi-spec.html).

Os conteúdos do arquivo ABI podem ser achado num JSON chique no seu projeto hardhat.

`artifacts/contracts/MyEpicNFT.sol/MyEpicNFT.json`

Então, a questão se torna como conseguimos esse arquivo JSON dentro do nosso frontend? Só vamos copiar e colar.

Copie os conteúdos de `MyEpicNFT.json` e vá para o web app. Você criará uma pasta nova chamada `utils` dentro de `src`. Dentro de `utils`, crie um arquivo chamado `MyEpicNFT.json`. O caminho total vai parecer com:

`src/utils/MyEpicNFT.json`

Cole o conteúdo do arquivo ABI ali mesmo no nosso arquivo.

Agora que você tem o seu arquivo com todo o conteúdo ABI pronto, é hora de importar ele dentro do seu arquivo `App.js`. Será assim:

```javascript
import myEpicNft from "./utils/MyEpicNFT.json";
```

E estamos prontos. Não deverá ter mais erros. Você está pronto para mintar alguns NFTs!

Tudo que você precisa fazer aqui é clicar em "Cunhar NFT", pagar o gás (usando seu fake ETH), esperar a transação ser minerada e bam! Seu NFT deve aparecer no OpenSea ou imediatamente ou dentro de 5 - 15 minutos no máximo.

Você deve estar se perguntando o que é gás. Eu não vou responder isso aqui. Mas você pode começar a pesquisar [aqui](https://solidity.web3dev.com.br/exemplos/linguagem-v0.8.3/gas/) ;).

## 🤩 Teste

Você deve estar pronto para mintar um NFT direto do seu site agora. **Isso é épico!!** Isso é basicamente como todos esses sites de mintar NFT funcionam, e você acabou de fazer você mesmo :). Corre lá e posta em todas as redes sociais esse seu feito!!!

Eu testei todo o código no vídeo ABI que linkei acima. Tenha certeza de assisti-lo. No vídeo eu apresento coisas super importantes sobre o que fazer quando você **muda** o contrato. Porque o seu contrato é permanente, mudanças requerem fazer outro deploy, atualizar o endereço no frontend, e finalmente atualizar o arquivo ABI no frontend

## ✈️ Uma nota sobre o redeploy do contrato

Digamos que você quer mudar seu contrato. Você precisa de 3 coisas:

1. Precisamos fazer deploy de novo.

2. Precisamos atualizar o endereço do contrato no frontend.

3. Precisamos atualizar o arquivo ABI no frontend.

**As pessoas esquecem constantemente de fazer esses 3 passos quando mudam o contrato. Não esqueçam.**

Por que precisamos fazer tudo isso? Bom, é porque contratos inteligentes são  **imutáveis**. Eles não podem mudar. São permanentes. Isso significa que mudar um contrato requer fazer o deploy inteiro de novo. Isso também vai **resetar** todas as variáveis visto que será tratado como um contrato novo. **Isso significa que perderíamos os dados das NFTs se quiséssemos atualizar o código do contrato.**

🚨 Relatório de progresso!
------------------------
Poste um print do seu console em #progresso depois que você faz o mint de alguns NFTs e todos aparecem no `console.log`s!
