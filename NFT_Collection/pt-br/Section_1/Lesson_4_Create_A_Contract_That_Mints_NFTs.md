_Nota: essa lição é um pouco mais longa do que as outras!_

Agora que todos os nossos scripts estão funcionando e fizemos o básico, vamos mintar algumas NFTs! Assim que o meu arquivo `MyEpicNft.sol` atualizado se parece:

```solidity
pragma solidity ^0.8.0;

// Primeiro importamos alguns contratos do OpenZeppelin.
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

// Nós herdamos o contrato que importamos. Isso significa que
// teremos acesso aos métodos do contrato herdado.
contract MyEpicNFT is ERC721URIStorage {
    // Mágica dada pelo OpenZeppeling para nos ajudar a observar os tokenIds.
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Nós precisamos passar o nome do nosso token NFT e o símbolo dele.
    constructor() ERC721 ("SquareNFT", "SQUARE"){
        console.log("Esse é meu contrato NFT! Uau!");
    }

    // Uma função que o nosso usuário irá encontrar para pegar sua NFT.
    function makeAnEpicNFT() public {
        // Pega o tokenId atual, que começa por 0.
        uint 256 newItemId = _tokenIds.current();

        // Minta ("cunha") o NFT para o sender (quem ativa o contrato) usando msg.sender.
        _safeMint(msg.sender, newItemId);

        // Designa os dados do NFT.
        _setTokenURI(newItemId, "blah");

        // Incrementa o contador para quando o próximo NFT for mintado.
        _tokenIds.increment();
    }
}
```

Várias coisas estão acontecendo aqui. Primeiro você vai ver que eu "herdei" um contrato do OpenZeppelin usando `is ERC721URIStorage` quando eu declaro o contrato. Você pode ler mais sobre hereditariedade [aqui](https://solidity-by-example.org/inheritance/), mas basicamente, significa que podemos chamar outros contratos a partir do nosso. É quase como importar funções para usarmos!

O padrão NFT é conhecido como `ERC721`, o qual você pode ler um pouco sobre [aqui](https://eips.ethereum.org/EIPS/eip-721). O OpenZeppelin essencialmente implementa o padrão NFT para nós e deixa escrevermos nossa própria lógica e customizá-la em cima disso. Isso significa que não precisamos escrever código repetido.

Eu seria louco de escrever um servidor HTTP do zero sem usar uma library, certo? Claro, a não ser que você quisesse explorar. Mas nós só queremos levantar e correr aqui.

De maneira semelhante - seria loucura escrever um contrato NFT totalmente do zero. Você pode explorar o contrato `ERC721` que estamos herdado [daqui](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol).

Vamos olhar passo a passo a função `makeAnEpicNFT`.

```solidity
uint256 newItemId = _tokenIds.current();
```

Mas o que diabos é `_tokenIds`? Bom, lembra do exemplo do Picasso? Ele tinha 100 esboços NFT nomeados Esboço #1, Esboço #2, Esboço #3, etc. Esses eram os identificadores únicos.

A mesma coisa acontece aqui, estamos usando `_tokenIds` para observar os identificadores únicos das NFTs, e é só um número! É automaticamente inicializado para 0 quando declaramos `private _tokenIds`. Então, quando chamamos `makeAnEpicNFT`, `newItemId` é 0. Quando rodamos de novo, `newItemId` será 1, e assim por diante.

`_tokenIds` é uma **variável de estado (state variable)**, o que significa que se a mudarmos, o valor vai ser guardado diretamente no contrato.

```solidity
_safeMint(msg.sender, newItemId);
```

Quando fazemos `_safeMint(msg.sender, newItemId);`, está basicamente dizendo: "minte a NFT com o id `newItemId` para o usuário com o endereço `msg.sender`". Aqui, `msg.sender` é uma variável que o [Solidity dispõe](https://docs.soliditylang.org/en/develop/units-and-global-variables.html#block-and-transaction-properties) que nos dá fácil acesso ao **endereço público** da pessoa que chamou o contrato.

O que é incrível aqui é que essa é uma **maneira super segura de conseguir o endereço público do usuário**. Manter o endereço público um segredo não é um problema, porque ele já é público!! Todo mundo pode ver. Mas, usando `msg.sender`, você não pode "fingir" o endereço público de alguém a não ser que você tenha as credenciais da carteira da pessoa e chame o contrato ao invés do dono.

**Você não pode chamar um contrato anonimamente.**, você precisa ter as credenciais da sua carteira conectadas. É quase como fazer "login" e ser autenticado.

```solidity
_setTokenURI(newItemId, "blah");
```

Por fim, rodamos `_setTokenURI(newItemId, "blah");`, que define o identificador único da NFT juntamento com os dados associados com o identificador único. É literalmente nós configurando os dados que fazem a NFT valiosa. Nesse caso, estamos definindo como "blah", o qual... não é tão valioso ;). Também não está seguindo o padrão do `ERC721`. Vamos entrar em mais detalhes sobre `tokenURI` daqui a pouco.

```solidity
_tokenIds.increment();
```

Depois que NFT é mintada, nós incrementamos `tokenIds` usando `_tokenIds.increment()` (que é uma função que o OpenZeppelin nos dá). Isso certifica que da próxima vez que uma NFT for mintada, vai ter um diferente `tokenIds` identificador. Ninguém pode ter um `tokenIds` que já tenha sido mintado.

## 🎟 `tokenURI` e rodando localmente.

O `tokenURI` é onde os dados da NFT vivem. E geralmente **liga** para um arquivo JSON chamado `metadata``que parece com algo assim:

```bash
{
    "name": "Spongebob Cowboy Pants",
    "description": "A silent hero. A watchful protector.",
    "image": "https://i.imgur.com/v7U019j.png"
}
```

Você pode customizar isso, mas quase toda NFT tem um nome, uma descrição e um link para alguma coisa como um vídeo, uma imagem, etc. Pode ter inclusive atributos customizados! Tenha cuidado com a estrutura da sua metadata, se sua estrutura não coincidir com os [requerimentos OpenSea](https://docs.opensea.io/docs/metadata-standards) sua NFT vai aparecer "quebrada" no site.

Isso faz parte dos padrões `ERC721` e permite que as pessoas construam site em cima dos dados das NFTs. Por exemplo, o [OpenSea](https://opensea.io/assets) é um marketplace de NFTs. E, toda NFT no OpenSea segue o padrão de metadata `ERC721` que deixa mais fácil para as pessoas comprarem e venderem NFTs. Imagine se todo mundo seguisse os próprios padrões e estruturassem suas metadatas como quisessem, seria um caos!

Nós podemos copiar o `Spongebob Cowboy Pants` metadata acima e colar dentro [desse](https://jsonkeeper.com/) site. Esse site é um lugar fácil para hostear dados JSON e nós vamos usá-lo para manter os dados da nossa NFT por agora. Uma vez que você clicar em "Salvar" você vai ter um link para o arquivo JSON. (Por exemplo, o meu é [`https://jsonkeeper.com/b/RUUS`](https://jsonkeeper.com/b/RUUS)). Lembre-se de testar o seu link e tenha certeza que tudo esteja bem!

**Nota: Eu amaria que você criasse o metadata JSON ao invés de só copiar o meu. Use sua própria imagem, nome e descrição. Talvez você queira sua NFT com a imagem de seu personagem favorito de anime, banda favorita, qualquer coisa!! Faça-o customizado. Não se preocupe, vamos poder mudar isso no futuro!**

Se você decidir usar sua própria imagem, tenha certeza que o URL leve diretamente para a imagem, e não para o site que hospeda a imagem! Links diretos do Imgur parecem com isso `https://i.imgur.com/123123.png` e NÃO `https://imgur.com/gallery/123123`. A maneira mais fácil de checar é ver se o URL termina com uma extensão de imagem como `.png` ou `.jpg`. Você pode clicar com o botão direito na imagem do imgur e "copiar o link da imagem". Isso vai te dar o URL correto.

Agora, vamos pro nosso contrato inteligente e mudar uma linha. Ao invés de:

```solidity
_setTokenURI(newItemId, "blah")
```

Nós vamos setar o URI para o link do nosso arquivo JSON.

```solidity
_setTokenURI(newItemId, "INSERT_YOUR_JSON_URL_HERE");
```
