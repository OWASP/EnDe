/* ========================================================================= //
#?
#? NAME
#?      EnDe.zap.js
#?
#? SYNOPSIS
#?      Used in EnDe.lib.js when loaded in ZAP.
#?
#? DESCRIPTION
#?      Defines additionl JavaScript functions for ZAP's ScriptConsole.
#?      Provided (global) functions:
#?           alert()           - use ZAP's API to show a alert window
#?           print()           - use ZAP's API to print text on console
#?           EnDe.alert()      - redefine EnDe's own alert function
#?      Provided object:
#?           EnDe.ZAP          - NOT YET USED
#?
#? SEE ALSO
#?      EnDe.lib.js
#?      Makefile
#?
# HACKER's INFO
#?
#? VERSION
#?      @(#) EnDe.zap.js 3.4 13/06/15 09:50:17
#?
#? AUTHOR
#?      16-nov-12 Achim Hoffmann, mailto: EnDe (at) my (dash) stp (dot) net
#?
 * ========================================================================= */

// ========================================================================= //
// General functions                                                         //
// ========================================================================= //

importPackage(org.parosproxy.paros.view); //# load API

function alert(str) {
//#? JavaScript style wrapper for ZAP's Dialog window
	org.parosproxy.paros.view.View.getSingleton().showMessageDialog(str);
};

function print(str) {
//#? wrapper for ZAP's print to console
	org.parosproxy.paros.view.View.getSingleton().getOutputPanel().append(str+'\n');
};

function help(str) {
//#? wrapper for EnDe.ZAP.help()
	org.parosproxy.paros.view.View.getSingleton().getOutputPanel().append(
		EnDe.ZAP.help(str)
		+'\n'
	);

};

// ========================================================================= //
// EnDe functions                                                            //
// ========================================================================= //

if (typeof(EnDe)!=='undefined') {
	EnDe.ZAP    = true;
	EnDe.alert  = function(str) {
		org.parosproxy.paros.view.View.getSingleton().showMessageDialog(str);
	};
};

// ========================================================================= //
// EnDe.ZAP object methods                                                   //
// ========================================================================= //

EnDe.ZAP    = new function() {
	this.SID    = '3.4';
	this.sid    = function() { return '@(#) EnDe.zap.js 3.4 13/06/15 09:50:17 EnDe.ZAP'; };
	this.help   = function(str) { return EnDe.Func.help(str); }

	// NOT YET USED
};
