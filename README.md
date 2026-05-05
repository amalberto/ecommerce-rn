# Ecommerce React Native

Aplicacion movil ecommerce desarrollada con React Native y Expo. Incluye autenticacion, navegacion por categorias, detalle de productos, carrito persistente, ordenes, perfil de usuario, cache local con SQLite y sincronizacion remota con Firebase Realtime Database.

## Features

- Registro e inicio de sesion con Firebase Authentication.
- Productos y categorias sincronizados desde Firebase Realtime Database.
- Fallback offline con cache SQLite y datos semilla iniciales.
- Carrito administrado con Redux Toolkit y persistido en SQLite.
- Creacion y listado de ordenes en Firebase Realtime Database.
- Perfil de usuario guardado en SQLite y sincronizado con Firebase.
- Foto de perfil usando galeria o camara con `expo-image-picker`.
- Navegacion con stack y tabs usando React Navigation.
- Componentes reutilizables para botones, cards, categorias, carga y estados vacios.

## Librerias Usadas

- Expo: entorno de desarrollo y ejecucion React Native.
- React Navigation: navegacion por stacks y tabs.
- Redux Toolkit y React Redux: estado global y flujos asincronicos.
- Firebase JS SDK: Auth y Realtime Database.
- expo-sqlite: persistencia local entre reinicios.
- expo-image-picker: acceso a galeria y camara.
- AsyncStorage: persistencia de sesion para Firebase Auth en React Native.

## Instalacion

```bash
npm install
```

## Ejecutar Proyecto

```bash
npx expo start -c
```

Desde Expo se puede abrir en Android, iOS o Expo Go escaneando el QR.

## Configuracion Firebase

1. Crear un proyecto en Firebase Console.
2. Agregar una app web y copiar las credenciales.
3. Activar Authentication con Email/Password.
4. Crear una Realtime Database.
5. Crear un archivo `.env` basado en `.env.example`.

Expo inyecta estas variables publicas cuando se leen con dot notation directa, por ejemplo `process.env.EXPO_PUBLIC_FIREBASE_API_KEY`.

```env
EXPO_PUBLIC_FIREBASE_API_KEY=tu_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
EXPO_PUBLIC_FIREBASE_DATABASE_URL=https://tu_proyecto-default-rtdb.firebaseio.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

Estructura sugerida para Realtime Database:

```json
{
  "categories": {
    "zapatillas": {
      "id": "zapatillas",
      "title": "Zapatillas",
      "image": "https://..."
    }
  },
  "products": {
    "prod-1": {
      "id": "prod-1",
      "categoryId": "zapatillas",
      "title": "Zapatillas Urbanas",
      "description": "Zapatillas comodas para uso diario",
      "price": 75000,
      "stock": 10,
      "image": "https://..."
    }
  },
  "orders": {},
  "profiles": {}
}
```

## Estructura Del Proyecto

```text
src/
  app/              store Redux Toolkit
  components/       UI reutilizable
  constants/        colores y rutas
  data/             datos semilla offline
  db/               SQLite y repositorios locales
  features/         slices Redux por dominio
  firebase/         config y servicios Firebase
  navigation/       stacks y tabs
  screens/          pantallas auth, tienda y perfil
  utils/            formato y validaciones
```

## Flujo De La App

Login/Signup -> Home -> Categorias -> Productos -> Detalle -> Carrito -> Orden -> Perfil.

## Persistencia Y Offline

SQLite guarda el carrito, el perfil local y el ultimo catalogo cacheado. Si Firebase no esta configurado o no hay conexion, la app muestra el catalogo cacheado; si todavia no hay cache, usa datos semilla para mantener el flujo navegable.

## Autor

Alberto Aguirre
