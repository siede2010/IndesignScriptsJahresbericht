var scr = "app.doc.pages"
while(true) {
    var myDialog = app.dialogs.add({name:"testing Grounds:"}) // Create a new Dialog box to edit
    with (myDialog) // uses the dialog box as the theoreticaly "this"
    {
        with (dialogColumns.add()) // adds a column to it
        {
            with(dialogRows.add()){ //row go brr
                staticTexts.add({staticLabel:"Script :"});
                var selectedPage = textEditboxes.add({editContents:scr});
            }
        }
    }
    if (myDialog.show())
    {
        scr = selectedPage.editContents;
        var attr = scr.split(".");
        var cur = this;
        try {
            for(var i in attr)
                    cur = cur[attr[i]]
            alert(cur)
        }
        catch(error)
        {
            alert(error)
        }
    }
    else
    {
        myDialog.destroy();
        break;
    }
    myDialog.destroy();
}