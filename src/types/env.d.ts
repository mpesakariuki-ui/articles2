declare global {
  namespace NodeJS {
    interface ProcessEnv {
      FIREBASE_SERVICE_ACCOUNT_KEY: string;
      FIREBASE_PROJECT_ID: string;
    }
  }
}
