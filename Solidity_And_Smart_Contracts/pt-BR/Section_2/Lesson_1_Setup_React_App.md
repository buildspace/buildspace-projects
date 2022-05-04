💻 Configurar um cliente
------------------

É hora de começar a trabalhar em nosso site! Nosso contrato é bem simples, mas vamos aprender como nosso front-end pode interagir com nosso contrato o mais rápido possível!

Portanto, existem cerca de 100 maneiras diferentes de configurar um projeto básico em React e implantá-lo. Mostraremos como fazer isso aqui em 10 minutos e, no final, você terá um aplicativo React totalmente implantado com seu próprio domínio e tudo mais.

🤯 Replique
---------

**Observação: você não precisa usar o replit para compilar + implantar seu site. Se você quiser usar create-react-app + Vercel/Heroku/AWS -- também funciona. [Aqui](https://github.com/w3b3d3v/projeto-tchauzinho) está um link para o repositório base que você pode clonar e trabalhar localmente.**

Usaremos [Replit](https://replit.com/~)! É uma IDE baseada em navegador que nos permite criar facilmente aplicativos Web e implantá-los a partir do navegador. É super legal. Em vez de ter que configurar um ambiente local completo e escrever comandos para o deploy, tudo é dado para nós.

Faça uma conta no Replit antes de seguir em frente.

Eu já criamos um projeto React básico que você pode fazer o **fork** no Replit. **Basta ir [aqui](https://replit.com/@DanielCukier/projeto-tchauzinho?v=1) e, à direita, você verá o botão "Fork".** Certifique-se de que esteja logado e clique. Magicamente você clonará meu repositório e a IDE completa em seu navegador para trabalhar com o código. Quando ele parar de carregar e mostrar algum código, clique no botão "Executar" na parte superior. Isso pode levar uns sólidos 2-3 minutos na primeira vez. Basicamente, o Replit estará inicializando seu projeto e implantando-o em um domínio real.

**Observação: à medida que avança neste projeto, você pode notar que estamos fazendo referência a arquivos `.js`. No Replit, se você estiver criando novos arquivos JavaScript, precisará usar a extensão `.jsx`! Replit tem alguma questão de performance que requer que você use a extensão de arquivo `.jsx` :).**

Fiz um vídeo rápido explicando como editar código no Replit, fazer deploy, e alterar para o modo noturno. Confira abaixo:
[Tear](https://www.loom.com/share/4578eb9fba1243499a6913d214b21dc3)

🦊 Metamask
-----------

Incrível, temos um projeto React **implantado** com o qual podemos trabalhar facilmente. Isso foi simples :).

Em seguida, precisamos de uma carteira Ethereum. Existem várias delas, mas, para este projeto, vamos usar a Metamask. Baixe a extensão do navegador e configure sua carteira [aqui](https://metamask.io/download.html). Mesmo se você já tiver outra carteira, basta usar a Metamask por enquanto.

Por que precisamos da Metamask? Bem. Precisamos ser capazes de chamar funções em nosso contrato inteligente que vivem na blockchain. E, para isso, precisamos ter uma carteira que tenha nosso endereço Ethereum e uma chave privada.

**Mas, precisamos de algo para conectar nosso site à nossa carteira para que possamos passar com segurança nossas credenciais da carteira para nosso site para que nosso site possa usar essas credenciais para chamar nosso contrato inteligente. Você precisa ter credenciais válidas para acessar funções em contratos inteligentes.**

É quase como autenticação. Precisamos de algo para "fazer login" na blockchain e usar essas credenciais de login para fazer solicitações de API do nosso site.

Então, vá em frente e configure tudo! O fluxo de configuração deles é bastante autoexplicativo :).

🚨 Antes de clicar em "Próxima lição"
--------------------------------------------

*Nota: se você não fizer isso, Yan ficará muito triste :(.*

Compartilhe um link para seu site e poste-o em #progresso. Altere o CSS e o texto para o que você quiser. Talvez você queira que seja mais colorido? Talvez você não se importe com tchauzinhos e queira fazer um clone descentralizado do Twitter? Faça o que quiser, este é o seu aplicativo :).