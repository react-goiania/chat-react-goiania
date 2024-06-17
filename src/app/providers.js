"use client";

import apolloConfigData from "./apolloConfig";

const { ApolloProvider } = require("@apollo/client");

function Providers({ children }) {
  return (
    <ApolloProvider client={apolloConfigData.apolloClient}>
      {children}
    </ApolloProvider>
  );
}

export default Providers;
