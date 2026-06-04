# Dynamic Todo App

A polished React Native todo app built to demonstrate practical mobile app architecture: Redux state management, offline persistence, animated list interactions, progress tracking, dark/light theming, and a clean component structure.

## Features

- Add, edit, delete, and complete todos.
- Undo the most recently deleted todo.
- Hide editing for completed tasks.
- Persist todos locally with AsyncStorage.
- Validate persisted todo data before restoring it.
- Track completion progress with `react-native-progress`.
- Smooth todo row animations with `react-native-reanimated`.
- Global state with Redux Toolkit.
- System-aware light and dark themes.
- Centralized UI strings and theme color tokens.
- Keyboard-aware list layout for long todo lists.
- BootSplash integration.
- Shared app icon for Android and iOS.

## Tech Stack

- React Native
- TypeScript
- Redux Toolkit
- React Redux
- AsyncStorage
- react-native-progress
- react-native-reanimated
- react-native-bootsplash
- react-native-safe-area-context

## Project Structure

```txt
src/
  components/
    ProgressSummary.tsx
    TodoInput.tsx
    TodoItem.tsx
  constants/
    strings.ts
  store/
    index.ts
    todoSlice.ts
  theme/
    theme.tsx
  types/
    todo.ts
  utils/
    storage.ts
```

## Local Setup

Make sure your React Native environment is ready before running the app:

- Node.js `>= 22.11.0`
- Android Studio and an Android emulator for Android
- Xcode and CocoaPods for iOS

Install dependencies:

```sh
npm install
```

For iOS, install pods:

```sh
cd ios
bundle install
bundle exec pod install
cd ..
```

## Run Locally

Start Metro:

```sh
npm start
```

In a second terminal, run Android:

```sh
npm run android
```

Or run iOS:

```sh
npm run ios
```

You can also open the native projects directly:

- Android: `android/` in Android Studio
- iOS: `ios/todo.xcworkspace` in Xcode

## Quality Checks

Run lint:

```sh
npm run lint
```

Run TypeScript validation:

```sh
npx tsc --noEmit
```

Run tests, if test files are added:

```sh
npm test
```

## Implementation Notes

Todos are stored in Redux and persisted through AsyncStorage after hydration. Saves are debounced to avoid unnecessary writes during rapid changes. Stored data is validated before being restored into state, which keeps the app resilient if local storage contains malformed data.

The progress summary derives completed count and percentage from the todo list using memoization. Todo rows are memoized and receive stable callbacks from the parent list, keeping rendering efficient as the list grows.

The app theme follows the system color scheme. UI strings and colors are centralized so components stay readable and maintainable.
