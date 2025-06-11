import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonTextarea,
  IonText,
  IonImg,
} from "@ionic/react";
import React, { useState } from "react";
import Tesseract from "tesseract.js";

const OCRDislexia: React.FC = () => {
  const [imagen, setImagen] = useState<string | null>(null);
  const [texto, setTexto] = useState("");
  const [procesando, setProcesando] = useState(false);

  const handleImagen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setImagen(dataUrl);
      procesarImagen(dataUrl);
    };
    reader.readAsDataURL(archivo);
  };

  const procesarImagen = async (img: string) => {
    setProcesando(true);
    try {
      const resultado = await Tesseract.recognize(img, "spa", {
        logger: (m) => console.log(m),
      });
      const textoOCR = resultado.data.text.replace(/\s+/g, " "); // conserva espacios
      const limpio = convertirTexto(textoOCR);
      setTexto(limpio);
    } catch (error) {
      alert("Error procesando la imagen");
    } finally {
      setProcesando(false);
    }
  };
const leerTexto = () => {
  const speech = new SpeechSynthesisUtterance(texto);
  const voces = window.speechSynthesis.getVoices();

  // Elegimos la voz "Microsoft Laura" si está disponible
  const voz = voces.find(v => v.name.includes('Laura') && v.lang === 'es-ES');
  if (voz) speech.voice = voz;

  speech.lang = 'es-ES';
  speech.rate = 0.9;
  window.speechSynthesis.speak(speech);
};
  const convertirTexto = (txt: string) =>
    txt
      .toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // quita tildes
      .replace(/[^A-Z0-9\s]/g, "") // CONSERVA espacios reales
      .replace(/\s+/g, " ")
      .replace(/[^A-Z0-9\s.,;:¡!¿?]/g, "");

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>OCR Dislexia</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent
        className="ion-padding"
        style={{ fontFamily: "OpenDyslexic" }}
      >
        <input type="file" accept="image/*" onChange={handleImagen} />

        {imagen && (
          <IonImg
            src={imagen}
            alt="Imagen seleccionada"
            className="ion-margin-vertical"
          />
        )}

        {procesando && (
          <IonText color="warning">
            <p>Procesando imagen...</p>
          </IonText>
        )}

        <IonTextarea
          readonly
          value={texto}
          autoGrow
          style={{
            fontFamily: "OpenDyslexic",
            fontSize: "20px",
            letterSpacing: "2px",
            lineHeight: "1.8",
            marginTop: "16px",
          }}
        />
        <IonButton
          expand="block"
          color="success"
          onClick={leerTexto}
          disabled={!texto}
        >
          Leer en voz alta
        </IonButton>
        <IonButton
          expand="block"
          color="danger"
          onClick={() => window.speechSynthesis.cancel()}
          disabled={!texto}
        >
          Detener lectura
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default OCRDislexia;
