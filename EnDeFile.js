/* ========================================================================= //
#?
#? NAME
#?      EnDeFile.js
#?
#? SYNOPSIS
#?      <SCRIPT language="JavaScript1.5" type="text/javascript" charset="utf-8" src="EnDeFile.js"></SCRIPT>
#?
#? DESCRIPTION
#?      This file defines the  EnDe.File  class with following functions:
#?          .*         - functions and variables for reading files
#?          .read()    - read a file using XMLHttpRequest()
#?          .readTXT() - read a text file using XMLHttpRequest()
#?          .readXML() - read a  XML file using XMLHttpRequest()
#?          .reset()   - reset EnDe.File.* public valiables
#?          .local()   - check if url is file:/// then return url + src
#?
#?      Public input variables:
#?          .trace     - enable trace output
#?          .name      - path/filename of current read file
#?      Public output variables:
#?          .list      - list of read files (for debug purpose only)
#?          .errors    - list of file/access errors
#?          .content   - content read by EnDe.File.read()
#?                       null if failed, otherwise plain text or XML object
#?          .lines     - array with line numbers
#?          .strip     - true: remove comments (#) and empty lines
#?
#? VERSION
#?      @(#) EnDeFile.js 3.18 19/08/22 09:14:54
#?
#? AUTHOR
#?      07-may-07 Achim Hoffmann, mailto: EnDe (at) my (dash) stp (dot) net
#?
 * ========================================================================= */

// ========================================================================= //
// EnDe.File methods                                                         //
// ========================================================================= //

if (typeof(EnDe)==='undefined') { EnDe = new function() {}; }

EnDe.File   = new function() {
	this.SID    = '3.18';
	this.sid    = function() { return('@(#) EnDeFile.js 3.18 19/08/22 09:14:54 EnDe.File'); };

	this.trace  = false;

	// ===================================================================== //
	// public variables                                                      //
	// ===================================================================== //
	this.name   = '';   // store current file path/name here
	this.lines  = [];   // store line numbers as comment and empty lines are removed
	this.errors = [];   // store file/access errors
	this.content= null; // store read content here
	this.version= '';   // store read SID which is string containing '@(#)' here
	this.fileSID= '';   // store read SID number (which is part of this.version)
	this.strip  = true; // true: remove comments and empty lines
	this.list   = [     // list of read files (for debug purpose only)
			[ '# type\t', 'loaded\t', 'SID\t',    'lines\t',  'src\t\t', 'version' ],
			[ '#------+', '-------+', '-------+', '-------+', '---------------+', '-------------------' ]
		];
	this.listTYP= 0;
	this.listSID=                      2;
	this.listCNT=                                  3;
	this.listSRC=                                              4;
	this.listVER=                                                         5;

	// ===================================================================== //
	// private functions                                                     //
	// ===================================================================== //

	function __dbx(t,n) { if (EnDe.File.trace===true) { EnDeGUI.dpr(t,n); } };

	function __fileread(src,type,strip,async,header) {
	// internal function to read a file and store content in EnDe.File.content
		// returns true on success; false otherwise
		// NOTE that content is appended to EnDe.File.content
		/* type:  DOM  read text from innerHTML of given src object
		 * type:  TXT  read from file src and get it as text data
		 * type:  XML  read from file src and get it as XML data
		 * strip: true removes comments and empty lines from text
		 * async: true read file asynchronous; default read synchronous
		 *        async ** NOT YET IMPLEMENTED**
		 * header:value for Content-Type header in XMLHttpRequest()
		 *        only used if not empty
		 */
		__dbx(' EnDe.File __fileread('+src+', '+type+') {', ''); // dummy }
		var _ME = 'EnDe.File.__fileread: ';
		var bux = null;
		var bbb = null;
		var kkk = null;
		var idx = -1;
		var req = null;
		switch (type) {
		  case 'DOM':
			if (document.getElementById(src)!==null) {  // if we have a DOM object ..
				kkk = document.getElementById.innerHTML;
			}
			break;
		  case 'TXT':
		  case 'XML':
			this.name = src;
			bux = new XMLHttpRequest();
			req = bux.open("GET", src, false);// always load syncronous
			if (header!=='') {
				// workaround for some picky browsers reading from file:///
				try {      bux.setRequestHeader('Accept', header) ; }
				catch(e) {
					/*
					 * need try-catch to avoid hangup or uncatched thrown
					 * privilege exception; ugly workaround but smart for
					 * pedantic browsers
					 */
					bbb = _ME + ' send() with header failed:\n' + e;
					EnDe.File.errors.push( bbb ); __dbx( bbb );
				}
			}
// ToDo: chrome on windows fails here, probably need file:///....
			try { req = bux.send(null); }
			catch(e) {
// 08sep17: catch wenn file:///*.xml beim Starten, klaeren warum, funktioniert trotzdem
// #dbx glob_e = e;
// #dbx glob_s = src;
				//#dbx alert('silently catch failed requests, which may occour in some browsers for file:///');
// #dbx setTimeout("alert(' EnDe.File __fileread catch2: '+glob_e+' for: '+glob_s);", 3000);
				bbb = _ME + ' send(file:///) failed:\n' + e;
				EnDe.File.errors.push( bbb ); /* dummy { */ __dbx( bbb + ' }' );
				//return false;
			}
			if (type==='TXT') {
				kkk = bux.responseText;
			} else {
				kkk = bux.responseXML;
			}
			break;
		} // switch
		if ((bux.status!==200) && (bux.status!==0)) {
			// 200 from http:// request; 0 from file:/// request
			bbb = _ME + ' failed with status ' + bux.status + '**';
			EnDe.File.errors.push( bbb ); /* dummy { */ __dbx( bbb + ' }' );
			kkk = null; bux = null;
			return false;
		}
		if (kkk===null) {
			bbb = _ME + ' failed (null)**';
			EnDe.File.errors.push( bbb ); /* dummy { */ __dbx( bbb + ' }' );
			kkk = null; bux = null;
			return false;
		}
		if (kkk==='') {
			// failed file:/// request
			bbb = _ME + ' failed (empty)**';
			EnDe.File.errors.push( bbb ); /* dummy { */ __dbx( bbb + ' }' );
			//kkk = null; bux = null; // ToDo: Omniweb crashes
			return false;
		}
		// set EnDe.File.version
		switch (typeof( kkk )) {
		  case 'string':    // for type TXT
			bux = kkk;
			break;
		  case 'object':    // for type XML
			bux = kkk;
			if (typeof( kkk )==='object') { var s = new XMLSerializer(); bux = s.serializeToString(kkk); delete s; } // XML object
// TODO: try, catch probably nice
// FIXME not: IE uses its own serialize method: bux = kkk.xml; 
			break;
		}
		//bbb = bux.match(/\n(?:(?:#\?\s)*@\(#\)\s*)([^\n]*)/);
		// we use a lazy regex to match string behind  @
		// NOTE that this matches the first occourance
		// if file does not contain this magic string, .verion and .fileSID
		// will be empty (that's ok, we allow foreign files too :)
		bbb = bux.match(/@\(#\)\s*([^\n]*)/);
		if (bbb!==null) {
			EnDe.File.version = bbb[1];
			bbb = EnDe.File.version.split(/[ ]+/);
		}
		if (bbb!==null) {
			EnDe.File.fileSID = bbb[1].replace(/[^0-9.]/g, '');
		}

		// set EnDe.File.content
		if (strip===false) {// get text as is
			EnDe.File.content = kkk;        // keep string or object type here, as it will be handles later
			bux = kkk;
			if (typeof( kkk )==='object') { var s = new XMLSerializer(); bux = s.serializeToString(kkk); delete s; } // XML object
			__dbx(' .content=['+typeof(EnDe.File.content)+']', '');
			bux = bux.split('\n');
			while ((bbb = bux.shift())!==undefined) {
				idx++;
				EnDe.File.lines.push(idx);
			}
		} else {            // get text and remove comments and formating stuff
			EnDe.File.content = '';
			bux = kkk.split('\n');
			if (typeof( kkk )==='onject') { bux = kkk.toString().split('\n'); } // XML object
			while ((bbb = bux.shift())!==undefined) {   // squeeze content
				idx++;
				if (EnDe.File.strip===true) {
					if (bbb.match(/^\s*#/)!==null) { continue; }// skip comments
					if (bbb.match(/^\s*$/)!==null) { continue; }// skip empty lines
				}
				EnDe.File.content += bbb + '\n';
				EnDe.File.lines.push(idx);
			}
			__dbx(' .content=[text]', '');
		}
		/* dummy { */ __dbx(' .content.length=' + EnDe.File.content.length + ', .lines=' + EnDe.File.lines.length + ' }');
		//#dbx alert('bux:\n'+EnDe.File.content);
		kkk = null;
		bbb = null;
		bux = null;
		return true;
	}; // __fileread

	// ===================================================================== //
	// public functions                                                      //
	// ===================================================================== //

	this.reset  = function(src) {
	//#? reset EnDe.File.* valiables
		while (this.lines.pop()!==undefined) {};
		this.name   = '';
		this.lines  = [];
		this.errors = [];
		this.content= null;
		this.version= '';
		this.fileSID= '';
		this.strip  = true;
	}; // .reset

	this.local  = function(src) {
	//#? check if url is file:/// and then return url + src
		if (document.location.protocol!=='file:') { return src; }
		if (document.location.href.match(/^file:/)!==null) { return src; }
		return document.location.href.replace(/[?&].*$/,'').replace(/\/[^\/]*$/,'/') + src;
	}; // .local

	this.read   = function(src) {
	//#? read data from DOM object or file and store content in EnDe.File.content
		// returns true on success; false otherwise
		/* read data and removes comments and empty lines */
		var bux = false;
		if (document.getElementById(src)!==null) {  // if we have a DOM object ..
			bux = __fileread(this.local(src),'DOM',true,false,'');
			this.list.push([ 'DOM', bux, this.fileSID, (bux===true)?this.lines.length:'', src, this.version ]);
		} else {
			bux = __fileread(this.local(src),'TXT',true,false,'');
			this.list.push([ 'TXT', bux, this.fileSID, (bux===true)?this.lines.length:'', src, this.version ]);
		}
		return bux;
	}; // .read

	this.readTXT= function(src) {   // wrapper for __fileread()
	//#? read data from file and store content in EnDe.File.content
		/* read data and removes comments and empty lines */
		var bux = __fileread(this.local(src),'TXT',true,false,'text/plain');
		this.list.push([ 'TXT', bux, this.fileSID, (bux===true)?this.lines.length:'', this.local(src), this.version ]);
		return bux;
	}; // .readTXT

	this.readXML= function(src) {   // wrapper for __fileread()
	//#? read data from file and store content in EnDe.File.content
		/* read data and removes comments and empty lines */
		var bux = __fileread(this.local(src),'XML',false,false,'');
		this.list.push([ 'XML', bux, this.fileSID, (bux===true)?this.lines.length:'', this.local(src), this.version ]);
		return bux;
	}; // .readXML

}; // EnDe.File
