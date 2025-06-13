import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonText,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import React from 'react';

const Home: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle style={{ fontFamily: 'OpenDyslexic' }}>DISLECTOR</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" style={{ fontFamily: 'OpenDyslexic' }}>
        <IonText color="medium">
          <h2>¿Qué querés hacer?</h2>
        </IonText>
        <IonButton expand="block" onClick={() => history.push('/texto')} style={{ fontFamily: 'OpenDyslexic' }}>
          ✍️ Pegar texto
        </IonButton>
        <IonButton expand="block" onClick={() => history.push('/ocr')} style={{ fontFamily: 'OpenDyslexic' }}>
          📸 Capturar texto desde imagen
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Home;
