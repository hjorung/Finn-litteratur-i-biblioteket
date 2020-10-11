

//SEARCHBOX STUFF
$(document).ready(function () {
    //select library catalogue as default
    $("#library").prop("checked", true);
    //when clicking search, adapt the URL depending on selection made
    $('#btnOpenNewTab').click(function () {
        //Get the search term, and save it as a var
        var searchstring = $('input#searchInput').val();
        //Library Catalogue
        if (
            $('#library').is(":checked")) {
            //change this url to match your library's! Here is Leiden's URL as an example for ExLibris Primo users - Old UI!
            var newLibraryURL = 'https://more-romsdal-felles.mikromarc.no/Mikromarc3/web/search.aspx?db=more-romsdal-felles&Unit=6463&SC=FT&LB=FT&IN=0&SU=0&SW=' + searchstring + '&source=LibrarySearchPluginPunblic'; //you can modofy &source to anything you like. This is useful to see how many users are coming to your catalogue via the plugin, in Google Analytics.
            // Create the new tab
            chrome.tabs.create({
                url: newLibraryURL
            });
        }
        //Worldcat
        if (
            $('#nb').is(":checked")) {
            //alert("NB checked");
            var newWorldcatURL = 'https://www.nb.no/search?q=' + searchstring;
            // Create the new tab
            chrome.tabs.create({
                url: newWorldcatURL
            });
        }
        //Google Scholar
        if (
            $('#scholar').is(":checked")) {
            //alert("Google Scholar checked");
            var newScholarURL = 'https://scholar.google.com/scholar?hl=no&q=' + searchstring;
            // Create the new tab
            chrome.tabs.create({
                url: newScholarURL
            });
        }
        //Pubmed
        if (
            $('#bibsok').is(":checked")) {
            //alert("Google Scholar checked");
            var newPubmedURL = 'https://bibsok.no/?mode=vt&&pubsok_txt_0=' + searchstring; 
            // Create the new tab
            chrome.tabs.create({
                url: newPubmedURL
            });
        }
    });
    $('#searchInput').keypress(function (e) {
        if (e.which == 13) { //Enter key pressed
            $('#btnOpenNewTab').click(); //Trigger search button click event
        }
    });
});
//CONTEXT STUFF
//Search definitions. %s is the variable that gets replaced by the search term.
var searches = [
    {
        title: "Search in the Library Catalogue", // Same as above: edit to match your library's url. Modify &soruce as well at the end. Remeber to keep '%s'
        url: "https://more-romsdal-felles.mikromarc.no/Mikromarc3/web/search.aspx?db=more-romsdal-felles&Unit=6463&SC=FT&LB=FT&IN=0&SU=0&SW=%s&source=LibrarySearchPluginPublic"
  },
    {
        title: "Search in Nasjonalbiblioteket",
        url: "https://www.nb.no/search?q=%s"
  },
    {
        title: "Search in Google Scholar",
        url: "https://scholar.google.com/scholar?q=%s"
  },
    {
        title: "Search in Biblioteksøk", // Again: remove or adapt your ezproxy URL
        url: "https://bibsok.no/?mode=vt&&pubsok_txt_0=%s"
  }
];
// Create a parent item and two children.
var parent = chrome.contextMenus.create({
    "title": "Søk med Ulstein bibliotek", // Change the name here too!
    "id": "0",
    "contexts": ["selection"]
});
searches.forEach(function (obj) {
    console.log("creating context menu item: " + JSON.stringify(obj));
    var contextMenuId = chrome.contextMenus.create({
        "title": obj.title,
        "parentId": parent,
        "contexts": ["selection"],
        "id": (searches.indexOf(obj) + 1).toString()
    });
});
// replace %s with highlighted text
chrome.contextMenus.onClicked.addListener(function (info, tab) {
    console.log(info.menuItemId);
    var searchObj = searches[info.menuItemId - 1];
    if (typeof searchObj === "undefined")
        return;
    chrome.tabs.create({
        "url": searchObj.url.replace("%s", encodeURIComponent(info.selectionText))
    });
});
