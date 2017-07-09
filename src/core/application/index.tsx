
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css'
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { AppRouter } from './components/App';

ReactDOM.render(
  <AppRouter />,
  document.getElementById('intent-app')
);
