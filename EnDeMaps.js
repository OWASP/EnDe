/* ========================================================================= //
// vi:  ts=4:
// vim: ts=4:
#?
#? NAME
#?      EnDeMaps.js
#?
#? SYNOPSIS
#?      <SCRIPT language="JavaScript1.3" type="text/javascript" src="EnDeMaps.gen.js"></SCRIPT>
#?      <SCRIPT language="JavaScript1.3" type="text/javascript" src="EnDeMaps.js"></SCRIPT>
#?
#? DESCRIPTION
#?      Functions to initialize character maps defined in  EnDe.MAPS  or loaded
#?      from  EnDeMaps.txt  using XMLHttpRequest();
#?
#?      Initializes following maps:
#?          EnDe.intMap     - array of [standard, Entity, Group, Desciption]
#?                            index is charCode
#?          EnDe.ncrMap     - array of char codes
#?                            index is entity name
#           EnDe.ucsMap     - array of characters where unicode base cannot be
#                             calculated from its integer value
#?          EnDe.dupMap     - array of duplicate entity names (of EnDe.intMap)
#?                            unsorted, no index
#?          EnDe.xmlMap     - array of entities for XML
#?                            index is charCode
#                             this map may be extended dynamically
#?          EnDe.winMap     - for CP-1252 codings
#?          EnDe.winfMap    - for CP-1252 codings
#?          EnDe.figsMap    - Baudot figures
#?          EnDe.ltrsMap    - Baudot letters
#?          EnDe.sosMap     - array of Morse characters
#?          EnDe.osoMap     - reverse array of Morse characters
#?          EnDe.asciiMap   - array 8-bit ASCII characters
#?          EnDe.ebcdicMap  - array 8-bit EBCDIC characters
#?          EnDe.ebcdicUTF  - array 8-bit UTF-EBCDIC characters
#?          EnDe.romanMap   - array 8-bit Mac OS Roman characters
#?          EnDe.u2superMap - Unicode = Unicode superscript characters
#?          EnDe.super2uMap - Unicode superscript = Unicode characters
#?          EnDe.u2subMap   - Unicode = Unicode subscript characters
#?          EnDe.sub2uMap   - Unicode subscript = Unicode characters
#?          EnDe.a2eMap     - index is ASCII charCode, value index to ebcdicMap
#?          EnDe.e2aMap     - index is EBCDIC charCode, value index to asciiMap
#?          EnDe.AbrMap     - ASCII Braille characters
#?                            index is character, value is string
#?          EnDe.DbrMap     - Standard (dotless) Braille characters
#?                            index is character, value is string
#?          EnDe.DadMap     - Dada Urka
#?                            index is character, value is string
#?          EnDe.spaceMap   -
#?          EnDe.uhwMap     -
#?          EnDe.asciiMap   -
#?          EnDe.BladeMap   -
#?          EnDe.DIN66003Map    -
#?          EnDe.DIN66003fMap   -
#?          EnDe.dnaMap     -
#?          EnDe.rangeMap   -
#?          EnDe.mg0Map     - 3x5 matrix for digits; MathGuard style
#?          EnDe.mg1Map     - 3x5 matrix for digits; MathGuard variuant
#?
#? SEE ALSO
#?      EnDe.js
#?      EnDeMaps.txt
#?
#? VERSION
#?      @(#) EnDeMaps.js 3.25 13/06/23 01:03:16
#?
#? AUTHOR
#?      05-jun-07 Achim Hoffmann, mailto: EnDe (at) my (dash) stp (dot) net
#?
 * ========================================================================= */

if (typeof(EnDe)==='undefined') { EnDe = new function() {}; }

// EnDe.Maps object see behind Ende object extension below

// ===================================================================== //
// extend EnDe object  with character, Unicode, duplicate map            //
// ===================================================================== //


/* ------------- following must be defined in EnDe.js
EnDe.mapInt = 0;
EnDe.mapStd = 1;
EnDe.mapChr = 1;
EnDe.mapDsc = 2;
EnDe.mapEty = 2;
EnDe.mapSet = 3;
EnDe.mapTxt = 4;

EnDe.intMap = new Array(256*256);
EnDe.ncrMap = new Array();
EnDe.ucsMap = new Array();
EnDe.dupMap = new Array();
EnDe.xmlMap = new Array();
EnDe.winMap = new Array();
EnDe.winfMap= new Array();
EnDe.figsMap= new Array();
EnDe.ltrsMap= new Array();
EnDe.sosMap = new Array(50);
EnDe.osoMap = new Array(50);
EnDe.spaceMap   = new Array(50);
EnDe.asciiMap   = new Array(256);
EnDe.DIN66003Map= new Array(256);
EnDe.DIN66003fMap=new Array(256);
EnDe.ebcdicMap  = new Array(256);
EnDe.ebcdicUTF  = new Array(256);
EnDe.romanMap   = new Array(256);
EnDe.u2superMap = new Array(256);
EnDe.super2uMap = new Array(256);
EnDe.u2subMap   = new Array(256);
EnDe.sub2uMap   = new Array(256);
EnDe.a2rMap     = new Array(256);
EnDe.r2aMap     = new Array(256); 
EnDe.a2eMap     = new Array(256);
EnDe.e2aMap     = new Array(256); 
EnDe.BladeMap   = new Array(16);
EnDe.mg0Map     = new Array(10);
EnDe.mg1Map     = new Array(10);
------------- */

//      to unescape \n here (see _u() below)

/*
 * Symbol characters (i.e. Braille)
 * for en-/decoding see EnDe.{EN,DE}.symbol()
 */
/*
	following Braille character: 1-3-4-5

		**
		 *
		*

	can be written as:

		'**\n *\n* '
		 14  25  36

	or as array:

		Array(3,1,2)
 */
/* References dor Braille
 * http://www.dotlessbraille.org/FACInfo.htm
 * http://www.brl.org/
 * http://de.wikipedia.org/wiki/Brailleschrift
 * http://en.wikipedia.org/wiki/Braille_ASCII
*/
/*
 * Standard (dotless) Braille characters
 */
EnDe.DbrMap['digit']=' *\n *\n**'; // used as prefix to digits same as '#'
EnDe.DbrMap[' ']=Array(0,2,0);  // '  \n* \n  '
EnDe.DbrMap['1']=Array(2,0,0);  // '* \n  \n  '
EnDe.DbrMap['2']=Array(2,2,0);  // '* \n* \n  '
EnDe.DbrMap['3']=Array(3,0,0);  // '**\n  \n  '
EnDe.DbrMap['4']=Array(3,1,0);  // '**\n *\n  '
EnDe.DbrMap['5']=Array(2,1,0);  // '* \n *\n  '
EnDe.DbrMap['6']=Array(3,2,0);  // '**\n* \n  '
EnDe.DbrMap['7']=Array(3,3,0);  // '**\n**\n  '
EnDe.DbrMap['8']=Array(2,3,0);  // '* \n**\n  '
EnDe.DbrMap['9']=Array(1,2,0);  // ' *\n* \n  '
EnDe.DbrMap['0']=Array(1,3,0);  // ' *\n**\n  '
//
EnDe.DbrMap['a']=Array(2,0,0);  // '* \n  \n  '
EnDe.DbrMap['b']=Array(2,2,0);  // '* \n* \n  '
EnDe.DbrMap['c']=Array(3,0,0);  // '**\n  \n  '
EnDe.DbrMap['d']=Array(3,1,0);  // '**\n *\n  '
EnDe.DbrMap['e']=Array(2,1,0);  // '* \n *\n  '
EnDe.DbrMap['f']=Array(3,2,0);  // '**\n* \n  '
EnDe.DbrMap['g']=Array(3,3,0);  // '**\n**\n  '
EnDe.DbrMap['h']=Array(2,3,0);  // '* \n**\n  '
EnDe.DbrMap['i']=Array(1,2,0);  // ' *\n* \n  '
EnDe.DbrMap['j']=Array(1,3,0);  // ' *\n**\n  '
//
EnDe.DbrMap['k']=Array(2,0,2);  // '* \n  \n* '
EnDe.DbrMap['l']=Array(2,2,2);  // '* \n* \n* '
EnDe.DbrMap['m']=Array(3,0,2);  // '**\n  \n* '
EnDe.DbrMap['n']=Array(3,1,2);  // '**\n *\n* '
EnDe.DbrMap['o']=Array(2,1,2);  // '* \n *\n* '
EnDe.DbrMap['p']=Array(3,2,2);  // '**\n* \n* '
EnDe.DbrMap['q']=Array(3,3,2);  // '**\n**\n* '
EnDe.DbrMap['r']=Array(2,3,2);  // '* \n**\n* '
EnDe.DbrMap['s']=Array(1,2,2);  // ' *\n* \n* '
EnDe.DbrMap['t']=Array(1,3,2);  // ' *\n**\n* '
//
EnDe.DbrMap['u']=Array(2,0,3);  // '* \n  \n**'
EnDe.DbrMap['v']=Array(2,2,3);  // '* \n* \n**'
EnDe.DbrMap['w']=Array(1,3,1);  // ' *\n**\n *'
EnDe.DbrMap['x']=Array(3,0,3);  // '**\n  \n**'
EnDe.DbrMap['y']=Array(3,1,3);  // '**\n *\n**'
EnDe.DbrMap['z']=Array(2,1,3);  // '* \n *\n**'
EnDe.DbrMap['ß']=Array(1,2,3);  // ' *\n* \n**'
EnDe.DbrMap['st']=Array(1,3,3); // ' *\n**\n**'
EnDe.DbrMap['au']=Array(2,0,1); // '* \n  \n *'
EnDe.DbrMap['eu']=Array(2,2,1); // '* \n* \n *'
//
EnDe.DbrMap[',']=Array(0,2,0);  // '  \n* \n  '
EnDe.DbrMap[';']=Array(0,2,2);  // '  \n* \n* '
EnDe.DbrMap[':']=Array(0,3,0);  // '  \n**\n  '
EnDe.DbrMap['.']=Array(0,0,2);  // '  \n  \n* '
EnDe.DbrMap['?']=Array(0,2,1);  // '  \n* \n *'
EnDe.DbrMap['!']=Array(0,3,2);  // '  \n**\n* '
EnDe.DbrMap['(']=Array(0,3,3);  // '  \n**\n**'
EnDe.DbrMap[')']=Array(0,3,3);  // '  \n**\n**'
EnDe.DbrMap['"']=Array(0,2,3);  // '  \n* \n**'
EnDe.DbrMap['"']=Array(0,1,3);  // '  \n *\n**'
EnDe.DbrMap['-']=Array(0,0,3);  // '  \n  \n**'
/*
 * ASCII Braille characters
 */
EnDe.AbrMap     = EnDe.DbrMap;
EnDe.AbrMap[' ']=Array(0,0,1);  // '  \n  \n *'
//
EnDe.AbrMap[',']=Array(0,0,1);  // '  \n  \n *'
EnDe.AbrMap[';']=Array(0,2,1);  // '  \n *\n *'
EnDe.AbrMap[':']=Array(0,2,1);  // '* \n *\n *'
EnDe.AbrMap['.']=Array(0,0,1);  // ' *\n  \n *'
EnDe.AbrMap['?']=Array(0,2,1);  // '**\n *\n *'
EnDe.AbrMap['!']=Array(0,2,3);  // ' *\n* \n**'
EnDe.AbrMap['(']=Array(0,2,3);  // '* \n**\n**'
EnDe.AbrMap[')']=Array(0,2,3);  // ' *\n**\n**'
EnDe.AbrMap['"']=Array(0,2,0);  // '  \n *\n  '
EnDe.AbrMap['"']=Array(0,0,1);  // '  \n  \n *'
EnDe.AbrMap['-']=Array(0,0,3);  // '  \n  \n**'
//
EnDe.AbrMap['#']=Array(1,1,3);  // ' *\n *\n**'
EnDe.AbrMap['$']=Array(3,2,1);  // '**\n* \n *'
EnDe.AbrMap['%']=Array(3,0,1);  // '**\n  \n *'
EnDe.AbrMap['&']=Array(3,2,3);  // '**\n* \n**'
EnDe.AbrMap["'"]=Array(0,0,2);  // '  \n  \n* '
EnDe.AbrMap['*']=Array(2,0,1);  // '* \n  \n *'
EnDe.AbrMap['+']=Array(1,0,3);  // ' *\n  \n**'
EnDe.AbrMap['/']=Array(1,0,2);  // ' *\n  \n* '
EnDe.AbrMap['<']=Array(2,2,1);  // '* \n* \n *'
EnDe.AbrMap['=']=Array(3,3,3);  // '**\n**\n**'
EnDe.AbrMap['>']=Array(1,1,2);  // ' *\n *\n* '
EnDe.AbrMap['@']=Array(1,0,0);  // ' *\n  \n  '
EnDe.AbrMap['[']=Array(1,2,1);  // ' *\n* \n *'
EnDe.AbrMap['\\']=Array(2,3,1); // '* \n**\n *'
EnDe.AbrMap[']']=Array(3,3,1);  // '**\n**\n *'
EnDe.AbrMap['^']=Array(1,1,0);  // ' *\n *\n  '
EnDe.AbrMap['_']=Array(1,1,2);  // ' *\n *\n* '

/*
 * (MathGuard) 3x5 matrix for digits; variant 0
 */
EnDe.mg0Map['0']=Array(7,5,5,5,7);
EnDe.mg0Map['1']=Array(2,6,2,2,7);
EnDe.mg0Map['2']=Array(7,1,7,4,7);
EnDe.mg0Map['3']=Array(7,1,7,1,7);
EnDe.mg0Map['4']=Array(4,5,7,1,1);
EnDe.mg0Map['5']=Array(7,4,7,1,7);
EnDe.mg0Map['6']=Array(7,4,7,5,7);
EnDe.mg0Map['7']=Array(7,1,1,1,1);
EnDe.mg0Map['8']=Array(7,5,7,5,7);
EnDe.mg0Map['9']=Array(7,5,7,1,7);
EnDe.mg0Map['+']=Array(0,2,7,2,0);
EnDe.mg0Map['-']=Array(0,0,7,0,0);
EnDe.mg0Map['*']=Array(0,5,2,5,0);
EnDe.mg0Map['/']=Array(0,1,2,4,0);
EnDe.mg0Map['=']=Array(0,7,0,7,0);
EnDe.mg0Map['.']=Array(0,0,0,2,0);
EnDe.mg0Map[',']=Array(0,0,0,2,2);
EnDe.mg0Map[' ']=Array(0,0,0,0,0);

/*
 * (MathGuard) 3x5 matrix for digits; variant 1
 */
EnDe.mg1Map['0']=Array(2,5,5,5,2);
EnDe.mg1Map['1']=Array(2,6,2,2,2);
EnDe.mg1Map['2']=Array(6,1,2,4,7);
EnDe.mg1Map['3']=Array(6,1,6,1,6);
EnDe.mg1Map['4']=Array(1,3,7,1,1);
EnDe.mg1Map['5']=Array(7,4,6,1,6);
EnDe.mg1Map['6']=Array(2,4,6,5,2);
EnDe.mg1Map['7']=Array(7,1,1,2,4);
EnDe.mg1Map['8']=Array(2,5,2,5,2);
EnDe.mg1Map['9']=Array(2,5,3,1,2);
EnDe.mg1Map['+']=Array(0,2,7,2,0);
EnDe.mg1Map['-']=Array(0,0,7,0,0);
EnDe.mg1Map['*']=Array(0,5,2,5,0);
EnDe.mg1Map['/']=Array(0,1,2,4,0);
EnDe.mg1Map['=']=Array(0,7,0,7,0);
EnDe.mg1Map['.']=Array(0,0,0,2,0);
EnDe.mg1Map[',']=Array(0,0,0,2,4);
EnDe.mg1Map[' ']=Array(0,0,0,0,0);

// ToDo following settings need to be moved to EnDeMaps.txt (missing 'cause we

/*
 * Dada Urka  http://www.leiber.ws/dirk/dadaurka.htm
 */
EnDe.DadMap['a']='|   \n|   \n+---';
EnDe.DadMap['b']='|   \n|*  \n+---';
EnDe.DadMap['c']='|   \n|** \n+---';
EnDe.DadMap['d']='   |\n   |\n---+';
EnDe.DadMap['e']='   |\n  *|\n---+';
EnDe.DadMap['f']='   |\n **|\n---+';
EnDe.DadMap['g']='---+\n   |\n   |';
EnDe.DadMap['h']='---+\n  *|\n   |';
EnDe.DadMap['i']='---+\n **|\n   |';
EnDe.DadMap['j']='+---\n|   \n|   ';
EnDe.DadMap['k']='+---\n|*  \n|   ';
EnDe.DadMap['l']='+---\n|**|\n|   ';
EnDe.DadMap['m']='|  |\n|  |\n+--+';
EnDe.DadMap['n']='|  |\n|* |\n+--+';
EnDe.DadMap['o']='|  |\n|**|\n+--+';
EnDe.DadMap['p']='---+\n   |\n---+';
EnDe.DadMap['q']='---+\n  *|\n---+';
EnDe.DadMap['r']='---+\n **|\n---+';
EnDe.DadMap['s']='+--+\n|  |\n|  |';
EnDe.DadMap['t']='+--+\n|* |\n|  |';
EnDe.DadMap['u']='+--+\n|**|\n|  |';
EnDe.DadMap['v']='+---\n|*  \n+---';
EnDe.DadMap['w']='+--+\n|  |\n+--+';
EnDe.DadMap['x']='+--+\n|* |\n+--+';
EnDe.DadMap['y']='+--+\n|**|\n+--+';
EnDe.DadMap['z']='+---\n|   \n+---';
EnDe.DadMap['A']='|   \n|   \n+---';
EnDe.DadMap['B']='|   \n|*  \n+---';
EnDe.DadMap['C']='|   \n|   \n+---';
EnDe.DadMap['D']='   |\n   |\n---+';
EnDe.DadMap['E']='   |\n  *|\n---+';
EnDe.DadMap['F']='   |\n **|\n---+';
EnDe.DadMap['G']='---+\n   |\n   |';
EnDe.DadMap['H']='---+\n  *|\n   |';
EnDe.DadMap['I']='---+\n **|\n   |';
EnDe.DadMap['J']='+---\n|   \n|   ';
EnDe.DadMap['K']='+---\n|*  \n|   ';
EnDe.DadMap['L']='+---\n|**|\n|   ';
EnDe.DadMap['M']='|  |\n|  |\n+--+';
EnDe.DadMap['N']='|  |\n|* |\n+--+';
EnDe.DadMap['O']='|  |\n|**|\n+--+';
EnDe.DadMap['P']='---+\n   |\n---+';
EnDe.DadMap['Q']='---+\n  *|\n---+';
EnDe.DadMap['R']='---+\n **|\n---+';
EnDe.DadMap['S']='+--+\n|  |\n|  |';
EnDe.DadMap['T']='+--+\n|* |\n|  |';
EnDe.DadMap['U']='+--+\n|**|\n|  |';
EnDe.DadMap['V']='+---\n|*  \n+---';
EnDe.DadMap['W']='+--+\n|  |\n+--+';
EnDe.DadMap['X']='+--+\n|* |\n+--+';
EnDe.DadMap['Y']='+--+\n|**|\n+--+';
EnDe.DadMap['Z']='+---\n|   \n+---';

// ========================================================================= //
// EnDe.Maps object methods                                                  //
// ========================================================================= //

EnDe.Maps   = new function() {
	this.SID    = '3.25';
	this.sid    = function() { return('@(#) EnDeMaps.js 3.25 13/06/23 01:03:16 EnDe.Maps'); };
	this.trace  = false;

	this.traces = [];   /* used for trace, as GUI function are not avaialable
						 * here; array must be printed in calling function
						 */

	/* Very ugly hack: all EnDe.Maps.* methods are called while loading the GUI
	 * into the browser, hence the GUI have not yet been called to check search
	 * parameters in the URL or checkboxes in the HTML.
	 * Also when EnDe.js is used as library, there is no GUI.
	 * Hence the hardcoded check for search parameters, details see EnDeGUI.js.
	 */
	if (typeof(location)!=='undefined') {
		if (location.search) {
			if (/traceMaps?/i.test(location.search)===true) { this.trace = true; }
		}
	}

	// ===================================================================== //
	// internal/private functions                                            //
	// ===================================================================== //

	function __dbx(t,n) { if (EnDe.Maps.trace===true) { EnDe.Maps.traces.push(t); } };

	// ===================================================================== //
	// public functions                                                      //
	// ===================================================================== //

	this.init   = function() {
	//#? intialize EnDe maps                                                            //
	var file='EnDeMaps.txt';
	var a   = 0;
	var e   = 0;
	var cnt = 0;
	var idx = 0;
	var txt = '';
	var kkk = '';
	var map = '';
	var typ = '';
	var ccc = '';
	var bbb = null; // XMLHttpRequest()
	var arr = null;
	var req = null;
	var skip= true;

// ToDo: unescape only used for some maps
	function _u(src) {
		//# very simple unescape for some \-escaped characters
		if (src.match(/^\\/)===null) { return src; }
		switch(src[1]) {
		  case '0': return '\0'; break;
		  case 'b': return '\b'; break;
		  case 'h': return '\h'; break;
		  case 'v': return '\v'; break;
		  case 't': return '\t'; break;
		  case 'n': return '\n'; break;
		  case 'r': return '\r'; break;
		  default:  return src;  break;
		}
	}; 

	if (typeof(EnDe.MAPS)!=='undefined') {
		// requires: <script src="EnDeMaps.gen.js"></script> in EnDe.html
		// or: EnDeMaps.gen.js being part of code (if used as library)
		__dbx('EnDe.Maps.init: EnDe.MAPS');

		txt = EnDe.MAPS;
		delete EnDe.MAPS;
		// file included by *.html, add to list
		EnDe.File.list.push([ 'HTML', true, '', txt.split('\n').length, 'EnDeMaps.gen.js', '?' ]);
	} else { 
		// if <script src="EnDeMaps.gen.js"></script> failed try to read
		// plain text file
		__dbx('EnDe.Maps.init: XMLHttpRequest.open(GET, ' + file + ')');
		if (typeof(XMLHttpRequest)==='undefined') { return; }
		bbb = new XMLHttpRequest();
		// maps from external file
		req = bbb.open('GET', file, false);          // load synchronous, to avoid specifying a handler
		bbb.setRequestHeader('Accept', 'text/plain');// workaround for some picky browsers reading from file:///
		req = bbb.send(null);
		if ((bbb.status!==200) && (bbb.status!==0)) {// contribution to GUI which may use lib/ directory
			file= 'lib/' + file;
			req = bbb.open('GET', file, false);
			bbb.setRequestHeader('Accept', 'text/plain');
			req = bbb.send(null);
			// if there was no lib/ directory, it's just a useless request
		}
		txt = bbb.responseText;
		if ((bbb.status!==200) && (bbb.status!==0)) {
			// 200 from http:// request; 0 from file:/// request
			txt = null; bbb = null;
	// ToDo: alert() is a bad idea! think about a better solution
			//alert('**ERROR: reading ' + file + ' failed');
			return;
		}
	}

	kkk = txt.split('\n');
	__dbx('EnDe.Maps.init: initialize mapping: ' + kkk.length + ' lines ...');
	while ((bbb = kkk.shift())!==undefined) {
		cnt++; if (cnt==32000)         { break;}    // avoid loops
		if (bbb.match(/^\s*#/)!==null) { continue; }// skip comments
		if (bbb.match(/^\s*$/)!==null) { continue; }// skip empty lines
		if (/^__DATA/.test(bbb)===true){ skip = false; }
		if (/^__END/.test(bbb)===true) { break; }   // end of data
		if (skip===true)               { continue; }
		bbb = bbb.replace(/\t{2,}/g, '\t');         // squeeze multiple TABs
		arr = bbb.split(/\t/);
		switch (arr[0]) {   // only have 2 keywords, anything else is data
		  case 'group': map = arr[1]; __dbx('EnDe.Maps.init: group = ' + map); break;
		  case 'map':   typ = arr[1]; __dbx('EnDe.Maps.init: map   = ' + typ); break;
		  default:          // data
			switch(typ) {       // define index or hash for each line
			  case 'index':     idx = parseInt(arr[0],10);      break;
			  case 'hash':      idx = arr[0].toString() + '';   break;
			  default:          /* simply ignore */             break;
			}
			switch(map) {
			  case 'ltrsMap':   EnDe.ltrsMap[idx]  = _u(arr[1]);break;
			  case 'figsMap':   EnDe.figsMap[idx]  = _u(arr[1]);break;
			  case 'sosMap':    EnDe.sosMap[idx]   = arr[1];    break;
			  case 'xmlMap':    EnDe.xmlMap[idx]   = arr[1];    break;
			  case 'rangeMap':  EnDe.rangeMap[idx] = arr[1];    break;
			  case 'ebcdicMap': EnDe.ebcdicMap[idx]= arr;
			                    EnDe.ebcdicUTF[idx]= arr;       break;
			  case 'ebcdicUTF': EnDe.ebcdicUTF[idx]= arr;       break;
			  case 'asciiMap':  EnDe.asciiMap[idx] = arr;       break;
			  case 'romanMap':  EnDe.romanMap[idx] = arr;       break;
			  case 'spaceMap':  EnDe.spaceMap[idx] = arr[1];    break;
			  case 'BladeMap':  EnDe.BladeMap[idx] = arr[1];    break;
			  case 'dnaMap':    EnDe.dnaMap[idx]   = arr[1];    break;
			  case 'superMap':
				ccc =  arr[1].charCodeAt();
				EnDe.super2uMap[idx] = arr[1];
				EnDe.u2superMap[ccc] = String.fromCharCode(idx);
				// __dbx('EnDe.Maps.init: initialize EnDe.u2superMap: ' + idx + ' <-> ' +  ccc);
				break;
			  case 'subMap':
				ccc =  arr[1].charCodeAt();
				EnDe.sub2uMap[idx] = arr[1];
				EnDe.u2subMap[ccc] = String.fromCharCode(idx);
				// __dbx('EnDe.Maps.init: initialize EnDe.u2subMap: ' + idx + ' <-> ' +  ccc);
				break;
			  case 'DIN66003Map':
				ccc = new Number(arr[1]);           // force cast to number!
				EnDe.DIN66003Map[idx]  = arr;
				EnDe.DIN66003fMap[ccc] = idx;
				// __dbx('idx='+ idx + ', arr1='+ccc + ': '+ EnDe.DIN66003fMap[ccc] + '# '+ typeof EnDe.DIN66003fMap[ccc]);
				break;
			  case 'intMap':
				if ((arr[EnDe.mapEty]==='-') && (arr[EnDe.mapSet]==='-')) {
					continue;                       // skip empty definitions
				}
				if (EnDe.intMap[idx]!==undefined) { // duplicate index
					EnDe.dupMap.push(new Array(EnDe.intMap[idx]));
				}
				EnDe.intMap[idx]   = arr;
				if (arr[EnDe.mapEty]!=='-') {       // entity index
					EnDe.ncrMap[arr[EnDe.mapEty]]  = idx;// just the index, save memory
				}
				break;
			  case 'winMap':    EnDe.winMap[idx]   = arr;
				if (arr[EnDe.mapEty]!=='-') {
					EnDe.winfMap[arr[EnDe.mapStd]] = arr;
				}
				break;
			  default:          /* simply ignore */             break;
			}
			break;
		} // switch keyword
	} // while

	__dbx('EnDe.Maps.init: reverse Morse mapping');
	for (ccc in EnDe.sosMap) {              // ------------------- reverse Morse
		EnDe.osoMap[EnDe.sosMap[ccc]] = ccc;
	}

	// some specials maps
	__dbx('EnDe.Maps.init: ASCII-EBCDIC mapping (' + EnDe.asciiMap.length + ')');
	for (a=0; a<256; a++) {             // ----------- lazy ASCII-EBCDIC mapping
		if (EnDe.asciiMap[a]===undefined) { continue; }
		ccc =  EnDe.asciiMap[a][EnDe.mapChr];
		if (ccc==='')  { continue; }
		for (e=0; e<256; e++) {
			if (EnDe.ebcdicMap[e]===undefined) { continue; }
			kkk =  EnDe.ebcdicMap[e][EnDe.mapChr];
			if (kkk==='')  { continue; }
			if (kkk===ccc) {
				EnDe.a2eMap[a] = e;
				EnDe.e2aMap[e] = a;
				break;
			}
		}
		kkk = null;
	}
	__dbx('EnDe.Maps.init: ASCII-Mac OS Roman mapping (' + EnDe.asciiMap.length + ')');
	for (a=0; a<256; a++) {           // ----------- lazy ASCII-EBCDIC mapping
		if (EnDe.asciiMap[a]===undefined) { continue; }
		ccc =  EnDe.asciiMap[a][EnDe.mapChr];
		if (ccc==='')  { continue; }
		for (e=0; e<256; e++) {
			if (EnDe.romanMap[e]===undefined) { continue; }
			kkk =  EnDe.romanMap[e][EnDe.mapChr];
			if (kkk==='')  { continue; }
			if (kkk===ccc) {
				EnDe.a2rMap[a] = e;
				EnDe.r2aMap[e] = a;
				break;
			}
		}
		kkk = null;
	}

	__dbx('EnDe.Maps.init: 3x5 digits (MathGuard) (' + EnDe.mg0Map.length + ')');
	// reverse map is simply a string concatenated from all array values
	// [3] = new Araay(7,1,7,1,7)  --> ['71717'] = '3'
	for (ccc in EnDe.mg0Map) {             // ------------------- reverse 3x5
		kkk = '';
		for (a=0; a<EnDe.mg0Map[ccc].length ;a++) { kkk += EnDe.mg0Map[ccc][a]; }
		EnDe.gm0Map[kkk] = ccc;
	}
	for (ccc in EnDe.mg1Map) {             // ------------------- reverse 3x5
		kkk = '';
		for (a=0; a<EnDe.mg1Map[ccc].length ;a++) { kkk += EnDe.mg1Map[ccc][a]; }
		EnDe.gm1Map[kkk] = ccc;
	}

	}; // .init

}; // EnDe.Maps

// ToDo: loading EnDeMaps.gen.js from EnDe.html fails in Chrome
// window.setTimeout() cannot be used here as it is a LIB file
EnDe.Maps.init();
