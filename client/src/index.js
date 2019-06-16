import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import './index.css';
import App from './Components/App';
import withSession from './Components/withSession';
import Navbar from './Components/Navbar';

import AddRecipe from './Components/Recipe/AddRecipe';
import RecipePage from './Components/Recipe/RecipePage';
import Profile from './Components/Profile/Profile';

import Signin from './Components/Auth/Signin';
import Signup from './Components/Auth/Signup';
import Search from './Components/Recipe/Search';

const client = new ApolloClient({
  uri: 'http://localhost:4444/graphql',
  fetchOptions: {
    credentials: 'include',
  },
  request: operation => {
    const token = localStorage.getItem('token');
    operation.setContext({
      headers: {
        authorization: token,
      },
    });
  },
  onError: ({ networkError }) => {
    if (networkError) {
      console.log('Network Error', networkError);

      // if (networkError.statusCode === 401) {
      //   localStorage.removeItem('token');
      // }
    }
  },
});

const Root = ({ refetch, session }) => (
  <Router>
    <React.Fragment>
      <Navbar session={session} />
      <Switch>
        <Route path="/" exact component={App} />
        <Route path="/search" exact component={Search} />
        <Route path="/signin" render={() => <Signin refetch={refetch} />} />
        <Route path="/signup" render={() => <Signup refetch={refetch} />} />
        <Route
          path="/recipe/add"
          render={() => <AddRecipe session={session} />}
        />
        <Route path="/recipes/:_id" component={RecipePage} />
        <Route path="/profile" component={Profile} />
        <Redirect to="/" />
      </Switch>
    </React.Fragment>
  </Router>
);

const RootWithSession = withSession(Root);

ReactDOM.render(
  <ApolloProvider client={client}>
    <RootWithSession />
  </ApolloProvider>,
  document.getElementById('root')
);
