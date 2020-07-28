import React from 'react';
import Documents from './documents.jsx';
import '../static/css/style.css';

export default class MapLegend extends React.Component {
    constructor(props) {
        super(props);
        this.data = null; // fill in later
        this.clusterColors = {}; //fill in later
        this.determineLegendInfo = this.determineLegendInfo.bind(this);
    }

    componentDidMount() {
        
    }

    //this function takes the current value of color by: dropdown menu and returns the set of answers that associate with it
    determineLegendInfo() {
        var option = this.props.colorByOption;
        //option = 'Author';
        if (option == 'Document ID') {
            //console.log("do something else!!");
            //TODO: DONT HARCODE BELOW CODE
            this.data = {};
            this.data[1] = [];
            this.data[1].push(1);
            this.data[2] = [];
            this.data[2].push(2);
            this.data[3] = [];
            this.data[3].push(3);
            this.data[4] = [];
            this.data[4].push(4);

            this.clusterColors[1] = this.props.colors[0];
            this.clusterColors[2] = this.props.colors[1];
            this.clusterColors[3] = this.props.colors[2];
            this.clusterColors[4] = this.props.colors[3];

        } else {
            this.data = this.props.answersPerCluster[option];
            //console.log("HIII", option, this.props.answersPerCluster);

            //determine colors for each cluster in legend:
            for (var key in this.props.answersPerCluster[option]) {

                this.clusterColors[key] = null; //initialize
                if (this.props.answersPerCluster[option].hasOwnProperty(key)) {
                    //console.log("printingggg, ", key);
                    //console.log(this.props.clusterNumbers, );
                    var clusterNumber = this.props.clusterNumbers[key];
                    //console.log("clusterNumber is, ", clusterNumber);
                    this.clusterColors[key] = this.props.colors[this.props.colors.length - 1 - clusterNumber];
 
                }
            }

        }
        //console.log(this.props.answersPerCluster[option]);
        //console.log(this.props.clusterNumbers);
        //console.log(this.props.imageOrder);



        //color={this.props.colorBy == "Document ID" ? this.props.colors[imageData[1] - 1] : (this.props.clusterBy == "Document ID" ? this.props.colors[imageData[1] - 1] : this.props.colors[this.props.colors.length - 1 - this.props.imageOrder.clusterOrder[imageData[1]]])}


                    //{this.props.imageOrder.documentOrder.map((imageData, index) =>
              //<Document image={imageData[0]} documentid={imageData[1]} imageName={"image" + imageData[1]} endOfCluster={this.props.imageOrder.spaceOrder.indexOf(imageData[1]) > -1 ? true : false} color={this.props.colorBy == "Document ID" ? this.props.colors[imageData[1] - 1] : (this.props.clusterBy == "Document ID" ? this.props.colors[imageData[1] - 1] : this.props.colors[this.props.colors.length - 1 - this.props.imageOrder.clusterOrder[imageData[1]]])} storyid={this.props.storyid} referenceViewTop={this.props.referenceViewTop} referenceViewBottom={this.props.referenceViewBottom} />
            //)}

    }

    render() {

        this.determineLegendInfo();

        //console.log(this.data, 'data is');
        //need to reassign variables so they work in map function below
        var data = this.data;
        var clusterColors = this.clusterColors;
        //console.log("clusterColors");
        //console.log(clusterColors);

        return (
            <div id="mapLegendData">
                <div>Map Legend:</div>

                <div>
                {Object.keys(data).map(function (key) {
                    var item = data[key];
                    //console.log(key);
                    //console.log("item is", item);
                    return (
                        <div>
                            <div>
                                {key}: {clusterColors[key]}
                            </div>
                        </div>
                    );
                })}
                </div>
            </div>
        )
        //example: Color By: Document iD
                            //Map Legend
                            //1: Blue
                            //2: Red
                            //3: Green

                    //Color By: Slavery Stance
                            //Pro Abolition: Blue
                            //Pro Slavery: Red
    }
}