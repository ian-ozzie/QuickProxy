// Points extension description to the localized version
pref("extensions.{d5ea4520-61a1-11da-8cd6-0800200c9a66}.description", "chrome://quickproxy/locale/quickproxy.properties");

// QuickProxy Defaults
pref('extensions.quickproxy.type', 4); // Set type (1=Manual, 2=Auto Configuration, 4=Auto Detect)
pref('extensions.quickproxy.behaviour', 1); // Set behaviour (0=No change, 1=Auto Off on exit, 2=Auto On on exit)
pref('extensions.quickproxy.skin', 1); // Set Skin (0=Square-bright, 1=Square-dull, 2=Round-dull)
pref('extensions.quickproxy.import', 0); // QuickProxy version control, imports from different preference versions (0=Oldest style, 1=Skinned style, 2=extensions.pref style)