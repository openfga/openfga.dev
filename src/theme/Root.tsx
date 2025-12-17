import React, { useEffect } from 'react';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

interface RootProps {
  children: React.ReactNode;
}

export default function Root({ children }: RootProps): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const { contentSecurityPolicy } = siteConfig.customFields;

  useEffect(() => {
    // Move Ask AI button to the absolute right after search bar
    const moveAskAIButton = () => {
      const navbarRight = document.querySelector('.navbar__items--right');
      const askAIWrapper = document.querySelector('.ask-ai-button-wrapper');

      if (navbarRight && askAIWrapper) {
        // Only move if it's not already the last child
        const lastChild = navbarRight.lastElementChild;
        if (lastChild !== askAIWrapper) {
          // Append to end to ensure it's after search
          navbarRight.appendChild(askAIWrapper);
          console.log('Ask AI button moved to the right, last child is now:', navbarRight.lastElementChild.className);
        }
      }
    };

    // Run immediately
    moveAskAIButton();

    // Run multiple times with different delays to catch async search bar loading
    setTimeout(moveAskAIButton, 50);
    setTimeout(moveAskAIButton, 100);
    setTimeout(moveAskAIButton, 250);
    setTimeout(moveAskAIButton, 500);
    setTimeout(moveAskAIButton, 1000);
    setTimeout(moveAskAIButton, 2000); // Add longer delay for search plugin

    const observer = new MutationObserver((mutations) => {
      const hasSearchContainer = mutations.some(mutation =>
        Array.from(mutation.addedNodes).some(node =>
          node instanceof Element &&
          (node.className?.includes('navbarSearchContainer') ||
           node.querySelector?.('[class*="navbarSearchContainer"]'))
        )
      );

      if (hasSearchContainer) {
        console.log('Search container detected, repositioning Ask AI button');
        setTimeout(moveAskAIButton, 50);
      } else {
        moveAskAIButton();
      }
    });

    const navbarRight = document.querySelector('.navbar__items--right');
    if (navbarRight) {
      observer.observe(navbarRight, { childList: true, subtree: true });
    }

    // Listen for route changes
    const handleRouteChange = () => {
      setTimeout(moveAskAIButton, 100);
      setTimeout(moveAskAIButton, 500);
    };
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      observer.disconnect();
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return (
    <div className="CustomizedRoot">
      <Head>
        <meta httpEquiv="Content-Security-Policy" content={contentSecurityPolicy as string} />
      </Head>
      {children}
    </div>
  );
}
