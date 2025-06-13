import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonText,
  IonTextarea,
  IonButton,
  IonSpinner,
  IonButtons,
  IonBackButton,
} from "@ionic/react";
import React, { useEffect, useState, useRef } from "react";
import { Preferences } from "@capacitor/preferences";

const TextoResultado: React.FC = () => {
  const [texto, setTexto] = useState("");
  const [leyendo, setLeyendo] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const cargarTexto = async () => {
      const { value } = await Preferences.get({ key: "textoResultado" });
      if (value) setTexto(value);
    };
    cargarTexto();
  }, []);

  const leerTexto = () => {
    if (!texto) return;

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(texto);
      utterance.lang = "es-AR";
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onend = () => setLeyendo(false);
      utterance.onerror = () => setLeyendo(false);

      speechRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setLeyendo(true);
    } else {
      alert("La síntesis de voz no está disponible en este dispositivo.");
    }
  };

  const pararLectura = () => {
    try {
      if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        setLeyendo(false);
      }
    } catch (error) {
      console.warn("Error al detener la lectura:", error);
      setLeyendo(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle style={{ fontFamily: "OpenDyslexic" }}>TEXTO EXTRAÍDO</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent
        className="ion-padding"
        style={{ fontFamily: "OpenDyslexic" }}
      >
        <IonText color="medium">
          <p>Texto procesado:</p>
        </IonText>
        <IonTextarea
          readonly
          value={texto}
          autoGrow
          style={{
            fontFamily: "OpenDyslexic",
            fontSize: "20px",
            letterSpacing: "2px",
            lineHeight: "1.8",
          }}
        />

        {leyendo ? (
          <>
            <IonText color="primary">
              <p>🗣️ Leyendo...</p>
            </IonText>
            <IonSpinner name="dots" />
            <IonButton expand="block" color="danger" onClick={pararLectura} style={{ fontFamily: "OpenDyslexic" }}>
              Parar lectura
            </IonButton>
          </>
        ) : (
          <IonButton expand="block" color="success" onClick={leerTexto} style={{ fontFamily: "OpenDyslexic" }}>
            Leer en voz alta
          </IonButton>
        )}
      </IonContent>
    </IonPage>
  );
};

export default TextoResultado;
