import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonText,
} from "@ionic/react";
import React, { useRef, useState, useEffect } from "react";
import Cropper from "cropperjs";
import Tesseract from "tesseract.js";

import "cropperjs"; // sin CSS, lo incluís por CDN en public/index.html

const OCRCrop: React.FC = () => {
  const [imagen, setImagen] = useState<string | null>(null);
  const [textoOCR, setTextoOCR] = useState("");
  const [procesando, setProcesando] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const cropperRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const abrirArchivo = () => {
    inputRef.current?.click();
  };

  const cargarImagen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;
    const lector = new FileReader();
    lector.onload = (evento: ProgressEvent<FileReader>) => {
      const url = evento.target?.result as string;
      setImagen(url);
    };
    lector.readAsDataURL(archivo);
  };

  useEffect(() => {
    if (imageRef.current && imagen) {
      if (cropperRef.current) {
        cropperRef.current.destroy();
      }
      cropperRef.current = new Cropper(imageRef.current, {
        viewMode: 1,
        autoCropArea: 0.8,
        background: false,
        responsive: true,
        zoomable: true,
        movable: true,
      });
    }
  }, [imagen]);

  const convertirTexto = (texto: string) =>
    texto
      .toUpperCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^A-Z0-9\s]/g, "");

  const procesarImagen = async () => {
    if (!cropperRef.current) return;
    const canvas = cropperRef.current.getCroppedCanvas();
    if (!canvas) return;
    setProcesando(true);
    try {
      const resultado = await Tesseract.recognize(canvas, "spa", {
        logger: (m) => console.log(m),
      });
      const texto = resultado.data.text.replace(/\s+/g, " ");
      setTextoOCR(convertirTexto(texto));
    } catch (error) {
      alert("Ocurrió un error al procesar la imagen.");
    } finally {
      setProcesando(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>OCR para Dislexia</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonButton expand="block" onClick={abrirArchivo}>
            Tomar foto o seleccionar imagen
        </IonButton>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          hidden
          onChange={cargarImagen}
        />
        {imagen && (
          <img
            ref={imageRef}
            src={imagen}
            alt="Imagen"
            style={{ width: "100%" }}
          />
        )}
        {imagen && (
          <IonButton expand="block" color="success" onClick={procesarImagen}>
            {procesando ? "Procesando..." : "Extraer texto"}
          </IonButton>
        )}
        {textoOCR && (
          <>
            <IonText color="medium">
              <p>Texto leído:</p>
            </IonText>
            <pre
              style={{
                fontFamily: "OpenDyslexic",
                fontSize: "20px",
                whiteSpace: "pre-wrap",
              }}
            >
              {textoOCR}
            </pre>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default OCRCrop;
