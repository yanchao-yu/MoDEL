import * as React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import Templates from './pages/Templates';
import Template from './pages/Template';
import TemplatePreview from './pages/TemplatePreview';
import Demo from './pages/Demo';
import './style.css';
import ConfigProvider from './app/configContext'
import LogPlayback from './pages/LogPlayback';

export default function App() {
  return (
    <ConfigProvider>
      <Router>
        <Switch>
          <Route path="/demo//:botId">
            <Demo />
          </Route>
          <Route path="/setup">
            <Template />
          </Route>
          <Route path="/launch">
            <TemplatePreview />
          </Route>
          <Route path="/logplayback">
            <LogPlayback />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </ConfigProvider>
  );
}
