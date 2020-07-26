import React from 'react';
import fetch from 'isomorphic-fetch';
import Documents from './documents.jsx';
import ReferenceView from './referenceView';
import * as utils from './docCluster.js';
import '../static/css/style.css';

export default class ReferenceViewOptions extends React.Component {
  constructor(props) {
    super(props);

    var initialSpaceOrder = [];
    var initialClusterOrder = {};
    for (var i = 0; i < this.props.documents.length; i++) {
      initialSpaceOrder.push(this.props.documents[i].docID);
      initialClusterOrder[this.props.documents[i].docID] = i;
    }

    this.state = { 
      imageOrder: {
        clusterOrder: initialClusterOrder,
        documentOrder: this.props.docImages,
        spaceOrder: initialSpaceOrder
      },
      clusterBy: 'Document ID',
      colorBy: 'Document ID',

    };

    this.changeClusterBy = this.changeClusterBy.bind(this);
    this.changeColorBy = this.changeColorBy.bind(this);
  }

  changeClusterBy (event) {

    this.setState({
      imageOrder: utils.cluster(this.props.data, event.target.value, this.props.documents),
      clusterBy: event.target.value
    });

  }

  changeColorBy (event) {
    this.setState({
      colorBy: event.target.value
    });
  }

  render() {

      return (
        <div id="ReferenceViewOptions">


          Cluster by:
          <select id="clusterByList" name="clusterByList" onChange={this.changeClusterBy} value={this.state.clusterBy} >
                {this.props.clusterByOptions.map((clusterByOption, index) =>
                  <option value={clusterByOption}>
                    {clusterByOption}
                  </option>


                )}
          </select>


          <div onChange={this.changeColorBy}>
              Color by:
              <input type="radio" value="Document ID" name="colorByOption" defaultChecked/> Document ID
              <input type="radio" value="Cluster" name="colorByOption"/> Cluster
          </div>


          <div className="ReferenceViewTitles">

            {this.props.ReferenceViews.map((view, index) =>
              <div style={{display: 'inline-block', marginRight: '50px'}} >
                { view.Type == "Timeline" ? (index == 0 ? ("#1: Timeline of " + view.Question) : ("#2: Timeline of " + view.Question)) : (index == 0 ? ("#1: Map of " + view.Question) : ("#2: Map of " + view.Question)) }
              </div>
            )}

          </div>

          <div>
            {this.props.ReferenceViews.map((view, index) =>
              <div>

                <ReferenceView docImages={this.props.docImages} viewName={this.props.viewName} clusterByOptions={this.props.clusterByOptions} dataUrl={this.props.dataUrl} data={ this.props.data } documents={ this.props.documents } type={ view.Type } question={ view.Question }
                  isUpper={index == 0 ? true : false} storyid={this.props.storyid} referenceViewOrder={this.props.referenceViewOrder} imageOrder={this.state.imageOrder} clusterBy={this.state.clusterBy} colorBy={this.state.colorBy} />

              </div>
            )}

          </div>


        </div>
      );
    }
}
/* gotten rid of in favor of something simpler 7.12.20

                <div className="ReferenceViewTitle1">
                  {index == 0 ? (view.Type == "Timeline" ? ("Timeline of: " + view.Question) : ("Map of: " + view.Question)) : null}
                </div>

                <div className="ReferenceViewTitle2">
                  {index == 1 ? ((view.Type == "Map" && allMaps == false) ? ("Map of: " + view.Question) : null) : null}
                </div>

                                <div className="ReferenceViewTitle2">
                  {index == 1 ? (view.Type == "Timeline" ? ("Timeline of: " + view.Question) : null) : null}


                </div>
*/