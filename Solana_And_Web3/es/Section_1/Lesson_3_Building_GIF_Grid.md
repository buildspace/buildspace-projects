¡Seguimos avanzando! Lo que hemos logrado es: configurar nuestra aplicación React, crear un botón de conexión a la billetera, configurar una representación condicional basada en el estado de la cartera Solana del usuario.

¡En nuestro portal GIF queremos poder mostrar los GIF que las personas envían a nuestra aplicación!

Necesitamos construir la interfaz de usuario para manejar esto. Como aún no hemos escrito nuestro programa Solana, vamos a usar datos de prueba para asegurarnos de que todo funcione como se espera. Entonces todo lo que tendremos que hacer es llamar al programa más tarde desde nuestra aplicación (más sobre esto pronto).

### 🧪 Visualización de datos de prueba

Para comenzar, deberíamos analizar sobre cuándo en qué momento queremos que se procese nuestra cuadrícula de GIF. Si lo piensas, la única vez que se mostrará nuestra cuadrícula GIF es **cuando el usuario ya se haya conectado y haya autorizado su cartera a nuestra aplicación.**

Entonces, comencemos por hacer algunos datos de prueba para eliminar esa primera condición. Nuevamente, actualizaremos esto más adelante en el proyecto para usar los datos en el programa Solana en lugar de los de la interfaz.

¡Espera y confía en mi aquí!

En la parte superior de su archivo en `App.js`, continúa y creemos la propiedad llamada `TEST_GIFS`. ¡En esta propiedad, la vamos a llenar con nuestros GIF favoritos!

Voy a construir el mío con esto: **[Squid Game](https://en.wikipedia.org/wiki/Squid_Game) 🦑.**

```javascript
const TEST_GIFS = [
	'https://i.giphy.com/media/eIG0HfouRQJQr1wBzz/giphy.webp',
	'https://media3.giphy.com/media/L71a8LW2UrKwPaWNYM/giphy.gif?cid=ecf05e47rr9qizx2msjucl1xyvuu47d7kf25tqt2lvo024uo&rid=giphy.gif&ct=g',
	'https://media4.giphy.com/media/AeFmQjHMtEySooOc8K/giphy.gif?cid=ecf05e47qdzhdma2y3ugn32lkgi972z9mpfzocjj6z1ro4ec&rid=giphy.gif&ct=g',
	'https://i.giphy.com/media/PAqjdPkJLDsmBRSYUp/giphy.webp'
]
```

Este es tu momento para divertirte. Agrega todos los GIF que quieras a la lista de prueba y que sean del tema que quieras.
Tal vez quieras que este sitio web sea solo de GIF con temas de anime. Tal vez quieras que solo sean GIF con temas de películas. Tal vez solo quieras GIF con temas de videojuegos.

**Cambie el título y la descripción del sitio web para que coincida con el tipo de GIF que deseas que las personas envíen.**

```jsx
// Change this stuff. Make it themed to something you're interested in.
// Ex. memes, music, games, cute animals, whatever!
<p className="header">🖼 GIF Portal</p> 
<p className="sub-text">
  View your GIF collection in the metaverse ✨
</p>
```

Sé que suena tonto, pero estos pequeños cambios en realidad harán que su sitio sea un poco más divertido. Y te motivará a terminarlo por completo.

MUY BIEN. Tenemos algunos GIF picantes para probar nuestra aplicación ahora. Entonces, ¿cómo vamos a mostrar realmente estos datos? ¿Recuerdas cuando escribimos la función `renderNotConnectedContainer`? Vamos a tomar el mismo enfoque esta vez, ¡pero rendericemos nuestra cuadrícula de GIF en su lugar!

Comencemos creando una nueva función llamada `renderConnectedContainer` justo debajo de `renderNotConnectedContainer`. Esto tendrá un código de interfaz de usuario simple que se mapeará a través de todos nuestros enlaces GIF y los representará:

```jsx
const renderConnectedContainer = () => (
  <div className="connected-container">
    <div className="gif-grid">
      {TEST_GIFS.map(gif => (
        <div className="gif-item" key={gif}>
          <img src={gif} alt={gif} />
        </div>
      ))}
    </div>
  </div>
);
```

¡Casi lo logramos! ¡Probablemente guardaste el archivo y todavía no se ve nada en tu aplicación! Recuerda: ¡estos métodos de renderizado deben **llamarse** para ejecutarse! Vamos a donde agregamos `{!walletAddress && renderNotConnectedContainer()}`.

Si solo queremos que esto se muestre cuando el usuario está conectado a nuestra aplicación, ¿qué propiedad podemos usar para decidir esto? Probablemente la `walletAddress`, ¿verdad? ¡Si tenemos una `walletAddress` eso debe significar que tenemos una billetera conectada! Muy bien.

Entonces, justo debajo de donde se le llama `renderNotConnectedContainer`, sigamos adelante y agreguemos esto:

```javascript
return (
  <div className="App">
    <div className="container">
      <div className="header-container">
        <p className="header">🖼 GIF Portal</p>
        <p className="sub-text">
          View your GIF collection in the metaverse ✨
        </p>
        {!walletAddress && renderNotConnectedContainer()}
        {/* We just need to add the inverse here! */}
        {walletAddress && renderConnectedContainer()}
      </div>
      <div className="footer-container">
        <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
        <a
          className="footer-text"
          href={TWITTER_LINK}
          target="_blank"
          rel="noreferrer"
        >{`built on @${TWITTER_HANDLE}`}</a>
      </div>
    </div>
  </div>
);
```

*** AHORA, *** si guardas el archivo con estos cambios, deberías ver todos tus hermosos GIF 😮.

*Nota: si tu conexión a Internet es lenta, los GIF pueden tardar un poco en cargarse.*

Todo parece "funcionar". Te proporcioné algunos estilos para esta aplicación, en `App.css`, para que no tengas que preocuparte demasiado por estos temas.
En este punto, deberás realizar algunos cambios en este archivo. Aquí es donde vivirá todo tu estilo. Pensé que este tipo de formato se vería genial, ¡pero es posible que tengas otra configuración que sea aún mejor!

![https://i.imgur.com/PtpFGIa.png](https://i.imgur.com/PtpFGIa.png)

Por ejemplo, si tu aplicación web es un lugar donde las personas envían GIF de animales lindos, entonces tal vez la sensación de modo oscuro del sitio web en este momento realmente no funcione. Tú decides. Cámbialo como quieras.

### 🔤 Creando un cuadro de entrada GIF

**Nuestra aplicación está tomando forma, y estamos a unos 10 minutos de comenzar a escribir nuestro primer programa Solana que impulsará nuestra aplicación web con datos reales en lugar de datos de prueba codificados.**

Tómate un momento para mirar la magia que has creado :).

Estas son cosas que **MUCHÍSIMAS** de personas en el mundo desearían saber cómo hacer. La mayoría de la gente solo habla de estas cosas en Twitter. Pero, en realidad estás tomando los pasos para hacerlo. Siéntete orgulloso, mi amigo.

Es hora de que vayamos pensando en cómo las otras personas pueden agregar sus propios GIF a nuestra aplicación. Vamos a adoptar un enfoque de entrada aquí. Cuando alguien visite la aplicación, podrá agregar un enlace a su GIF favorito que luego llamará a nuestro programa Solana para que se encargue del resto. Por ahora, vamos a configurar la entrada y la acción que se llamará aquí.

Comencemos con la entrada. Queremos que este cuadro de entrada se muestre cuando el usuario haya conectado su cartera a nuestra aplicación. Entonces, eso significa que queremos agregar este código a nuestro método de procesamiento `renderConnectedContainer`:

```jsx
const renderConnectedContainer = () => (
  <div className="connected-container">
    {/* Go ahead and add this input and button to start */}
    <form
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <input type="text" placeholder="Enter gif link!" />
      <button type="submit" className="cta-button submit-gif-button">Submit</button>
    </form>
    <div className="gif-grid">
      {TEST_GIFS.map((gif) => (
        <div className="gif-item" key={gif}>
          <img src={gif} alt={gif} />
        </div>
      ))}
    </div>
  </div>
);
```

Lo importante que agregamos aquí es un cuadro de `entrada` y un `botón` de envío.

Puedes escribir en este cuadro de entrada y hacer clic en el botón o presionar Intro, ¡pero no sucede nada! Todavía tenemos que escribir la lógica y conectarla para el envío del formulario.

Para esto, vamos a usar un par de nuevos atributos que son geniales.

`onChange` es una función que se activa cada vez que cambia el valor del cuadro de entrada. Nuevamente, si ya eres un React Pro, puedes continuar sin ver estas cosas.

Para que esto funcione correctamente, necesitaremos crear una nueva propiedad de estado llamada `inputValue`. Empecemos por ahí -

Justo debajo de `const [walletAddress, setWalletAddress] = useState(null);` agrega esto:

```javascript
const [inputValue, setInputValue] = useState('');
```

FÁCIL. ¡Ahora sólo tenemos que conectar esto a nuestro elemento de entrada! Vamos al elemento `input` y cámbialo para que se vea así:

```jsx
<input
  type="text"
  placeholder="Enter gif link!"
  value={inputValue}
  onChange={onInputChange}
/>
```

Probablemente verás que hay un error aquí que dice `onInputChange is not defined.` y `inputValue is not defined.` Bueno, esa es una solución fácil, ¡vamos a definir esto!
Justo debajo de la función `connectWallet` agrega esto:

```javascript
const onInputChange = (event) => {
  const { value } = event.target;
  setInputValue(value);
};
```

Esta función súper simple se activará a medida que escriba algo en el cuadro de entrada y luego establezca el valor de esta en nuestra propiedad `inputValue`. De esta manera, cuando estemos listos para enviar nuestro enlace GIF a nuestro programa Solana, podemos acceder fácilmente a esa propiedad para obtener el valor.

Finalmente, conectemos el envío del formulario. Hay que crear una nueva función bajo la acción `connectWallet` llamada `sendGif`:

```javascript
const sendGif = async () => {
  if (inputValue.length > 0) {
    console.log('Gif link:', inputValue);
  } else {
    console.log('Empty input. Try again.');
  }
};
```

En primer lugar, estamos haciendo esta función `asincrónica` para más tarde cuando terminemos de agregar la interacción con nuestro programa Solana.

Luego, vamos a verificar si hay algún valor de entrada en nuestro cuadro de entrada. Si hay otro enlace imprima el GIF, imprímelo vacío. Nuevamente, revisaremos esta función más adelante para hacer la implementación completa :).

*** SI SEÑOR ***. ¡Así que adelante, agrega un enlace GIF al cuadro de entrada y abre la consola! Una vez que presione el botón de enviar, deberás ver `Gif link: YOUR_GIF_LINK`.

¿no pasó nada?

¡Eso es porque todavía necesitamos llamar a este método en el atributo `onSubmit` en nuestro formulario! Eso es fácil. Actualiza el controlador `onSubmit` para llamar a nuestro nuevo método `sendGif`.

```jsx
<form
  onSubmit={(event) => {
    event.preventDefault();
    sendGif();
  }}
>
```

¡Inténtalo una vez más y ahora deberás ver el enlace impreso en la consola!

### 🌈 Establecer datos GIF en el estado

Antes de pasar a la parte de Solana, necesitamos configurar una cosa más... ¡cómo recuperar nuestros datos en carga! En este momento, simplemente estamos renderizando ciegamente `TEST_GIFS`.

El flujo debe verse así:

1. Abrir la aplicación web.
2. Conectar la cartera digital.
3. Obtener la lista de GIF del programa Solana una vez que la cartera esté conectada.

Dado que tenemos esta configuración de datos de prueba, podemos simular fácilmente esta recuperación, por lo que es simplemente conectar y usar cuando estemos listos para llamar a nuestro programa.

** Estamos haciendo un montón de configuración aquí. ¿Por qué? Porque valdrá la pena más tarde no preocuparse por estas cosas. ** Solana no es muy fácil, especialmente si eres nuevo en Rust. Por lo tanto, es mejor configurar cosas de interfaz de usuario que pueden parecer tontas para que después podamos centrarnos completamente en nuestro programa Solana.

Genial, hagamos esto. Vamos a mantener nuestra lista de GIF en una propiedad de estado en nuestro componente.

Entonces, comencemos creando esta propiedad de estado justo debajo de nuestra declaración `walletAddress`:

```javascript
// State
const [walletAddress, setWalletAddress] = useState(null);
const [inputValue, setInputValue] = useState('');
const [gifList, setGifList] = useState([]);
```

Luego, vamos a configurar otro `useEffect` que será llamado cuando cambie el estado de nuestra `walletAddress`. Recuerda, solo queremos obtener nuestra lista de GIF cuando un usuario ha conectado su cartera a nuestra aplicación.

Justo debajo de tu `useEffect` actual **crea otro** `useEffect`.

```jsx
useEffect(() => {
  const onLoad = async () => {
    await checkIfWalletIsConnected();
  };
  window.addEventListener('load', onLoad);
  return () => window.removeEventListener('load', onLoad);
}, []);

useEffect(() => {
  if (walletAddress) {
    console.log('Fetching GIF list...');
    
    // Call Solana program here.

    // Set state
    setGifList(TEST_GIFS);
  }
}, [walletAddress]);
```

Todo lo que queremos aquí es que si tenemos una "dirección de cartera", avanza y ejecuta nuestra lógica de búsqueda. ¡En este momento, solo vamos a configurar nuestros datos de prueba ya que aún no hemos configurado la interacción con nuestro programa!

Entonces, una vez que nuestros datos de prueba están configurados, ¡queremos usarlos! Para esto vamos a regresar a la función `renderConnectedContainer` y hacer un cambio de tan sólo una línea:

```jsx
const renderConnectedContainer = () => (
    <div className="connected-container">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          sendGif();
        }}
      >
        <input
          type="text"
          placeholder="Enter gif link!"
          value={inputValue}
          onChange={onInputChange}
        />
        <button type="submit" className="cta-button submit-gif-button">
          Submit
        </button>
      </form>
      <div className="gif-grid">
        {/* Map through gifList instead of TEST_GIFS */}
        {gifList.map((gif) => (
          <div className="gif-item" key={gif}>
            <img src={gif} alt={gif} />
          </div>
        ))}
      </div>
    </div>
  );
```

Ahora vamos a agregar algunas líneas a sendGif() para que cuando envíe el formulario, agregue el GIF a gifList y se borre el campo de texto:

```javascript
const sendGif = async () => {
  if (inputValue.length > 0) {
    console.log('Gif link:', inputValue);
    setGifList([...gifList, inputValue]);
    setInputValue('');
  } else {
    console.log('Empty input. Try again.');
  }
};
```

Así de fácil. Ahora, cuando cambiemos nuestro `useEffect` para obtener la lista de GIF de nuestro programa Solana, ¡lo tendremos todo listo para ser renderizado!
**¡Esta es la base de nuestra aplicación web! GENIAL.**

Ahora vamos a empezar a construir muchas cosas en nuestro programa Solana. Volveremos a React de vez en cuando para realizar algunas pruebas y configurar las piezas finales de nuestra aplicación descentralizada 🌌

### 🚨 Reporte de avances

*Por favor haz esto sino Farza se pondrá triste :(*

Publique una captura de pantalla de su cuadrícula GIF épica para que todos la vean en `#progress` :).
