!include "nsDialogs.nsh"

; Add our customizations to the finish page
!macro customFinishPage
XPStyle on

Var DetectDlg
Var FinishDlg
Var FlaxSquirrelInstallLocation
Var FlaxSquirrelInstallVersion
Var FlaxSquirrelUninstaller
Var CheckboxUninstall
Var UninstallFlaxSquirrelInstall
Var BackButton
Var NextButton

Page custom detectOldFlaxVersion detectOldFlaxVersionPageLeave
Page custom finish finishLeave

; Add a page offering to uninstall an older build installed into the flax-blockchain dir
Function detectOldFlaxVersion
  ; Check the registry for old flax-blockchain installer keys
  ReadRegStr $FlaxSquirrelInstallLocation HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\flax-blockchain" "InstallLocation"
  ReadRegStr $FlaxSquirrelInstallVersion HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\flax-blockchain" "DisplayVersion"
  ReadRegStr $FlaxSquirrelUninstaller HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\flax-blockchain" "QuietUninstallString"

  StrCpy $UninstallFlaxSquirrelInstall ${BST_UNCHECKED} ; Initialize to unchecked so that a silent install skips uninstalling

  ; If registry keys aren't found, skip (Abort) this page and move forward
  ${If} FlaxSquirrelInstallVersion == error
  ${OrIf} FlaxSquirrelInstallLocation == error
  ${OrIf} $FlaxSquirrelUninstaller == error
  ${OrIf} $FlaxSquirrelInstallVersion == ""
  ${OrIf} $FlaxSquirrelInstallLocation == ""
  ${OrIf} $FlaxSquirrelUninstaller == ""
  ${OrIf} ${Silent}
    Abort
  ${EndIf}

  ; Check the uninstall checkbox by default
  StrCpy $UninstallFlaxSquirrelInstall ${BST_CHECKED}

  ; Magic create dialog incantation
  nsDialogs::Create 1018
  Pop $DetectDlg

  ${If} $DetectDlg == error
    Abort
  ${EndIf}

  !insertmacro MUI_HEADER_TEXT "Uninstall Old Version" "Would you like to uninstall the old version of Flax Blockchain?"

  ${NSD_CreateLabel} 0 35 100% 12u "Found Flax Blockchain $FlaxSquirrelInstallVersion installed in an old location:"
  ${NSD_CreateLabel} 12 57 100% 12u "$FlaxSquirrelInstallLocation"

  ${NSD_CreateCheckBox} 12 81 100% 12u "Uninstall Flax Blockchain $FlaxSquirrelInstallVersion"
  Pop $CheckboxUninstall
  ${NSD_SetState} $CheckboxUninstall $UninstallFlaxSquirrelInstall
  ${NSD_OnClick} $CheckboxUninstall SetUninstall

  nsDialogs::Show

FunctionEnd

Function SetUninstall
  ; Set UninstallFlaxSquirrelInstall accordingly
  ${NSD_GetState} $CheckboxUninstall $UninstallFlaxSquirrelInstall
FunctionEnd

Function detectOldFlaxVersionPageLeave
  ${If} $UninstallFlaxSquirrelInstall == 1
    ; This could be improved... Experiments with adding an indeterminate progress bar (PBM_SETMARQUEE)
    ; were unsatisfactory.
    ExecWait $FlaxSquirrelUninstaller ; Blocks until complete (doesn't take long though)
  ${EndIf}
FunctionEnd

Function finish

  ; Magic create dialog incantation
  nsDialogs::Create 1018
  Pop $FinishDlg

  ${If} $FinishDlg == error
    Abort
  ${EndIf}

  GetDlgItem $NextButton $HWNDPARENT 1 ; 1 = Next button
  GetDlgItem $BackButton $HWNDPARENT 3 ; 3 = Back button

  ${NSD_CreateLabel} 0 35 100% 12u "Flax has been installed successfully!"
  EnableWindow $BackButton 0 ; Disable the Back button
  SendMessage $NextButton ${WM_SETTEXT} 0 "STR:Let's Farm!" ; Button title is "Close" by default. Update it here.

  nsDialogs::Show

FunctionEnd

; Copied from electron-builder NSIS templates
Function StartApp
  ${if} ${isUpdated}
    StrCpy $1 "--updated"
  ${else}
    StrCpy $1 ""
  ${endif}
  ${StdUtils.ExecShellAsUser} $0 "$launchLink" "open" "$1"
FunctionEnd

Function finishLeave
  ; Launch the app at exit
  Call StartApp
FunctionEnd

; Section
; SectionEnd
!macroend
