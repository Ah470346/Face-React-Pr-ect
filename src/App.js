import React from 'react';
import Main from './Containers/main';
import store from '../src/store/store';
import {Provider} from 'react-redux';
import {
  BrowserRouter as Router
} from 'react-router-dom';

function App() {
  return (
    <Provider store={store}>
      <Router>
      <div className="App">
        <Main></Main>
      </div>
      </Router>
    </Provider>
  );
}

export default App;

