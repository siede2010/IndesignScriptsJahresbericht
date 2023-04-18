//Just Wow ;)
var doc = app.activeDocument //gets current document
var pages = doc.pages //Pages brrrrrrr
for(var i in pages) //for each page.
{
    var page = pages[i] //get current Page
        var textFrames = doc.textFrames //all textFrames
    if (textFrames.length > 0) //No execute if non exists

        for(var j = 0; j < textFrames.length; j++) // for each textFrame
        {
            var textFrame = textFrames[j]
            
            textFrame.contents = "WOW" //contents = texts also. '-u*"WOW"*u-'
        }
        var text = ""
        text += page + "\n"
        text += doc + "\n"
        text += doc.textFrames + "\n"
        text += doc.rectangles + "\n"
        text += doc.groups + "\n"
        var myDialog = app.dialogs.add({name:"output:"})
        alert()
        with (myDialog)
        {
            with (dialogColumns.add())
            {
                for (var textNum in text.split("\n"))
                with (dialogRows.add())
                {
                    staticTexts.add({staticLabel:text.split("\n")[textNum]})
                }
            }
        }
        var exists = myDialog.show()
        if (!exists)
            myDialog.destroy()
}