/*
#includepath "modules;../modules";
#include "createLehrer.jsx";
#include "includes.jsx";
#include "readFiles.jsx";
#include './filter.jsx';
#include 'createAbteilungen.jsx';
#include 'createKlassen.jsx';
#include 'createSchueler.jsx';
#include 'getPages.jsx';
*/

main();
function main()
{
    var pathbase = Folder.selectDialog("select base folder");
    var seiten = createLehrer(pathbase + '/lehrer.csv');    
    var range = readJSON(pathbase + '/settings.json').lehrer.range;
    var begin = parseInt(range.split('-')[0], 10);
    var end = parseInt(range.split('-')[1], 10);
    var doc = app.activeDocument;
    var pages = doc.pages;
    var lid = 0;
    for(var i = begin; i <= end; i++)
    {
        var seite = seiten[lid];
        var page = pages[i];
        for(var j = 0; j < seite.lehrer.length; j++){
            if(File(pathbase + '/lehrer/' + seite.lehrer[j].longname + '_' +  titleCase(seite.lehrer[j].forename) + '.png').exists){
                var amongus = page.rectangles;
                for(var k = 0; k < amongus.count(); k++){
                        if(amongus[k].label == 'Picture' + String(j + 1) ){
                            var rec = amongus[k];
                            }
                    }
                rec.place(File(pathbase + '/lehrer/' + seite.lehrer[j].longname + '_' + titleCase(seite.lehrer[j].forename) + '.png'));
                rec.fit(FitOptions.FILL_PROPORTIONALLY);
                var amongus2 = page.textFrames;
                for(var k = 0; k < amongus2.count(); k++){
                        if(amongus2[k].label =='Name' + String(j + 1)){
                            var txt = amongus2[k];
                            }
                    }
                //var txt = page.textFrames.filter(function(a){return a.label == ('Name' + String(j + 1));})[0];
                txt.contents =  titleCase(seite.lehrer[j].forename) +" "+ titleCase(seite.lehrer[j].longname);
            }
            else{
                var amongus = page.rectangles;
                for(var k = 0; k < amongus.count(); k++){
                        if(amongus[k].label == 'Picture' + String(j + 1) ){
                            var rec = amongus[k];
                            }
                    }
                rec.place(File(pathbase + '/phantom/phantom' + String(j%7+1) + '.png'));
                rec.fit(FitOptions.FILL_PROPORTIONALLY);
                var amongus2 = page.textFrames;
                for(var k = 0; k < amongus2.count(); k++){
                        if(amongus2[k].label =='Name' + String(j + 1)){
                            var txt = amongus2[k];
                            }
                    }
                //var txt = page.textFrames.filter(function(a){return a.label == ('Name' + String(j + 1));})[0];
                txt.contents =  titleCase(seite.lehrer[j].forename) +" "+ titleCase(seite.lehrer[j].longname);
                }
        }
        lid++;
    }
}

function titleCase(str) {
  str = str.toLowerCase().split('');
  str[0] = str[0].toUpperCase();
  return str.join('');
}

function randomINT(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}