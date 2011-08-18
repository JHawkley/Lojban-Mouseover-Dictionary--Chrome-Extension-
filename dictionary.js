
function LojbanDictionary () {
    function read(url) {
        var h = new XMLHttpRequest();
        h.open('GET',
               url,
               false);
        h.send();
        return h.response;
    }

    // put wordlists in prototype for singleton-ness
    // but initialize in constructor for laziness
    try {
    if (typeof LojbanDictionary.prototype.cmavolist == 'undefined') {
        LojbanDictionary.prototype.cmavolist = read(
            'http://www.lojban.org/publications/wordlists/cmavo.txt');
    }
    if (typeof LojbanDictionary.prototype.gismulist == 'undefined') {
        LojbanDictionary.prototype.gismulist = read(
            'http://www.lojban.org/publications/wordlists/gismu.txt');
    }
    } catch (err) {
        window.err = err;
        alert(err);
    }
}

LojbanDictionary.prototype.cmavo = function (word) {
    var line = this.cmavolist.match(new RegExp('^.'+word+' .*$', 'm'))[0];
    if (typeof line == 'undefined') {
        return null;
    }
    return {
        selmaho: line.slice(11, 20).replace(/ *$/, ''),
        def: line.slice(20, 168).replace(/ *$/, ''),
        cf: line.slice(169).replace(/ *$/, ''),
    };
}

LojbanDictionary.prototype.gismu = function (word) {
    var line = this.cmavolist.match(new RegExp('^.'+word+' .*$', 'm'))[0];
    if (typeof line == 'undefined') {
        return null;
    }
    return {
        raf1: line.slice(7,11).replace(/ *$/, ''),
        raf2: line.slice(11,15).replace(/ *$/, ''),
        raf3: line.slice(15, 20).replace(/ *$/, ''),
        eng: line.slice(20,40).replace(/ *$/, ''),
        hint: line.slice(41, 60).replace(/ *$/, ''),
        def: line.slice(62, 158).replace(/ *$/, ''),
        cf: line.slice(165).replace(/ *$/, ''),
    }
}
