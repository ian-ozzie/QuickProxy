var qp_Prefs_Version = 3;
var qp_Prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
var qp_Bundle = Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService);
var qp_Strings = qp_Bundle.createBundle("chrome://quickproxy/locale/quickproxyFunctions.properties");
var quickproxy_prefs_title = qp_Strings.GetStringFromName("quickproxy_prefs_title");
var quickproxy_prefs_browser_title = qp_Strings.GetStringFromName("quickproxy_prefs_browser_title");
var quickproxy_status_on = qp_Strings.GetStringFromName("quickproxy_status_on");
var quickproxy_status_off = qp_Strings.GetStringFromName("quickproxy_status_off");

function QuickProxy_Init() {
	// Check preferences, ensures they exist
	QuickProxy_CheckPrefs();
	// Update icon to reflect current status
	QuickProxy_UpdateUI();
   
   // Init window management
   var windowManager = Components.classes['@mozilla.org/appshell/window-mediator;1'].getService(Components.interfaces.nsIWindowMediator);
	var windowIter = windowManager.getEnumerator('navigator:browser');

   // Init window counter
   var counter = 0;
   // Loop through available windows
   while (windowIter.hasMoreElements()) {
		currentWindow = windowIter.getNext();
      // Add to counter for window found
      counter = counter + 1;
   }

   // If only one window, first init
   if(counter == 1) {
      // Grab QuickProxy settings
      var qp_Behaviour = qp_Prefs.getIntPref('extensions.quickproxy.behaviour');
      var qp_Type = qp_Prefs.getIntPref('extensions.quickproxy.type');
      if (qp_Behaviour == 1) {
         // If set to auto off, disable
         qp_Prefs.setIntPref("network.proxy.type", 0);
      } else if (qp_Behaviour == 2) {
         // If set to auto on, enable
         qp_Prefs.setIntPref("network.proxy.type", qp_Type);
      }
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
	var Proxy_Type = qp_Prefs.getIntPref("extensions.quickproxy.type");
	// If it's on, set to 0, else set to type
	if (Is_Proxy_On==0) { Is_Proxy_On=Proxy_Type; } else { Is_Proxy_On=0; }
	qp_Prefs.setIntPref("network.proxy.type", Is_Proxy_On);
	// Update icon to reflect
	QuickProxy_UpdateUI();
}

function QuickProxy_UpdateUITimeout() {
	window.setTimeout("QuickProxy_UpdateUI()", 50);
}

function QuickProxy_UpdateUI() {
	// Get proxy status
	var Is_Proxy_On = qp_Prefs.getIntPref("network.proxy.type");
	// Get quickproxy skin
	var qp_Skin = qp_Prefs.getIntPref("extensions.quickproxy.skin");
	// Grab proxy icon
	var qp_Button = document.getElementById("quickproxy-status");
	if (Is_Proxy_On==0) {
		// If proxy is off, update graphic with disabled status
      qp_Button.setAttribute("tooltiptext", quickproxy_status_off);
		// Update with correct skin to reflect
		if (qp_Skin == 0) {
			qp_Button.setAttribute("class", "quickproxy-status-bright-off");
		} else if (qp_Skin == 1) {
			qp_Button.setAttribute("class", "quickproxy-status-dull-off");
		} else if (qp_Skin == 2) {
			qp_Button.setAttribute("class", "quickproxy-status-off");
		} else {
         qp_Button.setAttribute("class", "quickproxy-status-bright-off");
      }
	} else {
		// Else if proxy is on, update graphic with enabled status
      qp_Button.setAttribute("tooltiptext", quickproxy_status_on);
		// Update with correct skin to reflect
		if (qp_Skin == 0) {
			qp_Button.setAttribute("class", "quickproxy-status-bright-on");
		} else if (qp_Skin == 1) {
			qp_Button.setAttribute("class", "quickproxy-status-dull-on");
		} else if (qp_Skin == 2) {
			qp_Button.setAttribute("class", "quickproxy-status-on");
		} else {
         qp_Button.setAttribute("class", "quickproxy-status-bright-on");
      }
	}
}

function QuickProxy_OpenPrefs() {
   try {
      // Try opening the QuickProxy settings dialogue
      window.openDialog('chrome://quickproxy/content/quickproxySettings.xul', quickproxy_prefs_title, 'chrome,centerscreen,dependent');
   } catch (rErr) {
      // Catch and display any errors caused
      alert(rErr);
   }
}

function QuickProxy_OpenProxyPrefs() {
   try {
      // Try opening the FireFox Proxy settings dialogue
	   window.openDialog('chrome://browser/content/preferences/connection.xul', quickproxy_prefs_browser_title, 'chrome,centerscreen,dependent');
   } catch (rErr) {
      // Catch and display any errors caused
      alert(rErr);
   }
}

// Init preferences screen
function QuickProxy_InitPrefs(qp_Type, qp_Behaviour, qp_Skin) {
   // Call check preferences
	QuickProxy_CheckPrefs();
   // Retrieve current proxy type
	var proxyType = qp_Prefs.getIntPref('extensions.quickproxy.type')
   // Set the proxy type in the preferences dialogue
	if (proxyType == 4) {
		qp_Type.selectedIndex = proxyType-2;
	} else {
		qp_Type.selectedIndex = proxyType-1;
	}

   // Set the behaviour type in preferences dialogue
	qp_Behaviour.selectedIndex = qp_Prefs.getIntPref('extensions.quickproxy.behaviour');
   // Set the skin in preferences dialogue
	qp_Skin.selectedIndex = qp_Prefs.getIntPref('extensions.quickproxy.skin');
}

// Save preferences
function QuickProxy_SavePrefs(qp_Type, qp_Behaviour, qp_Skin) {
   // Save proxy type based on selected
	qp_Prefs.setIntPref('extensions.quickproxy.type', qp_Type.selectedItem.value);
   // Save proxy behaviour based on selected
	qp_Prefs.setIntPref('extensions.quickproxy.behaviour', qp_Behaviour.selectedItem.value);
   // Save proxy skin based on selected
	qp_Prefs.setIntPref('extensions.quickproxy.skin', qp_Skin.selectedItem.value);
   // Retrieve current proxy setting
	var Is_Proxy_On = qp_Prefs.getIntPref("network.proxy.type");
   // If the proxy is on, update it to the proxy type selected.
	if (Is_Proxy_On != 0) { qp_Prefs.setIntPref("network.proxy.type", qp_Type.selectedItem.value); } 
}

// Get preference version
function QuickProxy_CheckPrefs() {
   try {
      var qp_Prefs_Cur = qp_Prefs.getIntPref('extensions.quickproxy.scheme');
   } catch (rErr) {
      try {
         // Unique preference to second preference set
         qp_Prefs.getIntPref('quickproxy.behaviour');
         var qp_Prefs_Cur = 2;
      } catch (rErr) {
         try {
            // Unique preference to first preference set
            qp_Prefs.getBoolPref('quickproxy.autooff');
            var qp_Prefs_Cur = 1;
         } catch (rErr) {
            // No known QuickProxy settings, set to 0
            var qp_Prefs_Cur = 0;
         }
      }
   }
   // If they are using an older preferences version, 
   if (qp_Prefs_Cur != qp_Prefs_Version) {
      QuickProxy_SetPrefs(qp_Prefs_Cur)
   }
}

// Set/upgrade preferences 
function QuickProxy_SetPrefs(qp_Version) {
   // Second QuickProxy preferences set found, upgrade from these and init defaults for others
   if (qp_Version==2) {
      // Try and retrieve old type setting, and set as appropriate, or init default
      try {
         qp_Type = qp_Prefs.getIntPref('quickproxy.type');
         qp_Prefs.setIntPref('extensions.quickproxy.type', qp_Type);
      } catch (rErr) {
         qp_Prefs.setIntPref('extensions.quickproxy.type', 1);
      }

      // Try and retrieve old autooff setting, and set as appropriate, or init default
      try {
			var qp_Behave = qp_Prefs.getIntPref('quickproxy.behaviour');
         qp_Prefs.setIntPref('extensions.quickproxy.behaviour', qp_Behave);
      } catch (rErr) {
			qp_Prefs.setIntPref('extensions.quickproxy.behaviour', 0);
      }

      // Set default skin
      qp_Prefs.setIntPref('extensions.quickproxy.skin', 0);
      // Set prefs scheme version
      qp_Prefs.setIntPref('extensions.quickproxy.scheme', 3);
   }

   // Oldest QuickProxy preferences set found, upgrade from these and init defaults for others
   if (qp_Version==1) {
      // Try and retrieve old type setting, and set as appropriate, or init default
      try {
         qp_Type = qp_Prefs.getIntPref('quickproxy.type');
         qp_Prefs.setIntPref('extensions.quickproxy.type', qp_Type);
      } catch (rErr) {
         qp_Prefs.setIntPref('extensions.quickproxy.type', 1);
      }

      // Try and retrieve old autooff setting, and set as appropriate, or init default
      try {
			var qp_autooff = qp_Prefs.getBoolPref('quickproxy.autooff');
      	if (qp_autooff == true) {
				qp_Prefs.setIntPref('extensions.quickproxy.behaviour', 1);
			} else {
				qp_Prefs.setIntPref('extensions.quickproxy.behaviour', 0);
			}
      } catch (rErr) {
         qp_Prefs.setIntPref('extensions.quickproxy.behaviour', 0);
      }

      // Set default skin
      qp_Prefs.setIntPref('extensions.quickproxy.skin', 0);
      // Set prefs scheme version
      qp_Prefs.setIntPref('extensions.quickproxy.scheme', 3);
   }

   // No found preferences, init with default
   if (qp_Version==0) {
      // Set default proxy type
      qp_Prefs.setIntPref('extensions.quickproxy.type', 1);
      // Set default proxy behaviour
      qp_Prefs.setIntPref('extensions.quickproxy.behaviour', 0);
      // Set default icon skin
      qp_Prefs.setIntPref('extensions.quickproxy.skin', 0);
      // Set prefs scheme versions
      qp_Prefs.setIntPref('extensions.quickproxy.scheme', 3);
   }
}
