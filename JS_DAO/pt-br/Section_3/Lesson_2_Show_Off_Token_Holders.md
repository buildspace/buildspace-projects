### 🥺 Recuperando os Detentores do Token no Web App.

Seria legal para todos os membros da sua DAO conseguir facilmente ver todas as pessoas da DAO que detêm tokens juntamente com quantos tokens eles detêm. Para fazer isso, vamos precisar chamar nosso smart contract pelo nosso cliente e recuperar os dados.

Vamos fazer isso! Vá para `App.jsx`. No topo, importe Ethers:

```jsx
import { ethers } from "ethers";
```

Depois, abaixo de `bundleDropModule`, adicione o seu `tokenModule`.

```jsx
const tokenModule = sdk.getTokenModule(
  "INSIRA_O_ENDEREÇO_DO_TOKEN_MODULE"
);
```

Nós precisamos disso para interagir tanto com o nosso contrato ERC-1155 quanto o ERC-20. Do ERC-1155, nós vamos pegar todos os endereços dos membros. Do ERC-20, vamos pegar o # de tokens que cada membro tem.

Depois, adicione o código abaixo após `const [isClaiming, setIsClaiming] = useState(false)`:

```jsx
// Guarda a quantidade de tokens que cada membro tem nessa variável de estado.
const [memberTokenAmounts, setMemberTokenAmounts] = useState({});
// O array guardando todos os endereços dos nosso membros.
const [memberAddresses, setMemberAddresses] = useState([]);

// Uma função para diminuir o endereço da carteira de alguém, não é necessário mostrar a coisa toda.
const shortenAddress = (str) => {
  return str.substring(0, 6) + "..." + str.substring(str.length - 4);
};

// Esse useEffect pega todos os endereços dos nosso membros detendo nosso NFT.
useEffect(() => {
  if (!hasClaimedNFT) {
    return;
  }
  
  // Do mesmo jeito que fizemos no arquivo 7-airdrop-token.js! Pegue os usuários que tem nosso NFT
  // com o tokenId 0.
  bundleDropModule
    .getAllClaimerAddresses("0")
    .then((addresess) => {
      console.log("🚀 Members addresses", addresess)
      setMemberAddresses(addresess);
    })
    .catch((err) => {
      console.error("failed to get member list", err);
    });
}, [hasClaimedNFT]);

// Esse useEffect pega o # de tokens que cada membro tem.
useEffect(() => {
  if (!hasClaimedNFT) {
    return;
  }

  // Pega todos os saldos.
  tokenModule
    .getAllHolderBalances()
    .then((amounts) => {
      console.log("👜 Amounts", amounts)
      setMemberTokenAmounts(amounts);
    })
    .catch((err) => {
      console.error("failed to get token amounts", err);
    });
}, [hasClaimedNFT]);

// Agora, nós combinamos os memberAddresses e os memberTokenAmounts em um único array
const memberList = useMemo(() => {
  return memberAddresses.map((address) => {
    return {
      address,
      tokenAmount: ethers.utils.formatUnits(
        // Se o endereço não está no memberTokenAmounts, isso significa que eles não
        // detêm nada do nosso token.
        memberTokenAmounts[address] || 0,
        18,
      ),
    };
  });
}, [memberAddresses, memberTokenAmounts]);
```

Parece muita coisa à primeira vista! Mas saiba que estamos fazendo três coisas:

1) Estamos chamando `getAllClaimerAddresses` para receber todos os endereços dos nosso membros que detêm um NFT do nosso contrato ERC-1155.

2) Nós estamos chamando `getAllHolderBalances` para receber os saldos de todo mundo que tem nosso token do nosso contrato ERC-20.

3) Estamos combinando os dados dentro de `memberList` que é um um array que combina os endereço dos membros e os saldos. Sinta-se livre para checar o que `useMemo` faz [aqui](https://reactjs.org/docs/hooks-reference.html#usememo). É um jeito chique que o React usa para guardar uma variável calculada.

Agora, você deve estar se perguntando, “Nós não podemos simplesmente fazer `getAllHolderBalances` para pegar todo mundo que tem nosso token?”. Bem, basicamente, alguém pode estar na sua DAO e ter zero tokens! *E está tudo bem.* Então ainda queremos que eles aparecam na lista.

No meu console, eu recebo algo tipo isso agora que eu estou recebendo com sucesso os dados dos meus dois contratos — o ERC-20 e o ERC-1155. Aí sim!! Sinta-se à vontade para bagunçar aqui e entender todos os dados.

![Untitled](https://i.imgur.com/qx8rfRZ.png)

*Nota: talvez você também veja a mensagem “Request-Rate Exceeded” do Ethers no seu console. Isso não é um problema por agora!*

### 🤯 Renderize os dados dos membros no Dashboard DAO.

Agora que nós temos todos os dados guardados no estado do nosso React app, vamos renderizá-lo.

**Substitua** `if (hasClaimedNFT) { }` com o seguinte:

```jsx
// Se o usuário já reivindicou seu NFT nós queremos mostrar a página interna da DAO para ele
// Apenas membros da DAO vão ver isso. Renderize todos os membros + quantidade de tokens
if (hasClaimedNFT) {
  return (
    <div className="member-page">
      <h1>🍪DAO Member Page</h1>
      <p>Congratulations on being a member</p>
      <div>
        <div>
          <h2>Member List</h2>
          <table className="card">
            <thead>
              <tr>
                <th>Address</th>
                <th>Token Amount</th>
              </tr>
            </thead>
            <tbody>
              {memberList.map((member) => {
                return (
                  <tr key={member.address}>
                    <td>{shortenAddress(member.address)}</td>
                    <td>{member.tokenAmount}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
```

Bem direto! Nós estamos apenas renderizando uma linda tabela que vai mostrar os dados da nossa `memberList`. Uma vez que você vir nossa página, você vai ver algo tipo o screenshot abaixo! *Nota: a lista está descentralizada, isso foi feito de propósito. Nós vamos adicionar algo depois!*

![Untitled](https://i.imgur.com/HZCHFak.png)

Épico. Agora nós temos um lugar para todos os nossos membros verem outros membros num dashboard interno e restrito via token. Perfeito :).

### 🚨 Relatório de Progresso

*Por favor faça isso ou Yan vai ficar triste :(.*

Vá em frente e compartilhe uma captura de tela em `#progresso` do seu dashboard interno da DAO mostrando seus membros atuais + suas quantidades de token!