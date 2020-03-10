import React from 'react';
//import PropTypes from 'prop-types';
import fetch from 'isomorphic-fetch';
//import moment from 'moment';
//import Likes from './likes';
//import Comments from './comments';

export default class Documents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      documents: [],
    };
  }

  componentDidMount() {
    // Runs when an instance is added to the DOM
    // Call REST API to get number of likes
    fetch(this.props.url, { credentials: 'include' })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        //console.log(data.Black_Death);
        //let newArray = [...this.state.documents, "doc1"];
        //let newArray = data.Black_Death;
        //console.log(newArray);
        this.setState({
          documents: data.Black_Death
        });
      })
      .catch(error => console.log(error)); // eslint-disable-line no-console
  }


  render() {
    return (
      <div className="Documents">
        <div>
          {this.state.documents.map(doc =>
            <img src={"/static/images/".concat('', doc.Frontcover)} alt="Picture of Document" height="200" width="150"></img>
          )}

        </div>
      </div>
    );
  }
}

        //<Likes url={`${this.props.url}likes/`} />
        //<Comments url={`${this.props.url}comments/`} />