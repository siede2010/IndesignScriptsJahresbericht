/*
  {[Most Up to date Version of the List Script.]}
Label's used :
  Pic - Photo Frame
  Name - Text Frame
  Saying - Text Frame
  Group%0 - 0 represents the index. (given to the group that contains all 3 Frames)
  Titel - Class Name
  Classphoto - Picture Frame for Class Photo
Uses 3 Things :
  peopleet.csv [Contains info about every student & teacher]
  saying.csv [contains a email and their saying]
  picFolder [a folder that contains every portrait]
*/
var defaultPhotos = [];
var imageTypes = ["png","jpg"] // if a file is found that isnt one of those it isnt seen as an image.
function GetSubFolders(theFolder,list) { //if the pictures are within sub folders it should extract those aswell
    var myFileList = theFolder.getFiles();
    for (var i = 0; i < myFileList.length; i++) {
         var myFile = myFileList[i];
         if (myFile instanceof Folder){
              GetSubFolders(myFile,list); // is folder then run this again, with the folder as the host.
         }
         else if (myFile instanceof File) {
            var curType = myFile.name.split(".")
            curType = curType[curType.length-1].toLowerCase()
            for(var imI in imageTypes)
              if (imageTypes[imI] == curType)
              list.push(myFile); //put into list.
         } 
    }
}
var flatGroup = []
function flattenGroups(ifgroups)
{ //basicaly the same for the folders but it instead does it to groups.
 for(var gr = 0;gr<ifgroups.length;gr++)
 {
   if (ifgroups[gr] != null && ifgroups[gr] != undefined)
    flatGroup.push(ifgroups[gr])
    if (ifgroups[gr].groups.length > 0) 
      flattenGroups(ifgroups[gr].groups)
 }
}

function readSchüler(path)
{
  if (path instanceof File)
    var file = path;
  else
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
              var set = lines[i].split("#")[0].split(";"); //this is basicaly the list of info.
              if (set.length <= cIndex.unit) continue;
              var nData = {}
              if (set[cIndex.role] == "student")
              {
                if (data.unit[set[cIndex.unit]] == null) 
                  data.unit[set[cIndex.unit]] = {people:[],name:set[cIndex.unit],classPic:""}
                nData = { //the dataset is saved as nData so it can be put into multible things without having to call the other list
                    email:set[cIndex.email],
                    //unit:set[cIndex.unit], //unused
                    vorname:set[cIndex.firstName],
                    nachname:set[cIndex.lastName],
                    name:set[cIndex.firstName] + " " + set[cIndex.lastName],
                    //role:set[cIndex.role], //it has no use. its always the same for the entire class.
                    saying:"", //will be added with the other csv
                    pic:"" //is added with the pic finder
                  }
                data.unit[set[cIndex.unit]].people.push(nData)
                data.email[set[cIndex.email]] = nData; 
              } else if (set[cIndex.role] == "teacher") {
                if (data.abteilung[set[cIndex.unit]] == null) 
                  data.abteilung[set[cIndex.unit]] = {people:[],name:set[cIndex.unit],classPic:""}
                
                  nData = {
                    email:set[cIndex.email],
                    //abteilung:set[cIndex.unit], //unused 2
                    vorname:set[cIndex.firstName],
                    nachname:set[cIndex.lastName],
                    name:set[cIndex.firstName] + " " + set[cIndex.lastName],
                    //role:set[cIndex.role], //it has no use.
                    saying:"", //will be added with the other csv
                    abkz:set[cIndex.abbreviation], // specialty of the Teachers.
                    pic:"" //is added with the pic finder
                }
                data.abteilung[set[cIndex.unit]].people.push(nData)
                data.email[set[cIndex.email]] = nData; //alternative way of finding a user. using their email. used for saying.csv
              }
           }
       } catch (error) { alert (error, "ERROR when reading the CSV File Schüler. something may be wrong with its content."); }
       return data;
   } return null;
}

function replace(str,a)
{
  var repStr = str;
  for(var Ar in a)
  {
    if (typeof repStr == "string")
      repStr = repStr.split(Ar).join(a[Ar])
    else
      return str;
  }
  return repStr;
}

function replaceStr(str,sL) {
  var repStr = str;
  for(var Ar = 0; Ar < sL.length - 1; Ar+=2)
    repStr = repStr.split(sL[Ar]).join(sL[Ar+1]);
  return repStr;
}

function readSaying(path,schüler)
{
  if (path instanceof File)
    var file = path;
  else
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
                if (schüler.email[set[0]] != undefined)
                  schüler.email[set[0]].saying = set[1] //find the user using the email enum list.
            }
       } catch (error) { alert (error, "ERROR when reading the CSV File Saying. something may be wrong with its content."); }
       return null;
   } return null;
}
var myPics;
main(); //so i can use return to stop the code;
function main() {

var doc = app.activeDocument; // gets the opened active document

var folder = Folder.selectDialog( "Chose the Folder with the Pictures" );
if (folder == null || folder == undefined) return;
myPics = [];
GetSubFolders(folder,myPics);

var myDialog = app.dialogs.add({name:"adding Class:"}) // Create a new Dialog box to edit
with (myDialog) // uses the dialog box as the theoreticaly "this"
{
   with (dialogColumns.add()) // adds a column to it
   {
    with(dialogRows.add())
    {
      with(dialogColumns.add())
      {
        staticTexts.add({staticLabel:"Page Number :"});
        staticTexts.add({staticLabel:"Print Student? [False = Print Teachers] :"});
        staticTexts.add({staticLabel:"Pictures found within " + folder.path + "/" + folder.name + " :"});
        staticTexts.add({staticLabel:"Phantoms on no photo? "})
      } //Reorganized from old style. :>
      with(dialogColumns.add())
      {
        var selectedPage = integerEditboxes.add({editValue:1}); //box that hold the changeable info aka value.
        var isStudentBox = checkboxControls.add({checkedState:true}); //so you can switch between new version and old one.
        staticTexts.add({staticLabel:myPics.length + ""})
        var phantomBox = checkboxControls.add({checkedState:false});
      }
    }
   }
}
// ----------------------------------------- Start of the Active Script -------------------------------------------
if (myDialog.show())
{
  var printStudents = isStudentBox.checkedState;
  var phantomBool = phantomBox.checkedState;
  var schuelerf = File.openDialog("Please select the Schüler CSV File…", true, false);
  if (schuelerf == null || schuelerf == undefined) return;
  if (printStudents) {
    var sayingf = File.openDialog("Please select the Sayings CSV File…", true, false);
    if (sayingf == null || sayingf == undefined) return;
  }

  if(phantomBool)
    GetSubFolders(Folder.selectDialog( "Chose the Folder with the Phantoms"),defaultPhotos)
  var objectAmm = 0; //how many people can fit in 1 page.
  var pageToDuplicate = doc.pages[selectedPage.editValue-1];
  var allTemplateObjects = pageToDuplicate.allPageItems; //saves all TemplateObjects onto a var.
  var csv = readSchüler(schuelerf) //Reads the Schueler CSV
  readSaying(sayingf,csv) //Reads the Saying of the CSV and connects it to the csv of Schueler.
  var selUnit = printStudents ? csv.unit : csv.abteilung;
  var allClasses = [];
  for(var i in selUnit)
    allClasses.push(i)
  for(var picI in selUnit) //Imports any Pic Files into the correct user
  {
    var curClass = selUnit[picI]
    for(var student in curClass.people) {
        var curStud = curClass.people[student] //current Student.
        var nameCheck = curStud.nachname.toLowerCase() + "-" +curStud.vorname.toLowerCase()
        nameCheck = replace(nameCheck,{"ö":"%C3%B6","ß":"%E1%BA%9E","ä":"%C3%A4","ü":"%C3%BC"," ":"-","_":"-"})
        var checks = nameCheck.split("-");
        for(var pic in myPics) // Checks each Picture
        {
            var curPic = myPics[pic]; // checks with the split command if the given string exists within the other string.
            var failed = false;
            var namecheckLower = replaceStr(curPic.name.toLowerCase(),["%c3%96","%C3%B6",  "%c3%84","%C3%A4",  "%c3%9c","%C3%BC","%c3%b6","%C3%B6","%c3%a4","%C3%A4","%c3%bc","%C3%BC",  "%31"," ",  "%20"," "])
            for(var ci = 0;ci < checks.length; ci++) //Thing above just turns Big Ö Ä Ü into ö ä ü aswell.
              if (namecheckLower.split(checks[ci]).length == 1)
                failed = true;
            if(!failed) {
                curStud.pic = curPic.path+"/"+curPic.name; //sets the path for itself onto the student obj.
                break; //no reason to keep looping so breaking it is.
            } //funny how this entire piece of code was made by just me. jet it looks like 10 people worked on it.
        }
      }
    var nameCheck = curClass.name.toLowerCase()
    for(var pic in myPics)
    {
      var curPic = myPics[pic]
      if (curPic.name.toLowerCase().split(nameCheck).length > 1) {
        curClass.classPic = curPic.path+"/"+curPic.name
      }
    }
  }
  for(var i = 0;i < allTemplateObjects.length;i++) /* Counts the amount of class members within the template page */ 
    if (allTemplateObjects[i].label != null && allTemplateObjects[i].label.toLowerCase().split("name").length > 1)
      objectAmm++; //counts the amount of name elements to count how many people fit.
  for(var curClassNameInd in allClasses)
  { //now the fun starts with each class.
    var curClassName = allClasses[curClassNameInd]
    var curClass = selUnit[curClassName] //class Object {people:[]}
    var title = curClassName; // classTitle
    var sAmount = curClass.people.length; // amount of class members
    var pages = Math.ceil(sAmount / objectAmm) //the amount of pages this class needs.
    if (pages > 100000) throw "tooLargeCatch : failsave if no name labels are within the inDesign design.\nWhat was expected :\ngroup%0\n  name\n  saying  \n  pic";
    //Failsave if you forgot to put any labels on the page.
    var classInd = 0; // after a class was made it goes again
    var cpyPages = []
    for(var p = 0;p<pages;p++)
      cpyPages.push(pageToDuplicate.duplicate(LocationOptions.AFTER, doc.pages[-1]))
    for(var curPageIndex in cpyPages)
    {
      var grpUpInd = objectAmm * classInd++
      var curPage = cpyPages[curPageIndex]
      var centerList = []
      var curElems = curPage.allPageItems;
      for(var curElemInd = 0;curElemInd<curElems.length;curElemInd++)
      {
        var curElem = curElems[curElemInd]
        if (curElem instanceof TextFrame) {
          if (curElem.label.toLowerCase() == "titel")
            curElem.contents = curClass.name; //Title should be set to classname.
        }
        if (curElem instanceof Rectangle) {
          if (curElem.label.toLowerCase() == "classphoto")
          {
            try {
              var myFile = new File(curClass.classPic);
              fileName = myFile.name;
              var imageFrage = curElem.place(myFile)[0];
              imageFrage.fit(FitOptions.PROPORTIONALLY)
            }
            catch(error) { //if no pic was found and error was called remove pic element.
              curElem.remove();
            }
          }
        }
      }
      var curGroups = curPage.groups;
      flatGroup = []
      flattenGroups(curGroups);
      for(var groupIndex = 0;groupIndex < flatGroup.length;groupIndex++)
      {
        var curGroup = flatGroup[groupIndex] //current Group
        if (!curGroup.isValid) continue;
        var curTextFrames = curGroup.textFrames //textFrames
        var curRectangles = curGroup.rectangles  //rectangles
        switch (curGroup.label.split("%")[0]) 
        {
          case "group":
            var groupI = parseInt(curGroup.label.split("%")[1]) + grpUpInd
            var curSchüler = curClass.people[groupI]
            for(var ii = 0;ii < curTextFrames.length;ii++)
            { //current Time Frame
              var curTextFr = curTextFrames[ii]
              switch(curTextFr.label.toLowerCase())
              {
                case "name":
                  if(curSchüler == undefined) {
                    curTextFr.remove(); //if curSchüler doesnt Exist it removes that label.
                    ii--;
                    groupIndex--; //it removes the group once the last element is deleted. if the name wasnt found
                                  //it will probably not exist.thus going back 1 step here.
                  }
                  else
                    curTextFr.contents = curSchüler.name;
                  break;
                case "saying":
                case "abkz":
                  if(curSchüler == undefined) {
                    curTextFr.remove(); //if curSchüler doesnt Exist it removes that label.
                    ii--;
                    //doesnt reduce groupIndex since only name is fix and if it didnt load nothing will.
                  }
                  else
                    if (printStudents)
                      curTextFr.contents = curSchüler.saying;
                    else
                      curTextFr.contents = curSchüler.abkz;
                  break;
                default:
                  break;
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
                  if (phantomBool) {
                    if (curSchüler == undefined)
                      curRectangle.remove();
                    else {
                      var myFile = new File(defaultPhotos[Math.floor(Math.random()*defaultPhotos.length)]);
                      fileName = myFile.name;
                      var imageFrage = curRectangle.place(myFile)[0];
                      imageFrage.fit(FitOptions.PROPORTIONALLY)
                    }
                  }
                  else
                    curRectangle.remove();
                  break;
                }
              }
            }
            break;
            /*
          case "center": //Broken, supposed to save geometric bounds to later centralize
              var bounds = curGroup.geometricBounds;
              centerList.push({
                grp:curGroup, //used to get the group later
                width: bounds[3] - bounds[1], //width
                height: bounds[2] - bounds[0], //height
                x: bounds[1],
                y: bounds[0]
              })
            break;
            */
          default:
            break;
        }
      }
      /*
      for(var gCenI = 0;gCenI < centerList.length;gCenI++)
      { //after groups had been removed it shouldve been used to center the "center" groups.
        var cenGrpElm = centerList[gCenI]
        var cenGrp = cenGrpElm.grp;
        var curBounds = cenGrp.geometricBounds;
        var dim = {
          width : bounds[3] - bounds[1],
          height: bounds[2] - bounds[0]
        }
        var offset = {
          width : (cenGrpElm.width - dim.width) / 2,
          height : (cenGrpElm.height - dim.height) / 2
        }
        var newPos = {
          x: cenGrpElm.x+offset.width,
          y: cenGrpElm.y+offset.height
        }
        cenGrp.geometricBounds = [
          newPos.y,
          newPos.x,
          newPos.y+dim.height,
          newPos.x+dim.width]
      }
      */
    }
  }
}else {
    myDialog.destroy();
}

}