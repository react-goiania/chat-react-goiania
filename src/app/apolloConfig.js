import { split, HttpLink, ApolloClient, InMemoryCache } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { setContext } from "@apollo/client/link/context";

const urls = {
  ws: "wss://websocket.reactgoiania.com/",
  http: "https://graphql.reactgoiania.com/graphql",
};

const apolloConfigData = {
  apolloClient: null,
  connectionParams: {},
};

export const buildConnectionParams = () => ({});

apolloConfigData.connectionParams = buildConnectionParams();

const wsClient = () =>
  createClient({
    url: urls.ws,
    lazy: true,

    connectionParams: async () => apolloConfigData.connectionParams,
  });

export const wsLink = () => new GraphQLWsLink(wsClient());

export const httpLink = new HttpLink({
  uri: urls.http,
});

export const authLink = () =>
  setContext(async ({ headers }) => ({
    headers: {
      ...headers,
    },
    connectionParams: {
      ...headers,
    },
  }));

export const splitLink = () =>
  split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    wsLink(),
    httpLink
  );

export const client = () =>
  new ApolloClient({
    link: authLink().concat(splitLink()),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            findCheckinsByUser: {
              merge(_, incoming) {
                return incoming;
              },
            },
          },
        },
      },
    }),
    headers: {},
  });

apolloConfigData.apolloClient = client();

export default apolloConfigData;
