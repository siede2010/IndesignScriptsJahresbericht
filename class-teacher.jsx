var myFolder = Folder.selectDialog("Select the folder with the pictures");
var folder = myFolder.fsName;
var myFilesFilter = "*.jpg";

function readTeachers(path) {
  var file = File(path);
  file.encoding = 'UTF8';
  if (file.open("r")) {
    var content = file.read();
    file.close;
    try {
      var lines = content.split("\n");
      for (var i = 0; i < lines.length; i++) {
        var set = lines[i].split(";");
        if (set.length >= 4) {
          var email = set[0];
          var vorname = set[1];
          var nachname = set[2];
          var abkz = set[3];

          if (email) {
            var teacher = {
              email: email,
              vorname: vorname,
              nachname: nachname,
              name: vorname + " " + nachname,
              role: "teacher",
              abkz: abkz,
              pic: "" // will be added with the pic finder
            };
            abteilung[email].teachers.push(teacher);
          }
        }
      }
    } catch (error) {
      alert(error, "ERROR when reading the CSV File Teachers. Something may be wrong with its content.");
    }
  }
}

var myPics = myFolder.getFiles(myFilesFilter);

var myDialog = app.dialogs.add({ name: "Page Number" }) // Create a new Dialog box to edit
with (myDialog) // uses the dialog box as the theoretically "this"
{
  with (dialogColumns.add()) // adds a column to it
  {
    with (dialogRows.add()) {
      staticTexts.add({ staticLabel: "Page Number :" });
      var selectedPage = integerEditboxes.add({ editValue: 1 }); //box that holds the changeable info aka value.
    }
    with (dialogRows.add()) {
      staticTexts.add({ staticLabel: "CSV Teachers Path :" });
      var csvTeachersBox = textEditboxes.add({ editContents: teachersFile }); // path to CSV file
    }
    with (dialogRows.add()) {
      staticTexts.add({ staticLabel: "File Path: " + (folder + "").split("%20").join(" ") });
    }
    with (dialogRows.add()) {
      staticTexts.add({ staticLabel: myPics.length + " pictures found" });
    }
  }
}

if (myDialog.show()) {
  var objectAmm = 0; //how many people can fit in 1 page.
  var pageToDuplicate = doc.pages[selectedPage.editValue - 1];
  var allTemplateObjects = pageToDuplicate.allPageItems;

  for (var picI in abteilung) {
    var curAbteilung = abteilung[picI];
    for (var teacher in curAbteilung.teachers) {
      var curTeacher = curAbteilung.teachers[teacher]; // current Teacher
      var nameCheck = curTeacher.nachname.toLowerCase() + "_" + curTeacher.vorname.toLowerCase();
      for (var pic in myPics) {
        if (myPics[pic].name.toLowerCase().indexOf(nameCheck) != -1) {
          curTeacher.pic = myPics[pic];
        }
      }
    }
  }
  myDialog.destroy();
} else {
  myDialog.destroy();
}
