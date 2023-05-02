function GetSubFolders(theFolder) { //if the pictures are within sub folders it should extract those aswell
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
var flatGroup = []

function flattenGroups(flgroups)
{ //flatten's groups to make stuff easier to do in the future.
 flatGroup = []
 innerFlat(flgroups)
 return flatGroup;
}
function innerFlat(ifgroups)
{
 for(var gr = 0;gr<ifgroups.length;gr++)
 {
   if (ifgroups[gr] != null)
     if (ifgroups[gr].groups.length > 0)
       innerFlat(ifgroups[gr].groups)
     else
       flatGroup.push(ifgroups[gr])
 }
}

function readSchüler(path)
{
   var file = File(path);
   file.encoding = 'UTF8';
   if(file.open("r")){
       var content = file.read(); file.close;
       try {
           var lines = content.split("\n");
           var data = {};
           data["unit"] = {};
           data["abteilung"] = {};
           data["email"] = {};
           var origins = lines[0].split(";")
           var cIndex = { //default case when top is not set.
             email:0,
             unit:1,
             firstName:2,
             lastName:3,
             role:4,
             abbreviation:5
           }
           var startIndex = 1
           for(var indexxer in origins)
           {
              var dataSet = origins[indexxer].toLowerCase()
              switch(dataSet)
              { // reads the first line to check if indexxer's are present
                // indexxers are stuff like email;name;etc...
                // not needed. if not present will default to this :
                // email;class;firstName;lastName;role;abbrev;
                case "email":
                  cIndex.email = indexxer;
                  break;
                case "orgUnit":
                case "class":
                  cIndex.unit = indexxer;
                  break;
                case "name.given":
                case "firstName":
                case "name.first":
                  cIndex.firstName = indexxer;
                  break;
                case "name.last":
                case "lastName":
                  cIndex.lastName = indexxer
                  break;
                case "role":
                  cIndex.role = indexxer
                  break;
                case "abbrev":
                case "abbrov":
                  cIndex.abbreviation = indexxer
                  break;
                default:
                  startIndex = 0; //if it has a no header start on 0
                  break;
              }
           }
           //email;orgUnit;name.given;name.last;role;abbrev;
           for(var i = startIndex; i < lines.length; i++){
              var set = lines[i].split(";"); //this is basicaly the list of info.
              if (set.length <= cIndex.unit) continue;
              if (set[cIndex.role] == "student")
              {
                if (data.unit[set[cIndex.unit]] == null) 
                  data.unit[set[cIndex.unit]] = {schülers:[]}
                var nData = { //the dataset is saved as nData so it can be put into multible things without having to call the other list
                    email:set[cIndex.email],
                    unit:set[cIndex.unit],
                    vorname:set[cIndex.firstName],
                    nachname:set[cIndex.lastName],
                    name:set[cIndex.firstName] + " " + set[cIndex.lastName],
                    role:set[cIndex.role],
                    saying:"", //will be added with the other csv
                    pic:"" //is added with the pic finder
                  }
                data.unit[set[cIndex.unit]].schülers.push(nData)
                data.email[set[cIndex.email]] = nData;
              } else if (set[cIndex.role] == "teacher") {
                if (data.abteilung[set[cIndex.unit]] = null) 
                  data.abteilung[set[cIndex.unit]] = {teachers:[]}
                
                  var nData = {
                    email:set[cIndex.email],
                    abteilung:set[cIndex.unit],
                    vorname:set[cIndex.firstName],
                    nachname:set[cIndex.lastName],
                    name:set[cIndex.firstName] + " " + set[cIndex.lastName],
                    role:set[cIndex.role],
                    saying:"", //will be added with the other csv
                    abkz:set[cIndex.abbreviation],
                    pic:"" //is added with the pic finder
                }
                data.abteilung[set[1]].teachers.push(nData)
                data.email[set[0]] = nData;
              }
           }
       } catch (error) { alert (error, "ERROR when reading the CSV File Schüler. something may be wrong with its content."); }
       return data;
   } return null;
}
function readSaying(path,schüler)
{
   var file = File(path);
   file.encoding = 'UTF8';
   if(file.open("r")){
       var content = file.read(); file.close;
       try {
          //expects first email then saying
          //example : abroc.gerome@htlWienwest.at;I am Gerome and i am not annoyed.
          //  'u'
            var lines = content.split("\n");
            for(var i = 0; i < lines.length; i++){
                var set = lines[i].split(";");
                schüler.email[set[0]].saying = set[1]
            }
       } catch (error) { alert (error, "ERROR when reading the CSV File Saying. something may be wrong with its content."); }
       return null;
   } return null;
}

var doc = app.activeDocument; // gets the opened active document

var schuelerf = File.openDialog("Please select the Schüler CSV File…", true, false);
var sayingf = File.openDialog("Please select the Sayings CSV File…", true, false);
var folder = Folder.selectDialog( "Select a folder" );
var myPics = [];
GetSubFolders(folder);

var myDialog = app.dialogs.add({name:"adding Class:"}) // Create a new Dialog box to edit
with (myDialog) // uses the dialog box as the theoreticaly "this"
{
   with (dialogColumns.add()) // adds a column to it
   {
       with(dialogRows.add()){ //row go brr
               staticTexts.add({staticLabel:"Page Number :"});
               var selectedPage = integerEditboxes.add({editValue:1}); //box that hold the changeable info aka value.
       }
       with(dialogRows.add()){ //row 3 lul
           staticTexts.add({staticLabel:"CSV Schüler Path :"});
           var csvSchuelerBox = textEditboxes.add({editContents:schuelerf}); // path to csv file
       }
       with(dialogRows.add()){ //row 4 lul
        staticTexts.add({staticLabel:"CSV Saying Path :"});
        var csvSayingBox = textEditboxes.add({editContents:sayingf}); // path to csv file
        }
       with(dialogRows.add()){
           staticTexts.add({staticLabel:"File Path : " + (folder + "").split("%20").join(" ")})
       }
       with(dialogRows.add()){
         staticTexts.add({staticLabel: myPics.length + " pictures found"})
     }
     with(dialogRows.add()){ //row go brr
       staticTexts.add({staticLabel:"Uses Groups? [group%0 as example] :"});
       var isGroupBox = checkboxControls.add({checkedState:true}); //so you can switch between new version and old one.
     }
   }
}
if (myDialog.show())
{
  var objectAmm = 0; //how many people can fit in 1 page.
  var pageToDuplicate = doc.pages[selectedPage.editValue-1];
  var usesGroups = isGroupBox.checkedState;
  var allTemplateObjects = pageToDuplicate.allPageItems;
  var csv = readSchüler(csvSchuelerBox.editContents)
  readSaying(csvSayingBox.editContents,csv)
  var allClasses = [];
  for(var i in csv.unit)
    allClasses.push(i)
  for(var picI in csv.unit) //Imports any Pic Files into the correct user
  {
    var curClass = csv.unit[picI]
    for(var student in curClass.schülers) {
        var curStud = curClass.schülers[student] //current Student.
        var nameCheck = curStud.vorname.toLowerCase() + "_" + curStud.nachname.toLowerCase()
        for(var pic in myPics) // Checks each Picture
        {
            curPic = myPics[pic]; // checks with the split command if the given string exists within the other string.
            if(curPic.name.toLowerCase().split(nameCheck).length > 1) {
                curStud.pic = curPic.path+"/"+myPics[picI].name; //sets the path for itself onto the student obj.
                break; //no reason to keep looping so breaking it is.
            }
        }
    }
  }
  for(var i = 0;i < allTemplateObjects.length;i++) /* Counts the amount of class members within the template page */ 
    if (allTemplateObjects[i].label != null && allTemplateObjects[i].label.toLowerCase().split("name").length > 1)
      objectAmm++; //counts the amount of name elements to count how many people fit.
  for(var curClassNameInd in allClasses)
  { //now the fun starts with each class.
    var curClassName = allClasses[curClassNameInd]
    var curClass = csv.unit[curClassName] //class Object {schülers:[]}
    var title = curClassName; // classTitle
    var sAmount = curClass.schülers.length; // amount of class members
    var pages = Math.ceil(sAmount / objectAmm) //the amount of pages this class needs.
    if (pages > 100000) throw "tooLargeError : failsave if no name labels are within the in design design."
    var classInd = 0; // after a class was made it goes again
    var cpyPages = []
    for(var p = 0;p<pages;p++)
      cpyPages.push(pageToDuplicate.duplicate(LocationOptions.AFTER, doc.pages[-1]))
    for(var curPageIndex in cpyPages)
    {
      var grpUpInd = objectAmm * classInd++
      var curPage = cpyPages[curPageIndex]
      if(usesGroups) //when it uses group%0
      { // -------------------------------------Group Code-------------------------------------
        var curGroups = curPage.groups;
        for(var groupIndex = 0;groupIndex < curGroups.length;groupIndex++)
        {
          var curGroup = curGroups[groupIndex] //current Group
          var curTextFrames = curGroup.textFrames //textFrames
          var curRectangles = curGroup.rectangles  //rectangles
          var groupI = parseInt(curGroup.label.split("%")[1]) + grpUpInd
          var curSchüler = curClass.schülers[groupI]
          for(var ii = 0;ii < curTextFrames.length;ii++)
          { //current Time Frame
            var curTextFr = curTextFrames[ii]
            if(curTextFr.label.toLowerCase() == "name")
            {
              try {
                curTextFr.contents = curSchüler.name;
              }
              catch(error)
              {
                curTextFr.remove();
              }
            }
            else if(curTextFr.label.toLowerCase() == "saying")
            {
              try {
                curTextFr.contents = curSchüler.saying;
              }
              catch(error)
              {
                curTextFr.remove();
              }
            }
          }
          for(var ii = 0;ii < curRectangles.length;ii++)
          { //current Rectangle
            var curRectangle = curRectangles[ii]
            if(curRectangle.label.toLowerCase() =="pic")
            {
              try {
                var myFile = new File(curSchüler.pic);
                fileName = myFile.name;
                var imageFrage = curRectangle.place(myFile)[0];
                imageFrage.fit(FitOptions.PROPORTIONALLY)
              }
              catch(error)
              {
                curRectangle.remove();
              }
            }
          }
        }
      }
      else { //when it uses saying%0 and other
        // -------------------------------------Manual Code-------------------------------------
        var skipTo = objectAmm * classInd++
        var curElems = curPage.allPageItems;
        for(var curElemInd in curElems)
        {
          var curElem = curElems[curElemInd] //Current Element
          var curInd = parseInt(curElem.label.split('%')[1]) + skipTo;
          var curSchüler = curClass.schülers[curInd]
          if(curElem instanceof TextFrame) //If selected element is TextFrame [Text]
          {
            if(curElem.label.split('%')[0].toLowerCase() =="name")
            {
              try {
                curElem.contents = curSchüler.name;
              }
              catch(error)
              {
                curElem.remove();
              }
            }
            else if(curElem.label.split('%')[0].toLowerCase() == "saying")
            {
              try {
                curElem.contents = curSchüler.saying;
              }
              catch(error)
              {
                curElem.remove();
              }
            }
          }
          if (curElem instanceof Rectangle) //If selected element is Rectangle [Picture]
          {
            if(curElem.label.split('%')[0].toLowerCase() =="pic")
            {
              try {
                var myFile = new File(curSchüler.pic);
                fileName = myFile.name;
                var imageFrage = curElem.place(myFile)[0];
                imageFrage.fit(FitOptions.PROPORTIONALLY)
              }
              catch(error)
              {
                curElem.remove();
              }
            }
          }
        }
      }
    }
  }
}else {
    myDialog.destroy();
}