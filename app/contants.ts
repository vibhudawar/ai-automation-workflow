declare global {
  interface Window {
   google: {
    accounts: {
     oauth2: {
      initTokenClient: (config: {
       client_id: string;
       scope: string;
       callback: (response: any) => void;
      }) => {
       requestAccessToken: () => void;
      };
     };
    };
   };
  }
 }


export const workflows = [
  {
    id: 1,
    card_title: "Job Application",
    card_description: "Explore bulk job application",
    button_text: "Explore Workflow",
    badges: ["LinkedIn", "Indeed", "Remote", "Full-time"]
  },
  {
    id: 2,
    card_title: "Job Application",
    card_description: "Explore bulk job application",
    button_text: "Explore Workflow",
    badges: ["LinkedIn", "Indeed", "Remote", "Full-time"]
  }
];