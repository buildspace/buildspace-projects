Antes de que profundicemos en programar nuestro servicio de dominios, hablemos un poco sobre porque Polygon es una solución epica para esto. 

Este proyecto es sobre hacer tu propio servicio de dominios — donde la gente pueda comprar su propio dominio desde tu contrato inteligente y ser sus propietarios.

Cuando haces a las personas pagar por cosas, generalmente no quieres que paguen $40 (dolares) en comsiones por transacción, eso es aproximadamente cuanto se paga por comsiones por transacción en Ethereum en un buen día. Aquí es donde Polygon entra en escena!

Tecnicamente, Polygon es un protocolo y un marco de trabajo que consiste en un monton de diferentes blockchains. Vamos a estar construyendo en su cadena más popular - **Polygon PoS**. Qué es eso? Es otra cadena que se ejecuta **junto** a Ethereum y periodicamente sube **puntos de guardado** a está. Vamos a desglozar esto un poco.

la blockchain Ethereum es llamada una “layer 1” blockchain (blockhain de primera capa) porque podemos construir otras blockchains **sobre ella**. Eso es exactamente lo que Polygon PoS es: es una blockchain construida sobre Ethereum que se ejecuta en paralelo, haciendo una second layer (segunda capa).

Imagina que diriges una cocina como un chef. Sería bastate molesto para ti tener que tomar las ordenes, volver a la cocina, cocinarlo, y servirlo. Terminaras con una larga fila bastante rapido! en cambio, podrías contratar un equipo de meseros para que actuen como **una capa** entre la cocina y los clientes. Los meseros tomarian las ordenes de manera más eficiente y las entregarían a la cocina directamente.

Esta es una relación similar a la que Ethereum tiene con Polygon. Ethereum no estaba construida para manerja un numero tan alocado de transacciones así que se forma una "fila" facilmente. Polygon es capaz de manar un más alto numero de transacciones y luego las empaca todas esas transacciones y las deposita en Ethereum, siendo Ethereum la fuente final de la verdad.

**Todavía parece no tener sentido? Eh no te preocupes por eso. Una vez empieces a construir en Polygon sera 10X más claro :).**

Siente libre de leer más sobre lás soluciones de segunda capa para escalar [aquí](https://mirror.xyz/dcbuilder.eth/QX_ELJBQBm1Iq45ktPsz8pWLZN1C52DmEtH09boZuo0).

### 💥 Polygon vs Ethereum

Debes estar pensando “Hmm, realmente quiero aprender como usar otra blockchain???”.

Bueno, no! No lo necesitas! Ya que Polygon PoS es compatible con la EVM (Ethereum Virtual Machine o Maquina Virtual de Ethereum) , todo lo que se ejecuta en Ethereum puede ejecutarse en Polygon sin ningun cambio

Esto hace super facil mover contratos a Polygon así no tendras que vender tus riñones para pagar comsiones por transacción. para la mayoría de dApps, Polygon tiene mucho más sentido por lo rapido y barato que es. Todas las herramientas populares para Ethereum como Hardhat, Remix, Truffle y Web3js funcionan con Polygon; todo lo que necesitas es cambiar la red en la que estás!