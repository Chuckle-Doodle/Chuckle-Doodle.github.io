import React from 'react';
//import PropTypes from 'prop-types';
import fetch from 'isomorphic-fetch';
//import moment from 'moment';
//import Likes from './likes';
//import Comments from './comments';

export default class LowerTimeline extends React.Component {
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
          name: "When was this written?",
          dates: [2000, 2005, 2010, 2015],
        });
      })
      .catch(error => console.log(error)); // eslint-disable-line no-console
  }


  render() {
    return (
      <div className="LowerTimeline">
        <div>
          <svg>
            <text x="20" y="400">2000</text>
            <text x="100" y="400">2005</text>
            <text x="180" y="400">2010</text>
            <text x="260" y="400">2015</text>
          </svg>

          <svg height="250" width="1000">
            <line x1="50" y1="50" x2="1000" y2="50"
            stroke="black" />
          </svg>
          {this.state.name}
        </div>

      </div>
    );
  }
}

        //<Likes url={`${this.props.url}likes/`} />
        //<Comments url={`${this.props.url}comments/`} />