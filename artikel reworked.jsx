/*
#includepath "modules;../modules";
#include "readFiles.jsx";
#include "json2.js";
#include "getPages.jsx";
#include "includes.jsx";
*/

main();
function main()
{
    var pathbase = Folder.selectDialog("select base folder");
    var text = 0;
    var pictures = 0;
    
    if(!pathbase)
    {
        return;
    }     
    var range = getPages(pathbase);
    var doc = app.activeDocument;
    var pages = doc.pages;
    for(var i in pages)
    {
        if(range.includes(i))
        {
            var page = pages[i];
            var data = readJSON(pathbase + '/' + i + '.json');
            var textFrames = page.textFrames;
            var rectangles = page.rectangles;
            for(var j = 0; j < textFrames.length; j++)
            {
                var textFrame = textFrames[j];
                if(textFrame.label)
                {
                    textFrame.contents = data[textFrame.label];
                    text++;
                }
            }
            for(var j = 0; j < rectangles.length; j++)
            {
                var rectangle = rectangles[j];
                if(rectangle.label)
                {
                    rectangle.place(File(pathbase + '/' + data[rectangle.label]));
                    rectangle.fit(FitOptions.FILL_PROPORTIONALLY);
                    pictures++;
                }
            }
        }
    }
    alert(text + " TextBoxes were filled\n"+ pictures + " Pictures were added");
}   