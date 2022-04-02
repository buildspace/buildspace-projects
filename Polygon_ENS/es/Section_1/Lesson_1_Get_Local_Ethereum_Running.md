*Nota: Si anteriormente has realizado proyectos en buildspace, muchos pasos de las siguientes dos lecciones se repiten de proyectos anteriores. Si ya los comprendes, increible! Eres un pro. Sientete libre de pasar por ellos rapidamente.*

### **📚 Un pequeño manual de blockchain.**

Antes que nada, vamos a necesitar nuestra red Ethereum local funcionando. De esa manera compilamos y probamos el codigo de nuestros smart contract! Sabes como configurar un entorno local para desarrollar web apps? es bastante similar

Por ahora, todo lo que necesitas saber es que un smart contract es una pieza de codigo que vive en la blockchain. la blockchain es un lugar publico donde todos de manera segura pueden leer y escribir información pagando una comisión. Piensa en ello como una clase de AWS o Heroku, excepto que nadie es realmente el dueño! Es mantenido por miles de personas conocidas como "mineros".

El panorama general es:

1 -- **Vamos a escribir un smart contract**. Ese contrato tendra toda la logica alrededor de nuestros dominios.

2 -- **Nuestro smart contract sera desplegado a la blockchain**. De esta manera, cualquiera en el mundo sera capaz de acceder y ejecutar nuestro smart contract — y les dejaremos crear dominios!

3 -- **Vamos a crear una pagina web que permitira que las personas facilmente creen dominios de nuestra colección.**

También recomiendo leer [esta](https://ethereum.org/en/developers/docs/intro-to-ethereum/) documentación cuando puedas por diversión. Está es la mejor guía para en internet para entender como funciona Ethereum en mi opinion!

### **⚙️** Configura el entorno local

Vamos a usar una herramienta llamada **Hardhat,** mucho, la cual nos permitira compilar smart contracts y probarlos de manera local. Primero, necesitas tener node/npm o node/yarn. Recomendamos usar Hardhat con la actual LTS Node.js (soporte de largo plazo) o podrías tener problemas! Puedes encontrar las versiones actuales [aquí](https://nodejs.org/en/about/releases/). Para descargar Node, puedes ir [aquí](https://nodejs.org/en/download/).

Siguiente, vamos a nuestra terminal (Git Bash no va a funcionar). Ve y usa `cd` para ir al directorio donde deseas trabajar. Una vez estes ahí ejecuta estos comandos:

```bash
mkdir cool-domains
cd cool-domains
npm init -y
npm install --save-dev hardhat
```

Tal vez veas un mensaje sobre vulnerabilidades después de que ejecutes el ultimo comando e instales Hardhat. Cada vez que installes algo de npm, se realiza una verificación de seguridad para ver si algunos de los paquetes de la librería que estas instalando tiene alguna vulnerabilidad reportada. Esto es más una advertencia para que estes conciente! Ejecutar `npx audit fix` puede romper cosas, así que es mejor simplemente saltarlo. Googlea sobre estás vulnerabilidades si quieres saber más!

### 🪄 Proyecto de ejemplo

Bien, ahora deberíamos tener Hardhat. Vamos a iniciar con el proyecto de ejemplo.

Run:

```bash
npx hardhat
```

Elige la opción “Create a basic sample project”(crea un proyecto basico de ejemplo). Di que si a todo.

El proyecto te pedira installar `hardhat-waffle` y `hardhat-ethers`. estás son otras herramientas que usaremos más tarde :).

Ve adelante e instala estás otras dependencias por si acaso no se instalaron automaticamente.

```bash
npm install --save-dev @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers
```

También querras instalar algo llamado **OpenZeppelin** la cual es otra libreria qué es usada bastante para desarrollar smart contracts seguros. Aprenderemos sobre ella más tarde. Por ahora, solo la instalaremos :).

```bash
npm install @openzeppelin/contracts
```

Finalmente, ejecuta `npx hardhat accounts` y esto debería mostrar un monton de strings que se veran algo así:

`0xa0Ee7A142d267C1f36714E4a8F75612F20a79720`

Estás son direcciones de Ethereum que Hardhat genera para nosotros para simular usuarios reales en la blockchain. Esto nos va a ayudar bastante en el proyecto cuando queramos simular usuarios creando dominios!

### **🌟 Ejecutalo**

Para asegurarse que todo funciona, ejecuta:

```bash
 npx hardhat compile
```

Y luego:

```bash
npx hardhat test
```

Deberías ver algo como esto:

![https://i.imgur.com/rjPvls0.png](https://i.imgur.com/rjPvls0.png)

Vamos a limpiar un poco.

Ve y abre el codigo del proyecto en tu editor de codigo favorito. Me gusta VSCode, queremos borrar todo el codigi inicial creado para nosotros. No necesitamos nada de eso. Somos pros!

Ve y borra esté archivo `sample-test.js` en el directorio `test`.  También, borra `sample-script.js` en `scripts`. Entonces, borra `Greeter.sol` en `contracts`. No elimines ninguno de estos directorios!

### **🚨 Antes que hagas click en "Siguiente lección"**

*Nota: Si no haces esto, Raza estara bastante triste :(.*

Ve a #progress y publica un screenshot de **tu** terminal mostrando el resultando de haber ejecutado `npx hardhat test`! Acabas de ejecutar un smart contract, eso es algo importante!! presumelo :).

P.S: Si **no** tienes acceso a #progress, asegurate de haber enlazado tu Discord, unete al Discord [aquí](https://discord.gg/buildspace), escribenos en #general te ayudaremos a conseguir acceso a los canales correctos!