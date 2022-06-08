import React from 'react';

// Component to instruct reader for obtaining prerequisite for running the SDK
export function SdkSetupPrerequisite(): JSX.Element {
  return (
    // eslint-disable-next-line max-len
    <>
      Deploy an instance of the OpenFGA server, and have ready the values for your setup: FGA_STORE_ID, FGA_API_HOST
      and, if needed, FGA_API_TOKEN, FGA_API_ISSUER, FGA_API_AUDIENCE, FGA_CLIENT_ID and FGA_CLIENT_SECRET.
    </>
  );
}
