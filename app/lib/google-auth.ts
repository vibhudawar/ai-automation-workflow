export const initializeGoogleClient = (callback: (response: any) => void) => {
  window.google.accounts.oauth2.initTokenClient({
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
    scope: GMAIL_SCOPES.replace(/\s+/g, ' ').trim(),
    callback,
  });
};


export const GMAIL_SCOPES = `
  https://www.googleapis.com/auth/gmail.send
      https://www.googleapis.com/auth/gmail.readonly
      https://www.googleapis.com/auth/gmail.modify
      https://www.googleapis.com/auth/gmail.compose
      https://www.googleapis.com/auth/gmail.metadata
      https://www.googleapis.com/auth/gmail.insert
      https://www.googleapis.com/auth/gmail.settings.basic
      https://www.googleapis.com/auth/gmail.settings.sharing
      https://www.googleapis.com/auth/gmail.addons.current.action.compose
      https://www.googleapis.com/auth/gmail.addons.current.message.action
      https://www.googleapis.com/auth/gmail.labels
      https://www.googleapis.com/auth/userinfo.email
      https://www.googleapis.com/auth/userinfo.profile
      openid
      https://www.googleapis.com/auth/gmail.addons.current.message.metadata
      https://www.googleapis.com/auth/gmail.addons.current.message.readonly
`;