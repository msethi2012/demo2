import React from 'react';
import { render } from 'react-dom';
import './index.css';
import App from './App';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";

const client = new ApolloClient({
    uri: "https://api.github.com/graphql",
    request: operation => {
        operation.setContext({
            headers: {
                authorization: `Bearer 876487a587e4f79ef137e7f4513609bc27d34986`
            },
        });
    }
});

render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>, document.getElementById('root'));
