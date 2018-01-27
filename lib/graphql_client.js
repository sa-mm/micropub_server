import fetch from "node-fetch";
import ApolloClient from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { ApolloLink, concat } from "apollo-link";
import { InMemoryCache } from "apollo-cache-inmemory";

const { GRAPHCMS_BLOG_AUTH_TOKEN, GRAPHCMS_URI } = process.env;

const httpLink = new HttpLink({
  uri: GRAPHCMS_URI,
  fetch: fetch
});

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext({
    headers: {
      authorization: `Bearer ${GRAPHCMS_BLOG_AUTH_TOKEN}`
    }
  });

  return forward(operation);
});

const client = new ApolloClient({
  link: concat(authMiddleware, httpLink),
  cache: new InMemoryCache()
});

const Lokka = require("lokka").Lokka;
const Transport = require("lokka-transport-http").Transport;

const headers = {
  Authorization: `Bearer ${process.env.GRAPHCMS_BLOG_AUTH_TOKEN}`
};

export const lokkaClient = new Lokka({
  transport: new Transport(process.env.GRAPHCMS_URI, { headers })
});

export default client;
