//var i18n = chrome.i18n.getMessage;

var info = {
    about: 'register',
    //    name: i18n('extName'),
    name: 'Lojban',
    unit: 'word',
    first: 1,
    badge: "JBO",
    items: {
        classes: ['loj', 'eng', 'def', 'raf1', 'raf2', 'raf3'],
        //        names: [i18n('char'), i18n('charcode')],
        name: ['loj', 'eng', 'def', 'raf1', 'raf2', 'raf3'],
        samples: ['A', '65']
    },
    wordDef: {
        isWord: "a-z,'"
    },
    max: 100,
    
    styles: {
        "outer": {
            backgroundColor:    "#439c17",
            borderRadius:       8,
            borderColor:        "#51b320",
            borderWidth:        3,
        },
        "loj": {
            fontSize:           20,
            fontFamily:         "sans-serif",
            color:  "#ffff00",
        },
        "eng": {
            fontSize:           20,
            fontFamily:         "sans-serif",
        },
        "def": {
            color:              "#b3e6b3",
            fontSize:           14,
        },
        "raf1": {
            fontSize: 14,
            fontFamily: "sans-serif",
        },
        "raf2": {
            fontSize: 14,
            fontFamily: "sans-serif",
        },
        "raf3": {
            fontSize: 14,
            fontFamily: "sans-serif",
        },
    }
        
};

// no that's not random garbage
// it's the extension id of Mouseover Dictionary Framework
if (chrome.extension) {
    chrome.extension.sendRequest('fcabdhekhndgdciilfhbmiepfnjabeda', info);

    chrome.extension.onRequestExternal.addListener(
        function(request, sender, sendResponse) {
            switch(request.about) {
            case 'available?':
                sendResponse(info);
                break;
            case 'load':
                // load external data if needed
                // *might* happen more than once before unload...
                //alert('load');
                try {
                    window.lojbanDictionary = new LojbanDictionary();
                    //alert('ok');
                } catch (bad) {
                    //alert('bad');
                }
                //alert('done');
                sendResponse({complete: true});
                break;
            case 'unload':
                // unload external data if it was loaded ...?
                sendResponse({complete: true});
                break;
            case 'firstQuery':
            case 'oneTimeQuery':
                sendResponse(query(request.text));
                break;
            default:
                sendResponse({});
            }
        }
    );
}
