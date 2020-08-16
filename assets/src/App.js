import React from 'react';
import ConfigList from './Components/ConfigList'
import { Button } from 'antd';
import 'antd/dist/antd.css';

class App extends React.Component {
  render() {
    return <div>
      <h1>MyBackups</h1>
      <Button>Add a configuration</Button>
      <ConfigList />
    </div>;
  }
}

export default App;
