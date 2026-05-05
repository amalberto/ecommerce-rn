# Comparative Audit: mundoGeek-rn-79205

Reference repository: `https://github.com/pablormacia/mundoGeek-rn-79205`

Reference commit reviewed: `284f4d9dd81e4cf3464b822ccd642623142b1c54`

This audit uses the reference project only as a technical and academic comparison. No project code was copied literally.

## 1. Useful Patterns From The Reference Project

- Simple React Navigation organization with bottom tabs and dedicated stack navigators for shop, cart, and profile.
- RTK Query service colocated under `src/services`, registered in the Redux store through `shopApi.reducer` and `shopApi.middleware`.
- Firebase Realtime Database REST queries using `.json` endpoints and a category-filter endpoint with `orderBy` and `equalTo`.
- Redux Toolkit used for local UI/shop state and cart state, while remote catalog data comes from RTK Query.
- Reusable visual wrappers/components used to reduce repeated screen markup.
- Device feature implemented with `expo-image-picker` in the profile flow.

## 2. What This Project Already Does Well

- Starts directly in the ecommerce flow through `MainTabs`; there is no `AuthStack`, login gate, Login screen, or Signup screen.
- Uses RTK Query for Firebase Realtime Database data and keeps Redux slices focused on local cart/profile state.
- Provides more complete Firebase endpoints than the reference: products, single product, products by category, categories, orders, and order creation.
- Preserves SQLite for cart persistence, local profile persistence, and cached product/category fallback.
- Uses reusable components such as `ProductCard`, `CategoryItem`, `CartItem`, `OrderItem`, `PrimaryButton`, `LoadingView`, `ErrorState`, and `EmptyState`.
- Main collection screens already use `FlatList` and clear loading/empty/error states.
- Camera and gallery permissions are handled before launching `expo-image-picker`.

## 3. Improvements Safely Adapted

- Kept the reference idea of an explicit `getProductsByCategory` RTK Query endpoint, adapted to this project's `categoryId` data model.
- Improved Firebase response normalization so Firebase object maps become arrays with stable string ids.
- Added more precise RTK Query cache tags for list endpoints and order invalidation.
- Kept the route-based category/product flow instead of adding selected remote data slices.
- Added lightweight `FlatList` tuning (`initialNumToRender`, `windowSize`, `removeClippedSubviews`) to the main list screens.
- Simplified Firebase environment configuration to the only value required by this app: `EXPO_PUBLIC_FIREBASE_DATABASE_URL`.
- Updated documentation to state clearly that Firebase Auth is intentionally not used.

## 4. Things From The Reference Project Not Replicated

- Firebase Authentication was not copied because the updated rubric requires Firebase to be data-only through RTK Query.
- No Login, Signup, Auth stack, or authentication guard was added.
- The reference profile location feature was not copied because this submission already satisfies the device-interface requirement with camera/gallery and adding location would introduce extra scope and dependency surface.
- The reference `shopSlice` selected-category/product pattern was not copied because navigation params and RTK Query already keep the data flow clearer here.
- `react-native-vector-icons` was not added because it is unnecessary for the current rubric and would add a dependency without solving a delivery risk.
- The reference's more minimal README was not copied; this project needs clearer rubric, SQLite, RTK Query, and no-auth documentation.

## 5. Concrete Changes Required For Rubric Match

- Keep Firebase as Realtime Database REST data only through `src/services/shopApi.js`.
- Keep `shopApi.reducer` and `shopApi.middleware` registered in `src/app/store.js`.
- Keep Redux Toolkit slices for local cart and profile state.
- Keep SQLite helpers under `src/db` and use them in cart/profile/cache flows.
- Keep `expo-image-picker` and the `expo-image-picker` Expo config plugin.
- Keep `npx expo start -c` as the documented startup command.
- Keep `.env` ignored and `.env.example` tracked.
- Continue avoiding Auth screens, Auth stack, Firebase SDK Auth imports, and manual remote-data slices/thunks.