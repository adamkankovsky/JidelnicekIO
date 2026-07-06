import { ScrollViewStyleReset } from 'expo-router/html';
import type { ReactNode } from 'react';

export default function Root({ children }: { children: ReactNode }) {
  const baseUrl = process.env.EXPO_PUBLIC_DEPLOY_TARGET === 'github-pages' ? '/JidelnicekIO' : '';

  return (
    <html lang="cs">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        <meta name="theme-color" content="#2D6A4F" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Jídelníček" />
        <link rel="apple-touch-icon" href={`${baseUrl}/icons/icon-192.svg`} />

        <link rel="manifest" href={`${baseUrl}/manifest.json`} />

        <ScrollViewStyleReset />

        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />
        <script dangerouslySetInnerHTML={{ __html: swRegistration(baseUrl) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

function swRegistration(baseUrl: string): string {
  return `
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('${baseUrl}/sw.js', { scope: '${baseUrl}/' })
      .then(function(reg) {
        console.log('SW registered, scope:', reg.scope);
      })
      .catch(function(err) {
        console.warn('SW registration failed:', err);
      });
  });
}`;
}

const responsiveBackground = `
body {
  background-color: #F8FAF9;
}
@media (prefers-color-scheme: dark) {
  body {
    background-color: #1B4332;
  }
}`;
