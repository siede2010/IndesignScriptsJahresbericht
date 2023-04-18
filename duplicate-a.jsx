var doc = app.activeDocument
var pages = doc.pages
var myDialog = app.dialogs.add({name:"page to duplicate:"}) // Create a new Dialog box to edit
with (myDialog) // uses the dialog box as the theoreticaly "this"
{
    with (dialogColumns.add()) // adds a column to it
    {
        with(dialogRows.add()){ //row go brr
                staticTexts.add({staticLabel:"Page Number :"});
                var selectedPage = integerEditboxes.add({editValue:1}); //box that hold the changeable info aka value.
        }
        with(dialogRows.add()){ //row 2 7_7
                staticTexts.add({staticLabel:"Amount :"});
                var amount = integerEditboxes.add({editValue:1}); // amount of pages copy'd
        }
    }
}
if (myDialog.show()) // calls the dialog to show itself. if it is canceled then the else condition is triggered.
{ // Happends when the user clicks on [Okay]
    var sP = parseInt(selectedPage.editValue)
    var pC = parseInt(amount.editValue)
    myDialog.destroy()
    if (sP > 0 && sP <= doc.pages.length && pC > 0) {
        var pageToDuplicate = doc.pages[sP-1]
        for(var i = pC;i>0;i--)
            pageToDuplicate.duplicate(LocationOptions.AFTER, doc.pages[-1])
    } else {
        alert("Invalid Inputs. Please try again.")
    }
}
else { // Happends when the user clicks on [Cancel]
    myDialog.destroy()
}