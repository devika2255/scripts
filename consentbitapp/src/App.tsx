import { framer, CanvasNode } from "framer-plugin";
import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import MainContent from "./components/ScreenOne";
import "./App.css";
import ScreenThird from "./components/ScreenThird";
import ConfirmModal from "./components/ConfirmModal";
import Screen5 from "./components/Screen5";
import SuccessModal from "./components/SuccessModal";
import SettingsPanel from "./components/SettingsPanel";
import ScreenTwo from "./components/ScreenTwo";
import InstallBannerPopup from "./components/InstallBannerPopup";
import ChoosePlan from "./components/ChoosePlan";
import AdvancedCSVExportModal from "./components/ExportDataModal";
import OpenGuide from "./components/OpenGuide";
import LoadingScreen from "./components/LoadingScreen";
framer.showUI({
  width: 800,
  height: 591,
  position: "top right",
});

function useSelection() {
  const [selection, setSelection] = useState<CanvasNode[]>([]);
  useEffect(() => {
    return framer.subscribeToSelection(setSelection);
  }, []);
  return selection;
}

export function App() {

  const [check , setCheck] = useState(false);

  const handleCheck = () => {
    setCheck(!check);
  }
  return (
    <>
     <Header />
    
     
      {/* <MainContent /> */}
      {/* <ScreenTwo/> */}
      {/* <ScreenThird isPanel={true}/> */}
      {/* <ConfirmModal 
      checked={check}
      onCheck={handleCheck}
      onProceed={() => {framer.notify("proceed to next step")}}
      onGoBack={() => {framer.notify("go back to previous step")}}
      />  */}
      {/* <Screen5/> */}
  
      {/* <SuccessModal onCustomize={() => { framer.closePlugin() }} /> */}
   
        <SettingsPanel/>
        {/* <OpenGuide onClose={() => {framer.closePlugin()}}/> */}
        {/* <AdvancedCSVExportModal  onClose={() => { framer.closePlugin() }} /> */}
        {/* <InstallBannerPopup open onConfirm={() => {framer.notify("proceed to next step")}} onCancel={() => {framer.notify("go back to previous step")}} /> */}
     {/* <ChoosePlan onClose={() => {framer.closePlugin()}}/> */}
     {/* <LoadingScreen/> */}
        </>
  );
}


