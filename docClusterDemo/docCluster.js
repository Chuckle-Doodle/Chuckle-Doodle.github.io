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
var blankImage = "https://images-wixmp-530a50041672c69d335ba4cf.wixmp.com/templates/image/b77fe464cfc445da9003a5383a3e1acf.jpg"; 
    
let uniqueAuthors = [...new Set(authors)];
// console.log(doc3Author);
  console.log(authors);
console.log(uniqueAuthors);
function cluster_author()
{
   for(i = 0; i < uniqueAuthors.length; i++)
   {
             for(j = 0; j < authors.length; j++)
     {
         if(authors[j] == uniqueAuthors[i])
       {
           show_image(docs[j],137,100,"Document","author");
       }
     }
      //push blank space here
      show_image(blankImage,137,100,"","blank");
   }
  
}

function add_documents(doc0,doc1,doc2,doc3,doc4) {
     show_image(doc0, 137,100, "Document 1",doc0.author);
     show_image(doc1, 137,100, "Document 2",doc1.author);
     show_image(doc2, 137,100, "Document 3",doc2.author);
     show_image(doc3, 137,100, "Document 4",doc3.author);
     show_image(doc4, 137,100, "Document 5",doc4.author);
 }
//Doc 0 https://i.ibb.co/rcpFq8t/out0.png

 function show_image(src, width, height, alt, author) {
     var img = document.createElement("img");
     img.src = src;
     img.width = width;
     img.height = height;
     img.alt = alt;
     img.author = author;
     document.body.appendChild(img);
 }