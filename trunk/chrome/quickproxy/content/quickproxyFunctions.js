var	qp_Prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
var qp_Bundle = Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService);
var qp_Strings = qp_Bundle.createBundle("chrome://quickproxy/locale/quickproxyFunctions.properties");
var quickproxyprefstitle = qp_Strings.GetStringFromName("quickproxyprefstitle");
var quickproxystatuson = qp_Strings.GetStringFromName("quickproxystatuson");
var quickproxystatusoff = qp_Strings.GetStringFromName("quickproxystatusoff");

function QuickProxy_Init() {
	// Check preferences, ensures they exist
	QuickProxy_CheckPrefs();
	// Update icon to reflect current status
	QuickProxy_UpdateUI();
}

function QuickProxy_Exit() {
	// Grab QuickProxy settings
	var qp_behaviour = qp_Prefs.getIntPref('quickproxy.behaviour');
	var qp_type = qp_Prefs.getIntPref('quickproxy.type');
	if (qp_behaviour == 1) {
		// If set to auto off, disable
		qp_Prefs.setIntPref("network.proxy.type", 0);
	} else if (qp_behaviour == 2) {
		// If set to auto on, enable
		qp_Prefs.setIntPref("network.proxy.type", qp_type);
	}
}

function QuickProxy_Click(e) {
	if (e.button == 0) { QuickProxy_Switch();	}	// Left   Click
	if (e.button == 1) { QuickProxy_Switch();	}	// Middle Click
	if (e.button == 2) { QuickProxy_OpenPrefs();	}	// Right  Click
	e.preventDefault();
}

function QuickProxy_Switch() {
	// Get current proxy status
	var Is_Proxy_On = qp_Prefs.getIntPref("network.proxy.type");
	// Get QuickProxy type
	var Proxy_Type = qp_Prefs.getIntPref("quickproxy.type");
	// If it's on, set to 0, else set to type
	if (Is_Proxy_On==0) { Is_Proxy_On=Proxy_Type; } else { Is_Proxy_On=0; }
	qp_Prefs.setIntPref("network.proxy.type", Is_Proxy_On);
	// Update icon to reflect
	QuickProxy_UpdateUI();
}

function QuickProxy_UpdateUI() {
	// Get proxy status
	var Is_Proxy_On = qp_Prefs.getIntPref("network.proxy.type");
	// Get quickproxy skin
	var qp_skin = qp_Prefs.getIntPref("quickproxy.skin");
	// Grab proxy icon
	var qp_button = document.getElementById("quickproxy-status");
	if (Is_Proxy_On==0) {
		// If proxy is off, update graphic with disabled status
		qp_button.setAttribute("tooltiptext", quickproxystatuson);
		// Update with correct skin to reflect
		if (qp_skin == 0) {
			qp_button.setAttribute("class", "quickproxy-status-bright-off");
		} else if (qp_skin == 1) {
			qp_button.setAttribute("class", "quickproxy-status-dull-off");
		} else if (qp_skin == 2) {
			qp_button.setAttribute("class", "quickproxy-status-off");
		}
	} else {
		// Else if proxy is on, update graphic with enabled status
		qp_button.setAttribute("tooltiptext", quickproxystatusoff);
		// Update with correct skin to reflect
		if (qp_skin == 0) {
			qp_button.setAttribute("class", "quickproxy-status-bright-on");
		} else if (qp_skin == 1) {
			qp_button.setAttribute("class", "quickproxy-status-dull-on");
		} else if (qp_skin == 2) {
			qp_button.setAttribute("class", "quickproxy-status-on");
		}
	}
}

function QuickProxy_OpenPrefs() {
	window.openDialog('chrome://quickproxy/content/quickproxySettings.xul', quickproxyprefstitle, 'chrome,centerscreen,dependent');
}

function QuickProxy_OpenProxyPrefs() {
	window.openDialog('chrome://browser/content/preferences/connection.xul', quickproxybrowserprefstitle, 'chrome,centerscreen,dependent');
}

function QuickProxy_InitPrefs(qp_type, qp_behaviour, qp_skin) {
	QuickProxy_CheckPrefs();
	var proxyType = qp_Prefs.getIntPref('quickproxy.type')
	if (proxyType == 4) {
		qp_type.selectedIndex = proxyType-2;
	} else {
		qp_type.selectedIndex = proxyType-1;
	}

	qp_behaviour.selectedIndex = qp_Prefs.getIntPref('quickproxy.behaviour');
	qp_skin.selectedIndex = qp_Prefs.getIntPref('quickproxy.skin');
}

function QuickProxy_SavePrefs(qp_type, qp_behaviour, qp_skin) {
	qp_Prefs.setIntPref('quickproxy.type', qp_type.selectedItem.value);
	qp_Prefs.setIntPref('quickproxy.behaviour', qp_behaviour.selectedItem.value);
	qp_Prefs.setIntPref('quickproxy.skin', qp_skin.selectedItem.value);
	var Is_Proxy_On = qp_Prefs.getIntPref("network.proxy.type");
	if (Is_Proxy_On != 0) { qp_Prefs.setIntPref("network.proxy.type", qp_type.selectedItem.value); } 
}

function QuickProxy_CheckPrefs() {
	try {
		qp_Prefs.getIntPref('quickproxy.type');
	} catch (rErr) {
		qp_Prefs.setIntPref('quickproxy.type', 1);
	}

	try {
		qp_Prefs.getIntPref('quickproxy.behaviour');
	} catch (rErr) {
		try {
			var qp_autooff = qp_Prefs.getBoolPref('quickproxy.autooff');
			if (qp_autooff == true) {
				qp_Prefs.setIntPref('quickproxy.behaviour', 1);
			} else {
				qp_Prefs.setIntPref('quickproxy.behaviour', 0);
			}
		} catch (rErr) {
			qp_Prefs.setIntPref('quickproxy.behaviour', 0);
		}
	}

	try {
		qp_Prefs.getIntPref('quickproxy.skin');
	} catch (rErr) {
		qp_Prefs.setIntPref('quickproxy.skin', 0);
	}
}