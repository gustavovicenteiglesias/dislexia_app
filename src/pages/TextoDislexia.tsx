import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonTextarea,
  IonText,
  IonButtons,
  IonBackButton,
  IonSpinner,
} from "@ionic/react";
import React, { useState, useRef } from "react";
import { Clipboard } from "@capacitor/clipboard";
import { useHistory } from "react-router-dom";

const TextoDislexia: React.FC = () => {
  const [texto, setTexto] = useState("");
  const [leyendo, setLeyendo] = useState(false);
  const inputFile = useRef<HTMLInputElement | null>(null);
  const history = useHistory();

  const pegarTexto = async () => {
    try {
      const { value } = await Clipboard.read();
      setTexto(convertirTexto(value || ""));
    } catch (err) {
      alert("No se pudo acceder al portapapeles.");
    }
  };

  const cargarArchivo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = event.target.files?.[0];
    if (!archivo) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const contenido = e.target?.result as string;
      setTexto(convertirTexto(contenido));
    };
    reader.readAsText(archivo);
  };

  const leerTexto = () => {
    if (!texto || !("speechSynthesis" in window)) return;

    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = "es-AR";
    utterance.rate = 0.9;

    utterance.onend = () => setLeyendo(false);
    utterance.onerror = () => setLeyendo(false);

    window.speechSynthesis.speak(utterance);
    setLeyendo(true);
  };

  const pararLectura = () => {
    if ("speechSynthesis" in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setLeyendo(false);
    }
  };

  const convertirTexto = (texto: string) =>
    texto
      .toUpperCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^A-Z0-9\s]/g, "");

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle style={{ fontFamily: "OpenDyslexic" }}>DISLECTOR DESDE TEXTO </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent
        className="ion-padding"
        style={{ fontFamily: "OpenDyslexic" }}
      >
        <IonButton expand="block" onClick={pegarTexto} style={{ fontFamily: "OpenDyslexic" }}>
          Pegar desde portapapeles
        </IonButton>
        <IonButton expand="block" onClick={() => inputFile.current?.click()} style={{ fontFamily: "OpenDyslexic" }}>
          Cargar archivo .txt
        </IonButton>
        <input
          type="file"
          accept=".txt"
          hidden
          ref={inputFile}
          onChange={cargarArchivo}
        />

        {!leyendo && (
          <IonButton
            expand="block"
            color="success"
            onClick={leerTexto}
            disabled={!texto}
            style={{ fontFamily: "OpenDyslexic" }}
          >
            Leer en voz alta
          </IonButton>
        )}

        {leyendo && (
          <>
            <IonText color="primary">
              <p>🗣️ Leyendo...</p>
            </IonText>
            <IonSpinner name="dots" />
            <IonButton expand="block" color="danger" onClick={pararLectura} style={{ fontFamily: "OpenDyslexic" }}>
              Parar lectura
            </IonButton>
          </>
        )}

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
      </IonContent>
    </IonPage>
  );
};

export default TextoDislexia;
