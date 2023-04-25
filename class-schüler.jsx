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
           data.email = {}
           for(var i = 0; i < lines.length; i++){
              var set = lines[i].split(";");
              if (set[4] == "schüler")
              {
                if (data.class[set[1]] == null) 
                  data.class[set[1]] = {schülers:[]}
                
                var nData = {
                    email:set[0],
                    vorname:set[2],
                    nachname:set[3],
                    role:set[4],
                    saying:""
                  }
                data.class[set[1]].schülers.push(nData)
                data.email[set[0]] = nData;
              } else {
                if (data.abteilung[set[1]] = null) 
                  data.abteilung[set[1]] = {teachers:[]}
                
                  var nData = {
                    email:set[0],
                    vorname:set[2],
                    nachname:set[3],
                    role:set[4],
                    saying:"",
                    abkz:set[5]
                }
                data.abteilung[set[1]].teachers.push(nData)
                data.email[set[0]] = nData;
              }
           }
       } catch (error) { alert (error, "ERROR when reading the CSV File. something may be wrong with its content."); }
       return data;
   } return null;
}
function readSaying(path)
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
           for(var i = 0; i < lines.length; i++){
             
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

if (f != null && folder != null) return;
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
     with(dialogRows.add()){ //row go brr
       staticTexts.add({staticLabel:"Uses Groups? [group%0 as example] :"});
       var isGroupBox = checkboxControls.add({checkedState:true}); //so you can switch between new version and old one.
     }
   }
}