/* ========================================================================= //
#?
#? NAME
#?      EnDe.zap.js
#?
#? SYNOPSIS
#?      Used in EnDe.lib.js when loaded in ZAP.
#?
#? DESCRIPTION
#?      Defines additionl JavaScript functions for in ZAP's ScriptConsole.
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
#?      @(#) EnDe.zap.js 3.2 12/12/08 22:16:44
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
	org.parosproxy.paros.view.View.getSingleton().getOutputPanel().append(str);
};

// ========================================================================= //
// EnDe functions                                                            //
// ========================================================================= //

if (typeof(EnDe)!=='undefined') {
	EnDe.ZAP    = true;
	EnDe.alert  = new function(str) {
		org.parosproxy.paros.view.View.getSingleton().showMessageDialog(str);
	};
};

// ========================================================================= //
// EnDe.ZAP object methods                                                   //
// ========================================================================= //

EnDe.ZAP    = new function() {
	this.SID    = '3.2';
	this.sid    = function() { return '@(#) EnDe.zap.js 3.2 12/12/08 22:16:44 EnDe.ZAP'; };

	// NOT YET USED
};
