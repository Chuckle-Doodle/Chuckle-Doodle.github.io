/*
let authors = [];
let docs = [];
 var doc0 = "https://i.ibb.co/rcpFq8t/out0.png";//replace with input parameters
     doc0Author = "BenjaminFranklin";
     docs.push(doc0);
    authors.push(doc0Author);
 var doc1 = "https://i.ibb.co/YPPk68Q/out1.png";//replace with input parameters
     doc1Author = "ThomasJefferson";
    docs.push(doc1);
    authors.push(doc1Author);
 var doc2 = "https://i.ibb.co/jh01vfp/out2.png";//replace with input parameters
     doc2Author = "GeorgeWashington";
    docs.push(doc2);
    authors.push(doc2Author);
 var doc3 = "https://i.ibb.co/Lr5hLXr/out3.png";//replace with input parameters
var doc3Author = "ThomasJefferson";
    docs.push(doc3);
    authors.push(doc3Author);
 var doc4 = "https://i.ibb.co/thtyKSs/black-death-wages-economy-page-002.jpg";//replace with input parameters
var doc4Author = "BenjaminFranklin";
    docs.push(doc4);
    authors.push(doc4Author);
*/   
var blankImage = "https://images-wixmp-530a50041672c69d335ba4cf.wixmp.com/templates/image/b77fe464cfc445da9003a5383a3e1acf.jpg";

// let uniqueAuthors = [...new Set(authors)];
// console.log(doc3Author);
//console.log(authors);
//console.log(uniqueAuthors);

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
         show_image(documentsArray[j]["Frontcover"],137,100,"Document","data");
         docOrder.push(j + 1);  //+1 because the docID's are 1 indexed
       }
     }
      //push blank space here
      show_image(blankImage,137,100,"","blank");
      docOrder.push("space");
   }

   //if last element in docOrder is "space", delete it
   if (docOrder[docOrder.length - 1] == "space")
   {
     docOrder.pop();
   }
   console.log("printing docOrder");
   console.log(docOrder);
   //return docOrder array
   return docOrder;
  
}


//function to manipulate data so clusterDriver function has appropriate input
export function cluster(clusterBy, documentsArray)
{
  let dataArray = []; //this will be array that below function uses

  //different logic if clustering by docID, difference stemming from json data format
  if (clusterBy == "docID")
  {
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
  //now we have gone through all data so cluster it
  var clusteredDocOrder = clusterDriver(dataArray, documentsArray);
  return clusteredDocOrder;
}



export function add_documents(doc0,doc1,doc2,doc3,doc4) {
     show_image(doc0, 137,100, "Document 1",doc0Author);
     show_image(doc1, 137,100, "Document 2",doc1Author);
     show_image(doc2, 137,100, "Document 3",doc2Author);
     show_image(doc3, 137,100, "Document 4",doc3Author);
     show_image(doc4, 137,100, "Document 5",doc4Author);
 }
//Doc 0 https://i.ibb.co/rcpFq8t/out0.png

export function show_image(src, width, height, alt, clustertype) {
    var img = document.createElement("img");
    img.src = src;
    img.width = width;
    img.height = height;
    img.alt = alt;
    img.clustertype = clustertype;
    document.body.appendChild(img);
}
