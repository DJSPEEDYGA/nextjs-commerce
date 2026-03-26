; SUPER GOAT ROYALTIES APP - Custom NSIS Installer Script
; This script customizes the Windows installer experience

!macro customHeader
    !system "echo 'Custom header for SUPER GOAT ROYALTIES APP'"
!macroend

!macro preInit
    ; Set registry keys for uninstall
    WriteRegExpandStr HKLM "${INSTALL_REGISTRY_KEY}" InstallLocation "$INSTDIR"
    WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "$INSTDIR"
!macroend

!macro customInit
    ; Check if app is already running
    nsExec::ExecToStack 'tasklist /FI "IMAGENAME eq SUPER GOAT ROYALTIES APP.exe" /NH'
    Pop $0
    Pop $1
    StrCpy $2 $1 3
    ${If} $2 == "SUP"
        MessageBox MB_OK|MB_ICONEXCLAMATION "SUPER GOAT ROYALTIES APP is currently running.$\n$\nPlease close the application before installing."
        Abort
    ${EndIf}
!macroend

!macro customInstall
    ; Create additional shortcuts
    CreateDirectory "$SMPROGRAMS\SUPER GOAT ROYALTIES APP"
    CreateShortCut "$SMPROGRAMS\SUPER GOAT ROYALTIES APP\SUPER GOAT ROYALTIES APP.lnk" "$INSTDIR\SUPER GOAT ROYALTIES APP.exe"
    CreateShortCut "$SMPROGRAMS\SUPER GOAT ROYALTIES APP\Open in Browser.lnk" "http://localhost:4001"
    CreateShortCut "$SMPROGRAMS\SUPER GOAT ROYALTIES APP\Uninstall.lnk" "$INSTDIR\Uninstall SUPER GOAT ROYALTIES APP.exe"
    
    ; Create data directory
    CreateDirectory "$APPDATA\SUPER GOAT ROYALTIES APP"
    CreateDirectory "$APPDATA\SUPER GOAT ROYALTIES APP\data"
    CreateDirectory "$APPDATA\SUPER GOAT ROYALTIES APP\logs"
    
    ; Write version info
    FileOpen $0 "$APPDATA\SUPER GOAT ROYALTIES APP\version.txt" w
    FileWrite $0 "SUPER GOAT ROYALTIES APP v3.0.0$\n"
    FileWrite $0 "Installed: $\n"
    System::Call 'kernel32::GetLocaleInfoA(i 0x400, i 0x2, t .r1, i ${NSIS_MAX_STRLEN}) i .r0'
    FileWrite $0 "Locale: $1$\n"
    FileClose $0
    
    ; Register custom URL protocol
    WriteRegStr HKCR "goatroyalty" "" "URL:SUPER GOAT ROYALTIES APP Protocol"
    WriteRegStr HKCR "goatroyalty" "URL Protocol" ""
    WriteRegStr HKCR "goatroyalty\shell\open\command" "" '"$INSTDIR\SUPER GOAT ROYALTIES APP.exe" "%1"'
!macroend

!macro customUnInstall
    ; Remove shortcuts
    RMDir /r "$SMPROGRAMS\SUPER GOAT ROYALTIES APP"
    
    ; Remove data directory (optional - ask user)
    MessageBox MB_YESNO|MB_ICONQUESTION "Do you want to remove all application data?$\n$\nThis includes your local database and settings." IDYES RemoveData IDNO KeepData
    
    RemoveData:
        RMDir /r "$APPDATA\SUPER GOAT ROYALTIES APP"
        Goto Done
        
    KeepData:
        DetailPrint "Keeping application data in $APPDATA\SUPER GOAT ROYALTIES APP"
        
    Done:
    ; Remove URL protocol
    DeleteRegKey HKCR "goatroyalty"
!macroend

!macro customRemoveFiles
    ; Additional cleanup
    Delete "$INSTDIR\version.txt"
    RMDir /r "$INSTDIR\resources"
!macroend