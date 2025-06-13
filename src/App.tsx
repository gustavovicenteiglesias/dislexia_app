import React from "react";
import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import Home from "./pages/Home";
import TextoDislexia from "./pages/TextoDislexia";
import OCRDislexia from "./pages/OCRDislexia";

/* CSS y tema... */
import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
import "./theme/variables.css";
import OCRCrop from "./pages/OCRCrop";
import TextoResultado from "./components/TextoResultado";
import BackButtonHandler from "./components/BackButtonHandler";

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <BackButtonHandler/>
      <IonRouterOutlet>
        <Route exact path="/" component={Home} />
        <Route exact path="/texto" component={TextoDislexia} />
        <Route exact path="/ocr-crop" component={OCRDislexia} />
        <Route exact path="/ocr" component={OCRCrop} />
        <Redirect exact from="/home" to="/" />
        <Route exact path="/resultado">
          <TextoResultado />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
