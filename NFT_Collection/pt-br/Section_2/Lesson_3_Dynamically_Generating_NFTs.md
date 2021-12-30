🔤 Gerando randomicamente palavras em uma imagem.
------------------

Bacana — nós criamos um contrato que agora cria NFTs dentro da rede (on-chain). Mas ainda é sempre o mesmo NFT argh !!! Vamos torná-lo dinâmico. 

**Eu escrevi esse código [aqui](https://gist.github.com/farzaa/b788ba3a8dbaf6f1ef9af57eefa63c27) que irá gerar um SVG com uma combinação de três palavras aleatórias.**

Eu acho que essa seria a melhor maneira para as pessoas olharem todo o código de uma vez e entender como ele está funcionando.

Eu também escrevi um comentário acima da maioria das linhas que adicionei/alterei! Quando você olhar para este código, tente escrevê-lo você mesmo. Pesquise no Google as funções que você não entende!

Eu quero fazer algumas observações sobre algumas dessas linhas.

📝 Escolha as suas próprias palavras.
------------------

```solidity
string[] firstWords = ["YOUR_WORD", "YOUR_WORD", "YOUR_WORD", "YOUR_WORD", "YOUR_WORD", "YOUR_WORD"];

string[] secondWords = ["YOUR_WORD", "YOUR_WORD", "YOUR_WORD", "YOUR_WORD", "YOUR_WORD", "YOUR_WORD"];

string[] thirdWords = ["YOUR_WORD", "YOUR_WORD", "YOUR_WORD", "YOUR_WORD", "YOUR_WORD", "YOUR_WORD"];
```

Estas são nossas palavras aleatórias!! Por favor, divirta-se com isso. Certifique-se de que cada palavra seja única e sem espaços!

Quanto mais engraçadas as palavras, melhor será rs. Eu gostei de fazer de cada array um determinado tema. Por exemplo, `firstWords` pode ser o primeiro nome de seus personagens favoritos de anime. Então, `secondWords` pode ser um alimento de que você goste. E `thirdWords` podem ser nomes de animais aleatórios. Divirta-se com isso!!! Deixe com a sua cara

Aqui estão alguns dos meus. Eu gosto que a primeira linha tenha palavras que parecem "descrever" algo!

![](https://i.imgur.com/ADawgrB.png)

Talvez você queira gerar um nome de banda aleatório. Talvez você queira gerar nomes de personagens aleatórios para suas sessões de Dungeons and Dragons. Faça o que você quiser. Talvez você não dê a mínima para combinações de três palavras e só queira fazer SVGs de pinguins de pixel art. Vá em frente. Faça o que você quiser :).

Observação: Eu comendo entre 15-20 palavras por array. Notei que cerca de 10 geralmente não é aleatório o suficiente.

🥴 Números aleatórios.
------------------
