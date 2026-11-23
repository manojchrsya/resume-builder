# Firebase setup

The builder syncs one resume per signed-in user to
`users/{firebaseUid}/resumes/default`. The document contains the resume title,
the builder data, and created/updated timestamps. After sign-in, the builder
compares the current browser draft with that user's saved resume:

- If both contain resume data, it asks whether to use the Google account copy or
  sync this device's copy.
- If only the browser has resume data, it syncs that draft to the account.
- If only the account has resume data, it replaces the local draft and loads
  the sections from Firestore.
- If neither contains resume data, it leaves the blank draft alone.

The PDF is generated in the browser.

## Firebase project

1. Create a Firebase project and register a Web app.
2. In **Authentication → Sign-in method**, enable **Google**.
3. In **Authentication → Settings → Authorized domains**, add
   `manojchrsya.github.io` (or the domain serving this app).
4. Create a Cloud Firestore database.
5. Publish the rules from [`firestore.rules`](./firestore.rules).

## Local development

Copy `.env.example` to `.env.local` and fill in the Web app's API key, Auth
domain, project ID, and app ID. Restart the Vite dev server after changing
these values.

## GitHub Pages deployment

In the repository's **Settings → Secrets and variables → Actions**, add these
repository secrets using the same values from the Firebase Web app config:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_APP_ID`

The Pages workflow injects them at build time. Firebase Web app configuration
is used by the browser and is not a server credential; Firestore access is
protected by the authenticated-user rules.
