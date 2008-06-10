var	qp_Prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);

function QuickProxy_Init() {
	QuickProxy_CheckPrefs();
	var qp_autooff = qp_Prefs.getBoolPref('quickproxy.autooff');
	var Is_Proxy_On = qp_Prefs.getIntPref("network.proxy.type");
	if (Is_Proxy_On!=0) {
		if (qp_autooff == true) { Is_Proxy_On=0 }
	}
	qp_Prefs.setIntPref("network.proxy.type", Is_Proxy_On);
	QuickProxy_UpdateUI();
}

function QuickProxy_Click(e) {
	if (e.button == 0) { QuickProxy_Switch();	}	// Left   Click
	if (e.button == 1) { QuickProxy_Switch();	}	// Middle Click
	if (e.button == 2) { QuickProxy_OpenPrefs();	}	// Right  Click
	e.preventDefault();
}

function QuickProxy_Switch() {
	var Is_Proxy_On = qp_Prefs.getIntPref("network.proxy.type");
	var Proxy_Type = qp_Prefs.getIntPref("quickproxy.type");
	if (Is_Proxy_On==0) { Is_Proxy_On=Proxy_Type; } else { Is_Proxy_On=0; }
	qp_Prefs.setIntPref("network.proxy.type", Is_Proxy_On);
	QuickProxy_UpdateUI();
}

function QuickProxy_UpdateUI() {
	var Is_Proxy_On = qp_Prefs.getIntPref("network.proxy.type");
	var qp_button = document.getElementById("quickproxy-status");
	if (Is_Proxy_On==0) {
		qp_button.setAttribute("class", "quickproxy-status-off");
		qp_button.setAttribute("tooltiptext", "Switch Proxy On");
	} else {
		qp_button.setAttribute("class", "quickproxy-status-on");
		qp_button.setAttribute("tooltiptext", "Switch Proxy Off");
	}
}

function QuickProxy_OpenPrefs() {
	window.openDialog('chrome://quickproxy/content/quickproxySettings.xul', 'QuickProxy Preferences', 'chrome,centerscreen,dependent');
}

function QuickProxy_InitPrefs(qp_type, qp_autooff) {
	QuickProxy_CheckPrefs();
	if (qp_Prefs.getIntPref('quickproxy.type') == 4) {
		qp_type.selectedIndex = qp_Prefs.getIntPref('quickproxy.type')-2;
	} else {
		qp_type.selectedIndex = qp_Prefs.getIntPref('quickproxy.type')-1;
	}
	qp_autooff.checked = qp_Prefs.getBoolPref('quickproxy.autooff');
}

function QuickProxy_SavePrefs(qp_type, qp_autooff) {
	qp_Prefs.setIntPref('quickproxy.type', qp_type.selectedItem.value);
	qp_Prefs.setBoolPref('quickproxy.autooff', qp_autooff.checked);
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
		qp_Prefs.getBoolPref('quickproxy.autooff');
	} catch (rErr) {
		qp_Prefs.setBoolPref('quickproxy.autooff', 0);
	}
}