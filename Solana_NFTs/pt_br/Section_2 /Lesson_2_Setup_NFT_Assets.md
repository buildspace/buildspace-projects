### ✨ Crie os NFTs dos seus sonhos

A CLI do Metaplex oferece uma maneira muito simples de informar à sua Candy Machine quais NFTs você tem disponíveis, por qual preço e muito, muito mais. No final das contas, um NFT é um arquivo JSON que possui algum ativo anexado a ele. É exatamente isso que vamos fazer aqui.

O Metaplex fornece um formato fácil de seguir, que nos permitirá executar um comando para carregar todos os nossos NFTs para um local que armazenará tudo para nós. Vamos começar criando uma pasta para armazenar todos os nossos dados do NFT.

Abra a pasta que contém seu `app` e crie um novo diretório no nível raiz chamado `assets`. Veja como está minha estrutura agora:

![https://camo.githubusercontent.com/1bb9240373b175616946f653dac98ae0e23afad45b7ac6633a7431dbf9c2507d/68747470733a2f2f692e696d6775722e636f6d2f315777646d45412e706e67](https://camo.githubusercontent.com/1bb9240373b175616946f653dac98ae0e23afad45b7ac6633a7431dbf9c2507d/68747470733a2f2f692e696d6775722e636f6d2f315777646d45412e706e67)

_Nota: se você estiver no **Replit**, você pode simplesmente criar uma pasta localmente chamada `assets`, o que também funciona. Pode criar em qualquer lugar, realmente não importa onde você a coloca._

Na pasta `assets`, teremos pares de arquivos associados entre si — o próprio ativo NFT (no nosso caso, uma imagem) e um arquivo `json` com os metadados desse NFT específico, que o Metaplex precisa para configurar tudo para nós.

Você pode carregar quantos NFTs quiser nesta máquina, mas vamos começar com apenas **três** para familiarizá-lo com tudo o que é necessário.

Para acompanhar qual ativo vai com cada arquivo de metadados `json`, queremos dar a ele uma convenção de nomenclatura bem simples — números! Cada PNG é emparelhado com seu próprio arquivo JSON. Duas coisas a serem observadas:



1. Você precisa começar em 0.
2. Não pode haver lacunas na nomenclatura.

Em nossa pasta de ativos, as coisas ficarão assim:


```
// NFT #1
0.png
0.json

// NFT #2
1.png
1.json

// NFT #3
2.png
2.json
```


![https://camo.githubusercontent.com/b02e6d946d8ae83e61664e398d67e70caae8ec8c426f9312ae59aeeaabd1a8db/68747470733a2f2f692e696d6775722e636f6d2f337761726b6d702e706e67](https://camo.githubusercontent.com/b02e6d946d8ae83e61664e398d67e70caae8ec8c426f9312ae59aeeaabd1a8db/68747470733a2f2f692e696d6775722e636f6d2f337761726b6d702e706e67)

Bem direto né? `0.json` se correlaciona com `0.png`, `1.json` se correlaciona com `1.png` e assim por diante. Agora, você provavelmente está se perguntando o que vamos colocar dentro desses arquivos `json`.

Vamos copiar e colar o seguinte em `0.json`:


```json
{
  "name": "NOME_DO_NFT",
  "symbol": "SIMBOLO_DO_NFT",
  "image": "0.png",
  "properties": {
    "files": [
      {
        "uri": "0.png",
        "type": "image/png"
      }
    ],
    "creators": [
      {
        "address": "INSIRA_SEU_ENDEREÇO_DE_CARTEIRA_AQUI",
        "share": 100
      }
    ]
  }
}
```


Esta é a informação básica que você precisará para começar a trabalhar com cada NFT. O Metaplex pegará esses dados e os armazenará dentro da blockchain para você. Bem legal. Existem certos atributos que mudam para cada arquivo `json`, como: `name`, `image` e `uri`. 

**Agora, este é o momento para você ficar insanamente criativo. Crie três NFTs aleatórios para sua coleção.**

Para começar, recomendo escolher três PNGs com os quais você se identifica. Talvez sejam três de sua capa de álbum favorita, três de seus personagens de anime favoritos, três de seus pôsteres de filmes favoritos. Não importa!!

Escolha três de seus favoritos.

Vou escolher Naruto, Sasuke e Sakura – meu trio de anime favorito :).

Observação: Agora, apenas PNGs são suportados por meio da CLI. Para outros tipos de arquivos como MP4, MP3, HTML, etc, você precisa criar um script personalizado. Veja o problema no Github por [aqui](https://github.com/metaplex-foundation/metaplex/issues/511).

Você pode até dar um nome específico à sua coleção se quiser, adicionando seu próprio objeto `collection`. Confira um exemplo [aqui](https://docs.metaplex.com/candy-machine-v2/preparing-assets#-image-0png).

Por fim, certifique-se de substituir `"INSIRA_SEU_ENDEREÇO_DE_CARTEIRA_AQUI"` pelo endereço da sua carteira Phantom (não se esqueça das aspas). Ele é mostrado na visualização única do NFT e é direcionado para os identificadores do twitter se estiver conectado via Solana Name Service. Você pode ter vários criadores na matriz `creators`. O atributo `share` é a porcentagem de royalties que cada criador receberá. Já que você é o único criador aqui, você leva tudo!

🚨 Relatório de progresso

Por favor faça isso, senão o Farza vai ficar triste :(

Do que você está fazendo seus NFTs? Mostre pra gente em `#progress`.
