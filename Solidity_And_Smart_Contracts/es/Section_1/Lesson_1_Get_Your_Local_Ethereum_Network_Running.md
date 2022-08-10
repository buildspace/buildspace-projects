## ✅ Configura tu entorno para empezar a trabajar con la Cadena de Bloques.

Antes que nada, necesitas tener tu red local de Ethereum funcionando correctamente. Con esto vamos a poder compilar y hacer pruebas al código del contrato inteligente. Configurarás un entorno local para trabajar en él.
Por ahora, todo lo que necesitas saber es que un contrato inteligente es una pieza de código que vive en la cadena de bloques. La Cadena de Bloques es un lugar público que cualquiera puede leer e incluir datos de manera segura por una tarifa. Piensa en algo como AWS o Heroku con la excepción de que nadie es dueño de la información.
En este caso lo que queremos es que la gente nos mande 👋. La idea central aquí es:
1.	**Vamos a escribir un contrato inteligente.** El contrato tendrá toda la lógica de como funcionan los 👋 Este será tu código de servidor.
2.	**Nuestro contrato será desplegado a la cadena de Bloques.** De esta forma cualquiera podrá entrar y usar nuestro contrato (si se otorga la autorización) O sea, algo así como un servidor.
3.	**Vamos a construir un sitio web cliente.** Esto va a permitir que las personas puedan interactuar con el fácilmente.
Te iré explicando varios conceptos a profundidad conforme los vayamos necesitando (ejemplo: cómo funciona la minería, como compilar y usar un contrato inteligente, etc.) *Por ahora vamos a enfocarnos en que el entorno funcione correctamente*.
Si tienes alguna duda puedes hacer preguntas enviando un mensaje en Discord en `#section-1-help`.

## ✨ La magia de Hardhat
1.  Vamos a utilizar mucho una herramienta que se llama Hardhat. Esta herramienta nos ayudará a configurar un entorno local de Ethereum fácilmente, nos dará ETH de prueba y cuentas falsas de prueba para trabajar con ellas. Recuerda esto es como un servidor local, salvo que el servidor es la “Cadena De Bloques”.
2.	Rápidamente podrás compilar contratos inteligentes y hacer pruebas con ellos en nuestra cadena de bloques local.

Primero que nada, debes tener instalado y configurado node/npm. Si todavía no lo tienes lo puedes hacer [aquí.](https://hardhat.org/tutorial/setting-up-the-environment.html)
Te recomendamos utilizar Hardhat usando la versión más reciente de LTS Node.js si no haces esto podrías presentar algunos problemas y dificultades. Puedes encontrar las últimas versiones [aquí.](https://nodejs.org/en/about/releases/)
A continuación, vamos a utilizar Terminal (Git Bash no funcionará aquí). Vamos dirigirnos (con cd) al directorio en que queremos trabajar. Ya que estemos ahí vamos a correr los siguientes comandos:

```bash
mkdir my-wave-portal
cd my-wave-portal
npm init -y
npm install --save-dev hardhat
```

## 👏 Pongamos en marcha nuestro proyecto de muestra.

Excelente, Ya que tenemos Hardhat empecemos nuestro proyecto.

Inicializar:

```bash
npx hardhat
```

*Nota: Si además de npm tienes instalado yarn pueden surgir errores como:
`npm ERR! could not determine executable to run`. Si fuera el caso usa: `yarn add hardhat`.*
Escoge la opción de crear un proyecto de muestra. Pon que si a todas las opciones que aparezcan.
El proyecto de muestra te va a solicitar que instales hardhat-waffle y hardhat-ethers. Estas herramientas las usaremos posteriormente y serán muy útiles.
Continuemos e instalemos estas dependencias en caso de que no se hayan instalado de forma automática.

```bash
npm install --save-dev @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers
```
Finalmente, ejecuta `npx hardhat accounts`, este comando imprimirá varias cadenas de caracteres como esta:

`0xa0Ee7A142d267C1f36714E4a8F75612F20a79720`

Estas son direcciones de Ethereum que Hardhat nos genera para simular que son usuarios reales de la cadena de bloques. 
Esto nos va a ayudar un montón en el proyecto cuando queramos hacer pruebas y simular usuarios que vienen a enviarnos saludos 👋

## 🌟 Ejecútalo
Para asegurarnos que todo funciona correctamente utiliza el siguiente comando:

```bash
 npx hardhat compile
```
Ahora ejecuta:

```bash
npx hardhat test
```

Vas a ver en pantalla lo siguiente:

 ![image](https://user-images.githubusercontent.com/90020224/169627366-eaafd491-4da0-4141-a616-82d27b0d764f.png)
 
Bueno vamos a organizar esto.
Usa este código y ejecútalo en tu editor de código favorito. Yo utilizo VSCode.

Queremos que borres todo el código de novato que nosotros generamos, no lo necesitas tu eres un ¡¡PRO!!

Localiza y elimina `sample-test.js` en `test`. También elimina `sample-script.js` en `scripts`.
Después elimina `Greeter.sol` en `contracts`. ¡No borres los folders!

## 🚨 Antes de continuar a la siguiente lección.

*Nota: Si no haces esto harás que Farza se ponga muy triste :(*

Dirígete a #progress y publica una captura de pantalla de **tu Terminal** mostrando el resultado de tu prueba. ¡Acabas de ejecutar un contrato inteligente, es algo importante! Muéstralo.

Postdata: Si **no tienes** acceso a #progress asegúrate que conectaste y ligaste tu discord, puedes unirte [aquí:](https://discord.gg/mXDqs6Ubcc)
Contáctanos en la sección #general donde podemos ayudarte a que tengas acceso a los canales de discord correctos.

📝Tu respuesta
🤔 Envía captura de pantalla de tu Terminal
Toma una imagen de tu terminal y muéstranos el resultado de tu prueba exitosa de hardhat y envíanosla.
