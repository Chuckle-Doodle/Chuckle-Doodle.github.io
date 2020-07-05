//var blankImage = "https://images-wixmp-530a50041672c69d335ba4cf.wixmp.com/templates/image/b77fe464cfc445da9003a5383a3e1acf.jpg";

export function clusterDriver(dataArray, documentsArray)
{
  var docOrder = [];
  let uniqueData = [... new Set(dataArray)];
   for(let i = 0; i < uniqueData.length; i++)
   {
     for(let j = 0; j < dataArray.length; j++)
     {
       if(dataArray[j] == uniqueData[i])
       {
         //show_image(documentsArray[j]["Frontcover"],137,100,"Document","data");
         docOrder.push(j + 1);  //+1 because the docID's are 1 indexed
       }
     }
      //push blank space here
      //show_image(blankImage,137,100,"","blank");
      docOrder.push("space");
   }

   //if last element in docOrder is "space", delete it
   if (docOrder[docOrder.length - 1] == "space")
   {
     docOrder.pop();
   }
   
   return docOrder;
}

export function updateImageOrder(data, clusteredDocOrder)
{
      //update order of docs on screen each time state (aka document order) changes

    //this will be the array we use to actually render the images in proper order
    //console.log("clusteredDocOrder is:");
    //console.log(clusteredDocOrder);

    var imageOrder = {};
    imageOrder["documentOrder"] = [];
    imageOrder["spaceOrder"] = [];
    imageOrder["clusterOrder"] = {}; //this data structure maps doc IDs to which cluster number they are in

    var clusterNumber = 0;

    //iterate through current docOrder
    for (let i = 0; i < clusteredDocOrder.length; i++)
    {
      //console.log(this.state.documentOrder[i]);
      //if elem is a space
      if (clusteredDocOrder[i] == "space")
      {
        //imageOrder.push(blankImage);
        imageOrder["spaceOrder"].push(clusteredDocOrder[i - 1]);
        clusterNumber += 1;
        continue;
      } 
      else //push image to the imageOrder array
      {
        imageOrder['clusterOrder'][clusteredDocOrder[i]] = clusterNumber;
        //console.log(data[clusteredDocOrder[i] - 1]["Frontcover"]);
        imageOrder["documentOrder"].push([data[clusteredDocOrder[i] - 1]["Frontcover"], data[clusteredDocOrder[i] - 1]["docID"]]);
      }
    }

    //print("printing clusters")
    //print(imageOrder["clusters"])
    //console.log("printing clusters");
    //console.log(imageOrder["clusters"]);   //TODO!!! FIX LOGIC HERE. clusters list is not correct !!
    //console.log("printing imageOrder");
    //console.log(imageOrder);
    return imageOrder;
}


//function to manipulate data so clusterDriver function has appropriate input
export function cluster(data, clusterBy, documentsArray)
{
  //console.log("GOT HERE !!!!");
  //console.log(clusterBy);
  //console.log(data);
  //console.log(documentsArray);


  let dataArray = []; //this will be array that above function uses

  //different logic if clustering by docID, difference stemming from json data format
  if (clusterBy == "Document ID")
  {
    //set clusterBY to docID because that's what it's called in data dict
    clusterBy = 'docID'
    for(let z = 0; z < documentsArray.length; z++)
    {
      dataArray.push(documentsArray[z]["docID"]);
    }
  }
  else
  {
    for(let i = 0; i < documentsArray.length; i++)
    {
    //for each document, iterate through each question until we find the one we are clustering by
      for(let j = 0; j < documentsArray[i]["Questions"].length; j++)
      {
        if (clusterBy == documentsArray[i]["Questions"][j])
        {
          //if the question matches, push its corresponding answer
          dataArray.push(documentsArray[i]["Answers"][j]);
        }
      }
    }
  }

  console.log(dataArray);
  //now we have gone through all data so cluster it
  var clusteredDocOrder = clusterDriver(dataArray, documentsArray);
  var updatedImageOrder = updateImageOrder(data, clusteredDocOrder);

  // go from clusteredDocOrder to updated imageOrder in this function
  return updatedImageOrder;

}

export function clusterColors(data, clusterBy, documentsArray, colors) {
    let dataArray = []; //this will be array that above function uses

    //different logic if clustering by docID, difference stemming from json data format
    if (clusterBy == "docID") {
        for (let z = 0; z < documentsArray.length; z++) {
            dataArray.push(documentsArray[z]["docID"]);
        }
    }
    else {
        for (let i = 0; i < documentsArray.length; i++) {
            //for each document, iterate through each question until we find the one we are clustering by
            for (let j = 0; j < documentsArray[i]["Questions"].length; j++) {
                if (clusterBy == documentsArray[i]["Questions"][j]) {
                    //if the question matches, push its corresponding answer
                    dataArray.push(documentsArray[i]["Answers"][j]);
                }
            }
        }
    }
    //now we have gone through all data so cluster it
    var clusteredDocOrder = clusterDriver(dataArray, documentsArray);
    var colorOrder = [];
    
    var colorIdx = documentsArray.length;
    for (let i = 0; i < clusteredDocOrder.length; i++) {
        if (clusteredDocOrder[i] != "space") {
            if (i < clusteredDocOrder.length - 2 && clusteredDocOrder[i + 1] != "space") {
                while (clusteredDocOrder[i] != "space" && i < clusteredDocOrder.length) {
                    colorOrder[clusteredDocOrder[i] - 1] = colors[colorIdx];
                    i++;
                }
                colorIdx++;
            }
            else {
                colorOrder[clusteredDocOrder[i] - 1] = colors[clusteredDocOrder[i] - 1];
            }
        }
    }

    return colorOrder;
}