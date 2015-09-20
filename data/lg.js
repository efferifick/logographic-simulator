function isNodeLGAble(aNode) {
  if (aNode.parentElement.tagName.toUpperCase() == "SCRIPT"
      || aNode.parentElement.tagName.toUpperCase() == "NOSCRIPT" ) {
    return NodeFilter.FILTER_REJECT;
  } else if (aNode.textContent == null || aNode.textContent.match(/^\s*$/) != null) {
    return NodeFilter.FILTER_REJECT;
  } else {
    return NodeFilter.FILTER_ACCEPT;
  }
}

function LGNode(oldNode) {
  var parent = oldNode.parentNode;
  var words = oldNode.nodeValue.split(' ');
  var newNode = document.createElement("span")

  words.forEach( function(word) {
    word = word.split('');
    var wordElement = document.createElement('span');
    var spaceElement = document.createElement('span');
    var spaceCharacter = document.createTextNode(' ');
    var zIndex = -1;

    wordElement.className = 'lgParent';

    spaceElement.className = 'lg0';
    spaceElement.appendChild(spaceCharacter);
    wordElement.appendChild(spaceElement);

    word.forEach( function(character) {
      var characterElement = document.createElement('span');
      var characterNode = document.createTextNode(character);
      characterElement.className = 'lg';
      characterElement.style.zIndex = zIndex;
      characterElement.appendChild(characterNode);
      wordElement.appendChild(characterElement);
      zIndex -= 2;
    });

    wordElement.style.zIndex = (zIndex + 2).toString();
    newNode.appendChild(wordElement);
  });

  newNode.className = 'lgParent';
  parent.replaceChild(newNode, oldNode);
}

function LGTree(element) {
  var filter = { acceptNode: isNodeLGAble };
  var treeWalker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, filter, false);
  //we cannot change the node in which we are walking.
  //we need to walk the tree at least once to get a current node.
  treeWalker.nextNode();
  var oldNode = treeWalker.currentNode;
  while (treeWalker.nextNode()) {
    var currentNode = treeWalker.currentNode;
    LGNode(oldNode);
    oldNode = currentNode;
  }
}

function LGAJAX(changes) {
  changes.forEach( function(change) {
      for (var i = 0; i < change.addedNodes.length; i++) {
        if (change.addedNodes[i].nodeType == Node.ELEMENT_NODE)
          LGTree(change.addedNodes[i]);
        else if (change.addedNodes[i].nodeType == Node.TEXT_NODE)
          LGNode(change.addedNodes[i]);
      }
    });
}


function animate() {
  var elements = document.getElementsByClassName('lg');
  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];
    var zIndex = parseInt(element.style.zIndex) + 2;
    element.style.zIndex = zIndex.toString();
    if (zIndex > 1) {
      element.style.zIndex = element.parentElement.style.zIndex;
    }
  }
}

function LGPage() {
  LGTree(document.body);
  var lgify = new MutationObserver(LGAJAX);
  var config = { attributes: true,
               childList: true,
               characterData: true,
               subtree: true };

  lgify.observe(document.body, config);
}

LGPage();
window.setInterval(animate, 200);
