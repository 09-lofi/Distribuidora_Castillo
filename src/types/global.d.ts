export {};

declare global {
    interface Window {
        gtag: (command: string, eventName: string, params?: any) => void;
    }

    interface Window {
        dataLayer: any[];
    }
}

export {};