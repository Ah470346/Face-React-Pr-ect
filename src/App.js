import React from 'react';
import Main from './Containers/main';
import store from '../src/store/store';
import {Provider} from 'react-redux';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Main></Main>
      </div>
    </Provider>
  );
}

export default App;

