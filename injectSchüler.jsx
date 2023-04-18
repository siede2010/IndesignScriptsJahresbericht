var doc = app.activeDocument;
var curWindow = app.dialogs.add({staticLabel:"Settings :"})
with (curWindow)
{
    with(dialogColumns.add())
    {
        with(dialogRows.add())
        {
            with(dialogColumns.add())
            {
                staticTexts.add({staticLabel:"Template Page :"})
                staticTexts.add({staticLabel:"File :"})
                staticTexts.add({staticLabel:"Title :"})
            }
            with(dialogColumns.add())
            {
                var tempPageBox = integerEditboxes.add({editValue:1})
                var fileBox = textEditboxes.add({editText:"Yes"})
                var titleBox = textEditboxes.add({})
            }
        }
    }
}
curWindow.show()
curWindow.destroy()