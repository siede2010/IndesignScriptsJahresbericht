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
var flatGroup = []

function flattenGroups(flgroups)
{
 flatGroup = []
 for(var g = 0;g<flgroups.length;g++)
 {
   if (flgroups[g] != null)
     if (flgroups[g].groups.length > 0)
       innerFlat(flgroups[g].groups)
     else
       flatGroup.push(flgroups[g])
 }
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
           data.class = {};
           data.abteilung = {};
           data.email = {};
           for(var i = 0; i < lines.length; i++){
              var set = lines[i].split(";");
              if (set[4] == "student")
              {
                if (data.class[set[1]] == null) 
                  data.class[set[1]] = {schülers:[]}
                
                var nData = {
                    email:set[0],
                    class:set[1],
                    vorname:set[2],
                    nachname:set[3],
                    role:set[4],
                    saying:"",
                    pic:""
                  }
                data.class[set[1]].schülers.push(nData)
                data.email[set[0]] = nData;
              } else if (set[4] == "teacher") {
                if (data.abteilung[set[1]] = null) 
                  data.abteilung[set[1]] = {teachers:[]}
                
                  var nData = {
                    email:set[0],
                    abteilung:set[1],
                    vorname:set[2],
                    nachname:set[3],
                    role:set[4],
                    saying:"",
                    abkz:set[5],
                    pic:""
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
  var title = titleBox.editContents
  var objectAmm = 0;
  var pageToDuplicate = doc.pages[selectedPage.editValue-1];
  var usesGroups = isGroupBox.checkedState;
  var allTemplateObjects = pageToDuplicate.allPageItems;
  var csv = readSchüler(csvSchuelerBox.editContents)
  readSaying(csvSayingBox.editContents,csv)
  var allClasses = [];
  for(var i in csv.class)
    allClasses.push(i)
  for(var picI in csv.class) //Imports any Pic Files into the correct user
  {
    var curClass = vsc.class[picI]
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
  for(var i in allTemplateObjects)
  {
    if (allTemplateObjects.label.split("name").length > 1)
        objectAmm++;
  }
  for(var curClassName in allClasses)
  {
    var curClass = csv.class[curClassName]
    var title = curClassName;
    var sAmount = curClass.schülers.length;
    var pages = Math.ceil(sAmount / objectAmm)

  }

}else {
    myDialog.destroy();
}