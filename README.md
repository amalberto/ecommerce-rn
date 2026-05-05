# Ecommerce React Native

Aplicacion movil ecommerce desarrollada con Expo y React Native. La app abre directamente en la experiencia de tienda, permite navegar categorias y productos, administrar un carrito persistente, crear ordenes en Firebase Realtime Database, editar un perfil local y seleccionar una foto con camara o galeria.

## Features

- Catalogo de categorias y productos desde Firebase Realtime Database.
- Consumo remoto con RTK Query y endpoints REST de Firebase.
- Fallback offline con cache local SQLite y datos semilla.
- Carrito global con Redux Toolkit y persistencia SQLite.
- Creacion y listado de ordenes usando RTK Query.
- Perfil local editable guardado con SQLite.
- Foto de perfil con camara o galeria usando `expo-image-picker`.
- Navegacion con React Navigation, tabs y stacks.
- Listas optimizadas con `FlatList`.
- Componentes reutilizables para productos, categorias, carrito, ordenes, botones, carga, error y estados vacios.

## Tecnologias Usadas

- Expo SDK 54.
- React Native.
- React Navigation.
- Redux Toolkit.
- RTK Query.
- Firebase Realtime Database REST API.
- expo-sqlite.
- expo-image-picker.

## Instalacion

```bash
npm install
```

## Configuracion De Entorno

Crear un archivo `.env` en la raiz del proyecto basado en `.env.example`.

```env
EXPO_PUBLIC_FIREBASE_API_KEY=tu_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=ecommerce-rn-final.firebaseapp.com
EXPO_PUBLIC_FIREBASE_DATABASE_URL=https://ecommerce-rn-final-default-rtdb.firebaseio.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=ecommerce-rn-final
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=ecommerce-rn-final.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

Expo inyecta variables publicas cuando se leen con dot notation directa, por ejemplo `process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL`.

## Ejecutar Proyecto

```bash
npx expo start -c
```

La opcion `-c` limpia la cache de Metro para asegurar que Expo tome el `.env` actualizado.

## Uso De Firebase

Firebase se usa solo como fuente de datos. La app no usa Firebase Authentication y no requiere login para navegar ni comprar.

RTK Query consume Realtime Database con estos paths REST:

- `/categories.json`
- `/products.json`
- `/products/{productId}.json`
- `/orders.json`

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
  "orders": {}
}
```

Para una demo sin autenticacion, las reglas de Realtime Database deben permitir lectura de `categories`, `products` y `orders`, y escritura en `orders`.

## RTK Query

El servicio esta en `src/services/shopApi.js` y exporta hooks generados:

- `useGetProductsQuery`
- `useGetProductQuery`
- `useGetCategoriesQuery`
- `useGetOrdersQuery`
- `useCreateOrderMutation`

`shopApi.reducer` y `shopApi.middleware` estan registrados en `src/app/store.js`.

## SQLite

SQLite se inicializa en `src/db/database.js` y persiste:

- `cart_items`: carrito local.
- `profile`: perfil local y foto seleccionada.
- `cached_categories`: ultimo catalogo de categorias.
- `cached_products`: ultimo catalogo de productos.

Cuando RTK Query obtiene productos o categorias desde Firebase, la app actualiza el cache SQLite. Si Firebase no responde, las pantallas usan cache local; si aun no existe cache, usan datos semilla.

## Camara Y Galeria

La pantalla `EditProfileScreen` usa `expo-image-picker` para seleccionar una imagen desde galeria o tomar una foto con camara. Los permisos estan configurados en `app.json`.

## Navegacion

La app abre directamente en el flujo ecommerce. No hay pantalla obligatoria de login.

```text
MainTabs
  ShopStack
    Home
    Category
    ProductDetail
  Cart
  Orders
  ProfileStack
    Profile
    EditProfile
```

## Estructura Del Proyecto

```text
src/
  app/          store Redux Toolkit y RTK Query
  components/   UI reutilizable
  constants/    colores y rutas
  data/         datos semilla offline
  db/           SQLite y repositorios locales
  features/     slices locales Redux Toolkit
  firebase/     configuracion de entorno Firebase
  hooks/        hooks para cache/fallback local
  navigation/   tabs y stacks
  screens/      pantallas ecommerce y perfil
  services/     RTK Query API service
  utils/        formato y validaciones
```

## Final Project Rubric Compliance

- Optimized lists: implementadas con `FlatList` en catalogo, categorias, carrito y ordenes.
- Reusable components: `ProductCard`, `CategoryItem`, `CartItem`, `OrderItem`, `PrimaryButton`, `LoadingView`, `ErrorState` y `EmptyState`.
- Navigation: implementada con React Navigation, tabs y native stacks.
- State management: `useState` para estado local de UI/perfil e imagen; Redux Toolkit para carrito y perfil global/local.
- Firebase: usado solo como fuente de datos mediante RTK Query y Realtime Database REST API.
- Authentication: removida; la app no requiere login.
- Device interface: implementada con `expo-image-picker` para camara y galeria.
- Local persistence: implementada con SQLite para carrito, perfil y cache offline.
- Startup: preparado para iniciar con `npx expo start -c`.

## Autor

Alberto Aguirre
