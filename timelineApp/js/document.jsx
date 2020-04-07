import React from 'react';
//import PropTypes from 'prop-types';
import fetch from 'isomorphic-fetch';
//import moment from 'moment';
//import Likes from './likes';
//import Comments from './comments';

const Document = ({image, endOfCluster, dotLocationTop, dotLocationBottom}) => {
  var margin = 0;
  if (endOfCluster == true) {
    margin = 150;
  }

  return (
    <img src={image} style={{marginRight: margin + 'px'}} alt="Picture of Document" height="200" width="150"></img>
  )
}

export default Document;