var currentItem;
findObjectByLabel("1");
centerObject(currentItem);

function findObjectByLabel(label) {
  // Get the label you want to search for
  
  // Loop through all page items in the active document
  var allPageItems = app.activeDocument.allPageItems;
  for (var i = 0; i < allPageItems.length; i++) {
    currentItem = allPageItems[i];

    // Check if the current item's label matches the label you're looking for
    if (currentItem.label == label) {
      // Select the item
      currentItem.select();

      // Exit the loop, since you've found the item you're looking for
      break;
    }
  }
}
function centerObject(currentItem1) {
  // Get the bounds of the object
  var bounds = currentItem1.geometricBounds;

  // Calculate the width and height of the object
  var width = bounds[3] - bounds[1];
  var height = bounds[2] - bounds[0];

  // Get the width and height of the page
  var pageWidth = app.activeDocument.documentPreferences.pageWidth;
  var pageHeight = app.activeDocument.documentPreferences.pageHeight;

  // Calculate the X and Y coordinates to center the object on the page
  var x = (pageWidth - width) / 2;
  var y = (pageHeight - height) / 2;

  // Set the new geometric bounds of the object to center it on the page
  currentItem1.geometricBounds = [y, x, y + height, x + width];
}