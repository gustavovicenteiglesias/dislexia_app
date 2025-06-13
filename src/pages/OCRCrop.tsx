import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonText,
  useIonRouter,
  IonBackButton,
  IonButtons,
} from "@ionic/react";
import React, { useRef, useState, useEffect } from "react";
import Cropper from "cropperjs";
import Tesseract from "tesseract.js";
import { Camera, CameraResultType } from "@capacitor/camera";
import { Preferences } from "@capacitor/preferences";

import "cropperjs/dist/cropper.css";

const OCRCrop: React.FC = () => {
  const [imagen, setImagen] = useState<string | null>(null);
  const [procesando, setProcesando] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const cropperRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useIonRouter();

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

  const tomarFoto = async () => {
    try {
      const foto = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        quality: 90,
      });
      setImagen(foto.dataUrl || null);
    } catch (error) {
      alert("No se pudo acceder a la cámara.");
    }
  };

  useEffect(() => {
    if (imageRef.current && imagen) {
      if (cropperRef.current) {
        cropperRef.current.destroy?.(); // destroy puede no estar tipado
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
      console.log("Texto bruto OCR:", resultado.data.text);
      const texto = resultado.data.text.replace(/\s+/g, " ");

      const textoProcesado = convertirTexto(texto);
      await Preferences.set({ key: "textoResultado", value: textoProcesado });
      const { value } = await Preferences.get({ key: "textoResultado" });
      console.log(value);
      router.push("/resultado");
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
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle  style={{ fontFamily: 'OpenDyslexic' }}>DISLECTOR DESDE IMAGEN</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonButton expand="block" onClick={abrirArchivo}  style={{ fontFamily: 'OpenDyslexic' }}>
          Cargar Imagen
        </IonButton>
        <IonButton expand="block" color="medium" onClick={tomarFoto} style={{ fontFamily: 'OpenDyslexic' }}>
          Tomar Foto
        </IonButton>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
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
          <IonButton expand="block" color="success" onClick={procesarImagen}  style={{ fontFamily: 'OpenDyslexic' }}>
            {procesando ? "Procesando..." : "Extraer texto"}
          </IonButton>
        )}
      </IonContent>
    </IonPage>
  );
};

export default OCRCrop;
