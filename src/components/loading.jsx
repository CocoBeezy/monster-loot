import React from 'react';

// Styles
require('../../public/styles/loading.scss');

const Loading = (props) => {
  const style = {
    display: (props.show ? 'block' : 'none')
  };
  return (
    <div className="container" style={style}>
      <div className="banner">
        LOADING
        <div className="banner-left"></div>
        <div className="banner-right"></div>
      </div>
    </div>
  );
}

export default Loading;
