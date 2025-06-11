import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonTextarea,
  IonText
} from '@ionic/react';
import React, { useState, useRef } from 'react';

const TextoDislexia: React.FC = () => {
  const [texto, setTexto] = useState('');
  const inputFile = useRef<HTMLInputElement | null>(null);

  const pegarTexto = async () => {
    try {
      const textoPortapapeles = await navigator.clipboard.readText();
      setTexto(convertirTexto(textoPortapapeles));
    } catch (err) {
      alert('No se pudo acceder al portapapeles.');
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
    const speech = new SpeechSynthesisUtterance(texto);
    const vocesDisponibles = window.speechSynthesis.getVoices();
    console.log(vocesDisponibles)
    speech.voice=vocesDisponibles[5]
    speech.lang = 'es-AR';
    speech.rate = 0.9;
    window.speechSynthesis.speak(speech);
  };

  const convertirTexto = (texto: string) =>
    texto
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^A-Z0-9\s]/g, '');

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Dislexia App</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" style={{ fontFamily: 'OpenDyslexic' }}>
        <IonButton expand="block" onClick={pegarTexto}>Pegar desde portapapeles</IonButton>
        <IonButton expand="block" onClick={() => inputFile.current?.click()}>Cargar archivo .txt</IonButton>
        <input type="file" accept=".txt" hidden ref={inputFile} onChange={cargarArchivo} />
        <IonButton expand="block" color="success" onClick={leerTexto} disabled={!texto}>Leer en voz alta</IonButton>
        <IonButton expand="block" color="danger" onClick={() => window.speechSynthesis.cancel()} disabled={!texto}>
          Detener lectura
        </IonButton>

        <IonText color="medium"><p>Texto procesado:</p></IonText>
        <IonTextarea readonly value={texto} autoGrow style={{
          fontFamily: 'OpenDyslexic',
          fontSize: '20px',
          letterSpacing: '2px',
          lineHeight: '1.8'
        }} />
      </IonContent>
    </IonPage>
  );
};

export default TextoDislexia;

