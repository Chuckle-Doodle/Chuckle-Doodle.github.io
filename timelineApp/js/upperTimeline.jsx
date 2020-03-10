import React from 'react';
//import PropTypes from 'prop-types';
import fetch from 'isomorphic-fetch';
//import moment from 'moment';
//import Likes from './likes';
//import Comments from './comments';

export default class UpperTimeline extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      dates: [],
    };
  }

  componentDidMount() {
    // Runs when an instance is added to the DOM
    // Call REST API to get number of likes
    fetch(this.props.url, { credentials: 'same-origin' })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        this.setState({
          name: "When did the event occur?",
          dates: [1900, 1925, 1950, 1975],
        });
      })
      .catch(error => console.log(error)); // eslint-disable-line no-console
  }


  render() {
    return (
      <div className="UpperTimeline">
        <div>
          {this.state.name}
          <svg height="50" width="1000">
            <line x1="50" y1="50" x2="1000" y2="50"
            stroke="black" />
          </svg>

          <svg>
            <text x="20" y="35">1900</text>
            <text x="100" y="35">1925</text>
            <text x="180" y="35">1950</text>
            <text x="260" y="35">1975</text>
          </svg>
        </div>

      </div>
    );
  }
}

        //<Likes url={`${this.props.url}likes/`} />
        //<Comments url={`${this.props.url}comments/`} />
