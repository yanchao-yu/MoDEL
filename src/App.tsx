import * as React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import Templates from './pages/Templates';
import Template from './pages/Template';
import TemplatePreview from './pages/TemplatePreview';
import Demo from './pages/Demo';
import './style.css';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/demo/:template/:botId">
          <Demo />
        </Route>
        <Route path="/templates/:template/setup">
          <Template />
        </Route>
        <Route path="/templates/:template/preview">
          <TemplatePreview />
        </Route>
        <Route path="/templates">
          <Templates />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}
