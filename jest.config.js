module.exports = {
  preset: '@react-native/jest-preset',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native|@react-native-community|react-redux|@reduxjs|redux|immer|react-native-progress)/)',
  ],
};
