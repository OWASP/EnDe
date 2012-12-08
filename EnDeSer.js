/* ========================================================================= //
#?
#? NAME
#?      EnDeSer.js
#?
#? SYNOPSIS
#?      <SCRIPT language="JavaScript1.5" type="text/javascript" src="EnDeSer.js"></SCRIPT>
#?      <SCRIPT language="JavaScript1.3" type="text/javascript" src="EnDeUser.js"></SCRIPT>
#?
#? DESCRIPTION
#?      This file contains user defined functions/methods used in  EnDe.js .
#?      It defines the  EnDe.Ser  object with following functions:
#?          .EN.ser     - serialize data
#?          .DE.ser     - expand serialized data
#?          .init       - initialize user data
#?
#?      The dispatcher is defined in  EnDeUser.js .
#?
#? PRE-REQUESTS
#?
#? SEE ALSO
#?      EnDe.js
#?
# HACKER's INFO
#
#? VERSION
#?      @(#) EnDeSer.js 1.3 12/12/08 15:53:01
#?
#? AUTHOR
#?      21-jul-12 Achim Hoffmann, mailto: EnDe (at) my (dash) stp (dot) net
#?
 * ========================================================================= */

// ========================================================================= //
// EnDe.Ser object methods                                                  //
// ========================================================================= //

if (typeof(EnDe)==='undefined') { EnDe = new function() {}; }

EnDe.Ser    = new function() {
	this.SID    = '1.3';
	this.sid    = function() { return('@(#) EnDeSer.js 1.3 12/12/08 15:53:01 EnDe.Ser'); };

	// ===================================================================== //
	// global variables                                                      //
	// ===================================================================== //
	this.trace  = true;
	this.mode   = 'lazy';
		/*
		 * use of globals to avoid passing on stack, see _sr_parse() for details, 
		 */
	this.ident  = '|  ';
	this.str    = '';   // current string to be prased
	this.pos    = 0;    // current position of parser in string
	this.typ    = null; // current object type being parsed
	this.level  = [];   // stack of objects
	this.idxed  = false;// set to true if a index [n] was written with identation
	this.maxloop= EnDe.maxloop || 99999;

	this.types  = {
		'aced': 'Java',
		'dumm': null
	};
	this.data   = {
	// +-------+---+----------------+---------------------------------
	//  key    size string          // description
	// +-------+---+----------------+---------------------------------
		// from serialized declaration
		'\xca': [2, 'Java serialization data'],
		'\xfe': [2, 'Version '   ],
		'\xac': [2, 'Java serialization data'],
		'\xed': [2, 'Version '   ],
		'\x73': [2, 'class   '   ], // 1. byte end of version string
		'\x72': [9, 'VersionUID '], // 2. byte end of version string
		'\x71': [5, 'data    '   ], // 1. byte end of declerations 70 00 7e 00 01
		'Z':    [1, 'Boolean '   ],
		'B':    [1, 'Byte    '   ], // int8
		'C':    [2, 'Char    '   ], // int16 Unicode
		'S':    [2, 'Short   '   ], // int16
		'I':    [4, 'Int     '   ], // int32
		'J':    [8, 'Long    '   ], // int64
		'F':    [4, 'Float   '   ], // 32-bit IEEE 754 single prec.
		'D':    [8, 'Double  '   ], // 64-bit IEEE 754 single prec.
		'L':    [0, 'String  '   ], // java/lang/String
		't':    [0, '?str??  '   ], // ??
		//'q':    [0, '?obj??  '   ], // ??
		'[':    [0, 'Int[]   '   ], // must be  [I   integer array
		'@':    [0, 'Object[]'   ], // must be  [L   object
	    // pseudo types for internal use
		'\x01': [0, '// data type'],
		'\x02': [0, '// declaration'],
		'\x03': [0, '// data'],
		'dumm': null
	// +-------+---+----------------+---------------------------------
	};
	this.datasize   = function(typ) {
		if (this.data[typ] === undefined) { return null; }
		if (this.data[typ] === null)      { return null; }
		return this.data[typ][0];
	}; // datasize
	this.datastring = function(typ) {
		if (this.data[typ] === undefined) { return null; }
		if (this.data[typ] === null)      { return null; }
		return this.data[typ][1];
	}; // datasize

	// ===================================================================== //
	// internal/private functions                                            //
	// ===================================================================== //

	function __dbx(t,n) { if(EnDe.Ser.trace===true) { EnDe.dbx(t,n); } };

	// ===================================================================== //
	// un-/serialize functions                                               //
	// ===================================================================== //

	this.EN     = new function() {
		this.sid  = function() { return(EnDe.Ser.sid() + '.EN'); };
		this.ser  = function(mode,src) {
		//#? // ToDo not yet implemented
		}; // ser

		this.dispatch = function(type,mode,uppercase,src,prefix,suffix,delimiter) {
		//#? dispatcher for user encoding functions
			__dbx(this.sid()+'.dispatch: '+type+'\t:uppercase='+uppercase+'\tprefix='+prefix+'\tsuffix='+suffix+'\tdelimiter='+delimiter);
	 		var bbb = '';
			switch (type) {
			  case 'SRb64':     bbb = 'txt';    break;
			  case 'SRb64XML':  bbb = 'XML';    break;
			  case 'SRb64txt':  bbb = 'txt';    break;
			  case 'SRraw':     bbb = 'null';   break;
			}
			return null;
		}; // dispatch
	}; // .EN

	this.DE     = new function() {
		this.sid  = function() { return(EnDe.Ser.sid() + '.DE'); };
		this.ser  = function(mode,src) {
			//#? unserialize Java object format
			//#mode: 'XML':  for XML output (open tag)
			//#mode: '/XML': for XML output (close tag)
			//#mode: 'txt':  for simple text output

			if (mode === 'XML') {
				EnDe.Ser.ident = '   ';
			}
			EnDe.Ser.level = [];

			this.parse  = new function() {

	 			this.string = function(num) {
	 				// return string from next num bytes
	 				// it's assumed that bytes start at EnDe.Ser.pos
	 				var __s = '';
	 				var __t = 0;
	 				for (__t=0; __t<num; __t++) { __s += EnDe.Ser.str[EnDe.Ser.pos + __t]; }
	 				return __s;
	 			}; // string

	 			this.short  = function() {
	 				// return integer16 from next 2 bytes
	 				// it's assumed that bytes start at EnDe.Ser.pos and are in MSB order
	 				__dbx('  .short: ' + EnDe.EN.dez(2,'lazy',false,EnDe.Ser.str[EnDe.Ser.pos+1],'','',''));
	 				return  (parseInt(EnDe.Ser.str.charCodeAt(EnDe.Ser.pos)) << 8) + (parseInt(EnDe.Ser.str.charCodeAt(EnDe.Ser.pos+1)));
	 			}; // short

	 			this.typen  = function(typ) {
				//? return datatyp for given typ
					var bbb = EnDe.Ser.str[EnDe.Ser.pos];
	 				__dbx('  .typen{ [' + EnDe.Ser.pos
							+ ']='    + EnDe.EN.hex(2,'lazy',false,bbb,'\\x','','')
							+ ' typ=' + EnDe.EN.hex(2,'lazy',false,typ,'\\x','',''));
					var txt = EnDe.Ser.datastring(typ);
					var ccc = EnDe.Ser.datasize(typ);
					if (ccc === null) { typ = null; }
					//var ccc = this.short();
	 				switch (typ) {
			 		  case null:   txt = '';                EnDe.Ser.pos++;     break; // unknown typ; ignore one byte
			 		  case '\x71': // end of declarations
							if ((EnDe.Ser.str[EnDe.Ser.pos + 1] === '\x00')
							  &&(EnDe.Ser.str[EnDe.Ser.pos + 2] === '\x7e')
							  &&(EnDe.Ser.str[EnDe.Ser.pos + 3] === '\x00')
							  &&(EnDe.Ser.str[EnDe.Ser.pos + 4] === '\x01')) {
								EnDe.Ser.pos += ccc;
							} else {
								EnDe.Ser.pos++; txt = null;
							}
alert(EnDe.Ser.pos);
							break;
			 		  case '\xac':
							EnDe.Ser.pos += ccc;
							break;
			 		  case '\xed': txt = '' + this.short(); EnDe.Ser.pos += ccc; break;
			 		  case '\x73':
							EnDe.Ser.pos += ccc;
							ccc = this.short();             EnDe.Ser.pos += 2;  // pass over short
							txt = this.string(ccc);         EnDe.Ser.pos += ccc;
							break;
	 				  case '\x72': txt = this.string(ccc);  EnDe.Ser.pos += ccc;
							EnDe.Ser.pos++; // ignore one more byte
							txt = EnDe.EN.hex(2, 'lazy', false, txt, '\\x', '', '');
							break;
			 		  case 'Z':
			 		  case 'B':
	 				  case 'C':
	 				  case 'S':
			 		  case 'I':
			 		  case 'J':
	 				  case 'F':
	 				  case 'D':
			 		  case 'L':
			 		  case 't':
							EnDe.Ser.pos++;                     // skip one character
							ccc = this.short();             EnDe.Ser.pos += 2;  // pass over short
							txt = this.string(ccc);         EnDe.Ser.pos += ccc;
							break;
	 				  case '[':    __m += 'Int[]   ';   break; // must be  [I   integer array
			 		  case '@':    txt += 'Object[]';   break; // must be  [L   object
			 		  default:     EnDe.Ser.pos++; txt='';  break; // unknown typ; ignore one byte
	 				}
	 				__dbx('  .typen} [' + EnDe.Ser.pos + '] ==>' + txt);
	 				return txt;
	 			}; // typen

	 			this.daten  = function(typ) {
				//? return data for given typ
					var txt = '';
					var bbb = EnDe.Ser.str[EnDe.Ser.pos];
					var ccc = EnDe.Ser.datasize(typ);
	 				__dbx('  .daten{ [' + EnDe.Ser.pos
							+ ']='    + EnDe.EN.hex(2,'lazy',false,bbb,'\\x','','')
							+ ' typ=' + EnDe.EN.hex(2,'lazy',false,typ,'\\x','',''));
	 				switch (typ) {
			 		  case null:   txt = '';                EnDe.Ser.pos++;     break; // unknown typ; ignore one byte
			 		  case '\x71': // end of declarations
			 		  case '\xac':
			 		  case '\xed':
			 		  case '\x73':
	 				  case '\x72':
							break;
			 		  case 'Z':
			 		  case 'B':
	 				  case 'C':
	 				  case 'S':
			 		  case 'I':
			 		  case 'J':
	 				  case 'F':
	 				  case 'D':
			 		  case 'L':
			 		  case 't':
							ccc = this.short();             EnDe.Ser.pos += 2;  // pass over short
							txt = this.string(ccc);         EnDe.Ser.pos += ccc;
	 						var __t = 0;
	 						for (__t=0; __t<ccc; __t++) { txt += EnDe.Ser.str[EnDe.Ser.pos + __t]; }
							EnDe.Ser.pos += ccc;
							break;
	 				  case '[':    txt += 'Int[]   ';   break; // must be  [I   integer array
			 		  case '@':    txt += 'Object[]';   break; // must be  [L   object
			 		  default:     EnDe.Ser.pos++; txt='';  break; // unknown typ; ignore one byte
	 				}
	 				__dbx('  .daten} [' + EnDe.Ser.pos + '] ==>' + txt);
	 				return txt; // fallback
	 			}; // daten

	 		}; // parse

			this.write  = new function() {

	 			this.ident      = function _ident(mode,idx) {
	 				var __i = '';
	 				for (var _j=0; _j<idx; _j++, __i += EnDe.Ser.ident){};
	 				return '\n'+__i;
	 			}; // _ident

	 		}; // write

		 	EnDe.Ser.str = src; // store in a global
		 	EnDe.Ser.pos = 0;
		 	__dbx('EnDe.Ser.DE.ser(){ EnDe.Ser.str.length=' + EnDe.Ser.str.length); // dumm }

		 	var __p = EnDe.Ser.pos;
			var mod = 1; // 1=parse declaration, 2=parse data
			var bux = {
			//   key    value
				'\x01': 'Java',
				// '\x02': EnDe.Ser.datastring('\x02')
			};
//		 			__dbx(', typ=' + EnDe.EN.hex(2,'lazy',false,EnDe.Ser.typ,'\\x','',''),'');
		 	while (EnDe.Ser.pos<EnDe.Ser.str.length) {
		 		if (EnDe.Ser.pos>199999) { EnDe.dbx('data too large'); return src; }
		 		EnDe.Ser.typ = EnDe.Ser.str[EnDe.Ser.pos];
				if (mod === 1) { bux[EnDe.Ser.typ] = this.parse.typen(EnDe.Ser.typ); }
				if (mod === 2) { bux[EnDe.Ser.typ] = this.parse.daten(EnDe.Ser.typ); }
//# __dbx( '### ' + EnDe.EN.hex(2,'lazy',false,EnDe.Ser.typ,'\\x','','') + ' ==> ' + x);
		 		switch (EnDe.Ser.typ) {
				  case '\x71':  bux['\03'] = EnDe.Ser.datastring('\03'); mod = 2; break; // next is data
				  case '\xac':  // read serialization header
		 				// next is serialization version
		 				EnDe.Ser.typ = '\xed';   bux[EnDe.Ser.typ] = this.parse.typen(EnDe.Ser.typ);
		 				// next is class name
		 				EnDe.Ser.typ = '\x73';   bux[EnDe.Ser.typ] = this.parse.typen(EnDe.Ser.typ);
		 				// next is VersionUID
		 				EnDe.Ser.typ = '\x72';   bux[EnDe.Ser.typ] = this.parse.typen(EnDe.Ser.typ);
						break;
				}
		 		if (__p === EnDe.Ser.pos) {
		 			bux += '\n' + '**ERROR: EnDe.Ser.DE.vs2: infinite loop at position: ' + EnDe.Ser.pos + '; exit\n';
		 			break;
		 		}
		 		__p = EnDe.Ser.pos;
		 	}
			for (mod in bux) {
__dbx( ' ##bux[' + EnDe.EN.hex(2,'lazy',false,mod,'\\x','','') + '] ==> ' + EnDe.Ser.datastring(mod) + bux[mod]);
		 	}
		 	if (EnDe.Ser.level.length !== 0) {
		 		bux += '<ERROR level=' + EnDe.Ser.level.length + ' "something wrong" />';
		 	}
		 	/* dumm { */ __dbx('EnDe.Ser.DE.ser} (pos='+EnDe.Ser.pos+')');
		 	return bux;
		}; // ser

		this.dispatch = function(type,mode,uppercase,src,prefix,suffix,delimiter) {
		//#? dispatcher for user deserialize functions
// ToDo: not yet used
			__dbx(this.sid()+'.dispatch: '+type+'\t:uppercase='+uppercase+'\tprefix='+prefix+'\tsuffix='+suffix+'\tdelimiter='+delimiter);
			EnDe.Ser.mode = mode;
			var bbb = 'null';
			// first URL-decode which is idempotent and hence doesn't harm
			switch (type) {
			  case 'SRb64':     bbb = 'txt';    break;
			  case 'SRb64XML':  bbb = 'XML';    break;
			  case 'SRb64txt':  bbb = 'txt';    break;
			  case 'SRraw':     bbb = 'null';   break;
			}
			return this.ser(bbb, EnDe.DE.dispatch('base64',mode,true,EnDe.DE.dispatch('urlCHR',mode,true,src,'', '', ''),prefix, '', '') );
		}; // dispatch

	}; // .DE

	this.init      = function() {
	//#? initialize user data
	}; // init

}; // EnDe.Ser
