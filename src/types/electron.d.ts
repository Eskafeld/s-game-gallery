
declare global {
  interface Window {
    electronAPI?: {
      saveHTMLFile: (htmlContent: string, filename: string) => Promise<{
        success: boolean;
        path?: string;
        cancelled?: boolean;
        error?: string;
      }>;
    };
  }
}

export {};
