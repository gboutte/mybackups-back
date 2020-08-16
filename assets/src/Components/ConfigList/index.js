import { Table, Tag, Space } from 'antd';
import React from 'react';
import './style.css';
import axios from 'axios'

class ConfigList extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Enabled',
        dataIndex: 'enabled',
        key: 'enabled',
        render: (text, record) => (
          <Space size="middle">
            { record.enabled ? "Yes":"No"}
          </Space>
        ),
      },
      {
        title: 'Frequency',
        dataIndex: 'frequency',
        key: 'frequency',
      },
      {
        title: 'Keep',
        dataIndex: 'to_keep',
        key: 'to_keep',
      },
      {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <Space size="middle">
            <a>Delete</a>
          </Space>
        ),
      },
    ];
    this.state = {
      data:[

      ]
    };
  }

  componentDidMount() {
    var self = this;
    axios.get('http://localhost:8000/api/backup/config')
    .then(function (response) {
      // handle success
      self.setState({
        data:response.data
      })
      console.log(response);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });
  }
  render() {
    return <div>
      <Table columns={this.columns} dataSource={this.state.data} />
    </div>;
  }
}

export default ConfigList;
