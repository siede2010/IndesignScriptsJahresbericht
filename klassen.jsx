/*
#includepath "modules;../modules";
#include 'readFiles.jsx';
#include 'createAbteilungen.jsx';
#include 'createKlassen.jsx';
#include 'createSchueler.jsx';
#include 'getPages.jsx';
#include 'filter.jsx';
*/

main();
function main()
{
    var pathbase = Folder.selectDialog('Select base Folder');
    try {
        var list = readCSV(File(pathbase + '/data.csv'));
        var zitatlist = readJSON(File(pathbase + '/data.json'));
    } catch (error) {
        alert (error, "ERROR IN klassentest.jsx! WHY DID YOU DO THIS? DHARMANN IS SAD NOW!!!!😥😥😥😥😥😥😭😭😭😭😭😭😭😭😭😭");       
    }
    var abtrange = getAbteilungen(pathbase);
    var abteilungen = createAbteilungen(list);
    abteilungen = createKlassen(list, abteilungen);
    abteilungen = createSchueler(list, zitatlist, abteilungen);
    var doc = app.activeDocument;
    var pages = doc.pages;
    
    var worked = 0;
    var satzed = 0;
    var soll = 0;
    
    for(var i = 0; i < abtrange.length; i++)
    {
        var abt = abtrange[i];
        //var abteilung = abteilungen.filter(function(a){return a.bezeichnung == abt.bezeichnung;})[0];
        var abteilung = abteilungen.filter(function(a){return a.bezeichnung == abt.bezeichnung;})[0];
        var kid = 0;
        for(var j = parseInt(abt.range.split('-')[0], 10); j < parseInt(abt.range.split('-')[1], 10) + 1; j+=2)
        {
            var page = pages[j];
            var groups = page.groups;
            var klasse = abteilung.klassen[kid];
            if(klasse.schueler.length >= 20)
            {
                var le = 20;
            }
            else
            {
                var le = klasse.schueler.length;
            }
            for(var k = 0; k < le; k++)
            {
                var textFrames = groups.itemByName(String(k + 1)).textFrames;
                textFrames[0].contents = klasse.schueler[k].forename + ' ' + klasse.schueler[k].longname;
                textFrames[1].contents = klasse.schueler[k].satz;
                if(klasse.schueler[k].satz)
                {
                    satzed++;
                }
                if(File(pathbase + '/' + klasse.schueler[k].bild).exists)
                {
                    var rectangle = groups.itemByName(String(k + 1)).rectangles[0];
                    rectangle.place(File(pathbase + '/' + klasse.schueler[k].bild));
                    rectangle.fit(FitOptions.FILL_PROPORTIONALLY);
                    worked++;
                }
                else
                {
                    var rectangle = groups.itemByName(String(k + 1)).rectangles[0];
                    var n = randomINT(1, 7);
                    var path = pathbase + '/phantom/phantom' + String(n) + '.png';
                    rectangle.place(File(path));
                    rectangle.fit(FitOptions.FILL_PROPORTIONALLY);
                }
                soll++;
            }
            for(var k = 0; k < 20; k++)
            {
                var rec = groups.itemByName(String(k + 1)).rectangles[0];
                if(rec.graphics.length == 0)
                {
                    rec.remove();
                }
            }
            var page = pages[j + 1];
            var groups = page.groups;
            for(var k = 0; k < klasse.schueler.length - 20; k++)
            {
                var textFrames = groups.itemByName(String(k + 1)).textFrames;
                textFrames[0].contents = klasse.schueler[k + 20].forename + ' ' + klasse.schueler[k + 20].longname;
                textFrames[1].contents = klasse.schueler[k + 20].satz;
                if(File(pathbase + '/' + klasse.schueler[k + 20].bild).exists)
                {
                    var rectangle = groups.itemByName(String(k + 1)).rectangles[0];
                    rectangle.place(File(pathbase + '/' + klasse.schueler[k + 20].bild));
                    rectangle.fit(FitOptions.FILL_PROPORTIONALLY);
                    worked++;
                }
                else
                {
                    var rectangle = groups.itemByName(String(k + 1)).rectangles[0];
                    var n = randomINT(1, 7);
                    rectangle.place(File(pathbase + '/phantom/phantom' + String(n) + '.png'));
                    rectangle.fit(FitOptions.FILL_PROPORTIONALLY);
                }
                soll++;
            }
            var klassenbild = page.rectangles[0];
            if(File(pathbase + '/klassen/' + klasse.bezeichnung + '.JPG').exists)
            {
                klassenbild.place(File(pathbase + '/klassen/' + klasse.bezeichnung + '.JPG'));
                rectangle.fit(FitOptions.FILL_PROPORTIONALLY);
            }
            else
            {
                klassenbild.remove();
            }
            for(var k = 0; k < 6; k++)
            {
                var rec = groups.itemByName(String(k + 1)).rectangles[0];
                if(rec.graphics.length == 0)
                {
                    rec.remove();
                }
            }
            kid++;
        }

    }
    alert(worked  + "/" + soll + " Schüler mit Bildern\n" + satzed + "/" + soll + " Schüler mit Sätzen");
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    OLD
    /*
    sus
    var abteilung = abteilungen.filter(function(a){return a.bezeichnung == 'HIT';})[0];
    var klasse = abteilung.klassen.filter(function(k){return k.bezeichnung == '3BHIT';})[0];
    klasse.schueler = klasse.schueler.sort(GetSortOrder('longname'));
    for(var i = 0; i < pages.length; i++)
    {
        var page = pages[i];
        if(i == 1)
        {
            var groups = page.groups;
            if(klasse.schueler.length >= 20)
            {
                var le = 20;
            }
            else
            {
                var le = klasse.schueler.length;
            }
            for(var j = 0; j < le ; j++)
            {
                var textFrames = groups.itemByName(String(j + 1)).textFrames;
                textFrames[1].contents = klasse.schueler[j].forename + ' ' + klasse.schueler[j].longname;
                textFrames[0].contents = klasse.schueler[j].satz;
                if(File(pathbase + '/' + klasse.schueler[j].bild).exists)
                {
                    var rectangle = groups.itemByName(String(j + 1)).rectangles[0];
                    rectangle.place(File(pathbase + '/' + klasse.schueler[j].bild));
                    rectangle.fit(FitOptions.FILL_PROPORTIONALLY);
                }
            }
        }
        if(i == 2)
        {
            var groups = page.groups;
            for(var j = 0; j < klasse.schueler.length - 20 ; j++)
            {
                var textFrames = groups.itemByName(String(j + 1)).textFrames;
                textFrames[1].contents = klasse.schueler[j + 20].forename + ' ' + klasse.schueler[j + 20].longname;
                textFrames[0].contents = klasse.schueler[j + 20].satz;
                if(File(pathbase + '/' + klasse.schueler[j + 20].bild).exists)
                {
                    var rectangle = groups.itemByName(String(j + 1)).rectangles[0];
                    rectangle.place(File(pathbase + '/' + klasse.schueler[j + 20].bild));
                    rectangle.fit(FitOptions.FILL_PROPORTIONALLY);
                }
            }
            page.rectangles[0].place(File(pathbase + '/klassen/' + klasse.bezeichnung + '.JPG'));
            page.rectangles[0].fit(FitOptions.FILL_PROPORTIONALLY);
        }
    }
    */
}

function GetSortOrder(prop) {    
    return function(a, b) {    
        if (a[prop] > b[prop]) {    
            return 1;    
        } else if (a[prop] < b[prop]) {    
            return -1;    
        }    
        return 0;    
    }    
}

function randomINT(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}