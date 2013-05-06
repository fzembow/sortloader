/**
 * Alphabetizes a page's letters, and then uses bubble
 * sort to put them back in the correct order.
 *
 * Author: Fil Zembowicz (fil@filosophy.org)
 *
 */



/** 
 * Delay between rounds of bubblesort.
 * @const
 */
var INTERVAL_MS = 1;



/** 
 * Whether to skip whitespace.
 * @const
 */
var SKIP_WHITESPACE = true;


// Run when the program starts.
function init(){

  // Determine whether to use monospace.
  toggleHash();

  var textNodes = getTextNodes(document.body);
  var letters = getSortedLetters(textNodes);
  renderString(letters, textNodes);
  bubbleSort(letters, textNodes);
}


/**
 * Toggles font families.
 */
function toggleHash(){
  if (location.hash == "#mono") {
    document.body.style.fontFamily = 'monospace';
  } else {
    document.body.style.fontFamily = 'Helvetica, Arial, sans-serif';
  }
}


/**
 * Finds the text nodes in the document.
 * @param {Element} elem The root element.
 * @return {Array.<Element>} The text nodes descendant from
 *   the root element.
 */
function getTextNodes(elem){
  var textNodes = [];
  var children = elem.childNodes;
  for (var i = 0; i < children.length; i++) {
    var node = children[i];
    if (node.nodeType == 1) {
      // Element, so descend into its children.
      textNodes = textNodes.concat(getTextNodes(node));
    } else if (node.nodeType == 3) {
      // Text node.
      textNodes.push(node);
    }
  }
  return textNodes;
}


/**
 * Gets a sorted list of letters along with their
 * final indices.
 * @param {Array.<Element>} The list of textNodes.
 * @return {Array.<Object>} The list of letters.
 */
function getSortedLetters(textNodes){
  var letters = [];
  var stringIndex = 0;
  for (var i = 0; i < textNodes.length; i++) {
    var textContent = textNodes[i].data;
    for (var j = 0; j < textContent.length; j++) {
      var l = textContent[j];
      if (!SKIP_WHITESPACE || l.match(/\S/)) {
        letters.push({index: stringIndex, letter: textContent[j]});
        stringIndex++;
      }
    }
  }
  letters.sort(function(a, b){
      return a.letter.charCodeAt(0) - b.letter.charCodeAt(0);
  });
  return letters;
}


/**
 * Renders letters into textnodes.
 * @param {Array.<Object>} letters The list of letters.
 * @param {Array.<Element>} textNodes The list of textNodes.
 */
function renderString(letters, textNodes){

  var textNodeIndex = 0;
  var letterIndex = 0;

  while(textNodeIndex < textNodes.length) {
    var textNode = textNodes[textNodeIndex];
    var textNodeData = textNode.data;
    var textNodeLength = textNodeData.length;
    var textString = '';

    for (var i = 0; i < textNodeLength; i++) {
      var l = textNodeData[i];
      if (!SKIP_WHITESPACE || l.match(/\S/)) {
        textString += letters[letterIndex].letter;
        letterIndex++;
      } else {
        textString += l;
      }
    }
    textNode.data = textString;
    textNodeIndex++;
  }
}


/**
 * Run a cycle of bubblesort. If the sorting isn't complete,
 * this will call itself until completion.
 * @param {Array.<Object>} letters The list of letters.
 * @param {Array.<Element>} textNodes The list of textNodes.
 */
function bubbleSort(letters, textNodes){
  var didSwap = false;
  var max = letters.length - 1;

  for (i = max; i > 0; i--) {
    var letter = letters[i];
    var prevLetter = letters[i - 1];
    if (letter.index < prevLetter.index) {
      letters[i - 1] = letter;
      letters[i] = prevLetter;
      didSwap = true;
    }
  }

  renderString(letters, textNodes);
  if (didSwap) {
    setTimeout(bubbleSort.bind(this, letters, textNodes), INTERVAL_MS);
  }
}

// Let's go.
init();
