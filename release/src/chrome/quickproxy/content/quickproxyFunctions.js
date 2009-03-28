var QuickProxy = {
   // Set up preference vars, prefs ver, prefs component, and prefs branch
   prefsVer: 3,
   prefsCom: Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch),
   prefsBranch: Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("extensions.quickproxy.").QueryInterface(Components.interfaces.nsIPrefBranch2),
   // Set up language bundle
   langStrings: Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService).createBundle("chrome://quickproxy/locale/quickproxyFunctions.properties"),

   // Called on browser load
   onLoad : function() {
      // Check preferences, ensures they exist
      this.prefsInit();
      // Update icon to reflect current status
      this.updateIcon();

      // Init Lang vars
      this.lang_prefs_title = this.langStrings.GetStringFromName("quickproxy_prefs_title");
      this.lang_prefs_browser_title = this.langStrings.GetStringFromName("quickproxy_prefs_browser_title");
      this.lang_status_on = this.langStrings.GetStringFromName("quickproxy_status_on");
      this.lang_status_off = this.langStrings.GetStringFromName("quickproxy_status_off");
   
      // Init window management
      var wManager = Components.classes['@mozilla.org/appshell/window-mediator;1'].getService(Components.interfaces.nsIWindowMediator);
      var wIter = wManager.getEnumerator('navigator:browser');

      // Init window counter
      var counter = 0;
      // Loop through available windows
      while (wIter.hasMoreElements()) {
         currentWindow = wIter.getNext();
         // Add to counter for window found
         counter = counter + 1;
      }

      // If only one window, first init
      if(counter == 1) {
         // Grab QuickProxy settings
         var proxyBehaviour = this.prefsBranch.getIntPref('behaviour');
         var proxyType = this.prefsBranch.getIntPref('type');
         if (proxyBehaviour == 1) {
            // If set to auto off, disable
            this.prefsCom.setIntPref("network.proxy.type", 0);
         } else if (proxyBehaviour == 2) {
            // If set to auto on, enable
            this.prefsCom.setIntPref("network.proxy.type", proxyType);
         }
      }
   },
   
   // Update the icon on the status bar
   updateIcon : function() {
      // Get proxy status
      var proxyOn = this.prefsCom.getIntPref("network.proxy.type");
      // Get quickproxy skin
      var proxySkin = this.prefsBranch.getIntPref("skin");
      // Grab proxy icon
      var proxyButton = document.getElementById("quickproxy-status");
      if (this.debug==true) { alert(proxyButton); }
      if (proxyOn==0) {
         // If proxy is off, update graphic with disabled status
         proxyButton.setAttribute("tooltiptext", this.lang_status_off);
         // Update with correct skin to reflect
         if (proxySkin == 0) {
            proxyButton.setAttribute("class", "quickproxy-status-bright-off");
         } else if (proxySkin == 1) {
            proxyButton.setAttribute("class", "quickproxy-status-dull-off");
         } else if (proxySkin == 2) {
            proxyButton.setAttribute("class", "quickproxy-status-off");
         } else {
            proxyButton.setAttribute("class", "quickproxy-status-bright-off");
         }
      } else {
         // Else if proxy is on, update graphic with enabled status
         proxyButton.setAttribute("tooltiptext", this.lang_status_on);
         // Update with correct skin to reflect
         if (proxySkin == 0) {
            proxyButton.setAttribute("class", "quickproxy-status-bright-on");
         } else if (proxySkin == 1) {
            proxyButton.setAttribute("class", "quickproxy-status-dull-on");
         } else if (proxySkin == 2) {
            proxyButton.setAttribute("class", "quickproxy-status-on");
         } else {
            proxyButton.setAttribute("class", "quickproxy-status-bright-on");
         }
      }
   },

   // Called on icon click
   click : function(e) {
      if (e.button == 0) { this.switchProxy();   }   // Left   Click
      if (e.button == 1) { this.switchProxy();   }   // Middle Click
      if (e.button == 2) { this.prefsOpen();   }   // Right  Click
      e.preventDefault();
   },

   // Switches the proxy state
   switchProxy : function() {
      // Get current proxy status
      var proxyOn = this.prefsCom.getIntPref("network.proxy.type");
      // Get QuickProxy type
      var proxyType = this.prefsBranch.getIntPref("type");
      // If it's off, set to type, else set to 0
      if (proxyOn==0) { var proxyNew = proxyType; } else { var proxyNew = 0; }
      this.prefsCom.setIntPref("network.proxy.type", proxyNew);
      // Update icon to reflect
      this.updateIcon();
   },

   prefsOpen : function() {
      try {
         // Try opening the QuickProxy settings dialogue
         window.openDialog('chrome://quickproxy/content/quickproxySettings.xul', this.lang_prefs_title, 'chrome,centerscreen,dependent');
      } catch (rErr) {
         // Catch and display any errors caused
         alert(rErr);
      }
   },

   prefsOpenBrowser : function() {
      try {
         // Try opening the FireFox Proxy settings dialogue
         window.openDialog('chrome://browser/content/preferences/connection.xul', this.lang_prefs_browser_title, 'chrome,centerscreen,dependent');
      } catch (rErr) {
         // Catch and display any errors caused
         alert(rErr);
      }
   },

   // Init preferences window
   prefsOpenInit : function(objectType, objectBehaviour, objectSkin) {
      // Call check preferences
      this.prefsInit();
      // Retrieve current proxy type
      var proxyType = this.prefsBranch.getIntPref('type');
      // Set the proxy type in the preferences dialogue
      if (proxyType == 4) {
         objectType.selectedIndex = proxyType-2;
      } else {
         objectType.selectedIndex = proxyType-1;
      }

      // Set the behaviour type in preferences dialogue
      objectBehaviour.selectedIndex = this.prefsBranch.getIntPref('behaviour');
      // Set the skin in preferences dialogue
      objectSkin.selectedIndex = this.prefsBranch.getIntPref('skin');
   },

   // Save the preferences
   prefsSave : function(objectType, objectBehaviour, objectSkin) {
      // Save proxy type based on selected
      this.prefsBranch.setIntPref('type', objectType.selectedItem.value);
      // Save proxy behaviour based on selected
      this.prefsBranch.setIntPref('behaviour', objectBehaviour.selectedItem.value);
      // Save proxy skin based on selected
      this.prefsBranch.setIntPref('skin', objectSkin.selectedItem.value);
      // Retrieve current proxy setting
      var proxyOn = this.prefsCom.getIntPref("network.proxy.type");
      // If the proxy is on, update it to the proxy type selected.
      if (proxyOn != 0) { this.prefsCom.setIntPref("network.proxy.type", objectType.selectedItem.value); } 
      
      this.debug = true;
   },

   // Check for existing preferences and initiate if they aren't found
   prefsInit : function() {
      try {
         var prefsCur = this.prefsBranch.getIntPref('scheme');
         this.prefsBranch.getIntPref('behaviour');
         this.prefsBranch.getIntPref('skin');
         this.prefsBranch.getIntPref('type');
      } catch (rErr) {
         try {
            // Unique preference to second preference set
            this.prefsCom.getIntPref('quickproxy.behaviour');
            var prefsCur = 2;
         } catch (rErr) {
            try {
               // Unique preference to first preference set
               this.prefsCom.getBoolPref('quickproxy.autooff');
               var prefsCur = 1;
            } catch (rErr) {
               // No known QuickProxy settings, set to 0
               var prefsCur = 0;
            }
         }
      }
      // If they are using an older preferences version, 
      if (prefsCur != this.prefsVer) {
         this.prefsSet(prefsCur);
      }
   },
   
   prefsSet : function(prefsCur) {
      // Second QuickProxy preferences set found, upgrade from these and init defaults for others
      if (prefsCur==2) {
         // Try and retrieve old type setting, and set as appropriate, or init default
         try {
            proxyType = this.prefsCom.getIntPref('quickproxy.type');
            this.prefsBranch.setIntPref('type', proxyType);
         } catch (rErr) {
            this.prefsBranch.setIntPref('type', 1);
         }

         // Try and retrieve old autooff setting, and set as appropriate, or init default
         try {
            var proxyBehaviour = this.prefsCom.getIntPref('quickproxy.behaviour');
            this.prefsBranch.setIntPref('behaviour', proxyBehaviour);
         } catch (rErr) {
            this.prefsBranch.setIntPref('behaviour', 0);
         }

         // Set default skin
         this.prefsBranch.setIntPref('skin', 0);
         // Set prefs scheme version
         this.prefsBranch.setIntPref('scheme', 3);
      }

      // Oldest QuickProxy preferences set found, upgrade from these and init defaults for others
      if (prefsCur==1) {
         // Try and retrieve old type setting, and set as appropriate, or init default
         try {
            proxyType = this.prefsCom.getIntPref('quickproxy.type');
            this.prefsBranch.setIntPref('type', proxyType);
         } catch (rErr) {
            this.prefsBranch.setIntPref('type', 1);
         }

         // Try and retrieve old autooff setting, and set as appropriate, or init default
         try {
            var qp_autooff = this.prefsCom.getBoolPref('quickproxy.autooff');
            if (qp_autooff == true) {
               this.prefsBranch.setIntPref('behaviour', 1);
            } else {
               this.prefsBranch.setIntPref('behaviour', 0);
            }
         } catch (rErr) {
            this.prefsBranch.setIntPref('behaviour', 0);
         }

         // Set default skin
         this.prefsBranch.setIntPref('skin', 0);
         // Set prefs scheme version
         this.prefsBranch.setIntPref('scheme', 3);
      }

      // No found preferences, init with default
      if (prefsCur==0) {
         // Set default proxy type
         this.prefsBranch.setIntPref('type', 1);
         // Set default proxy behaviour
         this.prefsBranch.setIntPref('behaviour', 0);
         // Set default icon skin
         this.prefsBranch.setIntPref('skin', 0);
         // Set prefs scheme versions
         this.prefsBranch.setIntPref('scheme', 3);
      }
   }
};
