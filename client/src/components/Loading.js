import React, { Component } from 'react';
import loadingImg from '../assets/loading.gif'

export class Loading extends Component {
  render() {
    return (
      <div className='text-center' >
        <img src={loadingImg} style={{width: '100px',
    height: '100px'}} alt="" />
      </div>
    );
  }
}

export default Loading;
