export const trackEvent = (event: string, props?: Record<string, string>) => {
    if (typeof window.plausible === 'function') {
        window.plausible(event, { props });
    }
};