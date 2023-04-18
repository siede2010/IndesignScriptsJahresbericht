/* 
--How to use this--

1. to group things add %<number> after the tags ["pic","saying" or "name"] example : pic%0 or saying%4
2. the csv is constructed as following :
<Email>;<Saying>
example :
Schreiner.a20@HTLwienwest.at;Hello this is what i say.
3. if the databank is bigger than the amount of frames on the page it will create another one.

-------------------
*/
function GetSubFolders(theFolder) {
     var myFileList = theFolder.getFiles();
     for (var i = 0; i < myFileList.length; i++) {
          var myFile = myFileList[i];
          if (myFile instanceof Folder){
               GetSubFolders(myFile);
          }
          else if (myFile instanceof File) {
               myPics.push(myFile);
          }
     }
}


function has(origin,find)
{
  var loopTimes = origin.length - find.length
}


function readCSV(path)
{
    var file = File(path);
    file.encoding = 'UTF8';
    if(file.open("r")){
        var content = file.read(); file.close;
        try {
            var lines = content.split("\n");
            var data = {};
            data.email = []
            data.saying = []
            data.name = []
            data.pic = []
            for(var i = 0; i < lines.length; i++){
                var set = lines[i].split(";");
                var set = lines[i].split(";");
                data.email.push(set[0].split("@")[0]);
                data.saying.push(set[1]);
                data.name.push(null);
                data.pic.push(null);
            }
        } catch (error) { alert (error, "ERROR when reading the CSV File. something may be wrong with its content."); }
        return data;
    } return null;
}

var doc = app.activeDocument; // gets the opened active document

var f = File.openDialog("Please select the CSV File…", true, false);
var folder = Folder.selectDialog( "Select a folder" );
var myPics = [];
GetSubFolders(folder);

if (f != null && folder != null) {
var myDialog = app.dialogs.add({name:"adding Class:"}) // Create a new Dialog box to edit
with (myDialog) // uses the dialog box as the theoreticaly "this"
{
    with (dialogColumns.add()) // adds a column to it
    {
        with(dialogRows.add()){ //row go brr
                staticTexts.add({staticLabel:"Page Number :"});
                var selectedPage = integerEditboxes.add({editValue:1}); //box that hold the changeable info aka value.
        }
        with(dialogRows.add()){ //row 2 7_7
                staticTexts.add({staticLabel:"Title :"});
                var titleBox = textEditboxes.add({editContents:"3AHIT"}); // titel of class
        }
        with(dialogRows.add()){ //row 3 lul
            staticTexts.add({staticLabel:"CSV Path :"});
            var csvBox = textEditboxes.add({editContents:f}); // path to csv file
        }
        with(dialogRows.add()){
            staticTexts.add({staticLabel:"File Path : " + (folder + "").split("%20").join(" ")})
        }
        with(dialogRows.add()){
          staticTexts.add({staticLabel: myPics.length + " pictures found"})
      }
    }
}
if (myDialog.show())
{
  var title = titleBox.editContents
  var csv = readCSV(csvBox.editContents);
  var csvMax = csv.name.length;
  var objectAmm = 0;
  var pageToDuplicate = doc.pages[selectedPage.editValue-1];
  var allObjects = pageToDuplicate.allPageItems;
  for(var picI in myPics)
  {
    var picLastName = myPics[picI].name.split("_")[0].toLowerCase()
    var firstLetter = myPics[picI].name.split("_")[1].split("")[0].toLowerCase()
    for(var curEm in csv.email)
      if (csv.email[curEm].split(".")[0].toLowerCase() == picLastName)
        if (csv.email[curEm].split(".")[1].split("")[0].toLowerCase() == firstLetter) {
          csv.name[curEm] = myPics[picI].displayName.split("_").join(" ").split(".")[0];
          csv.pic[curEm] = myPics[picI].path+"/"+myPics[picI].name;
        }
  }


  for(var ii = 0;ii < allObjects.length;ii++)
  {
    if(allObjects[ii] instanceof TextFrame)
    {
      if(allObjects[ii].label.split('%')[0] =="name")
      {
        objectAmm++;
      }
    }
  }
  var newPages = [];
  var addAm = 0;
  for(var i = 0;i < csvMax/objectAmm;i++)
    newPages.push(pageToDuplicate.duplicate(LocationOptions.AFTER, doc.pages[-1])); // duplicates the selected page by index
  for(var l = 0;l < newPages.length;l++)
  {
    var myPage = newPages[l]
    var skipTo = addAm;
    var allObjects = myPage.allPageItems;
    var fileName;
    // goes through all elements of page 0
    for(var ii = 0; ii < allObjects.length; ii++)
    {
      //If selected element is TextFrame [Text]
      //allObjects[ii].label = "pic" + ii;
      if(allObjects[ii] instanceof TextFrame)
      {
        if(allObjects[ii].label.split('%')[0] =="name")
        {
          try {
            allObjects[ii].contents = csv.name[parseInt(allObjects[ii].label.split('%')[1])+skipTo];
            addAm++;
          }
          catch(error)
          {
            allObjects[ii].remove();
          }
        }
        else if(allObjects[ii].label.split('%')[0] == "saying")
        {
          try {
            allObjects[ii].contents = csv.saying[parseInt(allObjects[ii].label.split('%')[1])+skipTo];
          }
          catch(error)
          {
            allObjects[ii].remove();
          }
        }
        else if(allObjects[ii].label == "titel")
        {
            allObjects[ii].contents = title
        }
        //allObjects[ii].contents = "text" + ii;
      }
      //If selected element is Rectangle [Picture]
      if (allObjects[ii] instanceof Rectangle) 
      {
        if(allObjects[ii].label.split('%')[0] =="pic")
        {
          try {
            var myFile = new File(csv.pic[parseInt(allObjects[ii].label.split('%')[1])+skipTo]);
            fileName = myFile.name;
            var imageFrage = allObjects[ii].place(myFile);
          }
          catch(error)
          {
            allObjects[ii].remove();
          }
        }
        //var myFile = new File("C:\\Users\\neytey\\Documents\\HTL\\abdalsalam_alhyane.jpg");
        //fileName = myFile.name;
        //var imageFrame = allObjects[ii]//.place(myFile)[0];
        //imageFrame.fit(FitOptions.PROPORTIONALLY); //fits the image to fill the whole frame
      }
    }
  }
}
myDialog.destroy();
}
// var currentPage = doc.pages[1]; //sets currently opened page as page 2
// var imagePath = "C:\\Users\\neytey\\Desktop\\imageTestFolder\\test.png"; //path to the image

// for (var i = 0; i < currentPage.allPageItems.length; i++) { //loops through all page items
//   var item = currentPage.allPageItems[i];
  
  
//   if (item instanceof Rectangle || item instanceof Image) { //checks to see if the item is a rectangle or image
//     var imageFrame = item.place(File(imagePath))[0]; //places the image into the rectangle
    
//     imageFrame.fit(FitOptions.PROPORTIONALLY); //fits the image to fill the whole frame
//   }
// }