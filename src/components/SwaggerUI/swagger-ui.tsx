import * as React from 'react';

import SwaggerUIComponent from 'swagger-ui-react';

import './swagger-ui-override.css';
import './swagger-ui-feature-override.css';

const DisableAuthorizePlugin = function () {
  return {
    wrapComponents: {
      // eslint-disable-next-line react/display-name
      authorizeBtn: () => () => null,
    },
  };
};

type SwaggerUIProps = {
  apiDocsBasePath: string;
};

const SwaggerUI: React.FC<SwaggerUIProps> = ({ apiDocsBasePath }) => {
  return (
    <SwaggerUIComponent
      plugins={[SwaggerUIComponent.plugins.DownloadUrl, DisableAuthorizePlugin]}
      url={apiDocsBasePath}
      presets={[SwaggerUIComponent.presets.apis]}
      deepLinking
      supportedSubmitMethods={[]}
      tryItOutEnabled={false}
      responseInterceptor={(response) => {
        if (response.body.tags && response.body.tags.length > 0) {
          response.body.tags = [
            { name: 'Stores' },
            { name: 'Authorization Models' },
            { name: 'Relationship Tuples' },
            { name: 'Relationship Queries' },
            { name: 'Assertions' },
            // All other tags will appear after these tags.
          ];
        }

        response.text = JSON.stringify(response.body);
        return response;
      }}
    />
  );
};

export { SwaggerUI };
